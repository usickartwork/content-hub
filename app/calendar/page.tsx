'use client';

import { Sidebar } from '@/components/sidebar';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';

export default function CalendarPage() {
  const [currentMonth] = useState('September 2026');
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  const events: { [key: number]: string } = {
    1: 'Behind the Scenes & Daily Routine',
    2: 'Product Catalog & Best Tea Selection',
    4: 'Health Benefits & Morning Detox',
    10: 'Q&A Session with Tea Master',
    15: 'Mid-Month Special Campaign',
  };

  return (
    <div className="flex h-screen bg-[#F8F8F7] text-[#171717] font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="px-6 py-5 bg-white border-b border-[#E5E5E5] flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Content Calendar</h1>
            <p className="text-xs text-[#737373] mt-0.5">Visual monthly schedule for Savas&apos;t Tea channels.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border border-[#E5E5E5] rounded-lg bg-white px-2 py-1">
              <button className="p-1 hover:bg-[#F8F8F7] rounded"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-sm font-semibold px-2">{currentMonth}</span>
              <button className="p-1 hover:bg-[#F8F8F7] rounded"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 bg-[#FAFAFA] overflow-y-auto">
          <div className="grid grid-cols-7 gap-3 h-full">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-[#737373] py-2">
                {day}
              </div>
            ))}
            {daysInMonth.map((day) => (
              <div 
                key={day} 
                className="bg-white border border-[#E5E5E5] rounded-xl p-3 flex flex-col justify-between min-h-[100px] hover:border-[#737373] transition-all cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-semibold ${day === 1 ? 'bg-[#171717] text-white px-1.5 py-0.5 rounded-md' : 'text-[#737373]'}`}>
                    {day}
                  </span>
                </div>
                {events[day] && (
                  <div className="mt-2 p-1.5 bg-[#F8F8F7] rounded border border-[#E5E5E5] text-[11px] font-medium text-[#171717] leading-tight truncate">
                    📌 {events[day]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
