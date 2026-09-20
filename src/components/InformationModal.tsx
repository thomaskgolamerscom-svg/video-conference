import React, { useState, useEffect } from 'react';
import { MeetingConfig } from '../types';
import { fetchClientPublicIp } from '../utils/ip';
import {
  ShieldCheck,
  Mail,
  MapPin,
  Globe,
  Lock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from 'lucide-react';

interface InformationModalProps {
  isOpen: boolean;
  clientEmail: string;
  clientName?: string;
  clientCompany?: string;
  config: MeetingConfig;
  onSuccess: () => void;
}

export const InformationModal: React.FC<InformationModalProps> = ({
  isOpen,
  clientEmail,
  clientName,
  clientCompany,
  config,
  onSuccess,
}) => {
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [detectedIp, setDetectedIp] = useState<string>('Detecting...');

  const resolvedName = clientName || config.clientName || '';
  const resolvedCompany = clientCompany || config.clientCompany || '';

  // Automatically detect public IP in background
  useEffect(() => {
    let isMounted = true;
    async function resolveIp() {
      try {
        const ip = await fetchClientPublicIp();
        if (isMounted) {
          setDetectedIp(ip);
        }
      } catch (e) {
        if (isMounted) {
          setDetectedIp('Unavailable');
        }
      }
    }
    if (isOpen) {
      resolveIp();
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isAddressValid = address.trim().length > 0;
  const isEmailValid = Boolean(clientEmail && clientEmail.includes('@'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddressValid || status === 'submitting') return;

    setStatus('submitting');
    setErrorMessage(null);

    // Validate inputs locally
    if (!isEmailValid) {
      setStatus('error');
      setErrorMessage('Valid invitation email is required');
      return;
    }

    try {
      // Send the data securely to your server endpoint
      const API_URL = import.meta.env.VITE_BACKEND_URL || '';
      const response = await fetch(`${API_URL}/api/submit-client-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail: clientEmail,
          clientAddress: address,
          clientIp: detectedIp,
          meetingId: config.id || 'N/A',
          hostName: config.hostName || 'Host',
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit information');
      }

      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err: any) {
      console.error('Submission error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div
      id="client-information-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div
        id="client-information-modal-container"
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/60 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Confirm Your Information
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Please confirm your invitation email and enter your address to continue.
            </p>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Target Client Profile Identification Badge */}
          {(resolvedName || resolvedCompany) && (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-semibold text-indigo-400 block tracking-wider">
                  Verified Recipient
                </span>
                <span className="font-bold text-white text-xs">{resolvedName}</span>
                {resolvedCompany && (
                  <span className="text-slate-400 text-xs ml-1.5 font-normal">
                    &bull; {resolvedCompany}
                  </span>
                )}
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                Authorized
              </span>
            </div>
          )}

          {/* Email (Read-only) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Your Email</span>
              <span className="text-[11px] text-slate-500 font-normal">Invitation Verified</span>
            </label>
            <div className="relative">
              <input
                id="client-email-readonly-input"
                type="email"
                readOnly
                value={clientEmail || 'client@enterprise.com'}
                className="w-full text-xs font-medium py-2.5 px-3 pl-9 rounded-xl border border-slate-800 bg-slate-950/70 text-slate-300 cursor-not-allowed select-none focus:outline-none"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Obtained securely from your invitation credentials.
            </p>
          </div>

          {/* Address (Editable) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Enter Your Address <span className="text-rose-400">*</span></span>
              <span className="text-[11px] text-slate-500 font-normal">Required</span>
            </label>
            <div className="relative">
              <textarea
                id="client-address-input"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address to continue"
                required
                disabled={status === 'submitting' || status === 'success'}
                className="w-full text-xs py-2.5 px-3 pl-9 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors"
              />
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          {/* Public IP detection badge */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/50 border border-slate-800 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              Verified Public IP:
            </span>
            <span className="font-mono text-slate-300">{detectedIp}</span>
          </div>

          {/* Privacy Notice */}
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-400 leading-relaxed">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p>
              Your information is used to process this meeting request and may include your IP address for security and record-keeping purposes.
            </p>
          </div>

          {/* Error message state */}
          {status === 'error' && errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Button */}
          <div>
            {status === 'success' ? (
              <div className="w-full py-3 px-4 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Information confirmed</span>
              </div>
            ) : (
              <button
                id="client-information-continue-btn"
                type="submit"
                disabled={!isAddressValid || status === 'submitting'}
                className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Confirming...</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
