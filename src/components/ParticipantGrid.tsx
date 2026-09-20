import React from 'react';
import { Participant } from '../types';
import { ParticipantTile } from './ParticipantTile';

interface ParticipantGridProps {
  participants: Participant[];
  localStream: MediaStream | null;
  dominantSpeakerId?: string;
}

export const ParticipantGrid: React.FC<ParticipantGridProps> = ({
  participants,
  localStream,
  dominantSpeakerId,
}) => {
  const count = participants.length;

  // Grid layout class based on participant count specifications
  let gridClass = 'grid gap-3 w-full h-full p-3 sm:p-4 ';

  if (count <= 1) {
    gridClass += 'grid-cols-1 max-w-4xl max-h-[85vh] mx-auto';
  } else if (count === 2) {
    gridClass += 'grid-cols-1 md:grid-cols-2 max-w-6xl max-h-[85vh] mx-auto';
  } else if (count === 3) {
    gridClass += 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl max-h-[85vh] mx-auto';
  } else if (count === 4) {
    gridClass += 'grid-cols-2 grid-rows-2 max-w-6xl max-h-[85vh] mx-auto';
  } else if (count <= 6) {
    gridClass += 'grid-cols-2 md:grid-cols-3 max-h-[85vh] mx-auto';
  } else {
    gridClass += 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-h-[85vh] mx-auto overflow-y-auto';
  }

  return (
    <div id="participant-grid-container" className="w-full h-full flex items-center justify-center overflow-hidden">
      <div className={gridClass}>
        {participants.map((p) => (
          <div key={p.id} className="w-full h-full min-h-[180px] sm:min-h-[240px] flex items-center justify-center">
            <ParticipantTile
              participant={p}
              isLocal={p.isLocal}
              localStream={localStream}
              isDominantSpeaker={dominantSpeakerId === p.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
