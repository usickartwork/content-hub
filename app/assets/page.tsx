'use client';

import { Sidebar } from '@/components/sidebar';
import { Layers, Plus, Upload, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

export default function AssetsPage() {
  const [assets] = useState([
    { id: 1, name: 'Savas_t_Logo_Gold.png', type: 'Logo', size: '2.4 MB', date: 'Aug 2026' },
    { id: 2, name: 'Product_Bottle_Mockup.psd', type: 'Mockup', size: '45.1 MB', date: 'Aug 2026' },
    { id: 3, name: 'Campaign_Banner_Sept.jpg', type: 'Banner', size: '5.8 MB', date: 'Aug 2026' },
  ]);

  return (
    <div className="flex h-screen bg-[#F8F8F7] text-[#171717] font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="px-6 py-5 bg-white border-b border-[#E5E5E5] flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Media Assets</h1>
            <p className="text-xs text-[#737373] mt-0.5">Central repository for images, videos, and brand guidelines.</p>
          </div>
          <button className="flex items-center gap-2 bg-[#171717] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/95">
            <Upload className="w-4 h-4" /> Upload Asset
          </button>
        </header>

        <div className="flex-1 p-6 bg-[#FAFAFA] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assets.map((asset) => (
              <div key={asset.id} className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs flex flex-col justify-between">
                <div className="h-32 bg-[#F8F8F7] rounded-lg border border-[#E5E5E5] flex items-center justify-center mb-3">
                  <ImageIcon className="w-8 h-8 text-[#737373] stroke-1" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#171717] truncate">{asset.name}</h4>
                  <div className="flex justify-between items-center mt-1 text-xs text-[#737373]">
                    <span>{asset.type} · {asset.size}</span>
                    <span>{asset.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
