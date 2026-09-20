import React from 'react';
import { HostProfile as HostProfileType, RoleType } from '../types';
import { User, Shield, Briefcase, Mail, Sparkles } from 'lucide-react';
import { ImageUploadZone } from './ImageUploadZone';
import { AvatarImage } from './AvatarImage';

interface HostProfileProps {
  profile: HostProfileType;
  onChange: (profile: HostProfileType) => void;
}

const ROLES: RoleType[] = ['Host', 'Presenter', 'Attendee'];

export const HostProfile: React.FC<HostProfileProps> = ({ profile, onChange }) => {
  const updateField = <K extends keyof HostProfileType>(field: K, value: HostProfileType[K]) => {
    onChange({
      ...profile,
      [field]: value,
    });
  };

  return (
    <div id="host-profile-section" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Host Profile
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure the presiding meeting organizer details and credentials
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
          <Sparkles className="w-3 h-3" /> Live Preview Enabled
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Input Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="host-fullname-input"
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="e.g. Dr. Mohammad Hamad Almenhali"
                  className="w-full text-sm py-2 px-3 pl-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Display Name (In-Call)
              </label>
              <input
                id="host-displayname-input"
                type="text"
                value={profile.displayName}
                onChange={(e) => updateField('displayName', e.target.value)}
                placeholder="e.g. Dr. Almenhali"
                className="w-full text-sm py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="host-email-input"
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="dr.almenhali@enterprise.com"
                  className="w-full text-sm py-2 px-3 pl-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Job Title / Position
              </label>
              <div className="relative">
                <input
                  id="host-jobtitle-input"
                  type="text"
                  value={profile.jobTitle}
                  onChange={(e) => updateField('jobTitle', e.target.value)}
                  placeholder="e.g. Chief Executive Officer"
                  className="w-full text-sm py-2 px-3 pl-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Host Role
              </label>
              <select
                id="host-role-select"
                value={profile.role}
                onChange={(e) => updateField('role', e.target.value as RoleType)}
                className="w-full text-sm py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <ImageUploadZone
                id="host-avatar-upload"
                label="Host Avatar Photo"
                value={profile.avatar}
                onChange={(dataUrl) => updateField('avatar', dataUrl)}
                helperText="Drag & drop host headshot (PNG, JPG, WebP)"
              />
            </div>
          </div>
        </div>

        {/* Live Preview Card (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/80 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center justify-between">
            <span>Live Host Card Preview</span>
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <AvatarImage
                src={profile.avatar}
                alt={profile.fullName || 'Host'}
                fallbackText={profile.fullName || 'H'}
                sizeClassName="w-14 h-14"
                className="border-2 border-white dark:border-slate-800 shadow-sm"
                textClassName="text-lg font-semibold"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full z-10" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                  {profile.fullName || 'Host Name'}
                </h4>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {profile.role}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {profile.jobTitle || 'Executive Officer'}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                {profile.email || 'host@enterprise.com'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
