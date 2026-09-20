import React, { useState } from 'react';
import { MeetingConfig } from '../types';
import { encodeMeetingConfig } from '../utils/token';
import { PlatformLogo } from './PlatformLogos';
import {
  Link2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Mail,
  User,
  Building2,
  ShieldCheck,
} from 'lucide-react';

interface MeetingLinkGeneratorProps {
  config: MeetingConfig;
  onOpenLobby: (token: string, email: string, name?: string, company?: string) => void;
  onConfigChange: (updated: Partial<MeetingConfig>) => void;
}

export const MeetingLinkGenerator: React.FC<MeetingLinkGeneratorProps> = ({
  config,
  onOpenLobby,
  onConfigChange,
}) => {
  const [clientName, setClientName] = useState(config.clientName || 'Alexander Wright');
  const [clientCompany, setClientCompany] = useState(config.clientCompany || 'Apex Global Enterprises');
  const [clientEmail, setClientEmail] = useState(config.clientEmail || 'alexander.wright@apexglobal.com');

  const [generatedUrl, setGeneratedUrl] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const emailToUse = clientEmail.trim();
    const nameToUse = clientName.trim();
    const companyToUse = clientCompany.trim();

    const token = encodeMeetingConfig(config, emailToUse, nameToUse, companyToUse);
    setGeneratedToken(token);

    // Construct invitation URL preserving client parameters
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.set('token', token);
    if (emailToUse) params.set('email', emailToUse);
    if (nameToUse) params.set('name', nameToUse);
    if (companyToUse) params.set('company', companyToUse);

    const url = `${baseUrl}?${params.toString()}`;
    setGeneratedUrl(url);

    onConfigChange({
      clientEmail: emailToUse,
      clientName: nameToUse,
      clientCompany: companyToUse,
      token,
    });
  };

  const handleCopy = async () => {
    if (!generatedUrl) return;
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = generatedUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleLaunchLobby = () => {
    const emailToUse = clientEmail.trim();
    const nameToUse = clientName.trim();
    const companyToUse = clientCompany.trim();

    if (!generatedToken) {
      const token = encodeMeetingConfig(config, emailToUse, nameToUse, companyToUse);
      onOpenLobby(token, emailToUse, nameToUse, companyToUse);
    } else {
      onOpenLobby(generatedToken, emailToUse, nameToUse, companyToUse);
    }
  };

  const platformDisplayNames: Record<string, string> = {
    google_meet: 'Google Meet',
    zoom: 'Zoom',
    teams: 'Microsoft Teams',
  };

  return (
    <div id="meeting-link-generator-section" className="space-y-4 pt-2">
      <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Meeting Invitation Link & Target Client
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generates a secure, persistent invitation URL carrying meeting context and recipient data
            </p>
          </div>

          <button
            id="generate-meeting-link-btn"
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate Meeting Link
          </button>
        </div>

        {/* Target Client Details: Name, Company, and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {/* Target Client Name */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Target Client Name
            </label>
            <div className="relative">
              <input
                id="target-client-name-input"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Alexander Wright"
                className="w-full text-xs py-2 px-3 pl-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Personalizes attendee preview & lobby
            </span>
          </div>

          {/* Target Client Company */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Target Client Company
            </label>
            <div className="relative">
              <input
                id="target-client-company-input"
                type="text"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                placeholder="e.g. Apex Global Enterprises"
                className="w-full text-xs py-2 px-3 pl-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Organization metadata
            </span>
          </div>

          {/* Target Client Email */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Target Client Email
            </label>
            <div className="relative">
              <input
                id="client-invitation-email-input"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="client@enterprise.com"
                className="w-full text-xs py-2 px-3 pl-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Pre-filled in confirmation modal
            </span>
          </div>
        </div>

        {/* Selected Platform Badge Indicator with Official Logo */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs mb-4">
          <PlatformLogo platform={config.platform} size={18} />
          <span className="text-slate-600 dark:text-slate-300">
            Active Invitation Template:
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {platformDisplayNames[config.platform] || 'Video Conference'}
          </span>
          <span className="text-slate-400">&bull;</span>
          <span className="font-mono text-slate-500 dark:text-slate-400">
            Room #{config.meetingId}
          </span>
        </div>

        {/* Read-only URL box with Copy Link and Launch */}
        {generatedUrl && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Generated Secure Invitation URL
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Token & Recipient Bound
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <input
                id="generated-meeting-url-input"
                type="text"
                readOnly
                value={generatedUrl}
                className="flex-1 font-mono text-xs py-2.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 select-all focus:outline-none"
              />

              <button
                id="copy-meeting-link-btn"
                type="button"
                onClick={handleCopy}
                className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Link
                  </>
                )}
              </button>

              <button
                id="open-client-lobby-btn"
                type="button"
                onClick={handleLaunchLobby}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Launch Client Lobby
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
