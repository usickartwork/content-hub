'use client';

import { Sidebar } from '@/components/sidebar';
import { Plus, CheckCircle2, Clock, Calendar as CalendarIcon, Sparkles, Menu, Search, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { createContent } from '@/lib/api';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Reels',
    platform: 'Instagram',
    date: '2026-09-01',
    time: '19:00',
    pic: 'Filius',
    status: 'SCHEDULED' as any,
    caption: '',
  });

  const stats = [
    { label: 'TOTAL CONTENT', value: '48', change: '+12% this month', icon: CalendarIcon },
    { label: 'SCHEDULED', value: '12', change: 'Ready to post', icon: Clock },
    { label: 'PRODUCTION', value: '8', change: 'In progress', icon: Sparkles },
    { label: 'PUBLISHED', value: '28', change: 'Live on channels', icon: CheckCircle2 },
  ];

  const todaysContent = {
    time: '07:00',
    title: 'HAPPY NEW YEAR / Special Monthly Campaign',
    platform: 'Instagram · Poster',
    pic: 'Filius',
    status: 'Scheduled',
    format: 'Poster 🖼️',
    pillar: 'Special Day 🍂'
  };

  const upcomingContent = [
    { date: 'Sep 1, 2026', title: 'Behind the Scenes & Daily Routine', platform: 'TikTok', type: 'Video' },
    { date: 'Sep 2, 2026', title: 'Product Catalog & Best Tea Selection', platform: 'Instagram', type: 'Carousel 🎠' },
    { date: 'Sep 4, 2026', title: 'Health Benefits & Morning Detox Tips', platform: 'All', type: 'Text 🖹' },
  ];

  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await createContent(formData, 'January26');
    
    if (response.success) {
      setIsModalOpen(false);
      setFormData({
        title: '',
        type: 'Reels',
        platform: 'Instagram',
        date: '2026-09-01',
        time: '19:00',
        pic: 'Filius',
        status: 'SCHEDULED',
        caption: '',
      });
      alert('Content successfully created and synced to Google Spreadsheet!');
    } else {
      alert('Failed to save content: ' + response.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-[#F8F8F7] text-[#171717] font-sans overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="px-4 md:px-8 py-4 md:py-6 bg-white border-b border-[#E5E5E5] flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="p-2 border border-[#E5E5E5] rounded-lg md:hidden hover:bg-[#F8F8F7] cursor-pointer"
            >
              <Menu className="w-5 h-5 text-[#171717]" />
            </button>
            <div>
              <h1 className="text-base md:text-xl font-semibold tracking-tight">Good evening, Filius</h1>
              <p className="text-[11px] md:text-xs text-[#737373] mt-0.5">Savas&apos;t Tea content pipeline today.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#171717] text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-black/95 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Content</span>
          </button>
        </header>

        <div className="p-4 md:p-8 max-w-6xl w-full mx-auto space-y-6 md:space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white p-4 md:p-5 rounded-xl border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#737373] mb-2 md:mb-3">
                    <span className="text-[10px] md:text-[11px] font-semibold tracking-wider">{stat.label}</span>
                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#737373]" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-semibold tracking-tight text-[#171717]">{stat.value}</div>
                    <div className="text-[10px] md:text-xs text-[#737373] mt-0.5 md:mt-1">{stat.change}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-xl border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs md:text-sm font-semibold text-[#171717] tracking-tight flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Today&apos;s Content Schedule
                  </h3>
                  <span className="text-[11px] text-[#737373] bg-[#F8F8F7] px-2.5 py-1 rounded-md border border-[#E5E5E5]">
                    August 31, 2026
                  </span>
                </div>

                <div className="p-4 md:p-5 bg-[#F8F8F7]/60 rounded-lg border border-[#E5E5E5] space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#737373] px-2 py-0.5 bg-white rounded border border-[#E5E5E5]">
                      🕐 {todaysContent.time}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-medium rounded-full border border-emerald-200">
                      ● Scheduled
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm md:text-base text-[#171717] mb-1">{todaysContent.title}</h4>
                    <p className="text-xs text-[#737373]">{todaysContent.pillar} · {todaysContent.format}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 md:p-6 rounded-xl border border-[#E5E5E5] shadow-xs">
              <h3 className="text-xs md:text-sm font-semibold text-[#171717] mb-4 tracking-tight">Upcoming Content</h3>
              <div className="space-y-4">
                {upcomingContent.map((item, idx) => (
                  <div key={idx} className="pb-3 border-b border-[#E5E5E5] last:border-0 last:pb-0">
                    <div className="text-[10px] md:text-[11px] font-medium text-[#737373] mb-0.5">{item.date}</div>
                    <div className="text-xs md:text-sm font-medium text-[#171717] leading-snug">{item.title}</div>
                    <div className="text-[10px] md:text-[11px] text-[#737373] mt-1">🏷️ {item.platform} · {item.type}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Add Content */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-[#E5E5E5] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-[#E5E5E5] mb-4">
              <h3 className="text-base font-semibold text-[#171717]">Create New Content</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-[#F8F8F7] rounded-lg cursor-pointer">
                <X className="w-5 h-5 text-[#737373]" />
              </button>
            </div>

            <form onSubmit={handleCreateContent} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-[#737373] mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. 5 Tips Menjaga Kulit Sehat" 
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#171717]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#737373] mb-1">Content Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg bg-white focus:outline-none focus:border-[#171717]"
                  >
                    <option value="Reels">Reels</option>
                    <option value="Carousel">Carousel</option>
                    <option value="Video">Video</option>
                    <option value="Image">Image</option>
                    <option value="Poster">Poster</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#737373] mb-1">Platform</label>
                  <select 
                    value={formData.platform}
                    onChange={(e) => setFormData({...formData, platform: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg bg-white focus:outline-none focus:border-[#171717]"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="All">All Platforms</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#737373] mb-1">Publish Date</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#171717]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#737373] mb-1">Publish Time</label>
                  <input 
                    type="time" 
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#171717]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#737373] mb-1">PIC</label>
                  <select 
                    value={formData.pic}
                    onChange={(e) => setFormData({...formData, pic: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg bg-white focus:outline-none focus:border-[#171717]"
                  >
                    <option value="Filius">Filius</option>
                    <option value="Raka">Raka</option>
                    <option value="Kevin">Kevin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#737373] mb-1">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg bg-white focus:outline-none focus:border-[#171717]"
                  >
                    <option value="IDEA">Idea</option>
                    <option value="PLANNED">Planned</option>
                    <option value="PRODUCTION">Production</option>
                    <option value="REVIEW">Review</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#737373] mb-1">Caption / Copywriting</label>
                <textarea 
                  rows={3}
                  value={formData.caption}
                  onChange={(e) => setFormData({...formData, caption: e.target.value})}
                  placeholder="Write post caption..."
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#171717]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E5E5]">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E5E5E5] rounded-lg text-sm font-medium hover:bg-[#F8F8F7] cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#171717] text-white rounded-lg text-sm font-medium hover:bg-black/95 flex items-center gap-2 cursor-pointer"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Content
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
