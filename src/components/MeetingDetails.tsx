import React from 'react';
import { Calendar, Clock, Users, Hash, RefreshCw } from 'lucide-react';
import { generateMeetingId, formatNumericMeetingId } from '../utils/token';

interface MeetingDetailsProps {
  title: string;
  date: string;
  time: string;
  duration: string;
  expectedParticipants: number;
  meetingId: string;
  onChange: (fields: {
    title?: string;
    date?: string;
    time?: string;
    duration?: string;
    expectedParticipants?: number;
    meetingId?: string;
  }) => void;
}

export const MeetingDetails: React.FC<MeetingDetailsProps> = ({
  title,
  date,
  time,
  duration,
  expectedParticipants,
  meetingId,
  onChange,
}) => {
  const handleMeetingIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumericMeetingId(e.target.value);
    onChange({ meetingId: formatted });
  };

  return (
    <div id="meeting-details-section" className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Meeting Details
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Schedule, duration, and 11-digit numeric room identification
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Title */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Meeting Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="meeting-title-input"
            type="text"
            value={title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="e.g. Executive Strategic Review"
            className="w-full text-sm py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>

        {/* Room / Meeting ID (11-Digit Numeric) */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
            <span>Meeting / Room ID</span>
            <span className="text-[10px] text-slate-400">11-Digit Numeric</span>
          </label>
          <div className="relative flex items-center">
            <input
              id="meeting-id-input"
              type="text"
              value={meetingId}
              onChange={handleMeetingIdChange}
              placeholder="e.g. 842 1947 3820"
              maxLength={13} // 11 digits + 2 spaces
              className="w-full text-sm font-mono tracking-wider py-2 px-3 pl-8 pr-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
            />
            <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
            <button
              id="regenerate-meeting-id-btn"
              type="button"
              onClick={() => onChange({ meetingId: generateMeetingId() })}
              title="Generate new 11-digit numeric ID"
              className="absolute right-2 p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Meeting Date
          </label>
          <div className="relative">
            <input
              id="meeting-date-input"
              type="date"
              value={date}
              onChange={(e) => onChange({ date: e.target.value })}
              className="w-full text-sm py-2 px-3 pl-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
          </div>
        </div>

        {/* Time */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Scheduled Time
          </label>
          <div className="relative">
            <input
              id="meeting-time-input"
              type="text"
              value={time}
              onChange={(e) => onChange({ time: e.target.value })}
              placeholder="e.g. 10:30 AM EST"
              className="w-full text-sm py-2 px-3 pl-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Estimated Duration
          </label>
          <select
            id="meeting-duration-select"
            value={duration}
            onChange={(e) => onChange({ duration: e.target.value })}
            className="w-full text-sm py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="15 mins">15 mins</option>
            <option value="30 mins">30 mins</option>
            <option value="45 mins">45 mins</option>
            <option value="60 mins">60 mins</option>
            <option value="90 mins">90 mins</option>
            <option value="120 mins">120 mins</option>
          </select>
        </div>

        {/* Expected Participants */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Expected Participants
          </label>
          <div className="relative">
            <input
              id="meeting-expected-participants-input"
              type="number"
              min={1}
              max={100}
              value={expectedParticipants}
              onChange={(e) => onChange({ expectedParticipants: parseInt(e.target.value, 10) || 1 })}
              className="w-full text-sm py-2 px-3 pl-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Users className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
          </div>
        </div>
      </div>
    </div>
  );
};
