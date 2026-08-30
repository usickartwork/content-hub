'use client';

import { Sidebar } from '@/components/sidebar';
import { Lightbulb, Plus, Search } from 'lucide-react';

export default function IdeaBankPage() {
  return (
    <div className="flex h-screen bg-[#F8F8F7] text-[#171717] font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="px-6 py-5 bg-white border-b border-[#E5E5E5] flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Idea Bank</h1>
            <p className="text-xs text-[#737373] mt-0.5">Capture and store creative content ideas before planning.</p>
          </div>
          <button className="flex items-center gap-2 bg-[#171717] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/95">
            <Plus className="w-4 h-4" /> Add Idea
          </button>
        </header>

        <div className="flex-1 p-6 bg-[#FAFAFA] overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#737373]" />
              <input 
                type="text" 
                placeholder="Search ideas..." 
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:border-[#171717]"
              />
            </div>
            
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-8 text-center">
              <Lightbulb className="w-10 h-10 text-[#737373] mx-auto mb-3 stroke-1" />
              <h4 className="text-sm font-semibold text-[#171717]">No ideas captured yet</h4>
              <p className="text-xs text-[#737373] mt-1">Start adding your brainstormed concepts to convert them into content plans.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
