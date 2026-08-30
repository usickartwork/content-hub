'use client';
import { Sidebar } from '@/components/sidebar';

export default function PlaceholderPage() {
  return (
    <div className="flex h-screen bg-[#F8F8F7] text-[#171717] font-sans">
      <Sidebar />
      <main className="flex-1 p-8 bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-semibold">Workspace Feature</h1>
          <p className="text-xs text-[#737373] mt-1">This module is part of the upcoming roadmap version.</p>
        </div>
      </main>
    </div>
  );
}
