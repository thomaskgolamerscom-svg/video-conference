import React, { useEffect, useRef } from 'react';
import { Participant } from '../types';
import { Mic, MicOff, VideoOff, Crown, Shield } from 'lucide-react';
import { AvatarImage } from './AvatarImage';

interface ParticipantTileProps {
  participant: Participant;
  isLocal?: boolean;
  localStream?: MediaStream | null;
  isDominantSpeaker?: boolean;
}

export const ParticipantTile: React.FC<ParticipantTileProps> = ({
  participant,
  isLocal,
  localStream,
  isDominantSpeaker,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (isLocal && videoRef.current) {
      if (localStream && participant.cameraOn) {
        videoRef.current.srcObject = localStream;
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [isLocal, localStream, participant.cameraOn]);

  const hasRealVideoStream = isLocal && localStream && localStream.getVideoTracks().some(t => t.enabled && t.readyState === 'live');
  const showVideo = participant.cameraOn && (isLocal ? hasRealVideoStream : false);

  return (
    <div
      id={`participant-tile-${participant.id}`}
      className={`relative w-full h-full rounded-2xl overflow-hidden bg-slate-900 border transition-all duration-300 flex items-center justify-center ${
        isDominantSpeaker || participant.isSpeaking
          ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/50'
          : 'border-slate-800/80 hover:border-slate-700'
      }`}
    >
      {/* Video Stream or Avatar Fallback */}
      {showVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover -scale-x-100"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-4 select-none">
          <div className="relative mb-2">
            <AvatarImage
              src={participant.avatar}
              alt={participant.name || 'Participant'}
              fallbackText={participant.name || 'P'}
              sizeClassName="w-20 h-20 sm:w-24 sm:h-24"
              className="border-2 border-slate-700 shadow-md"
              textClassName="text-2xl sm:text-3xl font-bold"
            />

            {/* Speaking animated ripple */}
            {(participant.isSpeaking || isDominantSpeaker) && (
              <span className="absolute -inset-1.5 rounded-full border-2 border-emerald-400 animate-ping opacity-60 pointer-events-none" />
            )}
          </div>
          <p className="text-xs sm:text-sm font-semibold text-white/90 truncate max-w-[180px]">
            {participant.name}
          </p>
          {participant.company && (
            <p className="text-[10px] text-slate-400 truncate max-w-[170px] mt-0.5">
              {participant.company}
            </p>
          )}
        </div>
      )}

      {/* Top Left Role Badge */}
      {participant.role && participant.role !== 'Attendee' && (
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold backdrop-blur-md shadow-xs ${
              participant.role === 'Host'
                ? 'bg-purple-900/80 text-purple-200 border border-purple-500/30'
                : 'bg-blue-900/80 text-blue-200 border border-blue-500/30'
            }`}
          >
            {participant.role === 'Host' ? <Crown className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
            {participant.role}
          </span>
        </div>
      )}

      {/* Bottom Floating Info Pill */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-1.5 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-white max-w-[85%]">
          <span className="text-xs font-medium truncate">
            {participant.name} {isLocal && '(You)'}
            {participant.company && (
              <span className="text-slate-400 font-normal text-[11px] ml-1">
                ({participant.company})
              </span>
            )}
          </span>
        </div>

        <div
          className={`p-1.5 rounded-lg backdrop-blur-md border ${
            participant.micOn
              ? 'bg-black/60 text-emerald-400 border-white/10'
              : 'bg-rose-950/80 text-rose-400 border-rose-500/30'
          }`}
        >
          {participant.micOn ? (
            <Mic className="w-3.5 h-3.5" />
          ) : (
            <MicOff className="w-3.5 h-3.5" />
          )}
        </div>
      </div>
    </div>
  );
};
