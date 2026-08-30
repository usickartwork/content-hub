'use client';

import { Sidebar } from '@/components/sidebar';
import { Users, Mail } from 'lucide-react';

export default function TeamPage() {
  const members = [
    { name: 'Filius Patris Lahendra', role: 'Lead Photographer & Owner', email: 'filius@savastea.com', status: 'Active' },
    { name: 'Raka', role: 'Videographer & Editor', email: 'raka@savastea.com', status: 'Active' },
    { name: 'Kevin', role: 'Content Strategist', email: 'kevin@savastea.com', status: 'Active' },
  ];

  return (
    <div className="flex h-screen bg-[#F8F8F7] text-[#171717] font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="px-6 py-5 bg-white border-b border-[#E5E5E5] flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Team Workspace</h1>
            <p className="text-xs text-[#737373] mt-0.5">Manage team members and content responsibilities (PIC).</p>
          </div>
        </header>

        <div className="flex-1 p-6 bg-[#FAFAFA] overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-3">
            {members.map((m, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-[#E5E5E5] shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#171717] text-white flex items-center justify-center font-semibold text-sm">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#171717]">{m.name}</h4>
                    <p className="text-xs text-[#737373]">{m.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#737373]">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {m.email}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200 font-medium">{m.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
