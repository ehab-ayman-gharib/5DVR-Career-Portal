'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Compass,
  Map,
  Video,
  Bot,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface SidebarProps {
  userPath?: 'STUDENT' | 'JOB_SEEKER';
  userName?: string;
  onOpenMentor?: () => void;
}

export function Sidebar({ userPath = 'JOB_SEEKER', userName = 'User', onOpenMentor }: SidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, paths: ['STUDENT', 'JOB_SEEKER'] },
    { name: 'CV Center', href: '/cv-center', icon: FileText, paths: ['JOB_SEEKER'] },
    { name: 'Career Discovery', href: '/discovery', icon: Compass, paths: ['STUDENT'] },
    { name: 'Career Roadmap', href: '/roadmap', icon: Map, paths: ['STUDENT'] },
    { name: 'Mock Interviews', href: '/interview', icon: Video, paths: ['STUDENT', 'JOB_SEEKER'] },
  ];

  const filteredItems = navItems.filter((item) => item.paths.includes(userPath));

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative z-40 bg-white border-r border-[#E4E0FF] flex flex-col justify-between p-3 shrink-0 shadow-sm transition-all duration-300 ease-in-out font-sans ${
        isHovered ? 'w-64' : 'w-20'
      }`}
    >
      <div>
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 px-2.5 py-3 mb-6 border-b border-[#F0EDFF] overflow-hidden">
          <div className="h-10 w-10 rounded-xl bg-[#6C5CE7] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#6C5CE7]/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className={`transition-opacity duration-200 whitespace-nowrap ${isHovered ? 'opacity-100' : 'opacity-0 w-0 pointer-events-none'}`}>
            <h2 className="text-sm font-extrabold text-[#1E1B4B] tracking-tight">Career Portal</h2>
            <span className="text-[10px] text-[#00C2FF] font-extrabold uppercase tracking-wider">
              {userPath === 'STUDENT' ? 'Student' : 'Job Seeker'}
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="space-y-2">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap overflow-hidden ${
                  isActive
                    ? 'bg-[#00C2FF] text-white shadow-md shadow-[#00C2FF]/30'
                    : 'text-[#8E9BBA] hover:text-[#1E1B4B] hover:bg-[#F5F4FE]'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className={`transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 w-0 pointer-events-none'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / AI Mentor Drawer & Logout */}
      <div className="space-y-3 pt-4 border-t border-[#F0EDFF] overflow-hidden">
        <button
          onClick={onOpenMentor}
          className={`w-full flex items-center justify-center space-x-2 px-3 py-3 rounded-xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white font-bold text-xs shadow-md shadow-[#6C5CE7]/20 transition-all ${
            isHovered ? 'justify-center' : 'justify-center'
          }`}
          title="Ask AI Mentor"
        >
          <Bot className="h-5 w-5 shrink-0" />
          <span className={`transition-opacity duration-200 whitespace-nowrap ${isHovered ? 'opacity-100' : 'opacity-0 w-0 pointer-events-none'}`}>
            Ask AI Mentor
          </span>
        </button>

        <div className="flex items-center justify-between px-2 py-1.5 text-xs">
          <span className={`text-[#1E1B4B] font-extrabold truncate transition-opacity duration-200 ${isHovered ? 'opacity-100 max-w-[130px]' : 'opacity-0 w-0 pointer-events-none'}`}>
            {userName}
          </span>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="text-slate-400 hover:text-red-600 transition-colors p-1"
          >
            <LogOut className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </div>
    </aside>
  );
}
