'use client';

import { Sidebar } from '@/components/sidebar';
import { Lightbulb, Plus, Search, ArrowRight, X, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface IdeaItem {
  id: string;
  title: string;
  description: string;
  type: string;
  platform: string;
  tags: string;
}

export default function IdeaBankPage() {
  const [ideas, setIdeas] = useState<IdeaItem[]>([
    { id: 'IDEA-001', title: '5 Kesalahan Saat Menyeduh Teh Hijau', description: 'Bahas kesalahan umum yang bikin rasa teh jadi pahit.', type: 'Reels', platform: 'Instagram', tags: '#education #tips' },
    { id: 'IDEA-002', title: 'ASMR Brewing Morning Detox Tea', description: 'Fokus pada suara air mendidih dan tuangan teh yang menenangkan.', type: 'Video', platform: 'TikTok', tags: '#asmr #relaxing' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    type: 'Reels',
    platform: 'Instagram',
    tags: '#savastea'
  });

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.title) return;

    const item: IdeaItem = {
      id: `IDEA-${Date.now().toString().slice(-4)}`,
      ...newIdea
    };

    setIdeas([item, ...ideas]);
    setIsModalOpen(false);
    setNewIdea({ title: '', description: '', type: 'Reels', platform: 'Instagram', tags: '#savastea' });
    alert('Idea added successfully to Idea Bank!');
  };

  const filteredIdeas = ideas.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#F8F8F7] text-[#171717] font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="px-6 py-5 bg-white border-b border-[#E5E5E5] flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Idea Bank</h1>
            <p className="text-xs text-[#737373] mt-0.5">Capture, store, and brainstorm content concepts before planning.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#171717] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/95 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Idea
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 bg-[#FAFAFA] overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#737373]" />
              <input 
                type="text" 
                placeholder="Search ideas or tags..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:border-[#171717]"
              />
            </div>

            {/* Idea Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredIdeas.map((idea) => (
                <div key={idea.id} className="bg-white p-5 rounded-xl border border-[#E5E5E5] shadow-xs flex flex-col justify-between hover:border-[#737373] transition-all">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#737373] mb-2">
                      <span className="px-2 py-0.5 bg-[#F8F8F7] rounded border border-[#E5E5E5] font-medium">
                        {idea.platform} · {idea.type}
                      </span>
                      <span className="font-mono text-[11px]">{idea.id}</span>
                    </div>
                    <h3 className="font-semibold text-base text-[#171717] mb-1.5">{idea.title}</h3>
                    <p className="text-xs text-[#737373] mb-4 leading-relaxed">{idea.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E5E5E5]">
                    <span className="text-xs text-[#737373] font-medium">{idea.tags}</span>
                    <button className="flex items-center gap-1 text-xs font-semibold text-[#171717] hover:underline bg-[#F8F8F7] px-3 py-1.5 rounded-lg border border-[#E5E5E5]">
                      Add to Planner <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </main>

      {/* Modal Add Idea */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#E5E5E5]">
            <div className="flex justify-between items-center pb-4 border-b border-[#E5E5E5] mb-4">
              <h3 className="text-base font-semibold text-[#171717]">New Content Idea</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-[#F8F8F7] rounded-lg">
                <X className="w-5 h-5 text-[#737373]" />
              </button>
            </div>

            <form onSubmit={handleAddIdea} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-[#737373] mb-1">Idea Title</label>
                <input 
                  type="text" 
                  required
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
                  placeholder="e.g. Unboxing Savas't Tea Hamper" 
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#171717]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#737373] mb-1">Format</label>
                  <select 
                    value={newIdea.type}
                    onChange={(e) => setNewIdea({...newIdea, type: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg bg-white focus:outline-none focus:border-[#171717]"
                  >
                    <option value="Reels">Reels</option>
                    <option value="Carousel">Carousel</option>
                    <option value="Video">Video</option>
                    <option value="Image">Image</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#737373] mb-1">Platform</label>
                  <select 
                    value={newIdea.platform}
                    onChange={(e) => setNewIdea({...newIdea, platform: e.target.value})}
                    className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg bg-white focus:outline-none focus:border-[#171717]"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#737373] mb-1">Description / Notes</label>
                <textarea 
                  rows={3}
                  value={newIdea.description}
                  onChange={(e) => setNewIdea({...newIdea, description: e.target.value})}
                  placeholder="Briefly describe the concept..."
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#171717]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#737373] mb-1">Tags</label>
                <input 
                  type="text" 
                  value={newIdea.tags}
                  onChange={(e) => setNewIdea({...newIdea, tags: e.target.value})}
                  placeholder="#health #savastea" 
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
                  className="px-4 py-2 bg-[#171717] text-white rounded-lg text-sm font-medium hover:bg-black/95"
                >
                  Save Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
