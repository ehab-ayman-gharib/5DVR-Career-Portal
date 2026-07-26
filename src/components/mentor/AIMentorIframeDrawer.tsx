'use client';

import { X, Bot, ExternalLink } from 'lucide-react';

interface AIMentorIframeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  embedUrl?: string;
}

export function AIMentorIframeDrawer({
  isOpen,
  onClose,
  embedUrl = process.env['3RD_PARTY_AVATAR_EMBED_URL'] || 'https://avatar.provider.com/embed',
}: AIMentorIframeDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-lg bg-white border-l border-[#E4E0FF] h-full flex flex-col justify-between shadow-2xl">
        {/* Header with platform quick-navigation links */}
        <div className="p-4 border-b border-[#E4E0FF] flex items-center justify-between bg-[#F5F4FE]">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-[#6C5CE7] flex items-center justify-center text-white shadow-sm">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#1E1B4B]">AI Avatar Mentor</h3>
              <p className="text-[10px] text-[#64748B]">3rd-Party Embedded Avatar Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E1B4B] hover:bg-[#E8E5FF] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Embedded Iframe Container */}
        <div className="flex-1 bg-[#F8F9FE] relative overflow-hidden">
          <iframe
            src={embedUrl}
            title="AI Avatar Mentor Iframe"
            className="w-full h-full border-0"
            allow="camera; microphone; autoplay; encrypted-media"
          />
        </div>

        {/* Footer platform quick links */}
        <div className="p-3 border-t border-[#E4E0FF] bg-white flex items-center justify-between text-xs text-[#64748B]">
          <span className="text-[10px]">Embedded Web Solution</span>
          <a
            href={embedUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1 text-[#6C5CE7] hover:underline text-[10px] font-bold"
          >
            <span>Open in New Tab</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
