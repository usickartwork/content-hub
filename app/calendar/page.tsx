'use client';

import { Sidebar } from '@/components/sidebar';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarPage() {
  return (
    <div className="flex h-screen bg-[#F8F8F7] text-[#171717] font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="px-6 py-5 bg-white border-b border-[#E5E5E5] flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Content Calendar</h1>
            <p className="text-xs text-[#737373] mt-0.5">Visual schedule of your monthly social media posts.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-[#E5E5E5] rounded-lg bg-white hover:bg-[#F8F8F7]"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-sm font-semibold px-3">September 2026</span>
            <button className="p-2 border border-[#E5E5E5] rounded-lg bg-white hover:bg-[#F8F8F7]"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </header>

        <div className="flex-1 p-6 bg-[#FAFAFA] overflow-y-auto">
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 h-full flex flex-col items-center justify-center text-center">
            <CalendarIcon className="w-12 h-12 text-[#737373] mb-3 stroke-1" />
            <h3 className="text-base font-medium text-[#171717]">Calendar View Enabled</h3>
            <p className="text-xs text-[#737373] mt-1 max-w-sm">
              All content dates mapped from your Google Spreadsheet will be displayed here in a monthly grid format.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
