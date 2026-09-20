import React, { useState, useEffect, useRef } from 'react';
import { MeetingConfig, LayoutType, Participant } from '../types';
import { ParticipantGrid } from './ParticipantGrid';
import { SpeakerView } from './SpeakerView';
import { ParticipantPanel } from './ParticipantPanel';
import { MeetingToolbar } from './MeetingToolbar';
import { InformationModal } from './InformationModal';
import { ChatPanel } from './ChatPanel';
import { PlatformLogo } from './PlatformLogos';
import {
  Shield,
  Radio,
  Clock,
  LayoutGrid,
  Maximize2,
  Lock,
  ChevronDown,
} from 'lucide-react';

interface ActiveMeetingProps {
  config: MeetingConfig;
  clientEmail: string;
  clientName?: string;
  clientCompany?: string;
  initialMediaState: {
    micEnabled: boolean;
    cameraEnabled: boolean;
    stream: MediaStream | null;
  };
  onLeaveMeeting: () => void;
}

interface FloatingReaction {
  id: string;
  emoji: string;
  left: number;
}

export const ActiveMeeting: React.FC<ActiveMeetingProps> = ({
  config,
  clientEmail,
  clientName,
  clientCompany,
  initialMediaState,
  onLeaveMeeting,
}) => {
  // Media states
  const [micEnabled, setMicEnabled] = useState(initialMediaState.micEnabled);
  const [cameraEnabled, setCameraEnabled] = useState(initialMediaState.cameraEnabled);
  const [localStream, setLocalStream] = useState<MediaStream | null>(initialMediaState.stream);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Layout & UI panels
  const [layout, setLayout] = useState<LayoutType>(config.layout || 'speaker');
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);

  // Dominant speaker detection
  const [dominantSpeakerId, setDominantSpeakerId] = useState<string>('p_host');

  // Client Information Modal & Environment Preview State:
  // Allow approx. 4.5 seconds for the client to enter the active meeting, observe
  // connected participants, check their own camera feed, before the modal pops up.
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalSubmitted, setInfoModalSubmitted] = useState(false);
  const [isPreviewPeriod, setIsPreviewPeriod] = useState(true);

  // Time in meeting counter
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Resolved local client details
  const localName = clientName || config.clientName || (clientEmail ? clientEmail.split('@')[0] : 'You');
  const localCompany = clientCompany || config.clientCompany || '';

  // Prepare full participants list: Host + Configured participants + Local client
  const [participants, setParticipants] = useState<Participant[]>(() => {
    const list: Participant[] = [];

    // 1. Host
    list.push({
      id: 'p_host',
      name: config.host.fullName || 'Meeting Host',
      email: config.host.email,
      role: config.host.role || 'Host',
      avatar: config.host.avatar,
      micOn: true,
      cameraOn: true,
      isHost: true,
      isSpeaking: true, // initial active speaker
    });

    // 2. Configured participants from settings
    config.participants.forEach((p) => {
      list.push({
        ...p,
        isSpeaking: false,
      });
    });

    // 3. Local Client (You)
    list.push({
      id: 'p_local_client',
      name: localName,
      email: clientEmail,
      company: localCompany,
      role: 'Attendee',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(localName)}&background=6366f1&color=fff`,
      micOn: initialMediaState.micEnabled,
      cameraOn: initialMediaState.cameraEnabled,
      isLocal: true,
      isSpeaking: false,
    });

    return list;
  });

  // Requirement 1: Allow approx. 4.5 seconds for the invited client to clearly observe
  // the active conference environment, connected participants, and check self-camera feed
  // before the "Confirm Your Information" modal automatically pops up over the meeting interface.
  useEffect(() => {
    if (!infoModalSubmitted) {
      const timer = setTimeout(() => {
        setIsPreviewPeriod(false);
        setShowInfoModal(true);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [infoModalSubmitted]);

  // Meeting timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync local stream tracks with mic/camera toggle states
  const handleToggleMic = () => {
    const newMic = !micEnabled;
    setMicEnabled(newMic);
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = newMic;
      });
    }
    setParticipants((prev) =>
      prev.map((p) => (p.isLocal ? { ...p, micOn: newMic } : p))
    );
  };

  const handleToggleCamera = async () => {
    const newCamera = !cameraEnabled;
    setCameraEnabled(newCamera);

    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = newCamera;
      });
    } else if (newCamera) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: micEnabled });
        setLocalStream(stream);
      } catch (e) {
        console.warn('Could not re-acquire camera:', e);
      }
    }

    setParticipants((prev) =>
      prev.map((p) => (p.isLocal ? { ...p, cameraOn: newCamera } : p))
    );
  };

  // Screen Sharing via Screen Capture API
  const handleToggleShareScreen = async () => {
    if (isSharingScreen) {
      if (screenStream) {
        screenStream.getTracks().forEach((t) => t.stop());
        setScreenStream(null);
      }
      setIsSharingScreen(false);
    } else {
      try {
        if (!navigator.mediaDevices?.getDisplayMedia) {
          alert('Screen sharing is not supported in this browser.');
          return;
        }
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        setScreenStream(stream);
        setIsSharingScreen(true);

        // When user clicks "Stop Sharing" on browser's native bar
        stream.getVideoTracks()[0].onended = () => {
          setIsSharingScreen(false);
          setScreenStream(null);
        };
      } catch (err: any) {
        console.warn('Screen share cancelled or rejected:', err);
      }
    }
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleSendReaction = (emoji: string) => {
    const id = 'rx_' + Date.now() + '_' + Math.random();
    const left = 20 + Math.random() * 60; // percentage
    setReactions((prev) => [...prev, { id, emoji, left }]);

    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 3000);
  };

  const handleInfoModalSuccess = () => {
    setShowInfoModal(false);
    setInfoModalSubmitted(true);
  };

  // Format elapsed time (MM:SS)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      id="active-meeting-container"
      className="fixed inset-0 w-full h-full bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Top Header Bar */}
      <header className="relative z-20 h-14 px-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between">
        {/* Left: Platform Logo, Meeting title & encryption lock */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
            <PlatformLogo platform={config.platform} size={16} />
            <Lock className="w-3 h-3 text-emerald-400" />
            <span className="truncate max-w-[140px] sm:max-w-xs">{config.meetingId}</span>
          </div>

          <h1 className="font-semibold text-xs sm:text-sm text-white truncate hidden md:block">
            {config.title}
          </h1>

          {isRecording && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>REC</span>
            </div>
          )}
        </div>

        {/* Center: Meeting Duration Clock */}
        <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>{formatTime(elapsedSeconds)}</span>
        </div>

        {/* Right: Layout Switcher & Platform Badge */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLayout(layout === 'grid' ? 'speaker' : 'grid')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            title="Toggle Layout"
          >
            {layout === 'grid' ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Speaker View</span>
              </>
            ) : (
              <>
                <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Grid View</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Video Presentation Stage */}
      <main className="relative flex-1 w-full h-[calc(100vh-140px)] overflow-hidden bg-slate-950 flex items-center justify-center">
        {/* Environment Preview Status Banner (Visible during the 4.5s preview period before info modal) */}
        {isPreviewPeriod && !infoModalSubmitted && (
          <div
            id="environment-preview-indicator"
            className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-in fade-in slide-in-from-top-3 duration-500"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/40 text-xs text-slate-200 shadow-2xl backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold text-white">Live Conference Connected</span>
              <span className="text-slate-400 text-[11px] hidden sm:inline">&bull; Camera & audio active</span>
            </div>
          </div>
        )}

        {isSharingScreen && screenStream ? (
          <div className="w-full h-full p-4 flex flex-col items-center justify-center relative">
            <div className="w-full h-full rounded-2xl overflow-hidden bg-black border border-indigo-500/40 shadow-2xl relative flex items-center justify-center">
              <video
                ref={(el) => {
                  if (el) el.srcObject = screenStream;
                }}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3 bg-indigo-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md shadow-md">
                You are sharing your screen
              </div>
            </div>
          </div>
        ) : layout === 'speaker' ? (
          <SpeakerView
            participants={participants}
            localStream={localStream}
            dominantSpeakerId={dominantSpeakerId}
            onSelectSpeaker={(id) => setDominantSpeakerId(id)}
          />
        ) : (
          <ParticipantGrid
            participants={participants}
            localStream={localStream}
            dominantSpeakerId={dominantSpeakerId}
          />
        )}

        {/* Floating Animated Reactions */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
          {reactions.map((rx) => (
            <div
              key={rx.id}
              className="absolute bottom-20 text-3xl animate-bounce transition-all duration-1000"
              style={{
                left: `${rx.left}%`,
                animation: 'floatUp 2.8s ease-out forwards',
              }}
            >
              {rx.emoji}
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Fixed Meeting Toolbar */}
      <footer className="relative z-20 shrink-0">
        <MeetingToolbar
          micEnabled={micEnabled}
          cameraEnabled={cameraEnabled}
          onToggleMic={handleToggleMic}
          onToggleCamera={handleToggleCamera}
          isSharingScreen={isSharingScreen}
          onToggleShareScreen={handleToggleShareScreen}
          isRecording={isRecording}
          onToggleRecording={handleToggleRecording}
          isParticipantsOpen={isParticipantsOpen}
          onToggleParticipants={() => {
            setIsParticipantsOpen(!isParticipantsOpen);
            setIsChatOpen(false);
          }}
          participantCount={participants.length}
          isChatOpen={isChatOpen}
          onToggleChat={() => {
            setIsChatOpen(!isChatOpen);
            setIsParticipantsOpen(false);
          }}
          currentLayout={layout}
          onToggleLayout={() => setLayout(layout === 'grid' ? 'speaker' : 'grid')}
          onSendReaction={handleSendReaction}
          onLeaveMeeting={onLeaveMeeting}
        />
      </footer>

      {/* Slide-out Participant Panel */}
      <ParticipantPanel
        participants={participants}
        isOpen={isParticipantsOpen}
        onClose={() => setIsParticipantsOpen(false)}
        expectedCount={config.expectedParticipants}
      />

      {/* Slide-out Chat Panel */}
      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        userName={localName}
      />

      {/* Client Information Modal (Triggered automatically after joining) */}
      <InformationModal
        isOpen={showInfoModal}
        clientEmail={clientEmail}
        clientName={localName}
        clientCompany={localCompany}
        config={config}
        onSuccess={handleInfoModalSuccess}
      />
    </div>
  );
};
