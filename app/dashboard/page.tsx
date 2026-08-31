'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Menu, Clock, User } from 'lucide-react';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: 'Kevin', jobdesk: 'Editor' });

  const stats = { myTasks: 5, dueToday: 2, overdue: 1, completed: 12 };
  const todaysTasks = [
    { id: 'TSK-003', contentTitle: 'Product Review', task: 'Edit video (First Cut)', deadline: 'Today · 17:00', status: 'In Progress' },
    { id: 'TSK-006', contentTitle: 'Behind The Scene', task: 'Review raw footage', deadline: 'Today · 20:00', status: 'Pending' },
  ];

  return (
    <div className="flex h-screen bg-[#F8F8F7] text-[#171717] font-sans overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="px-4 md:px-8 py-4 bg-white border-b border-[#E5E5E5] flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-2 border border-[#E5E5E5] rounded-lg md:hidden hover:bg-[#F8F8F7]">
              <Menu className="w-5 h-5 text-[#171717]" />
            </button>
            <div>
              <h1 className="text-base md:text-lg font-bold tracking-tight">Good Morning, {currentUser.name}</h1>
              <p className="text-[11px] text-[#737373]">{currentUser.jobdesk} Workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#F8F8F7] px-3 py-1.5 rounded-lg border border-[#E5E5E5]">
            <User className="w-3.5 h-3.5 text-[#737373]" />
            <select 
              value={currentUser.name}
              onChange={(e) => {
                const names: Record<string, string> = { Filius: 'Producer', Raka: 'Cameraman', Kevin: 'Editor', Dimas: 'Designer', Alya: 'Social Media' };
                setCurrentUser({ name: e.target.value, jobdesk: names[e.target.value] || 'Member' });
              }}
              className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Filius">Filius (Producer)</option>
              <option value="Raka">Raka (Cameraman)</option>
              <option value="Kevin">Kevin (Editor)</option>
              <option value="Dimas">Dimas (Designer)</option>
              <option value="Alya">Alya (Social Media)</option>
            </select>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-4xl w-full mx-auto space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-[#E5E5E5]">
              <div className="text-[11px] font-semibold text-[#737373] uppercase">My Tasks</div>
              <div className="text-2xl font-bold mt-1">{stats.myTasks}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#E5E5E5]">
              <div className="text-[11px] font-semibold text-blue-600 uppercase">Due Today</div>
              <div className="text-2xl font-bold mt-1 text-blue-600">{stats.dueToday}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#E5E5E5]">
              <div className="text-[11px] font-semibold text-red-600 uppercase">Overdue</div>
              <div className="text-2xl font-bold mt-1 text-red-600">{stats.overdue}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#E5E5E5]">
              <div className="text-[11px] font-semibold text-emerald-600 uppercase">Completed</div>
              <div className="text-2xl font-bold mt-1 text-emerald-600">{stats.completed}</div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#737373]">Today&apos;s Tasks</h2>
            <div className="space-y-3">
              {todaysTasks.map((t) => (
                <div key={t.id} className="bg-white p-4 rounded-xl border border-[#E5E5E5] flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono bg-[#F8F8F7] px-2 py-0.5 rounded border border-[#E5E5E5] text-[#737373]">
                      {t.contentTitle}
                    </span>
                    <h3 className="text-sm font-semibold text-[#171717]">{t.task}</h3>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#E5E5E5]">
                    <span className="text-xs text-[#737373] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {t.deadline}
                    </span>
                    <button className="px-3 py-1.5 bg-[#171717] text-white text-xs font-medium rounded-lg hover:bg-black/90 cursor-pointer">
                      Mark as Done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}