'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Layers, 
  Lightbulb, 
  FolderKanban, 
  BarChart3, 
  Users, 
  Settings,
  X 
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Content Planner', href: '/planner', icon: FolderKanban },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Idea Bank', href: '/ideas', icon: Lightbulb },
  { name: 'Assets', href: '/assets', icon: Layers },
];

const secondaryNav = [
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop untuk mobile */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-black/40 z-45 md:hidden"
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-[#F8F8F7] border-r border-[#E5E5E5] flex flex-col h-screen p-4 select-none
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between px-2 py-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#171717] rounded-md flex items-center justify-center text-white text-xs font-bold">
              CP
            </div>
            <span className="font-semibold text-[#171717] text-sm tracking-wide">Workspace</span>
          </div>
          {isOpen && (
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/5 md:hidden">
              <X className="w-5 h-5 text-[#737373]" />
            </button>
          )}
        </div>

        <div className="text-[11px] font-medium text-[#737373] px-2 mb-2 uppercase tracking-wider">
          Content Hub
        </div>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-white text-[#171717] shadow-xs border border-[#E5E5E5]/60' 
                    : 'text-[#737373] hover:text-[#171717] hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4 text-[#737373]" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <hr className="my-4 border-[#E5E5E5]" />

        <nav className="space-y-1">
          {secondaryNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-white text-[#171717] shadow-xs border border-[#E5E5E5]/60' 
                    : 'text-[#737373] hover:text-[#171717] hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4 text-[#737373]" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
