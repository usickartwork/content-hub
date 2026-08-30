'use client';

import { useState } from 'react';
import { Plus, Search, Calendar, User, Layers, X, CheckCircle2 } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  platform: string;
  pic: string;
  status: 'IDEA' | 'PLANNED' | 'PRODUCTION' | 'SCHEDULED' | 'PUBLISHED';
  caption?: string;
}

export default function SimplePlanner() {
  const [contents, setContents] = useState<ContentItem[]>([
    { id: 'CNT-001', title: 'HAPPY NEW YEAR 2026 Special Campaign', date: '2026-09-01', time: '07:00', type: 'Poster', platform: 'Instagram', pic: 'Filius', status: 'SCHEDULED', caption: 'Selamat tahun baru bersama Savas\'t Tea...' },
    { id: 'CNT-002', title: 'Behind The Scene Pembuatan Teh', date: '2026-09-02', time: '10:00', type: 'Video', platform: 'TikTok', pic: 'Raka', status: 'PRODUCTION', caption: 'Proses penyeduhan daun teh pilihan...' },
    { id: 'CNT-003', title: 'Manfaat Morning & Night Detox Tea', date: '2026-09-05', time: '15:00', type: 'Carousel', platform: 'Instagram', pic: 'Kevin', status: 'PLANNED', caption: 'Kenali manfaat detoksifikasi alami...' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPic, setFilterPic] = useState('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'Reels',
    platform: 'Instagram',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    pic: 'Filius',
    status: 'PLANNED' as ContentItem['status'],
    caption: '',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newItem: ContentItem = {
      id: `CNT-${Date.now().toString().slice(-4)}`,
      ...formData
    };

    setContents([newItem, ...contents]);
    setIsAddOpen(false);
    setFormData({
      title: '',
      type: 'Reels',
      platform: 'Instagram',
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      pic: 'Filius',
      status: 'PLANNED',
      caption: '',
    });
  };

  const filtered = contents.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPic = filterPic === 'ALL' || item.pic === filterPic;
    return matchSearch && matchPic;
  });

  const getStatusColor = (status: ContentItem['status']) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'SCHEDULED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PRODUCTION': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F7] text-[#171717] font-sans pb-12">
      
      {/* Header */}
      <header className="bg-white border-b border-[#E5E5E5] sticky top-0 z-20 px-4 md:px-8 py-4 flex items-center justify-between shadow-xs">
        <div>
          <h1 className="text-base md:text-lg font-bold tracking-tight">Savas&apos;t Content Hub</h1>
          <p className="text-[11px] text-[#737373]">Simple & Functional Task Manager</p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-[#171717] text-white px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-black/90 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" /> Tambah Konten
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 md:px-6 pt-6 space-y-4">
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-xl border border-[#E5E5E5] shadow-xs">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#737373]" />
            <input 
              type="text" 
              placeholder="Cari judul..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F8F8F7] border border-[#E5E5E5] rounded-lg text-xs md:text-sm focus:outline-none focus:border-[#171717]"
            />
          </div>

          {/* PIC Filter Buttons */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-semibold text-[#737373] mr-1">PIC:</span>
            {['ALL', 'Filius', 'Raka', 'Kevin'].map((pic) => (
              <button
                key={pic}
                onClick={() => setFilterPic(pic)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filterPic === pic 
                    ? 'bg-[#171717] text-white' 
                    : 'bg-[#F8F8F7] text-[#737373] border border-[#E5E5E5] hover:text-[#171717]'
                }`}
              >
                {pic}
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-12 text-center text-[#737373]">
              <Layers className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Tidak ada konten ditemukan.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedContent(item)}
                className="bg-white p-4 rounded-xl border border-[#E5E5E5] shadow-xs hover:border-[#171717] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-medium text-[#737373] bg-[#F8F8F7] px-2 py-0.5 rounded border border-[#E5E5E5]">
                      {item.platform} · {item.type}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-xs md:text-sm font-semibold text-[#171717] leading-snug">{item.title}</h3>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5E5E5]">
                  <div className="text-[11px] text-[#737373] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {item.date}
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#F8F8F7] px-2.5 py-1 rounded-lg border border-[#E5E5E5]">
                    <User className="w-3.5 h-3.5 text-[#737373]" />
                    <span className="text-xs font-semibold text-[#171717]">{item.pic}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* MODAL: TAMBAH KONTEN */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#E5E5E5] space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="text-sm font-bold">Tambah Konten Baru</h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1 hover:bg-[#F8F8F7] rounded-lg cursor-pointer">
                <X className="w-5 h-5 text-[#737373]" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs md:text-sm">
              <div>
                <label className="block font-semibold text-[#737373] mb-1">Judul Konten *</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Contoh: Tips Menyeduh Teh Savas't"
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#171717]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#737373] mb-1">Format</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg bg-white"
                  >
                    <option value="Reels">Reels</option>
                    <option value="Carousel">Carousel</option>
                    <option value="Video">Video</option>
                    <option value="Poster">Poster</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#737373] mb-1">Platform</label>
                  <select 
                    value={formData.platform}
                    onChange={(e) => setFormData({...formData, platform: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg bg-white"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#737373] mb-1">Tanggal</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#737373] mb-1">PIC</label>
                  <select 
                    value={formData.pic}
                    onChange={(e) => setFormData({...formData, pic: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg bg-white font-medium"
                  >
                    <option value="Filius">Filius</option>
                    <option value="Raka">Raka</option>
                    <option value="Kevin">Kevin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#737373] mb-1">Caption / Catatan</label>
                <textarea 
                  rows={2}
                  value={formData.caption}
                  onChange={(e) => setFormData({...formData, caption: e.target.value})}
                  placeholder="Tulis caption..."
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button 
                  type="button" 
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border rounded-lg text-xs hover:bg-[#F8F8F7] cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#171717] text-white rounded-lg text-xs font-medium hover:bg-black/90 cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL KONTEN */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#E5E5E5] space-y-4">
            <div className="flex justify-between items-start pb-3 border-b">
              <div>
                <span className="text-[11px] font-mono text-[#737373]">{selectedContent.platform} · {selectedContent.type}</span>
                <h3 className="text-sm md:text-base font-bold mt-0.5">{selectedContent.title}</h3>
              </div>
              <button onClick={() => setSelectedContent(null)} className="p-1 hover:bg-[#F8F8F7] rounded-lg cursor-pointer">
                <X className="w-5 h-5 text-[#737373]" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-[#F8F8F7] p-3 rounded-lg text-xs">
              <div>
                <span className="text-[#737373] block">Jadwal:</span>
                <span className="font-semibold">{selectedContent.date} ({selectedContent.time})</span>
              </div>
              <div>
                <span className="text-[#737373] block">PIC:</span>
                <span className="font-semibold text-emerald-700">👤 {selectedContent.pic}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[#737373] uppercase mb-1">Caption / Detail</h4>
              <div className="p-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg text-xs md:text-sm min-h-[60px]">
                {selectedContent.caption || 'Tidak ada catatan.'}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setSelectedContent(null)}
                className="px-4 py-2 bg-[#171717] text-white rounded-lg text-xs font-medium cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
