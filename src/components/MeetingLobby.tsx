import React, { useState, useEffect } from 'react';
import { MeetingConfig } from '../types';
import { DevicePreview } from './DevicePreview';
import { PlatformLogo } from './PlatformLogos';
import { AvatarImage } from './AvatarImage';
import {
  Calendar,
  Clock,
  Users,
  Hash,
  ArrowRight,
  Sparkles,
  User,
  Building2,
  Lock,
  Loader2,
} from 'lucide-react';

interface MeetingLobbyProps {
  config: MeetingConfig;
  clientEmail: string;
  clientName?: string;
  clientCompany?: string;
  onJoinMeeting: (mediaState: { micEnabled: boolean; cameraEnabled: boolean; stream: MediaStream | null }) => void;
}

export const MeetingLobby: React.FC<MeetingLobbyProps> = ({
  config,
  clientEmail,
  clientName,
  clientCompany,
  onJoinMeeting,
}) => {
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joiningStage, setJoiningStage] = useState<string>('Connecting to secure meeting room...');

  // Resolved recipient metadata
  const targetName = clientName || config.clientName || 'Alexander Wright';
  const targetCompany = clientCompany || config.clientCompany || 'Apex Global Enterprises';
  const targetEmail = clientEmail || config.clientEmail || 'client@enterprise.com';

  const platformNames: Record<string, string> = {
    google_meet: 'Google Meet',
    zoom: 'Zoom',
    teams: 'Microsoft Teams',
  };

  // Initialize media devices
  const initMedia = async () => {
    try {
      setPermissionError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionError('Camera and microphone are not supported in this browser context.');
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);
    } catch (err: any) {
      console.warn('getUserMedia error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError('Camera and microphone permission was denied. Please allow access in browser settings to share your video.');
      } else if (err.name === 'NotFoundError') {
        setPermissionError('No camera or microphone hardware found on this system.');
      } else {
        setPermissionError('Unable to access media devices: ' + (err.message || 'Unknown error'));
      }
    }
  };

  useEffect(() => {
    initMedia();
  }, []);

  const handleToggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !micEnabled;
      });
    }
    setMicEnabled(!micEnabled);
  };

  const handleToggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !cameraEnabled;
      });
    }
    setCameraEnabled(!cameraEnabled);
  };

  // Requirement 3: Faint loading screen for 4.5 seconds on "Join Meeting"
  const handleJoin = () => {
    setIsJoining(true);
    setJoiningStage('Connecting to secure meeting room...');

    // Progress updates during the 4.5 second observation window
    setTimeout(() => {
      setJoiningStage('Verifying invitation & peer certificates...');
    }, 1500);

    setTimeout(() => {
      setJoiningStage('Entering active room session...');
    }, 3200);

    // Complete transition after 4.5 seconds
    setTimeout(() => {
      onJoinMeeting({
        micEnabled,
        cameraEnabled,
        stream,
      });
    }, 4500);
  };

  const displayDate = config.date || 'Today';

  return (
    <div
      id="meeting-lobby-screen"
      className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header with Dynamic Platform Logo */}
      <header className="flex items-center justify-between z-10 max-w-6xl w-full mx-auto pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center shadow-md p-1.5">
            <PlatformLogo platform={config.platform} size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-white block">
                {platformNames[config.platform] || 'Video Conference'}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Connected
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Room #{config.meetingId} &bull; Enterprise Secure Channel
            </span>
          </div>
        </div>
      </header>

      {/* Main Centered Lobby Card */}
      <main className="my-auto py-4 z-10 max-w-5xl w-full mx-auto">
        <div className="bg-slate-950/90 border border-slate-800/80 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Device Preview (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <DevicePreview
                micEnabled={micEnabled}
                cameraEnabled={cameraEnabled}
                onToggleMic={handleToggleMic}
                onToggleCamera={handleToggleCamera}
                stream={stream}
                permissionError={permissionError}
                fallbackName={targetName}
                onRequestPermissions={initMedia}
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Microphone and camera ready</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Lock className="w-3 h-3 text-slate-400" />
                  End-to-end encrypted
                </span>
              </div>
            </div>

            {/* Right: Meeting, Host & Target Client Details (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
              {/* Meeting Title & Room ID with Platform Tag */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Sparkles className="w-3 h-3" />
                    Ready to connect
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800/90 text-slate-300 border border-slate-700">
                    <PlatformLogo platform={config.platform} size={14} />
                    <span>{platformNames[config.platform]}</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                  {config.title || 'Video Conference Meeting'}
                </h1>
                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-500" />
                  Room ID: <span className="font-mono text-slate-300">{config.meetingId}</span>
                </p>
              </div>

              {/* Requirement 1: Target Client Recipient Banner in Lobby */}
              <div
                id="lobby-target-client-banner"
                className="bg-indigo-950/40 rounded-xl p-3.5 border border-indigo-500/30 space-y-1.5"
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 block">
                  Invitation Prepared For
                </span>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-400/30 text-indigo-300 flex items-center justify-center shrink-0 font-semibold text-xs">
                    {targetName.charAt(0) || 'C'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      {targetName}
                    </p>
                    <p className="text-[11px] text-indigo-200/80 truncate flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-indigo-400 shrink-0" />
                      {targetCompany}
                    </p>
                  </div>
                </div>
              </div>

              {/* Host Profile Info Card */}
              <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Meeting Host
                </span>
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <AvatarImage
                      src={config.host.avatar}
                      alt={config.host.fullName || 'Meeting Host'}
                      fallbackText={config.host.fullName || 'H'}
                      sizeClassName="w-10 h-10"
                      className="border border-indigo-500/30 shadow-md"
                      textClassName="text-sm font-bold"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-xs text-white truncate">
                        {config.host.fullName}
                      </h3>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {config.host.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {config.host.jobTitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Meeting Meta Grid */}
              <div className="grid grid-cols-3 gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
                    <Calendar className="w-3 h-3 text-indigo-400" /> Date
                  </span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5 block truncate">
                    {displayDate}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" /> Duration
                  </span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5 block">
                    {config.duration}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
                    <Users className="w-3 h-3 text-indigo-400" /> Capacity
                  </span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5 block">
                    {config.expectedParticipants} Max
                  </span>
                </div>
              </div>

              {/* Primary CTA: Join Meeting */}
              <button
                id="join-meeting-btn"
                type="button"
                onClick={handleJoin}
                disabled={isJoining}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                <span>{isJoining ? 'Connecting to Room...' : 'Join Meeting'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="z-10 max-w-6xl w-full mx-auto pt-4 text-center text-xs text-slate-500">
        Enterprise Encrypted Session &bull; TLS 1.3 Transport Security
      </footer>

      {/* Requirement 3: Smooth, VERY FAINT 4-5 second loading screen */}
      {isJoining && (
        <div
          id="faint-joining-loading-screen"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-black/40 backdrop-blur-[3px] transition-all duration-500 animate-in fade-in"
        >
          <div className="max-w-md w-full p-6 rounded-2xl bg-slate-950/80 border border-slate-700/60 shadow-2xl text-center space-y-4 backdrop-blur-md animate-in zoom-in-95 duration-300">
            <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
              {/* Pulsing faint aura */}
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
              <div className="relative w-14 h-14 rounded-2xl bg-slate-900 border border-indigo-500/40 flex items-center justify-center shadow-lg">
                <PlatformLogo platform={config.platform} size={32} />
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                Connecting to {platformNames[config.platform] || 'Meeting'}
              </h3>
              <p className="text-xs text-indigo-300 mt-1 font-medium">
                {targetName} &bull; {targetCompany}
              </p>
              <p className="text-xs text-slate-400 mt-2 flex items-center justify-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>{joiningStage}</span>
              </p>
            </div>

            {/* Subtle continuous progress bar across 4.5 seconds */}
            <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
              <div className="bg-indigo-500 h-1 rounded-full animate-[progress_4.5s_ease-out_forwards]" />
            </div>

            <p className="text-[11px] text-slate-500">
              Establishing encrypted video channel. Please wait...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
