import React, { useState } from 'react';
import { Participant, RoleType } from '../types';
import { ImageUploadZone } from './ImageUploadZone';
import { AvatarImage } from './AvatarImage';
import {
  Users,
  UserPlus,
  Trash2,
  Edit2,
  Mic,
  MicOff,
  Video,
  VideoOff,
  X,
  Check,
  Mail,
  User,
} from 'lucide-react';

interface ParticipantManagerProps {
  participants: Participant[];
  onChange: (participants: Participant[]) => void;
}

const ROLES: RoleType[] = ['Host', 'Presenter', 'Attendee'];

export const ParticipantManager: React.FC<ParticipantManagerProps> = ({
  participants,
  onChange,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: RoleType;
    avatar: string;
    micOn: boolean;
    cameraOn: boolean;
  }>({
    name: '',
    email: '',
    role: 'Attendee',
    avatar: '',
    micOn: true,
    cameraOn: true,
  });

  const handleStartAdd = () => {
    setFormData({
      name: '',
      email: '',
      role: 'Attendee',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 90000000)}?w=150&auto=format&fit=crop&q=80`,
      micOn: true,
      cameraOn: true,
    });
    setEditingId(null);
    setIsAdding(true);
  };

  const handleStartEdit = (p: Participant) => {
    setFormData({
      name: p.name,
      email: p.email,
      role: p.role,
      avatar: p.avatar,
      micOn: p.micOn,
      cameraOn: p.cameraOn,
    });
    setEditingId(p.id);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (isAdding) {
      const newParticipant: Participant = {
        id: 'p_' + Math.random().toString(36).substring(2, 9),
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        avatar:
          formData.avatar.trim() ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=6366f1&color=fff`,
        micOn: formData.micOn,
        cameraOn: formData.cameraOn,
      };
      onChange([...participants, newParticipant]);
      setIsAdding(false);
    } else if (editingId) {
      onChange(
        participants.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: formData.name.trim(),
                email: formData.email.trim(),
                role: formData.role,
                avatar: formData.avatar.trim() || p.avatar,
                micOn: formData.micOn,
                cameraOn: formData.cameraOn,
              }
            : p
        )
      );
      setEditingId(null);
    }
  };

  const handleDelete = (id: string) => {
    onChange(participants.filter((p) => p.id !== id));
  };

  const toggleMic = (id: string) => {
    onChange(
      participants.map((p) => (p.id === id ? { ...p, micOn: !p.micOn } : p))
    );
  };

  const toggleCamera = (id: string) => {
    onChange(
      participants.map((p) => (p.id === id ? { ...p, cameraOn: !p.cameraOn } : p))
    );
  };

  return (
    <div id="participant-manager-section" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            Configured Participants ({participants.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Define attending delegates, initial AV media states, and roles
          </p>
        </div>
        <button
          id="add-participant-btn"
          type="button"
          onClick={handleStartAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Add Participant
        </button>
      </div>

      {/* Add / Edit Form Modal / Box */}
      {(isAdding || editingId) && (
        <div className="bg-indigo-50/50 dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-900/50 rounded-xl p-4 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-indigo-100 dark:border-slate-700 pb-2">
            <h4 className="text-xs font-semibold text-indigo-950 dark:text-indigo-200">
              {isAdding ? 'Add New Participant' : 'Edit Participant Details'}
            </h4>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full text-xs py-1.5 px-2.5 pl-8 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sarah@enterprise.com"
                  className="w-full text-xs py-1.5 px-2.5 pl-8 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as RoleType })}
                className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <ImageUploadZone
                id="participant-avatar-upload"
                label="Avatar Photo (Optional)"
                value={formData.avatar}
                onChange={(dataUrl) => setFormData({ ...formData, avatar: dataUrl })}
                helperText="Drag & drop participant picture or browse"
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.micOn}
                  onChange={(e) => setFormData({ ...formData, micOn: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Mic On</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.cameraOn}
                  onChange={(e) => setFormData({ ...formData, cameraOn: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Camera On</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!formData.name.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              {isAdding ? 'Save Participant' : 'Update Participant'}
            </button>
          </div>
        </div>
      )}

      {/* Participant List Table / Cards */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
        {participants.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No participants configured yet. Click "Add Participant" above.
          </div>
        ) : (
          participants.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <AvatarImage
                  src={p.avatar}
                  alt={p.name || 'Participant'}
                  fallbackText={p.name || 'P'}
                  sizeClassName="w-8 h-8"
                  className="bg-slate-200 dark:bg-slate-700"
                  textClassName="text-xs font-semibold"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-900 dark:text-white truncate">
                      {p.name}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        p.role === 'Host'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                          : p.role === 'Presenter'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {p.role}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 truncate block">
                    {p.email || 'No email provided'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Initial mic toggle */}
                <button
                  type="button"
                  onClick={() => toggleMic(p.id)}
                  title={p.micOn ? 'Microphone on (Click to mute)' : 'Microphone muted'}
                  className={`p-1.5 rounded-md transition-colors ${
                    p.micOn
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {p.micOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                </button>

                {/* Initial camera toggle */}
                <button
                  type="button"
                  onClick={() => toggleCamera(p.id)}
                  title={p.cameraOn ? 'Camera on (Click to turn off)' : 'Camera off'}
                  className={`p-1.5 rounded-md transition-colors ${
                    p.cameraOn
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {p.cameraOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => handleStartEdit(p)}
                  title="Edit participant"
                  className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  title="Remove participant"
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
