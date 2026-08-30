'use client';

import { Sidebar } from '@/components/sidebar';
import { Plus, Search, SlidersHorizontal, Calendar, MoreHorizontal, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { createContent } from '@/lib/api';

interface ContentCard {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  platform: string;
  pic: string;
  status: 'IDEA' | 'PLANNED' | 'PRODUCTION' | 'REVIEW' | 'SCHEDULED' | 'PUBLISHED';
}

export default function PlannerPage() {
  const [contents, setContents] = useState<ContentCard[]>([
    { id: 'CNT-001', title: 'HAPPY NEW YEAR 2026', date: '2026-01-01', time: '07:00', type: 'Poster', platform: 'Instagram', pic: 'Filius', status: 'SCHEDULED' },
    { id: 'CNT-002', title: 'Varian Produk Savas\'t & Full Set', date: '2026-01-03', time: '10:00', type: 'Video', platform: 'Instagram', pic: 'Raka', status: 'SCHEDULED' },
    { id: 'CNT-003', title: 'New Product: Morning & Night Detox Tea', date: '2026-01-07', time: '09:00', type: 'Image', platform: 'Instagram', pic: 'Filius', status: 'SCHEDULED' },
    { id: 'CNT-004', title: 'Manfaat Teh Savas\'t untuk Tubuh', date: '2026-01-09', time: '15:00', type: 'Image', platform: 'Instagram', pic: 'Kevin', status: 'PRODUCTION' },
    { id: 'CNT-005', title: 'Behind The Scene Pembuatan Teh', date: '2026-09-01', time: '19:00', type: 'Video', platform: 'TikTok', pic: 'Raka', status: 'PLANNED' },
    { id: 'CNT-006', title: 'Tips Menjaga Kesehatan di Musim Hujan', date: '2026-09-05', time: '16:00', type: 'Carousel', platform: 'Instagram', pic: 'Filius', status: 'IDEA' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'Reels',
    platform: 'Instagram',
    date: '2026-09-01',
    time: '19:00',
    pic: 'Filius',
    status: 'PLANNED' as ContentCard['status'],
    caption: '',
    script: '',
  });

  const columns = [
    { key: 'IDEA', label: 'Idea Bank' },
    { key: 'PLANNED', label: 'Planned' },
    { key: 'PRODUCTION', label: 'Production' },
    { key: 'REVIEW', label: 'Review' },
    { key: 'SCHEDULED', label: 'Scheduled' },
    { key: 'PUBLISHED', label: 'Published' },
  ];

  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Kirim ke Google Apps Script API
    const response = await createContent(formData, 'January26');
    
    if (response.success) {
      const newItem: ContentCard = {
        id: `CNT-${Date.now().toString().slice(-4)}`,
        title: formData.title,
        date: formData.date,
        time: formData.time,
        type: formData.type,
        platform: formData.platform as any,
        pic: formData.pic,
        status: formData.status,
      };

      setContents([newItem, ...contents]);
      setIsModalOpen(false);
      setFormData({
        title: '',
        type: 'Reels',
        platform: 'Instagram',
        date: '2026-09-01',
        time: '19:00',
        pic: 'Filius',
        status: 'PLANNED',
        caption: '',
        script: '',
      });
      alert('Content created and synced to Google Spreadsheet successfully!');
    } else {
      alert('Failed to save content: ' + response.message);
    }
    setLoading(false);
  };

  const filteredContents = contents.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.pic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#F8F8F7] text-[#171717] font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="px-6 py-5 bg-white border-b border-[#E5E5E5] flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Content Planner</h1>
            <p className="text-xs text-[#737373] mt-0.5">Manage and monitor your social media campaign pipeline.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#737373]" />
              <input 
                type="text" 
                placeholder="Search title or PIC..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-[#F8F8F7] border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:border-[#171717]"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E5E5E5] rounded-lg text-sm font-medium hover:bg-[#F8F8F7]">
              <SlidersHorizontal className="w-4 h-4 text-[#737373]" /> Filter
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#171717] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/95 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" /> New Content
            </button>
          </div>
        </header>

        {/* Kanban Board Layout */}
        <div className="flex-1 overflow-x-auto p-6 flex gap-4 bg-[#FAFAFA]">
          {columns.map((col) => {
            const columnItems = filteredContents.filter((item) => item.status === col.key);
            return (
              <div key={col.key} className="w-72 flex-shrink-0 flex flex-col bg-[#F8F8F7]/80 rounded-xl border border-[#E5E5E5] max-h-full">
                <div className="p-3.5 border-b border-[#E5E5E5] flex items-center justify-between bg-white/50 rounded-t-xl">
                  <span className="text-xs font-semibold text-[#171717]">{col.label}</span>
                  <span className="text-xs bg-white border border-[#E5E5E5] px-2 py-0.5 rounded-md font-medium text-[#737373]">
                    {columnItems.length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {columnItems.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-[#E5E5E5] shadow-2xs hover:border-[#737373] transition-all cursor-pointer">
                      <div className="flex items-center justify-between text-[11px] text-[#737373] mb-2">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3 h-3" /> {item.date}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-[#171717] mb-3 leading-snug">{item.title}</h4>
                      <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E5] text-xs">
                        <span className="px-2 py-0.5 bg-[#F8F8F7] text-[#737373] rounded border border-[#E5E5E5] text-[11px]">
                          {item.platform} · {item.type}
                        </span>
                        <span className="font-medium text-[#171717] text-xs">👤 {item.pic}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* Modal Add Content */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-[#E5E5E5] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-[#E5E5E5] mb-4">
              <h3 className="text-base font-semibold text-[#171717]">Create New Content</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-[#F8F8F7] rounded-lg">
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
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
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
                  className="px-4 py-2 border border-[#E5E5E5] rounded-lg text-sm font-medium hover:bg-[#F8F8F7]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#171717] text-white rounded-lg text-sm font-medium hover:bg-black/95 flex items-center gap-2"
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
