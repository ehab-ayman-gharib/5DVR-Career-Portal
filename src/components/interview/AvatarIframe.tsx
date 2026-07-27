'use client';

import { Video, Mic, Volume2, Maximize2, Sparkles } from 'lucide-react';

interface AvatarIframeProps {
  embedUrl?: string;
  isRecording?: boolean;
}

export function AvatarIframe({
  embedUrl = process.env.NEXT_PUBLIC_3RD_PARTY_AVATAR_EMBED_URL ||
    process.env['3RD_PARTY_AVATAR_EMBED_URL'] ||
    'https://5d-ai-hub.com/avatars/5dVR@HelmyDev_7cc59',
  isRecording = false,
}: AvatarIframeProps) {
  return (
    <div className="relative w-full h-full bg-[#1E1B4B] rounded-3xl overflow-hidden shadow-2xl border border-[#E4E0FF]/30 flex flex-col justify-between font-sans group">
      {/* Top Overlay Badge & Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-white text-xs font-bold shadow-lg">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <Sparkles className="h-3.5 w-3.5 text-[#00C2FF]" />
          <span>5D AI Avatar Interviewer</span>
        </div>

        {isRecording && (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-500/90 text-white text-xs font-black animate-pulse shadow-lg">
            <Mic className="h-3.5 w-3.5" />
            <span>LISTENING & RECORDING</span>
          </div>
        )}
      </div>

      {/* Embedded Iframe */}
      <div className="flex-1 w-full h-full relative bg-slate-950">
        <iframe
          src={embedUrl}
          title="AI Avatar Interviewer"
          className="w-full h-full border-0 relative z-10"
          allow="camera; microphone; autoplay; encrypted-media; display-capture; clipboard-read; clipboard-write"
        />
      </div>

      {/* Footer Video Status Overlay Controls */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-white text-xs font-semibold shadow-lg">
        <div className="flex items-center space-x-3 text-slate-300">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <Video className="h-4 w-4" />
            <span className="text-[11px] font-bold">1080p Video Active</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center space-x-1.5 text-sky-400">
            <Volume2 className="h-4 w-4" />
            <span className="text-[11px] font-bold">Audio Stream On</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
            Powered by 5D AI Hub
          </span>
        </div>
      </div>
    </div>
  );
}
