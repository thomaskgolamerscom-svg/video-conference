import React from 'react';
import { LayoutType } from '../types';
import { LayoutGrid, Maximize2 } from 'lucide-react';

interface LayoutSelectorProps {
  selected: LayoutType;
  onChange: (layout: LayoutType) => void;
}

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({ selected, onChange }) => {
  const options: { id: LayoutType; label: string; description: string; icon: React.ElementType }[] = [
    {
      id: 'speaker',
      label: 'Speaker View',
      description: 'Spotlights active speaker with top thumbnail strip',
      icon: Maximize2,
    },
    {
      id: 'grid',
      label: 'Grid View',
      description: 'Equal multi-participant grid matrix',
      icon: LayoutGrid,
    },
  ];

  return (
    <div id="layout-selector-section" className="space-y-2">
      <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
        Meeting Layout
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              id={`layout-option-${opt.id}`}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 dark:border-indigo-500 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 ring-1 ring-indigo-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div
                className={`p-2 rounded-md shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-slate-900 dark:text-white text-sm block">
                  {opt.label}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                  {opt.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
