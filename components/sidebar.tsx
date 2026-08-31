'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ClipboardList, 
  CheckSquare, 
  Calendar, 
  AlertCircle, 
  Users, 
  BarChart2, 
  ExternalLink,
  Settings,
  X 
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const mainNav = [
  { name: 'My Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Content', href: '/content', icon: ClipboardList },
  { name: 'My Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Attention', href: '/attention', icon: AlertCircle },
];

const secondaryNav = [
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Progress', href: '/progress', icon: BarChart2 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/40 z-40 md:hidden" />}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-[#F8F8F7] border-r border-[#E5E5E5] flex flex-col h-screen p-4 select-none
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between px-2 py-3 mb-6">
          <div>
            <div className="font-bold text-sm tracking-tight text-[#171717]">Savas&apos;t Workspace</div>
            <div className="text-[10px] text-[#737373]">Content Team Assistant</div>
          </div>
          {isOpen && (
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/5 md:hidden">
              <X className="w-5 h-5 text-[#737373]" />
            </button>
          )}
        </div>

        <div className="text-[10px] font-semibold text-[#737373] px-2 mb-2 uppercase tracking-wider">
          Content Hub
        </div>
        <nav className="space-y-1">
          {mainNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive 
                    ? 'bg-white text-[#171717] shadow-2xs border border-[#E5E5E5]' 
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

        <div className="text-[10px] font-semibold text-[#737373] px-2 mb-2 uppercase tracking-wider">
          Management
        </div>
        <nav className="space-y-1">
          {secondaryNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive 
                    ? 'bg-white text-[#171717] shadow-2xs border border-[#E5E5E5]' 
                    : 'text-[#737373] hover:text-[#171717] hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4 text-[#737373]" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-[#E5E5E5]">
          <a
            href="https://docs.google.com/spreadsheets" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#737373] hover:text-[#171717] hover:bg-white border border-transparent hover:border-[#E5E5E5] transition-all"
          >
            <span>Open Spreadsheet</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </aside>
    </>
  );
}