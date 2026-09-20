import React from 'react';
import { ThemeType } from '../types';
import { Sun, Moon, Laptop } from 'lucide-react';

interface ThemeSelectorProps {
  selected: ThemeType;
  onChange: (theme: ThemeType) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ selected, onChange }) => {
  const options: { id: ThemeType; label: string; icon: React.ElementType }[] = [
    { id: 'auto', label: 'Auto (System)', icon: Laptop },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'light', label: 'Light', icon: Sun },
  ];

  return (
    <div id="theme-selector-section" className="space-y-2">
      <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
        Theme Appearance
      </label>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              id={`theme-option-${opt.id}`}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
