'use client';

import { Sidebar } from '@/components/sidebar';
import { BarChart3, TrendingUp, Users, Eye, Heart } from 'lucide-react';

export default function AnalyticsPage() {
  const metrics = [
    { label: 'TOTAL REACH', value: '45.2K', change: '+18.4%', icon: Eye },
    { label: 'ENGAGEMENT RATE', value: '5.8%', change: '+1.2%', icon: Heart },
    { label: 'PROFILE VISITS', value: '3,210', change: '+8.1%', icon: Users },
    { label: 'FOLLOWER GROWTH', value: '+840', change: '+15.3%', icon: TrendingUp },
  ];

  return (
    <div className="flex h-screen bg-[#F8F8F7] text-[#171717] font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="px-6 py-5 bg-white border-b border-[#E5E5E5] flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Analytics & Performance</h1>
            <p className="text-xs text-[#737373] mt-0.5">Overview of social media metrics and growth.</p>
          </div>
        </header>

        <div className="flex-1 p-6 bg-[#FAFAFA] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {metrics.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div key={idx} className="bg-white p-5 rounded-xl border border-[#E5E5E5] shadow-xs">
                  <div className="flex justify-between items-center text-[#737373] mb-3">
                    <span className="text-[11px] font-semibold">{m.label}</span>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-3xl font-semibold text-[#171717]">{m.value}</div>
                  <div className="text-xs text-emerald-600 mt-1 font-medium">{m.change} vs last month</div>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-xs h-72 flex flex-col items-center justify-center text-center">
            <BarChart3 className="w-12 h-12 text-[#737373] mb-3 stroke-1" />
            <h3 className="text-sm font-semibold text-[#171717]">Performance Chart Visualization</h3>
            <p className="text-xs text-[#737373] mt-1">Detailed channel growth graphs will populate automatically as data syncs.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
