import React from 'react';
import { PlatformType } from '../types';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { PlatformLogo } from './PlatformLogos';

interface PlatformSelectorProps {
  selected: PlatformType;
  onChange: (platform: PlatformType) => void;
}

interface PlatformOption {
  id: PlatformType;
  label: string;
  badge: string;
  description: string;
}

const PLATFORMS: PlatformOption[] = [
  {
    id: 'google_meet',
    label: 'Google Meet',
    badge: 'Standard Protocol',
    description: 'Cloud conference protocol & Google Workspace integration template',
  },
  {
    id: 'zoom',
    label: 'Zoom',
    badge: 'Enterprise Audio/Video',
    description: 'High-definition enterprise room & webinar bridge template',
  },
  {
    id: 'teams',
    label: 'Microsoft Teams',
    badge: 'Collaboration Bridge',
    description: 'Unified enterprise collaboration & tenant channel audio template',
  },
];

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selected, onChange }) => {
  const selectedPlatform = PLATFORMS.find((p) => p.id === selected) || PLATFORMS[0];

  return (
    <div id="platform-selector-section" className="space-y-3">
      <div className="flex items-center justify-between">
        <label
          htmlFor="meeting-platform-select"
          className="text-sm font-semibold text-slate-800 dark:text-slate-200"
        >
          Meeting Platform <span className="text-rose-500">*</span>
        </label>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Target conference configuration
        </span>
      </div>

      {/* Select Dropdown with Live Platform Logo */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <PlatformLogo platform={selected} size={22} className="shrink-0" />
        </div>

        <select
          id="meeting-platform-select"
          value={selected}
          onChange={(e) => onChange(e.target.value as PlatformType)}
          className="w-full pl-11 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer transition-colors"
        >
          {PLATFORMS.map((platform) => (
            <option
              key={platform.id}
              value={platform.id}
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2 font-medium"
            >
              {platform.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* Active Platform Template Card with Official Branding */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 transition-all">
        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-xs">
          <PlatformLogo platform={selected} size={26} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              {selectedPlatform.label}
            </h4>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">
              {selectedPlatform.badge}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            {selectedPlatform.description}
          </p>
        </div>
        <div className="shrink-0 text-emerald-500">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
