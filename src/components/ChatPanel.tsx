import React, { useState } from 'react';
import { MessageSquare, Send, X, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isSelf?: boolean;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose, userName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'System',
      text: 'Meeting session established. End-to-end transport encrypted.',
      time: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: userName || 'You',
      text: inputValue.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    };

    setMessages([...messages, newMsg]);
    setInputValue('');
  };

  return (
    <div
      id="in-call-chat-drawer"
      className="fixed inset-y-0 right-0 z-40 w-full sm:w-80 md:w-96 bg-slate-900/95 border-l border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col transition-all duration-300 animate-in slide-in-from-right"
    >
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-white">In-Call Messages</h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.isSelf ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
              <span className="font-medium text-slate-300">{m.sender}</span>
              <span>&bull;</span>
              <span>{m.time}</span>
            </div>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                m.sender === 'System'
                  ? 'bg-slate-800/60 text-slate-400 border border-slate-700/50 text-center w-full text-[11px]'
                  : m.isSelf
                  ? 'bg-indigo-600 text-white rounded-br-xs'
                  : 'bg-slate-800 text-slate-200 rounded-bl-xs border border-slate-700'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Send a message to everyone..."
            className="w-full text-xs py-2 px-3 pr-10 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-1.5 p-1.5 rounded-lg text-indigo-400 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
