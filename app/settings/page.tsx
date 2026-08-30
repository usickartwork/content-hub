'use client';

import { Sidebar } from '@/components/sidebar';
import { Settings, Shield, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-[#F8F8F7] text-[#171717] font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="px-6 py-5 bg-white border-b border-[#E5E5E5] flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
            <p className="text-xs text-[#737373] mt-0.5">Workspace configurations and API connections.</p>
          </div>
        </header>

        <div className="flex-1 p-6 bg-[#FAFAFA] overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-xs">
              <h3 className="text-sm font-semibold text-[#171717] mb-4 flex items-center gap-2">
                <Database className="w-4 h-4 text-[#737373]" /> Database Connection (Google Spreadsheet)
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-[#737373] mb-1">API URL (Google Apps Script Web App)</label>
                  <input 
                    type="text" 
                    readOnly
                    value={process.env.NEXT_PUBLIC_API_URL || 'Connected via Environment Variables'} 
                    className="w-full px-3 py-2 bg-[#F8F8F7] border border-[#E5E5E5] rounded-lg text-xs font-mono text-[#737373]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
