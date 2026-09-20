import { MeetingConfig, PlatformType, ThemeType, LayoutType, RoleType } from '../types';

/**
 * Generates a secure 11-digit numeric meeting ID.
 * Formatted as "XXX XXXX XXXX" (e.g. "842 1947 3820") for enterprise clarity,
 * containing exactly 11 digits.
 */
export function generateMeetingId(): string {
  // Generate 11 random digits securely
  const part1 = Math.floor(100 + Math.random() * 900).toString(); // 3 digits
  const part2 = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digits
  const part3 = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digits
  return `${part1} ${part2} ${part3}`;
}

/**
 * Normalizes or validates an 11-digit numeric meeting ID string.
 */
export function formatNumericMeetingId(val: string): string {
  const digitsOnly = val.replace(/\D/g, '').slice(0, 11);
  if (digitsOnly.length <= 3) return digitsOnly;
  if (digitsOnly.length <= 7) return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3)}`;
  return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 7)} ${digitsOnly.slice(7, 11)}`;
}

export function generateTokenId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'mtg_';
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Convert string to base64url safely with chunking for large strings (such as Base64 avatars)
function toBase64Url(str: string): string {
  const utf8Bytes = new TextEncoder().encode(str);
  const CHUNK_SIZE = 8192;
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i += CHUNK_SIZE) {
    const chunk = utf8Bytes.subarray(i, i + CHUNK_SIZE);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Convert base64url to string safely
function fromBase64Url(base64url: string): string {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function encodeMeetingConfig(
  config: MeetingConfig,
  clientEmail?: string,
  clientName?: string,
  clientCompany?: string
): string {
  const payload = {
    t: config.title,
    d: config.date,
    tm: config.time,
    du: config.duration,
    ep: config.expectedParticipants,
    mid: config.meetingId,
    p: config.platform,
    th: config.theme,
    l: config.layout,
    h: {
      a: config.host.avatar,
      fn: config.host.fullName,
      dn: config.host.displayName,
      e: config.host.email,
      jt: config.host.jobTitle,
      r: config.host.role,
    },
    pts: config.participants.map(p => ({
      id: p.id,
      n: p.name,
      e: p.email,
      r: p.role,
      a: p.avatar,
      m: p.micOn,
      c: p.cameraOn,
    })),
    ce: clientEmail || config.clientEmail || '',
    cn: clientName || config.clientName || '',
    cc: clientCompany || config.clientCompany || '',
    ts: Date.now(),
  };

  const json = JSON.stringify(payload);
  const token = toBase64Url(json);

  // Store in localStorage for instant access & redundancy
  try {
    localStorage.setItem(`meeting_token_${config.meetingId}`, token);
    localStorage.setItem(`meeting_config_${config.meetingId}`, JSON.stringify(config));
  } catch (e) {
    // Ignore quota issues
  }

  return token;
}

export function decodeMeetingConfig(token: string): {
  config: MeetingConfig;
  clientEmail?: string;
  clientName?: string;
  clientCompany?: string;
} | null {
  try {
    const json = fromBase64Url(token);
    const payload = JSON.parse(json);

    const config: MeetingConfig = {
      title: payload.t || 'Executive Meeting',
      date: payload.d || new Date().toISOString().split('T')[0],
      time: payload.tm || '10:00 AM',
      duration: payload.du || '45 mins',
      expectedParticipants: payload.ep || 4,
      meetingId: payload.mid || generateMeetingId(),
      platform: (payload.p as PlatformType) || 'google_meet',
      theme: (payload.th as ThemeType) || 'auto',
      layout: (payload.l as LayoutType) || 'speaker',
      host: {
        avatar: payload.h?.a || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        fullName: payload.h?.fn || 'Dr. Mohammad Hamad Almenhali',
        displayName: payload.h?.dn || 'Dr. Almenhali',
        email: payload.h?.e || 'dr.almenhali@enterprise.com',
        jobTitle: payload.h?.jt || 'Chief Executive Officer',
        role: (payload.h?.r as RoleType) || 'Host',
      },
      participants: (payload.pts || []).map((p: any) => ({
        id: p.id || Math.random().toString(36).substring(2, 9),
        name: p.n || 'Participant',
        email: p.e || '',
        role: (p.r as RoleType) || 'Attendee',
        avatar: p.a || '',
        micOn: p.m ?? true,
        cameraOn: p.c ?? true,
      })),
      clientEmail: payload.ce || '',
      clientName: payload.cn || '',
      clientCompany: payload.cc || '',
      token,
    };

    return {
      config,
      clientEmail: payload.ce,
      clientName: payload.cn,
      clientCompany: payload.cc,
    };
  } catch (error) {
    console.warn('Failed to parse meeting token directly from base64url:', error);

    // Fallback: check if the token is a meeting ID in localStorage
    try {
      const stored = localStorage.getItem(`meeting_config_${token}`) || localStorage.getItem(`meeting_token_${token}`);
      if (stored) {
        if (stored.startsWith('{')) {
          const cfg = JSON.parse(stored) as MeetingConfig;
          return {
            config: cfg,
            clientEmail: cfg.clientEmail,
            clientName: cfg.clientName,
            clientCompany: cfg.clientCompany,
          };
        } else {
          return decodeMeetingConfig(stored);
        }
      }
    } catch (e) {
      // Ignore
    }

    return null;
  }
}
