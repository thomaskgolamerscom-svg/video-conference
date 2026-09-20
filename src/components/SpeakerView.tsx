import React from 'react';
import { Participant } from '../types';
import { ParticipantTile } from './ParticipantTile';

interface SpeakerViewProps {
  participants: Participant[];
  localStream: MediaStream | null;
  dominantSpeakerId?: string;
  onSelectSpeaker?: (id: string) => void;
}

export const SpeakerView: React.FC<SpeakerViewProps> = ({
  participants,
  localStream,
  dominantSpeakerId,
  onSelectSpeaker,
}) => {
  // Find active speaker, defaulting to dominant speaker or host or first participant
  const activeSpeaker =
    participants.find((p) => p.id === dominantSpeakerId) ||
    participants.find((p) => p.role === 'Host') ||
    participants[0];

  const thumbnails = participants.filter((p) => p.id !== activeSpeaker?.id);

  return (
    <div id="speaker-view-container" className="w-full h-full flex flex-col p-3 sm:p-4 gap-3 overflow-hidden">
      {/* Top Thumbnails Ribbon */}
      {thumbnails.length > 0 && (
        <div className="w-full h-28 sm:h-36 shrink-0 flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
          {thumbnails.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectSpeaker && onSelectSpeaker(p.id)}
              className="h-full aspect-video shrink-0 cursor-pointer rounded-xl overflow-hidden hover:ring-2 hover:ring-indigo-500 transition-all"
            >
              <ParticipantTile
                participant={p}
                isLocal={p.isLocal}
                localStream={localStream}
                isDominantSpeaker={dominantSpeakerId === p.id}
              />
            </div>
          ))}
        </div>
      )}

      {/* Main Dominant Speaker Stage */}
      <div className="flex-1 w-full min-h-0 flex items-center justify-center">
        {activeSpeaker ? (
          <div className="w-full h-full max-w-6xl max-h-full">
            <ParticipantTile
              participant={activeSpeaker}
              isLocal={activeSpeaker.isLocal}
              localStream={localStream}
              isDominantSpeaker={true}
            />
          </div>
        ) : (
          <div className="text-slate-500 text-sm">No active speaker</div>
        )}
      </div>
    </div>
  );
};
