import React from 'react';
import { MeetingConfig } from '../types';
import { PlatformSelector } from './PlatformSelector';
import { ThemeSelector } from './ThemeSelector';
import { LayoutSelector } from './LayoutSelector';
import { HostProfile } from './HostProfile';
import { MeetingDetails } from './MeetingDetails';
import { ParticipantManager } from './ParticipantManager';
import { MeetingLinkGenerator } from './MeetingLinkGenerator';
import { Settings } from 'lucide-react';

interface MeetingSettingsProps {
  config: MeetingConfig;
  onChange: (updated: MeetingConfig) => void;
  onOpenLobby: (token: string, email: string, name?: string, company?: string) => void;
  currentJoinedCount?: number;
}

export const MeetingSettings: React.FC<MeetingSettingsProps> = ({
  config,
  onChange,
  onOpenLobby,
  currentJoinedCount = 1,
}) => {
  const updateConfig = (patch: Partial<MeetingConfig>) => {
    onChange({
      ...config,
      ...patch,
    });
  };

  return (
    <div id="admin-meeting-settings-page" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 transition-colors">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                Meeting Settings
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage your meeting preferences
              </p>
            </div>
          </div>

          {/* Participant Status Badge */}
          <div className="flex items-center gap-3">
            <div
              id="participant-status-indicator"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {currentJoinedCount}/{config.expectedParticipants} joined
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Settings Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Section 1: Meeting Platform Dropdown & Layout & Theme */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-6">
          <PlatformSelector
            selected={config.platform}
            onChange={(platform) => updateConfig({ platform })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100 dark:border-slate-800">
            <ThemeSelector
              selected={config.theme}
              onChange={(theme) => updateConfig({ theme })}
            />
            <LayoutSelector
              selected={config.layout}
              onChange={(layout) => updateConfig({ layout })}
            />
          </div>
        </div>

        {/* Section 2: Host Profile with Drag-and-Drop Image Upload */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
          <HostProfile
            profile={config.host}
            onChange={(host) => updateConfig({ host })}
          />
        </div>

        {/* Section 3: Meeting Details with 11-Digit Numeric ID */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
          <MeetingDetails
            title={config.title}
            date={config.date}
            time={config.time}
            duration={config.duration}
            expectedParticipants={config.expectedParticipants}
            meetingId={config.meetingId}
            onChange={(fields) => updateConfig(fields)}
          />
        </div>

        {/* Section 4: Participants Manager with Drag-and-Drop Image Upload */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
          <ParticipantManager
            participants={config.participants}
            onChange={(participants) => updateConfig({ participants })}
          />
        </div>

        {/* Section 5: Meeting Invitation Link Generator */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
          <MeetingLinkGenerator
            config={config}
            onOpenLobby={onOpenLobby}
            onConfigChange={updateConfig}
          />
        </div>
      </main>
    </div>
  );
};
