// Utility to obtain the client's public IP Password
// Does not ask the client. If unavailable or private/local, returns "Unavailable".

export function isPrivateIp(ip: string): boolean {
  if (!ip) return true;
  const clean = ip.replace(/^::ffff:/, '').trim();
  if (clean === '127.0.0.1' || clean === '::1' || clean === 'localhost') return true;
  if (clean.startsWith('10.') || clean.startsWith('192.168.')) return true;
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(clean)) return true;
  if (clean.startsWith('fc00:') || clean.startsWith('fe80:')) return true;
  return false;
}

export async function fetchClientPublicIp(): Promise<string> {
  const API_URL = import.meta.env.VITE_BACKEND_URL || '';

  // First attempt: internal server route /api/client-ip
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const resp = await fetch(`${API_URL}/api/client-ip`, { signal: controller.signal });
    clearTimeout(timeout);
    if (resp.ok) {
      const data = await resp.json();
      if (data?.ip && data.ip !== 'Unavailable' && !isPrivateIp(data.ip)) {
        return data.ip;
      }
    }
  } catch (e) {
    // Continue to fallback
  }

  // Second attempt: direct fetch to public IP resolver
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const resp = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(timeout);
    if (resp.ok) {
      const data = await resp.json();
      if (data?.ip && !isPrivateIp(data.ip)) {
        return data.ip;
      }
    }
  } catch (e) {
    // Continue
  }

  // Third attempt: alternative public IP resolver
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const resp = await fetch('https://api64.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(timeout);
    if (resp.ok) {
      const data = await resp.json();
      if (data?.ip && !isPrivateIp(data.ip)) {
        return data.ip;
      }
    }
  } catch (e) {
    // Unavailable
  }

  return 'Unavailable';
}
