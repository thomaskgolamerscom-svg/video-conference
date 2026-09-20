import { AppView, MeetingConfig } from '../types';

export interface MeetingSessionState {
  currentView: AppView;
  meetingId: string;
  token: string;
  stage: 'lobby' | 'joining' | 'preview' | 'modal' | 'meeting';
  infoModalSubmitted: boolean;
  mediaState: {
    micEnabled: boolean;
    cameraEnabled: boolean;
  };
  elapsedSeconds: number;
  clientEmail: string;
  clientName: string;
  clientCompany: string;
  lastUpdated: number;
}

const SESSION_KEY = 'executive_conf_session';
const CONFIG_KEY = 'executive_conf_last_config';

/**
 * Saves the active meeting session state into both sessionStorage (for tab lifecycle)
 * and localStorage (for durable multi-refresh and crash recovery).
 */
export function saveActiveMeetingSession(session: MeetingSessionState): void {
  try {
    const payload = JSON.stringify(session);
    sessionStorage.setItem(SESSION_KEY, payload);
    localStorage.setItem(`${SESSION_KEY}_${session.meetingId}`, payload);
    if (session.token) {
      localStorage.setItem(`${SESSION_KEY}_token_${session.token.slice(0, 32)}`, payload);
    }
  } catch (err) {
    console.warn('Unable to persist meeting session:', err);
  }
}

/**
 * Retrieves the stored meeting session for a given meeting ID or token,
 * or the active session for the current browser tab.
 */
export function getActiveMeetingSession(meetingIdOrToken?: string): MeetingSessionState | null {
  try {
    // 1. Try session storage first (scoped to current tab)
    const sessionRaw = sessionStorage.getItem(SESSION_KEY);
    if (sessionRaw) {
      const parsed = JSON.parse(sessionRaw) as MeetingSessionState;
      if (!meetingIdOrToken) return parsed;
      if (
        parsed.meetingId === meetingIdOrToken ||
        (parsed.token && parsed.token === meetingIdOrToken) ||
        (parsed.token && meetingIdOrToken.includes(parsed.token.slice(0, 24)))
      ) {
        return parsed;
      }
    }

    // 2. Try localStorage by meetingId or token
    if (meetingIdOrToken) {
      const byMeetingId = localStorage.getItem(`${SESSION_KEY}_${meetingIdOrToken}`);
      if (byMeetingId) {
        return JSON.parse(byMeetingId) as MeetingSessionState;
      }

      const byToken = localStorage.getItem(`${SESSION_KEY}_token_${meetingIdOrToken.slice(0, 32)}`);
      if (byToken) {
        return JSON.parse(byToken) as MeetingSessionState;
      }
    }

    // 3. Fallback: if sessionRaw exists, return it if it's recent (< 6 hours old)
    if (sessionRaw) {
      const parsed = JSON.parse(sessionRaw) as MeetingSessionState;
      const isFresh = Date.now() - (parsed.lastUpdated || 0) < 6 * 60 * 60 * 1000;
      if (isFresh) return parsed;
    }
  } catch (err) {
    console.warn('Unable to retrieve meeting session:', err);
  }

  return null;
}

/**
 * Updates a subset of the active meeting session state.
 */
export function updateActiveMeetingSession(partial: Partial<MeetingSessionState>): void {
  try {
    const current = getActiveMeetingSession();
    if (!current) return;
    const updated: MeetingSessionState = {
      ...current,
      ...partial,
      lastUpdated: Date.now(),
    };
    saveActiveMeetingSession(updated);
  } catch (err) {
    console.warn('Unable to update meeting session:', err);
  }
}

/**
 * Clears the active meeting session (e.g. when the user explicitly leaves or returns to admin).
 */
export function clearActiveMeetingSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.warn('Unable to clear session:', err);
  }
}

/**
 * Saves draft meeting configuration for persistence.
 */
export function saveStoredMeetingConfig(config: MeetingConfig): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    localStorage.setItem(`config_${config.meetingId}`, JSON.stringify(config));
  } catch (err) {
    // Ignore quota issues
  }
}

/**
 * Retrieves the stored meeting configuration.
 */
export function getStoredMeetingConfig(): MeetingConfig | null {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) {
      return JSON.parse(raw) as MeetingConfig;
    }
  } catch (err) {
    // Ignore
  }
  return null;
}
