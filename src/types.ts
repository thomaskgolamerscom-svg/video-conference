export type PlatformType = 'google_meet' | 'zoom' | 'teams';
export type ThemeType = 'auto' | 'dark' | 'light';
export type LayoutType = 'speaker' | 'grid';
export type RoleType = 'Host' | 'Presenter' | 'Attendee';

export interface HostProfile {
  avatar: string;
  fullName: string;
  displayName: string;
  email: string;
  jobTitle: string;
  role: RoleType;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  avatar: string;
  micOn: boolean;
  cameraOn: boolean;
  company?: string;
  isLocal?: boolean;
  isHost?: boolean;
  isSpeaking?: boolean;
  joinedAt?: string;
  stream?: MediaStream | null;
}

export interface MeetingConfig {
  title: string;
  date: string;
  time: string;
  duration: string;
  expectedParticipants: number;
  meetingId: string; // 11-digit numeric meeting ID
  platform: PlatformType;
  theme: ThemeType;
  layout: LayoutType;
  host: HostProfile;
  participants: Participant[];
  clientEmail?: string;
  clientName?: string;
  clientCompany?: string;
  token?: string;
}

export interface ClientSubmissionData {
  clientEmail: string;
  clientAddress: string;
  clientIp: string;
  meetingId: string;
  meetingTitle: string;
  platform: string;
  hostName: string;
  hostEmail: string;
  participantRole: string;
  submissionDateTime: string;
}

export type AppView = 'admin_settings' | 'client_lobby' | 'active_meeting';
