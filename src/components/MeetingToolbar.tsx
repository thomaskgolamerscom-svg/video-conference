import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Radio,
  Users,
  MessageSquare,
  Smile,
  MoreVertical,
  PhoneOff,
  LayoutGrid,
  Maximize2,
  Hand,
  Volume2,
  Check,
} from 'lucide-react';
import { LayoutType } from '../types';

interface MeetingToolbarProps {
  micEnabled: boolean;
  cameraEnabled: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  isSharingScreen: boolean;
  onToggleShareScreen: () => void;
  isRecording: boolean;
  onToggleRecording: () => void;
  isParticipantsOpen: boolean;
  onToggleParticipants: () => void;
  participantCount: number;
  isChatOpen: boolean;
  onToggleChat: () => void;
  currentLayout: LayoutType;
  onToggleLayout: () => void;
  onSendReaction: (emoji: string) => void;
  onLeaveMeeting: () => void;
}

const EMOJI_REACTIONS = ['👍', '👏', '❤️', '🎉', '🔥', '✋'];

export const MeetingToolbar: React.FC<MeetingToolbarProps> = ({
  micEnabled,
  cameraEnabled,
  onToggleMic,
  onToggleCamera,
  isSharingScreen,
  onToggleShareScreen,
  isRecording,
  onToggleRecording,
  isParticipantsOpen,
  onToggleParticipants,
  participantCount,
  isChatOpen,
  onToggleChat,
  currentLayout,
  onToggleLayout,
  onSendReaction,
  onLeaveMeeting,
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);

  const handleReactionClick = (emoji: string) => {
    if (emoji === '✋') {
      setIsHandRaised(!isHandRaised);
    }
    onSendReaction(emoji);
    setShowReactions(false);
  };

  return (
    <div id="meeting-bottom-toolbar" className="relative z-30 flex items-center justify-center p-3 sm:p-4 pointer-events-auto">
      {/* Reactions Popover */}
      {showReactions && (
        <div className="absolute bottom-20 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-2 shadow-2xl backdrop-blur-xl flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {EMOJI_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleReactionClick(emoji)}
              className="w-10 h-10 rounded-xl hover:bg-slate-800 flex items-center justify-center text-xl transition-transform hover:scale-125 active:scale-95 cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* More Options Popover */}
      {showMoreMenu && (
        <div className="absolute bottom-20 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-2 shadow-2xl backdrop-blur-xl w-56 animate-in fade-in slide-in-from-bottom-2 duration-200 divide-y divide-slate-800">
          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                onToggleLayout();
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {currentLayout === 'grid' ? <Maximize2 className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
                Switch to {currentLayout === 'grid' ? 'Speaker View' : 'Grid View'}
              </span>
            </button>
          </div>
          <div className="py-1">
            <div className="px-3 py-1.5 text-[11px] text-slate-400 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Spatial Audio: Enabled</span>
            </div>
            <div className="px-3 py-1 text-[11px] text-slate-400">
              Echo Cancellation: Active
            </div>
          </div>
        </div>
      )}

      {/* Toolbar Pill Container */}
      <div className="bg-slate-950/85 backdrop-blur-2xl border border-slate-800/90 rounded-2xl px-3 py-2 shadow-2xl flex items-center gap-1.5 sm:gap-2.5 max-w-full overflow-x-auto scrollbar-none">
        {/* Microphone */}
        <button
          id="toolbar-mic-btn"
          type="button"
          onClick={onToggleMic}
          className={`p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer relative group flex items-center justify-center ${
            micEnabled
              ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white'
              : 'bg-rose-600 hover:bg-rose-700 text-white'
          }`}
          title={micEnabled ? 'Mute Mic' : 'Unmute Mic'}
        >
          {micEnabled ? <Mic className="w-4 h-4 sm:w-5 sm:h-5" /> : <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />}
          <span className="sr-only">Toggle Microphone</span>
        </button>

        {/* Camera */}
        <button
          id="toolbar-camera-btn"
          type="button"
          onClick={onToggleCamera}
          className={`p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer relative group flex items-center justify-center ${
            cameraEnabled
              ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white'
              : 'bg-rose-600 hover:bg-rose-700 text-white'
          }`}
          title={cameraEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {cameraEnabled ? <Video className="w-4 h-4 sm:w-5 sm:h-5" /> : <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" />}
          <span className="sr-only">Toggle Camera</span>
        </button>

        <div className="w-[1px] h-6 bg-slate-800 mx-0.5 hidden sm:block" />

        {/* Share Screen */}
        <button
          id="toolbar-share-screen-btn"
          type="button"
          onClick={onToggleShareScreen}
          className={`p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
            isSharingScreen
              ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/40'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white'
          }`}
          title={isSharingScreen ? 'Stop Sharing Screen' : 'Share Entire Screen / Tab'}
        >
          <MonitorUp className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="sr-only">Share Screen</span>
        </button>

        {/* Record Meeting */}
        <button
          id="toolbar-record-btn"
          type="button"
          onClick={onToggleRecording}
          className={`p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
            isRecording
              ? 'bg-rose-600/90 text-white animate-pulse ring-2 ring-rose-500/40'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white'
          }`}
          title={isRecording ? 'Stop Recording' : 'Record Session'}
        >
          <Radio className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="sr-only">Record Meeting</span>
        </button>

        {/* Participants Toggle */}
        <button
          id="toolbar-participants-btn"
          type="button"
          onClick={onToggleParticipants}
          className={`p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer relative flex items-center justify-center ${
            isParticipantsOpen
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white'
          }`}
          title="Toggle Participants Panel"
        >
          <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-slate-900">
            {participantCount}
          </span>
          <span className="sr-only">Participants</span>
        </button>

        {/* Chat Toggle */}
        <button
          id="toolbar-chat-btn"
          type="button"
          onClick={onToggleChat}
          className={`p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
            isChatOpen
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white'
          }`}
          title="In-call Chat"
        >
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="sr-only">Chat</span>
        </button>

        {/* Reactions */}
        <button
          id="toolbar-reactions-btn"
          type="button"
          onClick={() => {
            setShowReactions(!showReactions);
            setShowMoreMenu(false);
          }}
          className={`p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
            showReactions
              ? 'bg-amber-500 text-slate-950'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white'
          }`}
          title="Send Reaction"
        >
          <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="sr-only">Reactions</span>
        </button>

        {/* More Menu */}
        <button
          id="toolbar-more-btn"
          type="button"
          onClick={() => {
            setShowMoreMenu(!showMoreMenu);
            setShowReactions(false);
          }}
          className="p-2.5 sm:p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white transition-all cursor-pointer flex items-center justify-center"
          title="More options & layout"
        >
          <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="sr-only">More Options</span>
        </button>

        <div className="w-[1px] h-6 bg-slate-800 mx-0.5 hidden sm:block" />

        {/* Leave Meeting (Distinct Red / Danger Style) */}
        <button
          id="toolbar-leave-meeting-btn"
          type="button"
          onClick={onLeaveMeeting}
          className="py-2.5 px-3.5 sm:px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all shadow-md shadow-rose-900/40 cursor-pointer"
          title="Leave Meeting"
        >
          <PhoneOff className="w-4 h-4" />
          <span>Leave</span>
        </button>
      </div>
    </div>
  );
};
