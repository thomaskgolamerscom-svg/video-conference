import React, { useState } from 'react';
import { Participant } from '../types';
import { AvatarImage } from './AvatarImage';
import {
  Users,
  Search,
  X,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Crown,
  Shield,
  UserCheck,
} from 'lucide-react';

interface ParticipantPanelProps {
  participants: Participant[];
  isOpen: boolean;
  onClose: () => void;
  expectedCount?: number;
}

export const ParticipantPanel: React.FC<ParticipantPanelProps> = ({
  participants,
  isOpen,
  onClose,
  expectedCount,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.email && p.email.toLowerCase().includes(search.toLowerCase())) ||
      p.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      id="participant-panel-drawer"
      className="fixed inset-y-0 right-0 z-40 w-full sm:w-80 md:w-96 bg-slate-900/95 border-l border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col transition-all duration-300 animate-in slide-in-from-right"
    >
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-white">Participants</h3>
            <span className="text-[11px] text-slate-400">
              {participants.length}
              {expectedCount ? ` of ${expectedCount}` : ''} in meeting
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-slate-800">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search participants..."
            className="w-full text-xs py-2 px-3 pl-8 rounded-lg bg-slate-800/80 border border-slate-700/80 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Participant List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No participants found
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <AvatarImage
                    src={p.avatar}
                    alt={p.name || 'Participant'}
                    fallbackText={p.name || 'P'}
                    sizeClassName="w-8 h-8"
                    className="border border-slate-700"
                    textClassName="text-xs font-bold"
                  />
                  {p.isSpeaking && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900 z-10" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white truncate">
                      {p.name}
                    </span>
                    {p.isLocal && (
                      <span className="text-[10px] text-slate-400 font-normal">
                        (You)
                      </span>
                    )}
                  </div>
                  {p.company && (
                    <p className="text-[10px] text-slate-400 truncate">
                      {p.company}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-0.5">
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-medium flex items-center gap-0.5 ${
                        p.role === 'Host'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : p.role === 'Presenter'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {p.role === 'Host' && <Crown className="w-2.5 h-2.5" />}
                      {p.role === 'Presenter' && <Shield className="w-2.5 h-2.5" />}
                      {p.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
                <span
                  title={p.micOn ? 'Microphone On' : 'Microphone Off'}
                  className={`p-1 rounded ${
                    p.micOn ? 'text-slate-300' : 'text-rose-400'
                  }`}
                >
                  {p.micOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                </span>
                <span
                  title={p.cameraOn ? 'Camera On' : 'Camera Off'}
                  className={`p-1 rounded ${
                    p.cameraOn ? 'text-slate-300' : 'text-rose-400'
                  }`}
                >
                  {p.cameraOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Panel Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-center">
        <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          End-to-end encrypted identity verification
        </span>
      </div>
    </div>
  );
};
