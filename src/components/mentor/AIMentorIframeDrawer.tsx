'use client';

import { X, Bot, ExternalLink, FileText, Map, Video, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

interface AIMentorIframeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  embedUrl?: string;
}

export function AIMentorIframeDrawer({
  isOpen,
  onClose,
  embedUrl = process.env.NEXT_PUBLIC_3RD_PARTY_AVATAR_EMBED_URL ||
    process.env['3RD_PARTY_AVATAR_EMBED_URL'] ||
    'https://5d-ai-hub.com/avatars/5dVR@HelmyDev_7cc59',
}: AIMentorIframeDrawerProps) {
  if (!isOpen) return null;

  const quickLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'CV Center', href: '/cv-center', icon: FileText },
    { name: 'Roadmap', href: '/roadmap', icon: Map },
    { name: 'Interviews', href: '/interview', icon: Video },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-lg md:max-w-xl bg-white border-l border-[#E4E0FF] h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header with platform quick-navigation links */}
        <div className="p-4 border-b border-[#E4E0FF] bg-[#F5F4FE] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-[#6C5CE7] flex items-center justify-center text-white shadow-sm shrink-0">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#1E1B4B]">AI Avatar Mentor</h3>
                <p className="text-[10px] text-[#64748B]">Interactive AI Assistant</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E1B4B] hover:bg-[#E8E5FF] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Nav Links */}
          <div className="flex items-center space-x-2 pt-1 border-t border-[#E4E0FF]/60 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-bold text-[#64748B] uppercase shrink-0">Quick Nav:</span>
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white border border-[#E4E0FF] text-[11px] font-bold text-[#1E1B4B] hover:bg-[#6C5CE7] hover:text-white transition-colors shrink-0 shadow-2xs"
                >
                  <Icon className="h-3 w-3" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Embedded Iframe Container */}
        <div className="flex-1 bg-[#F8F9FE] relative overflow-hidden">
          <iframe
            src={embedUrl}
            title="AI Avatar Mentor Iframe"
            className="w-full h-full border-0"
            allow="camera; microphone; autoplay; encrypted-media; display-capture; clipboard-read; clipboard-write"
          />
        </div>

        {/* Footer platform quick links */}
        <div className="p-3 border-t border-[#E4E0FF] bg-white flex items-center justify-between text-xs text-[#64748B]">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-600">5DVR AI Avatar Hub Connected</span>
          </div>
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

