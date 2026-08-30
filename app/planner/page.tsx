'use client';

import { Sidebar } from '@/components/sidebar';
import { Plus, Search, SlidersHorizontal, Calendar, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

interface ContentCard {
  id: string;
  title: string;
  date: string;
  type: string;
  platform: string;
  pic: string;
  status: 'IDEA' | 'PLANNED' | 'PRODUCTION' | 'REVIEW' | 'SCHEDULED' | 'PUBLISHED';
}

export default function PlannerPage() {
  // Mock data yang disesuaikan dengan isi database spreadsheet Savas't Tea
  const [contents] = useState<ContentCard[]>([
    { id: 'CNT-001', title: 'HAPPY NEW YEAR 2026', date: 'Jan 1', type: 'Poster', platform: 'Instagram', pic: 'Filius', status: 'SCHEDULED' },
    { id: 'CNT-002', title: 'Varian Produk Savas\'t & Full Set', date: 'Jan 3', type: 'Video', platform: 'Instagram', pic: 'Raka', status: 'SCHEDULED' },
    { id: 'CNT-003', title: 'New Product: Morning & Night Detox Tea', date: 'Jan 7', type: 'Image', platform: 'Instagram', pic: 'Filius', status: 'SCHEDULED' },
    { id: 'CNT-004', title: 'Manfaat Teh Savas\'t untuk Tubuh', date: 'Jan 9', type: 'Image', platform: 'Instagram', pic: 'Kevin', status: 'PRODUCTION' },
    { id: 'CNT-005', title: 'Behind The Scene Pembuatan Teh', date: 'Sep 1', type: 'Video', platform: 'TikTok', pic: 'Raka', status: 'PLANNED' },
    { id: 'CNT-006', title: 'Tips Menjaga Kesehatan di Musim Hujan', date: 'Sep 5', type: 'Carousel', platform: 'Instagram', pic: 'Filius', status: 'IDEA' },
  ]);

  const columns = [
    { key: 'IDEA', label: 'Idea Bank' },
    { key: 'PLANNED', label: 'Planned' },
    { key: 'PRODUCTION', label: 'Production' },
    { key: 'REVIEW', label: 'Review' },
    { key: 'SCHEDULED', label: 'Scheduled' },
    { key: 'PUBLISHED', label: 'Published' },
  ];

  return (
    <div className="flex h-screen bg-[#F8F8F7] text-[#171717] font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="px-6 py-5 bg-white border-b border-[#E5E5E5] flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Content Planner</h1>
            <p className="text-xs text-[#737373] mt-0.5">Drag, manage, and monitor your social media campaign pipeline.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#737373]" />
              <input 
                type="text" 
                placeholder="Search content title..." 
                className="pl-9 pr-4 py-2 bg-[#F8F8F7] border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:border-[#171717]"
              />
            </div>
            
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E5E5E5] rounded-lg text-sm font-medium hover:bg-[#F8F8F7] transition-all">
              <SlidersHorizontal className="w-4 h-4 text-[#737373]" /> Filter
            </button>

            <button className="flex items-center gap-2 bg-[#171717] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/90 transition-all shadow-xs">
              <Plus className="w-4 h-4" /> New Content
            </button>
          </div>
        </header>

        {/* Kanban Board Layout */}
        <div className="flex-1 overflow-x-auto p-6 flex gap-4 bg-[#FAFAFA]">
          {columns.map((col) => {
            const columnItems = contents.filter((item) => item.status === col.key);
            
            return (
              <div key={col.key} className="w-72 flex-shrink-0 flex flex-col bg-[#F8F8F7]/80 rounded-xl border border-[#E5E5E5] max-h-full">
                
                {/* Column Header */}
                <div className="p-3.5 border-b border-[#E5E5E5] flex items-center justify-between bg-white/50 rounded-t-xl">
                  <span className="text-xs font-semibold text-[#171717] tracking-wide">{col.label}</span>
                  <span className="text-xs bg-white border border-[#E5E5E5] px-2 py-0.5 rounded-md font-medium text-[#737373]">
                    {columnItems.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {columnItems.length === 0 ? (
                    <div className="text-center py-8 text-xs text-[#737373] border border-dashed border-[#E5E5E5] rounded-lg">
                      No content
                    </div>
                  ) : (
                    columnItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="bg-white p-4 rounded-lg border border-[#E5E5E5] shadow-2xs hover:border-[#737373] transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between text-[11px] text-[#737373] mb-2">
                          <span className="flex items-center gap-1 font-medium">
                            <Calendar className="w-3 h-3" /> {item.date}
                          </span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#F8F8F7] rounded">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 className="text-sm font-medium text-[#171717] mb-3 leading-snug">
                          {item.title}
                        </h4>

                        <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E5] text-xs">
                          <span className="px-2 py-0.5 bg-[#F8F8F7] text-[#737373] rounded border border-[#E5E5E5] text-[11px]">
                            {item.platform} · {item.type}
                          </span>
                          <span className="font-medium text-[#171717] text-xs">
                            👤 {item.pic}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
