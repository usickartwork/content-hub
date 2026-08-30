'use client';

import { Sidebar } from '@/components/sidebar';
import { Plus, ArrowUpRight, CheckCircle2, Clock, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  // Mock data statistik yang mencerminkan isi spreadsheet bulanan
  const stats = [
    { label: 'TOTAL CONTENT', value: '48', change: '+12% this month', icon: CalendarIcon },
    { label: 'SCHEDULED', value: '12', change: 'Ready to post', icon: Clock },
    { label: 'PRODUCTION', value: '8', change: 'In progress', icon: Sparkles },
    { label: 'PUBLISHED', value: '28', change: 'Live on channels', icon: CheckCircle2 },
  ];

  // Mock data untuk konten hari ini (Contoh tanggal 31 Agustus 2026 atau 1 September 2026)
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

  const recentActivity = [
    { user: 'Filius', action: 'Changed status to Scheduled', target: 'HAPPY NEW YEAR 2026', time: '2 hours ago' },
    { user: 'Admin', action: 'Added new copywriting for September', target: 'Hispanic Heritage Month', time: '5 hours ago' },
  ];

  return (
    <div className="flex h-screen bg-[#F8F8F7] text-[#171717] font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="px-8 py-6 bg-white border-b border-[#E5E5E5] flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Good evening, Filius</h1>
            <p className="text-xs text-[#737373] mt-0.5">Here&apos;s what&apos;s happening with Savas&apos;t Tea content pipeline today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/planner" 
              className="flex items-center gap-2 bg-[#171717] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/90 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" /> New Content
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 max-w-6xl w-full mx-auto space-y-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white p-5 rounded-xl border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#737373] mb-3">
                    <span className="text-[11px] font-semibold tracking-wider">{stat.label}</span>
                    <Icon className="w-4 h-4 text-[#737373]" />
                  </div>
                  <div>
                    <div className="text-3xl font-semibold tracking-tight text-[#171717]">{stat.value}</div>
                    <div className="text-xs text-[#737373] mt-1">{stat.change}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Grid: Today & Upcoming */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Today's Content Card */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#171717] tracking-tight flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Today&apos;s Content Schedule
                  </h3>
                  <span className="text-xs text-[#737373] bg-[#F8F8F7] px-2.5 py-1 rounded-md border border-[#E5E5E5]">
                    August 31, 2026
                  </span>
                </div>

                <div className="p-5 bg-[#F8F8F7]/60 rounded-lg border border-[#E5E5E5] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#737373] px-2 py-0.5 bg-white rounded border border-[#E5E5E5]">
                      🕐 {todaysContent.time}
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                      ● Scheduled
                    </span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-base text-[#171717] mb-1">{todaysContent.title}</h4>
                    <p className="text-xs text-[#737373]">{todaysContent.pillar} · {todaysContent.format}</p>
                  </div>

                  <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs text-[#737373]">
                    <span>Platform: <strong className="text-[#171717]">{todaysContent.platform}</strong></span>
                    <span>PIC: <strong className="text-[#171717]">👤 {todaysContent.pic}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#E5E5E5] flex justify-between items-center text-xs">
                <span className="text-[#737373]">Synced with Google Spreadsheet (January26)</span>
                <Link href="/planner" className="font-medium text-[#171717] hover:underline flex items-center gap-1">
                  View in Planner <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Upcoming Content Sidebar */}
            <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#171717] mb-4 tracking-tight">Upcoming Content</h3>
                <div className="space-y-4">
                  {upcomingContent.map((item, idx) => (
                    <div key={idx} className="pb-3 border-b border-[#E5E5E5] last:border-0 last:pb-0">
                      <div className="text-[11px] font-medium text-[#737373] mb-0.5">{item.date}</div>
                      <div className="text-sm font-medium text-[#171717] leading-snug">{item.title}</div>
                      <div className="text-[11px] text-[#737373] mt-1">🏷️ {item.platform} · {item.type}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5E5E5]">
                <Link href="/calendar" className="text-xs font-medium text-[#737373] hover:text-[#171717] flex items-center justify-center gap-1 w-full py-2 bg-[#F8F8F7] rounded-lg border border-[#E5E5E5]">
                  Open Full Calendar <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

          </div>

          {/* Recent Activity Section */}
          <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-xs">
            <h3 className="text-sm font-semibold text-[#171717] mb-4 tracking-tight">Recent Activity Log</h3>
            <div className="space-y-3">
              {recentActivity.map((act, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-[#E5E5E5] last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#F8F8F7] border border-[#E5E5E5] flex items-center justify-center font-bold text-[10px]">
                      {act.user[0]}
                    </span>
                    <span><strong>{act.user}</strong> {act.action} <span className="text-[#737373]">({act.target})</span></span>
                  </div>
                  <span className="text-[#737373]">{act.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
