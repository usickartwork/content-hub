'use client';

import { useState, useEffect } from 'react';

// Daftar Tahapan Workflow Utama
const STAGE_NAMES = [
  '1. Concept',
  '2. Copywriting',
  '3. Produksi / Syuting',
  '4. Visual & Editing',
  '5. Done / Posted'
];

const MONTH_ORDER = ['December26', 'November26', 'October26', 'September26', 'August26'];

const SOCMED_ACCOUNTS = [
  { platform: 'Instagram', username: 'dreamfieldtacticalsurabaya', url: 'https://www.instagram.com/dreamfieldtacticalsurabaya' },
  { platform: 'TikTok', username: 'dreamfieldtactical', url: 'https://www.tiktok.com/@dreamfieldtactical' },
];

const MONTH_MAP: Record<string, number> = {
  January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
  July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
};

function getMonthGrid(sheetName: string) {
  const monthName = sheetName.replace(/[0-9]+$/, '');
  const year = parseInt(sheetName.replace(/^[A-Za-z]+/, ''), 10) || 2026;
  const month = MONTH_MAP[monthName] ?? new Date().getMonth();
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (first.getDay() + 6) % 7; // Senin = 0
  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return { monthName, year, cells };
}

export default function WorkflowWorkspace() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState('September26');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'konten' | 'dashboard' | 'kalender' | 'statistik'>('konten');
  
  const [contentId, setContentId] = useState('CONT-001');
  const [week, setWeek] = useState('Week 1');
  const [date, setDate] = useState('2026-09-01');
  const [weekDay, setWeekDay] = useState('Selasa');
  const [holidays, setHolidays] = useState('');
  const [postTitle, setPostTitle] = useState('');
  
  const [activeStage, setActiveStage] = useState(STAGE_NAMES[0]);
  const [statusCheck, setStatusCheck] = useState('Proses');
  const [platform, setPlatform] = useState('Instagram');
  const [format, setFormat] = useState('Reels');
  
  const [plannerAndAdmin, setPlannerAndAdmin] = useState('Filius');
  const [copywriter, setCopywriter] = useState('Raka');
  const [productionTeam, setProductionTeam] = useState('Filius & Team');
  const [designer, setDesigner] = useState('Kevin');
  const [editor, setEditor] = useState('Alya');
  
  const [deadline, setDeadline] = useState('2026-09-01');
  const [progress, setProgress] = useState('0%');

  const [reportPlatform, setReportPlatform] = useState('Instagram');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportFollowers, setReportFollowers] = useState('');
  const [reportLikes, setReportLikes] = useState('');
  const [reportComments, setReportComments] = useState('');
  const [reportShares, setReportShares] = useState('');
  const [reportViews, setReportViews] = useState('');
  const [reportReach, setReportReach] = useState('');
  const [reportNotes, setReportNotes] = useState('');
  const [reportMsg, setReportMsg] = useState('');
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  const loadData = async (targetSheet?: string) => {
    try {
      const res = await fetch('/api/workspace');
      const json = await res.json();
      if (json && json.sheets) {
        setData(json);
        const availableSheets = json.sheetNames || Object.keys(json.sheets);
        if (targetSheet && availableSheets.includes(targetSheet)) {
          setSelectedSheet(targetSheet);
        } else if (!availableSheets.includes(selectedSheet)) {
          const defaultSheet = availableSheets.find((n: string) => n.includes('26')) || availableSheets[0];
          if (defaultSheet) setSelectedSheet(defaultSheet);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    loadData('September26');
  }, []);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setContentId('CONT-' + Math.floor(100 + Math.random() * 900));
    setWeek('Week 1');
    setDate(new Date().toISOString().split('T')[0]);
    setWeekDay('Selasa');
    setHolidays('');
    setPostTitle('');
    setActiveStage(STAGE_NAMES[0]);
    setStatusCheck('Proses');
    setPlatform('Instagram');
    setFormat('Reels');
    setPlannerAndAdmin('Filius');
    setCopywriter('Raka');
    setProductionTeam('Filius & Team');
    setDesigner('Kevin');
    setEditor('Alya');
    setDeadline(new Date().toISOString().split('T')[0]);
    setProgress('0%');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    const itemStage = item.parsedStage || STAGE_NAMES[0];
    setIsEditing(true);
    setContentId(item.raw[0] || 'CONT-001');
    setWeek(item.raw[1] || 'Week 1');
    setDate(item.date);
    setWeekDay(item.raw[3] || 'Selasa');
    setHolidays(item.raw[4] || '');
    setPostTitle(item.title);
    setActiveStage(itemStage);
    setStatusCheck('Proses');
    setPlatform(item.raw[7] || 'Instagram');
    setFormat(item.raw[8] || 'Reels');
    setPlannerAndAdmin(item.raw[12] || 'Filius');
    setCopywriter(item.raw[13] || 'Raka');
    setProductionTeam(item.raw[14] || 'Filius & Team');
    setDesigner(item.raw[15] || 'Kevin');
    setEditor(item.raw[16] || 'Alya');
    setDeadline(item.raw[17] ? String(item.raw[17]).split('T')[0] : item.date);
    setProgress(item.raw[18] || '0%');
    setIsModalOpen(true);
  };

  const handleAddOrUpdateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) return;

    setIsSubmitting(true);
    setMessage('Menyimpan estafet otomatis...');

    const currentActiveSheet = selectedSheet;
    let finalStageToSave = '';
    
    if (!isEditing) {
      finalStageToSave = '1. Concept (Proses)';
    } else {
      const currentIdx = STAGE_NAMES.indexOf(activeStage);
      if (statusCheck === 'Selesai' && currentIdx < STAGE_NAMES.length - 1) {
        const nextStageName = STAGE_NAMES[currentIdx + 1];
        finalStageToSave = `${nextStageName} (Proses)`;
      } else {
        finalStageToSave = `${activeStage} (${statusCheck})`;
      }
    }

    const newRowData = [
      contentId, week, date, weekDay, holidays, postTitle, finalStageToSave,
      platform, format, 'General', '', '', 
      plannerAndAdmin, copywriter, productionTeam, designer, editor, deadline, progress
    ];

    try {
      const res = await fetch('/api/workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetName: currentActiveSheet, newRowData })
      });
      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        setMessage('Estafet berhasil dipindah.');
        setTimeout(() => setMessage(''), 3000);
        await loadData(currentActiveSheet);
      } else {
        setMessage('Gagal: ' + (json.error || 'Unknown'));
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setMessage('Error: ' + err.toString());
      setIsSubmitting(false);
    }
  };

  if (loading || isSubmitting) {
    return (
      <div style={styles.fullScreenLoader}>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}} />
        <div style={styles.loaderCard}>
          <div style={styles.spinner}></div>
          <h3 style={styles.loaderTitle}>Dream Field Workspace</h3>
          <p style={styles.loaderSub}>
            {isSubmitting ? 'Menyimpan estafet ke Cloud...' : 'Memuat data konten...'}
          </p>
          {loading && (
            <button 
              onClick={() => setLoading(false)} 
              style={{ marginTop: '12px', padding: '6px 14px', fontSize: '11px', backgroundColor: '#F4F4F5', color: '#52525B', borderRadius: '8px', border: '1px solid #E4E4E7', cursor: 'pointer', fontWeight: 600 }}
            >
              Lewati Loading (Darurat)
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentRows = data?.sheets?.[selectedSheet] || [];
  
  let headerIdx = 0;
  for (let i = 0; i < currentRows.length; i++) {
    const firstCell = String(currentRows[i][0] || '').trim().toLowerCase();
    if (firstCell === 'content id' || firstCell === 'id') {
      headerIdx = i;
      break;
    }
  }

  const rows = currentRows.slice(headerIdx + 1);

  const contentList = rows.map((r: any[]) => {
    let rawStatus = String(r[6] || '').trim();
    let parsedStage = STAGE_NAMES[0];
    let parsedCheck = 'Proses';

    if (rawStatus.includes('Copywriting')) parsedStage = STAGE_NAMES[1];
    else if (rawStatus.includes('Produksi') || rawStatus.includes('Syuting')) parsedStage = STAGE_NAMES[2];
    else if (rawStatus.includes('Visual') || rawStatus.includes('Editing')) parsedStage = STAGE_NAMES[3];
    else if (rawStatus.includes('Done') || rawStatus.includes('Posted')) parsedStage = STAGE_NAMES[4];
    else parsedStage = STAGE_NAMES[0];

    if (parsedStage === '5. Done / Posted') {
      if (rawStatus.includes('Selesai')) {
        parsedCheck = 'Selesai';
      } else {
        parsedCheck = 'Proses';
      }
    } else {
      if (rawStatus.includes('Selesai') || rawStatus.includes('Done')) {
        parsedCheck = 'Selesai';
      } else {
        parsedCheck = 'Proses';
      }
    }

    return {
      id: r[0] || '-', week: r[1] || 'Week 1', date: r[2] ? String(r[2]).split('T')[0] : '-',
      title: r[5] ? String(r[5]).trim() : '', stage: parsedStage, checkStatus: parsedCheck,
      platform: r[7] || '-', format: r[8] || '-', plannerAndAdmin: r[12] || '-', copywriter: r[13] || '-',
      productionTeam: r[14] || '-', designer: r[15] || '-', editor: r[16] || '-',
      raw: r, parsedStage: parsedStage, parsedCheck: parsedCheck
    };
  }).filter((item: any) => {
    const hasTitle = item.title !== '' && item.title !== '-' && item.title.toLowerCase() !== 'not started';
    if (!hasTitle) return false;
    if (!searchQuery) return true;
    return Object.values(item).some(val => String(val).toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const availableSheetsFromData = data?.sheetNames || (data?.sheets ? Object.keys(data.sheets) : []);
  const sortedSheetNames = MONTH_ORDER.filter(m => availableSheetsFromData.includes(m));
  const finalSheetList = sortedSheetNames.length > 0 ? sortedSheetNames : availableSheetsFromData;

  const stageCounts = STAGE_NAMES.map(name => ({
    name,
    total: contentList.filter((i: any) => i.stage === name).length,
    done: contentList.filter((i: any) => i.stage === name && i.checkStatus === 'Selesai').length,
  }));

  const platformNames = Array.from(new Set(contentList.map((i: any) => String(i.platform || '-')))) as string[];
  const platformCounts = platformNames.filter(n => n !== '-').map(name => ({
    name,
    count: contentList.filter((i: any) => i.platform === name).length,
  })).sort((a, b) => b.count - a.count);

  const formatNames = Array.from(new Set(contentList.map((i: any) => String(i.format || '-')))) as string[];
  const formatCounts = formatNames.filter(n => n !== '-').map(name => ({
    name,
    count: contentList.filter((i: any) => i.format === name).length,
  })).sort((a, b) => b.count - a.count);

  const totalDone = contentList.filter((i: any) => i.checkStatus === 'Selesai').length;
  const totalProgress = contentList.length - totalDone;
  const maxStageCount = Math.max(1, ...stageCounts.map(s => s.total));
  const maxPlatformCount = Math.max(1, ...platformCounts.map(p => p.count));
  const maxFormatCount = Math.max(1, ...formatCounts.map(f => f.count));

  const calGrid = getMonthGrid(selectedSheet);
  const itemsByDay: Record<number, any[]> = {};
  contentList.forEach((item: any) => {
    if (!item.date || item.date === '-') return;
    const parts = String(item.date).split('-');
    if (parts.length < 3) return;
    const day = parseInt(parts[2], 10);
    if (isNaN(day) || day < 1) return;
    if (!itemsByDay[day]) itemsByDay[day] = [];
    itemsByDay[day].push(item);
  });
  const WEEKDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const MENU_TITLES: Record<string, string> = {
    konten: 'Konten',
    dashboard: 'Dashboard / Ringkasan',
    kalender: 'Kalender Konten',
    statistik: 'Statistik & Laporan',
  };

  const socmedReportRows = Array.isArray(data?.sheets?.['SocmedReport']) ? data.sheets['SocmedReport'] : [];
  let reportHeaderIdx = 0;
  for (let i = 0; i < socmedReportRows.length; i++) {
    const c0 = String(socmedReportRows[i][0] || '').toLowerCase();
    if (c0 === 'date' || c0 === 'tanggal') { reportHeaderIdx = i; break; }
  }
  const socmedReports = socmedReportRows.slice(reportHeaderIdx + 1)
    .map((r: any[], idx: number) => ({
      id: `${String(r[0] || '')}_${String(r[1] || '')}_${idx}`,
      date: r[0] ? String(r[0]).split('T')[0] : '-',
      platform: String(r[1] || '-'),
      username: String(r[2] || '-'),
      followers: r[3] !== undefined ? String(r[3]) : '',
      likes: r[4] !== undefined ? String(r[4]) : '',
      comments: r[5] !== undefined ? String(r[5]) : '',
      shares: r[6] !== undefined ? String(r[6]) : '',
      views: r[7] !== undefined ? String(r[7]) : '',
      reach: r[8] !== undefined ? String(r[8]) : '',
      notes: String(r[9] || ''),
      report: String(r[10] || ''),
    }))
    .filter((r: any) => r.platform !== '-')
    .sort((a: any, b: any) => String(b.date).localeCompare(String(a.date)));

  const platformInfo = (plat: string) => SOCMED_ACCOUNTS.find(a => a.platform === plat);

  const buildSocmedReport = (cur: any, prev: any) => {
    const n = (v: any) => { const k = parseInt(String(v || '0').replace(/[^0-9]/g, ''), 10); return isNaN(k) ? 0 : k; };
    const f = n(cur.followers), pf = n(prev?.followers);
    const likes = n(cur.likes), comments = n(cur.comments), shares = n(cur.shares);
    const views = n(cur.views), reach = n(cur.reach);
    const growth = f - pf;
    const growthPct = pf > 0 ? ((growth / pf) * 100) : 0;
    const engagementTotal = likes + comments + shares;
    const engagementRate = f > 0 ? ((engagementTotal / f) * 100) : 0;
    const lines: string[] = [];
    lines.push(`LAPORAN SOSIAL MEDIA HARIAN`);
    lines.push(`Platform: ${cur.platform}`);
    lines.push(`Akun: @${cur.username}`);
    lines.push(`Tanggal: ${cur.date}`);
    lines.push('');
    lines.push(`1. PERTUMBUHAN FOLLOWERS`);
    lines.push(`- Followers saat ini: ${f.toLocaleString('id-ID')}`);
    if (pf > 0) {
      lines.push(`- Hari sebelumnya: ${pf.toLocaleString('id-ID')}`);
      lines.push(`- Selisih: ${growth >= 0 ? '+' : ''}${growth.toLocaleString('id-ID')} (${growthPct.toFixed(2)}%)`);
      lines.push(`  Keterangan: ${growth >= 0 ? 'Mengalami pertumbuhan positif.' : 'Mengalami penurunan, perlu evaluasi konten.'}`);
    } else {
      lines.push(`- Belum ada data hari sebelumnya, ini laporan pertama tersimpan.`);
    }
    lines.push('');
    lines.push(`2. PERFORMA KONTEN`);
    lines.push(`- Total likes: ${likes.toLocaleString('id-ID')}`);
    lines.push(`- Komentar: ${comments.toLocaleString('id-ID')}`);
    lines.push(`- Shares/bagikan: ${shares.toLocaleString('id-ID')}`);
    lines.push(`- Views (TikTok): ${views.toLocaleString('id-ID')}`);
    lines.push(`- Jangkauan (reach): ${reach.toLocaleString('id-ID')}`);
    lines.push('');
    lines.push(`3. TINGKAT ENGAGEMENT`);
    lines.push(`- Total interaksi (likes+comments+shares): ${engagementTotal.toLocaleString('id-ID')}`);
    lines.push(`- Estimasi engagement rate: ${engagementRate.toFixed(2)}%`);
    lines.push(`  ${engagementRate >= 3 ? 'Kategori: SEHAT (di atas 3%).' : engagementRate >= 1 ? 'Kategori: CUKUP (1-3%), masih bisa ditingkatkan.' : 'Kategori: RENDAH (di bawah 1%), perlu perbaikan konten.'}`);
    lines.push('');
    lines.push(`4. CATATAN / KENDALA`);
    lines.push(`- ${cur.notes ? cur.notes : 'Tidak ada catatan.'}`);
    lines.push('');
    lines.push(`5. REKOMENDASI`);
    if (growth < 0 && pf > 0) lines.push(`- Fokus evaluasi penurunan followers; tinjau jadwal posting terakhir.`);
    if (engagementRate < 1) lines.push(`- Tingkatkan interaksi: gunakan call-to-action, caption tanya jawab, dan balas komentar.`);
    if (engagementRate >= 3) lines.push(`- Pertahankan konsistensi konten yang sedang efektif.`);
    if (shares > likes && likes > 0) lines.push(`- Konten banyak di-share: pertimbangkan buat konten sejenis (strategi viral).`);
    if (reach > f) lines.push(`- Jangkauan melebihi followers: konten sedang tampil di non-followers, manfaatkan momentum.`);
    if (views > 0 && likes === 0 && comments === 0) lines.push(`- Views tinggi namun interaksi rendah: perbaiki hook di 3 detik pertama.`);
    lines.push(`- Pantau rutin setiap hari dan bandingkan dengan periode sebelumnya.`);
    lines.push('');
    lines.push(`Dibuat otomatis oleh Dream Field Workspace`);
    return lines.join('\n');
  };

  const handleSaveSocmedReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDate) return;
    const acc = platformInfo(reportPlatform);
    if (!acc) return;
    const currentReports = socmedReports;
    const prev = currentReports.find((r: any) => r.platform === reportPlatform && r.date < reportDate);
    const reportText = buildSocmedReport({
      date: reportDate, platform: reportPlatform, username: acc.username,
      followers: reportFollowers, likes: reportLikes, comments: reportComments,
      shares: reportShares, views: reportViews, reach: reportReach, notes: reportNotes,
    }, prev);
    setReportMsg('Menyimpan laporan...');
    try {
      const res = await fetch('/api/workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetName: 'SocmedReport',
          newRowData: [reportDate, reportPlatform, acc.username, reportFollowers, reportLikes, reportComments, reportShares, reportViews, reportReach, reportNotes, reportText],
        }),
      });
      const json = await res.json();
      if (json.success) {
        setReportMsg('Laporan berhasil disimpan.');
        setReportFollowers(''); setReportLikes(''); setReportComments('');
        setReportShares(''); setReportViews(''); setReportReach(''); setReportNotes('');
        setExpandedReport(reportDate + '_' + reportPlatform);
        setTimeout(() => setReportMsg(''), 3000);
        await loadData(selectedSheet);
      } else {
        setReportMsg('Gagal: ' + (json.error || 'Unknown'));
      }
    } catch (err: any) {
      setReportMsg('Error: ' + err.toString());
    }
  };

  return (
    <div className="app-container" style={styles.container}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header-bar { display: flex !important; }
          .app-container { flex-direction: column !important; height: auto !important; min-height: 100vh !important; overflow: visible !important; overflow-x: hidden !important; }
          .app-main { height: auto !important; min-height: 100vh !important; overflow: visible !important; padding-top: 56px !important; }
          .main-header { padding: 14px 16px !important; flex-direction: column !important; align-items: stretch !important; gap: 10px !important; }
          .header-actions-row { width: 100% !important; display: flex !important; flex-wrap: wrap !important; gap: 8px !important; justify-content: flex-start !important; }
          .header-actions-row button, .header-actions-row input { flex-shrink: 1 !important; min-width: 0 !important; }
          .search-input-field { width: 100% !important; flex: 1 1 100% !important; }
          .content-area-wrapper { padding: 14px 16px !important; overflow: visible !important; overflow-x: hidden !important; }
          .grid-container-cards { grid-template-columns: 1fr !important; gap: 12px !important; }
          .dashboard-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .calendar-grid { gap: 3px !important; }
          .calendar-grid > div { min-width: 0 !important; overflow: hidden !important; }
          .report-form-grid { grid-template-columns: 1fr 1fr !important; gap: 6px !important; }
          .modal-box-card { max-width: 100% !important; width: 100% !important; height: 100% !important; max-height: 100vh !important; border-radius: 0 !important; padding: 16px !important; }
          .modal-two-col { grid-template-columns: 1fr !important; }
          .statistik-grid { grid-template-columns: 1fr !important; }
          .report-history-item { flex-direction: column !important; align-items: flex-start !important; gap: 6px !important; }
          .mobile-drawer { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; height: 100% !important; max-height: 100vh !important; overflow-y: auto !important; }
          .card-header { flex-wrap: wrap !important; gap: 6px !important; }
          .card-title { word-break: break-word !important; }
          .workflow-badge-inner { flex-direction: column !important; align-items: flex-start !important; gap: 6px !important; }
          .stat-row-mobile { flex-direction: column !important; }
          .header-title-row { flex-wrap: wrap !important; }
        }
        @media (max-width: 380px) {
          .report-form-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) { .mobile-header-bar { display: none !important; } }
      `}} />

<div className="mobile-header-bar" style={styles.mobileHeaderBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => setIsMobileSidebarOpen(true)} style={styles.hamburgerBtn}>☰</button>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#09090B' }}>Dream Field</span>
          </div>
        </div>

      <aside className="desktop-sidebar" style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logoBadge}>D</div>
          <div>
            <h1 style={styles.brandTitle}>Dream Field</h1>
            <p style={styles.brandSubtitle}>Workspace Konten</p>
          </div>
        </div>

        <div style={styles.sidebarContent}>
          <label style={styles.sectionLabel}>Menu</label>
          <div style={styles.menuList}>
            {[
              { key: 'konten', label: 'Konten' },
              { key: 'dashboard', label: 'Dashboard' },
              { key: 'kalender', label: 'Kalender Konten' },
              { key: 'statistik', label: 'Statistik' },
            ].map((m) => {
              const isActive = activeMenu === m.key;
              return (
                <button key={m.key} onClick={() => setActiveMenu(m.key as any)} style={{ ...styles.menuButton, ...(isActive ? styles.menuButtonActive : {}) }}>
                  <span>{m.label}</span>
                  {isActive && <span style={styles.activeDot}></span>}
                </button>
              );
            })}
          </div>

          <label style={{ ...styles.sectionLabel, marginTop: '20px' }}>Periode 2026</label>
          <div style={styles.menuList}>
            {finalSheetList.map((n: string) => {
              const isActive = selectedSheet === n;
              const displayName = n.replace('26', ' 2026');
              return (
                <button key={n} onClick={() => setSelectedSheet(n)} style={{ ...styles.menuButton, ...(isActive ? styles.menuButtonActive : {}) }}>
                  <span>{displayName}</span>
                  {isActive && <span style={styles.activeDot}></span>}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {isMobileSidebarOpen && (
        <div style={styles.modalOverlay}>
          <div className="mobile-drawer" style={styles.mobileDrawer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={styles.logoBadge}>D</div>
                <div>
                  <h1 style={styles.brandTitle}>Dream Field</h1>
                  <p style={styles.brandSubtitle}>Workspace Konten</p>
                </div>
              </div>
              <button onClick={() => setIsMobileSidebarOpen(false)} style={styles.closeBtn}>✕</button>
            </div>

            <label style={styles.sectionLabel}>Menu</label>
            <div style={styles.menuList}>
              {[
                { key: 'konten', label: 'Konten' },
                { key: 'dashboard', label: 'Dashboard' },
                { key: 'kalender', label: 'Kalender Konten' },
                { key: 'statistik', label: 'Statistik' },
              ].map((m) => {
                const isActive = activeMenu === m.key;
                return (
                  <button key={m.key} onClick={() => { setActiveMenu(m.key as any); setIsMobileSidebarOpen(false); }} style={{ ...styles.menuButton, ...(isActive ? styles.menuButtonActive : {}) }}>
                    <span>{m.label}</span>
                    {isActive && <span style={styles.activeDot}></span>}
                  </button>
                );
              })}
            </div>

            <label style={{ ...styles.sectionLabel, marginTop: '20px' }}>Periode 2026</label>
            <div style={styles.menuList}>
              {finalSheetList.map((n: string) => {
                const isActive = selectedSheet === n;
                const displayName = n.replace('26', ' 2026');
                return (
                  <button key={n} onClick={() => { setSelectedSheet(n); setIsMobileSidebarOpen(false); }} style={{ ...styles.menuButton, ...(isActive ? styles.menuButtonActive : {}) }}>
                    <span>{displayName}</span>
                    {isActive && <span style={styles.activeDot}></span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <main className="app-main" style={styles.main}>
        <header className="main-header" style={styles.header}>
          <div>
            <span style={styles.headerSub}>Sistem Estafet Otomatis</span>
            <h2 style={styles.headerTitle}>
              {activeMenu === 'konten' ? selectedSheet.replace('26', ' 2026') : MENU_TITLES[activeMenu]} <span style={styles.countBadge}>{contentList.length} Konten</span>
            </h2>
          </div>

          <div className="header-actions-row" style={styles.headerActions}>
            {message && <span style={{ fontSize: '12px', fontWeight: 600, color: '#10B981' }}>{message}</span>}
            <button onClick={() => loadData(selectedSheet)} style={styles.secondaryButton}>Refresh</button>
            <input className="search-input-field" type="text" placeholder="Cari judul atau tim..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} />
            <button onClick={handleOpenAddModal} style={styles.primaryButton}>+ Input Konten Baru</button>
          </div>
        </header>

        <div className="content-area-wrapper" style={styles.contentArea}>
          {activeMenu === 'konten' && (
            <div className="grid-container-cards" style={styles.gridContainer}>
              {contentList.length === 0 ? (
                <div style={styles.emptyState}>
                  Belum ada konten aktif di periode ini.<br />
                  <span style={{ fontSize: '11px', color: '#A1A1AA', marginTop: '6px', display: 'inline-block' }}>Klik "+ Input Konten Baru" untuk mulai menambah konten.</span>
                </div>
              ) : (
                contentList.map((item: any, idx: number) => {
                  const isFinished = item.checkStatus === 'Selesai';

                  return (
                    <div key={idx} style={styles.card}>
                      <div className="card-header" style={styles.cardHeader}>
                        <span style={styles.dateBadge}>{item.date}</span>
                        <button onClick={() => handleOpenEditModal(item)} style={styles.editBtn}>Update Estafet</button>
                      </div>

                      <h3 className="card-title" style={styles.cardTitle}>{item.title}</h3>

                      <div style={{ ...styles.workflowBadge, backgroundColor: isFinished ? '#DCFCE7' : '#FEF3C7', borderColor: isFinished ? '#86EFAC' : '#FDE68A', color: isFinished ? '#166534' : '#92400E' }}>
                        <div className="workflow-badge-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700 }}>{item.stage}</span>
                          <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', backgroundColor: isFinished ? '#166534' : '#D97706', color: '#FFF' }}>
                            {item.checkStatus === 'Selesai' ? 'SELESAI' : 'PROSES'}
                          </span>
                        </div>
                      </div>

                      <div style={styles.teamGrid}>
                        <div style={styles.teamBadge}><b>Planner:</b> {item.plannerAndAdmin}</div>
                        <div style={styles.teamBadge}><b>Copy:</b> {item.copywriter}</div>
                        <div style={styles.teamBadge}><b>Prod:</b> {item.productionTeam}</div>
                        <div style={styles.teamBadge}><b>Editor:</b> {item.editor}</div>
                      </div>

                      <div style={styles.cardFooter}>
                        <span>{item.platform} ({item.format})</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeMenu === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="dashboard-grid" style={{ ...styles.gridContainer, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                <div style={styles.statCard}>
                  <span style={styles.statLabel}>Total Konten</span>
                  <span style={styles.statValue}>{contentList.length}</span>
                </div>
                <div style={styles.statCard}>
                  <span style={styles.statLabel}>Selesai</span>
                  <span style={{ ...styles.statValue, color: '#166534' }}>{totalDone}</span>
                </div>
                <div style={styles.statCard}>
                  <span style={styles.statLabel}>Proses</span>
                  <span style={{ ...styles.statValue, color: '#92400E' }}>{totalProgress}</span>
                </div>
              </div>

              <div style={styles.dashCard}>
                <h4 style={styles.dashTitle}>Alur Estafet per Tahap</h4>
                {stageCounts.map(s => (
                  <div key={s.name} style={styles.barRow}>
                    <div style={styles.barLabelRow}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#52525B' }}>{s.name}</span>
                      <span style={{ fontSize: '11px', color: '#71717A' }}>{s.done}/{s.total} selesai</span>
                    </div>
                    <div style={styles.barTrack}>
                      <div style={{ position: 'absolute', top: 0, left: 0, width: `${(s.total / maxStageCount) * 100}%`, height: '8px', borderRadius: '99px', backgroundColor: '#D97706' }} />
                      <div style={{ position: 'absolute', top: 0, left: 0, width: `${(s.done / maxStageCount) * 100}%`, height: '8px', borderRadius: '99px', backgroundColor: '#10B981' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeMenu === 'kalender' && (
            <div style={styles.dashCard}>
              <h4 style={styles.dashTitle}>{calGrid.monthName} {calGrid.year}</h4>
              <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                {WEEKDAYS.map(w => (
                  <div key={w} style={{ fontSize: '10px', fontWeight: 700, color: '#71717A', textAlign: 'center', padding: '4px 0' }}>{w}</div>
                ))}
                {calGrid.cells.map((day, idx) => day === null ? (
                  <div key={idx} />
                ) : (
                  <div key={idx} style={itemsByDay[day] ? styles.calDayActive : styles.calDay}>
                    <span style={itemsByDay[day] ? styles.calDayNumActive : styles.calDayNum}>{day}</span>
                    {itemsByDay[day] && itemsByDay[day].slice(0, 2).map((it: any, j: number) => (
                      <span key={j} style={styles.calDayTitle}>
                        {it.title.length > 16 ? it.title.slice(0, 16) + '…' : it.title}
                      </span>
                    ))}
                    {itemsByDay[day] && itemsByDay[day].length > 2 && (
                      <span style={styles.calDayMore}>+{itemsByDay[day].length - 2} lagi</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeMenu === 'statistik' && (
            <>
            <div className="statistik-grid grid-container-cards" style={{ ...styles.gridContainer, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              <div style={styles.dashCard}>
                <h4 style={styles.dashTitle}>Distribusi Platform</h4>
                {platformCounts.length === 0 && <p style={{ fontSize: '12px', color: '#A1A1AA' }}>Belum ada data konten.</p>}
                {platformCounts.map(p => (
                  <div key={p.name} style={styles.barRow}>
                    <div style={styles.barLabelRow}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#52525B' }}>{p.name}</span>
                      <span style={{ fontSize: '11px', color: '#71717A' }}>{p.count} konten</span>
                    </div>
                    <div style={styles.barTrack}>
                      <div style={{ width: `${(p.count / maxPlatformCount) * 100}%`, height: '8px', borderRadius: '99px', backgroundColor: '#2563EB' }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.dashCard}>
                <h4 style={styles.dashTitle}>Distribusi Format</h4>
                {formatCounts.length === 0 && <p style={{ fontSize: '12px', color: '#A1A1AA' }}>Belum ada data konten.</p>}
                {formatCounts.map(f => (
                  <div key={f.name} style={styles.barRow}>
                    <div style={styles.barLabelRow}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#52525B' }}>{f.name}</span>
                      <span style={{ fontSize: '11px', color: '#71717A' }}>{f.count} konten</span>
                    </div>
                    <div style={styles.barTrack}>
                      <div style={{ width: `${(f.count / maxFormatCount) * 100}%`, height: '8px', borderRadius: '99px', backgroundColor: '#3B82F6' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.dashCard}>
              <h4 style={styles.dashTitle}>Laporan Sosial Media</h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
                {SOCMED_ACCOUNTS.map(acc => (
                  <a key={acc.platform} href={acc.url} target="_blank" rel="noreferrer"
                    style={{ fontSize: '12px', fontWeight: 600, color: '#2563EB', background: '#EFF6FF',
                      border: '1px solid #BFDBFE', padding: '6px 10px', borderRadius: '10px', textDecoration: 'none' }}>
                    {acc.platform} · @{acc.username}
                  </a>
                ))}
              </div>

              <form onSubmit={handleSaveSocmedReport}>
                <div className="report-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px', marginBottom: '8px' }}>
                  <label style={styles.reportLabel}>Platform
                    <select value={reportPlatform} onChange={e => setReportPlatform(e.target.value)} style={styles.reportInput}>
                      {SOCMED_ACCOUNTS.map(acc => <option key={acc.platform} value={acc.platform}>{acc.platform}</option>)}
                    </select>
                  </label>
                  <label style={styles.reportLabel}>Tanggal
                    <input type="date" value={reportDate} onChange={e => setReportDate(e.target.value)} style={styles.reportInput} />
                  </label>
                  <label style={styles.reportLabel}>Followers
                    <input type="number" value={reportFollowers} onChange={e => setReportFollowers(e.target.value)} style={styles.reportInput} placeholder="cth 1250" />
                  </label>
                  <label style={styles.reportLabel}>Likes
                    <input type="number" value={reportLikes} onChange={e => setReportLikes(e.target.value)} style={styles.reportInput} placeholder="cth 45" />
                  </label>
                  <label style={styles.reportLabel}>Komentar
                    <input type="number" value={reportComments} onChange={e => setReportComments(e.target.value)} style={styles.reportInput} placeholder="cth 5" />
                  </label>
                  <label style={styles.reportLabel}>Shares
                    <input type="number" value={reportShares} onChange={e => setReportShares(e.target.value)} style={styles.reportInput} placeholder="cth 3" />
                  </label>
                  <label style={styles.reportLabel}>Views
                    <input type="number" value={reportViews} onChange={e => setReportViews(e.target.value)} style={styles.reportInput} placeholder="cth 800" />
                  </label>
                  <label style={styles.reportLabel}>Reach
                    <input type="number" value={reportReach} onChange={e => setReportReach(e.target.value)} style={styles.reportInput} placeholder="cth 600" />
                  </label>
                </div>
                <label style={styles.reportLabel}>Catatan / Kendala
                  <textarea value={reportNotes} onChange={e => setReportNotes(e.target.value)} rows={2} style={{ ...styles.reportInput, width: '100%', resize: 'vertical' }} placeholder="cth: konten reels sepatu baru, jam 19.00" />
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" style={styles.reportSubmit}>{reportMsg.startsWith('Menyimpan') ? 'Menyimpan...' : 'Simpan Laporan Harian'}</button>
                  {reportMsg && <span style={{ fontSize: '11px', color: reportMsg.startsWith('Gagal') || reportMsg.startsWith('Error') ? '#DC2626' : '#059669' }}>{reportMsg}</span>}
                </div>
              </form>
            </div>

            <div style={{ ...styles.dashCard, gridColumn: '1 / -1' }}>
              <h4 style={styles.dashTitle}>Riwayat Laporan</h4>
              {socmedReports.length === 0 && <p style={{ fontSize: '12px', color: '#A1A1AA' }}>Belum ada laporan. Pastikan sheet "SocmedReport" sudah ada, lalu isi form di atas.</p>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {socmedReports.map(r => (
                  <div key={r.id} style={styles.reportItem}>
                    <div className="report-history-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB' }}>{r.platform}</span>
                        <span style={{ fontSize: '12px', color: '#374151' }}>@{r.username}</span>
                        <span style={{ fontSize: '11px', color: '#6B7280' }}>{r.date}</span>
                        <span style={styles.reportStat}>({r.followers || '0'} followers · {r.likes || '0'} likes · {r.views || '0'} views)</span>
                      </div>
                      <button type="button" onClick={() => setExpandedReport(expandedReport === r.id ? null : r.id)}
                        style={styles.reportToggle}>{expandedReport === r.id ? 'Tutup' : 'Lihat'}</button>
                    </div>
                    {expandedReport === r.id && (
                      <pre style={styles.reportText}>{r.report || '(laporan tersimpan tanpa teks)'}</pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
            </>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div className="modal-box-card" style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={styles.modalTitle}>{isEditing ? 'Update Estafet Checklist' : 'Input Konten Baru'}</h3>
                <p style={styles.modalSub}>{isEditing ? 'Update tahap pengerjaan konten.' : 'Konten baru otomatis dimulai dari 1. Concept.'}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={styles.closeBtn}>✕</button>
            </div>

            <form onSubmit={handleAddOrUpdateContent} style={styles.form}>
              {isEditing && (
                <div style={{ backgroundColor: '#F4F4F5', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E4E4E7' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block' }}>Tahap Tugas Saat Ini</span>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#09090B', marginTop: '2px' }}>{activeStage}</div>
                </div>
              )}

              <div>
                <label style={styles.label}>Status Pengerjaan</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
                  <button type="button" onClick={() => setStatusCheck('Proses')} style={{ padding: '10px', borderRadius: '10px', border: statusCheck === 'Proses' ? '2px solid #D97706' : '1px solid #E4E4E7', backgroundColor: statusCheck === 'Proses' ? '#FEF3C7' : '#FAFAFA', fontWeight: 700, fontSize: '12px', color: '#92400E', cursor: 'pointer' }}>Proses</button>
                  <button type="button" onClick={() => setStatusCheck('Selesai')} style={{ padding: '10px', borderRadius: '10px', border: statusCheck === 'Selesai' ? '2px solid #166534' : '1px solid #E4E4E7', backgroundColor: statusCheck === 'Selesai' ? '#DCFCE7' : '#FAFAFA', fontWeight: 700, fontSize: '12px', color: '#166534', cursor: 'pointer' }}>Selesai</button>
                </div>
                <span style={{ fontSize: '11px', color: '#71717A', marginTop: '6px', display: 'block', fontWeight: 500 }}>Jika memilih <b>Selesai</b>, sistem otomatis mengoper konten ke tahap berikutnya.</span>
              </div>

              <div>
                <label style={styles.label}>Post Title (Judul Konten)</label>
                <input type="text" placeholder="Masukkan judul konten..." value={postTitle} onChange={(e) => setPostTitle(e.target.value)} style={styles.input} required />
              </div>

              <div className="modal-two-col" style={styles.rowGrid}>
                <div>
                  <label style={styles.label}>Date (Tanggal Publish)</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.input} required />
                </div>
                <div>
                  <label style={styles.label}>Platform</label>
                  <select value={platform} onChange={(e) => setPlatform(e.target.value)} style={styles.input}>
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                    <option value="All">All</option>
                  </select>
                </div>
              </div>

              <div style={{ borderTop: '1px dashed #E4E4E7', paddingTop: '10px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#A1A1AA', textTransform: 'uppercase' }}>Penanggung Jawab Tim</span>
                <div style={{ marginTop: '6px' }}>
                  <label style={styles.label}>Content Planner & Schedule Admin</label>
                  <input type="text" value={plannerAndAdmin} onChange={(e) => setPlannerAndAdmin(e.target.value)} style={styles.input} />
                </div>

                <div className="modal-two-col" style={{ ...styles.rowGrid, marginTop: '8px' }}>
                  <div>
                    <label style={styles.label}>Copywriter</label>
                    <input type="text" value={copywriter} onChange={(e) => setCopywriter(e.target.value)} style={styles.input} />
                  </div>
                  <div>
                    <label style={styles.label}>Tim Produksi / Syuting</label>
                    <input type="text" value={productionTeam} onChange={(e) => setProductionTeam(e.target.value)} style={styles.input} />
                  </div>
                </div>

                <div className="modal-two-col" style={{ ...styles.rowGrid, marginTop: '8px' }}>
                  <div>
                    <label style={styles.label}>Graphic Designer</label>
                    <input type="text" value={designer} onChange={(e) => setDesigner(e.target.value)} style={styles.input} />
                  </div>
                  <div>
                    <label style={styles.label}>Video Editor</label>
                    <input type="text" value={editor} onChange={(e) => setEditor(e.target.value)} style={styles.input} />
                  </div>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.secondaryButton}>Batal</button>
                <button type="submit" style={styles.primaryButton}>{isEditing ? 'Simpan Estafet' : 'Simpan Konten Baru'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  // ── Layout ─────────────────────────────────────────────────────────────────
  container: {
    display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative',
    backgroundColor: '#F5F6FA', color: '#1A1D23',
    fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
  },

  // ── Full-screen loader ──────────────────────────────────────────────────────
  fullScreenLoader: {
    display: 'flex', height: '100vh', width: '100vw', alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#F5F6FA', position: 'fixed', inset: 0, zIndex: 999,
  },
  loaderCard: {
    backgroundColor: '#FFFFFF', padding: '40px 52px', borderRadius: '24px',
    border: '1px solid #E8EAF0', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '16px',
    boxShadow: '0 8px 32px rgba(37,99,235,0.08), 0 1px 4px rgba(0,0,0,0.06)',
  },
  spinner: {
    width: '36px', height: '36px',
    border: '3px solid #E8EAF0', borderTop: '3px solid #2563EB',
    borderRadius: '50%', animation: 'spin 0.8s linear infinite',
  },
  loaderTitle: { fontSize: '15px', fontWeight: 700, color: '#1A1D23', margin: 0 },
  loaderSub: { fontSize: '12px', color: '#6B7280', margin: 0 },

  // ── Mobile header ───────────────────────────────────────────────────────────
  mobileHeaderBar: {
    height: '56px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8EAF0',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 16px', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
  },
  hamburgerBtn: {
    background: 'transparent', border: 'none', fontSize: '20px',
    cursor: 'pointer', color: '#1A1D23', padding: '4px 8px',
  },
  mobileDrawer: {
    backgroundColor: '#FFFFFF', borderRadius: '20px', width: '90%', maxWidth: '320px',
    padding: '28px', border: '1px solid #E8EAF0',
    boxShadow: '0 20px 48px rgba(0,0,0,0.12)',
  },

  // ── Sidebar ─────────────────────────────────────────────────────────────────
  sidebar: {
    width: '240px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E8EAF0',
    display: 'flex', flexDirection: 'column', zIndex: 10,
    boxShadow: '2px 0 12px rgba(0,0,0,0.03)',
  },
  sidebarHeader: {
    padding: '22px 22px 20px', borderBottom: '1px solid #F3F4F6',
    display: 'flex', alignItems: 'center', gap: '12px',
  },
  logoBadge: {
    width: '34px', height: '34px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
    color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: '15px', flexShrink: 0,
    boxShadow: '0 4px 12px rgba(37,99,235,0.35)',
  },
  brandTitle: { fontSize: '14px', fontWeight: 700, margin: 0, color: '#1A1D23' },
  brandSubtitle: { fontSize: '11px', color: '#9CA3AF', margin: 0, fontWeight: 500 },
  sidebarContent: { padding: '20px 14px', overflowY: 'auto', flex: 1 },
  sectionLabel: {
    fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.08em', color: '#9CA3AF', paddingLeft: '10px',
    display: 'block', marginBottom: '8px',
  },
  menuList: { display: 'flex', flexDirection: 'column', gap: '3px' },
  menuButton: {
    width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: '12px',
    fontSize: '13px', fontWeight: 500, border: 'none', background: 'transparent',
    cursor: 'pointer', color: '#6B7280', display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', transition: 'all 0.15s ease',
  },
  menuButtonActive: {
    backgroundColor: '#2563EB', color: '#FFFFFF', fontWeight: 600,
    boxShadow: '0 4px 14px rgba(37,99,235,0.30)',
  },
  activeDot: {
    width: '7px', height: '7px', borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.75)',
  },

  // ── Main content ────────────────────────────────────────────────────────────
  main: { flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' },
  header: {
    padding: '18px 28px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8EAF0',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  headerSub: {
    fontSize: '11px', textTransform: 'uppercase', color: '#9CA3AF',
    letterSpacing: '0.08em', fontWeight: 600,
  },
  headerTitle: {
    fontSize: '18px', fontWeight: 700, color: '#1A1D23',
    margin: '3px 0 0 0', display: 'flex', alignItems: 'center', gap: '10px',
  },
  countBadge: {
    fontSize: '11px', fontWeight: 600, color: '#6B7280',
    backgroundColor: '#F3F4F6', padding: '3px 10px', borderRadius: '99px',
    border: '1px solid #E5E7EB',
  },
  headerActions: {
    boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: '10px',
  },
  searchInput: {
    width: '220px', padding: '9px 14px', backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '13px',
    outline: 'none', color: '#1A1D23', fontFamily: 'inherit',
  },

  // ── Buttons ─────────────────────────────────────────────────────────────────
  primaryButton: {
    background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
    color: '#FFFFFF', padding: '9px 18px', borderRadius: '12px',
    fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(37,99,235,0.30)',
    letterSpacing: '0.01em',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF', color: '#374151', padding: '9px 16px',
    borderRadius: '12px', fontSize: '13px', fontWeight: 600,
    border: '1px solid #E5E7EB', cursor: 'pointer',
  },

  // ── Content area ────────────────────────────────────────────────────────────
  contentArea: {
    flex: '1', padding: '24px 28px', overflowY: 'auto', backgroundColor: '#F5F6FA',
  },
  gridContainer: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px',
  },

  // ── Cards ───────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid #E8EAF0',
    padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  dateBadge: {
    fontSize: '11px', fontWeight: 600, color: '#6B7280',
    backgroundColor: '#F3F4F6', padding: '4px 10px', borderRadius: '8px',
    border: '1px solid #E5E7EB',
  },
  editBtn: {
    background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
    color: '#FFFFFF', border: 'none', padding: '6px 12px', borderRadius: '8px',
    fontSize: '11px', fontWeight: 600, cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
  },
  cardTitle: {
    fontSize: '14px', fontWeight: 700, color: '#1A1D23', margin: '2px 0', lineHeight: '1.4',
  },
  workflowBadge: { padding: '10px 14px', borderRadius: '12px', border: '1px solid' },
  teamGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px',
    borderTop: '1px solid #F3F4F6', paddingTop: '12px',
  },
  teamBadge: {
    fontSize: '11px', color: '#6B7280', backgroundColor: '#F9FAFB',
    padding: '5px 9px', borderRadius: '8px', border: '1px solid #F3F4F6',
  },
  cardFooter: {
    fontSize: '11px', fontWeight: 600, color: '#9CA3AF',
    borderTop: '1px solid #F3F4F6', paddingTop: '10px',
  },
  emptyState: {
    gridColumn: '1 / -1', textAlign: 'center', padding: '64px',
    color: '#9CA3AF', fontSize: '14px',
  },

  // ── View tambahan: Dashboard / Kalender / Statistik ─────────────────────────
  statCard: {
    backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid #E8EAF0',
    padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  },
  statLabel: {
    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.06em', color: '#9CA3AF',
  },
  statValue: { fontSize: '28px', fontWeight: 800, color: '#1A1D23', lineHeight: 1 },
  dashCard: {
    backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid #E8EAF0',
    padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  },
  dashTitle: { fontSize: '14px', fontWeight: 700, color: '#1A1D23', margin: '0 0 16px' },
  barRow: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' },
  barLabelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  barTrack: {
    position: 'relative', height: '8px', borderRadius: '99px',
    backgroundColor: '#F3F4F6', overflow: 'hidden',
  },
  calDay: {
    minHeight: '72px', backgroundColor: '#F9FAFB', border: '1px solid #F3F4F6',
    borderRadius: '10px', padding: '6px', display: 'flex',
    flexDirection: 'column', gap: '3px',
  },
  calDayActive: {
    minHeight: '72px', backgroundColor: '#FFFFFF', border: '1px solid #2563EB',
    borderRadius: '10px', padding: '6px', display: 'flex',
    flexDirection: 'column', gap: '3px', boxShadow: '0 2px 8px rgba(37,99,235,0.15)',
  },
  calDayNum: { fontSize: '11px', fontWeight: 700, color: '#9CA3AF' },
  calDayNumActive: { fontSize: '11px', fontWeight: 800, color: '#2563EB' },
  calDayTitle: {
    fontSize: '10px', fontWeight: 600, color: '#374151', lineHeight: '1.3',
    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
  },
  calDayMore: { fontSize: '9px', fontWeight: 700, color: '#2563EB' },
  reportLabel: { display: 'flex', flexDirection: 'column' as const, gap: '4px', fontSize: '11px', fontWeight: 600, color: '#374151' },
  reportInput: { fontSize: '12px', padding: '7px 9px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none', background: '#FFFFFF', color: '#1A1D23' },
  reportSubmit: { fontSize: '12px', fontWeight: 700, color: '#FFFFFF', backgroundColor: '#2563EB', border: 'none', padding: '9px 16px', borderRadius: '9px', cursor: 'pointer' },
  reportItem: { border: '1px solid #E8EAF0', borderRadius: '10px', padding: '10px 12px', background: '#FFFFFF' },
  reportStat: { fontSize: '11px', color: '#6B7280' },
  reportToggle: { fontSize: '11px', fontWeight: 600, color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap' as const },
  reportText: { fontSize: '11px', lineHeight: 1.6, color: '#1F2937', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '8px', padding: '10px', whiteSpace: 'pre-wrap' as const, margin: '8px 0 0' },

  // ── Modal ───────────────────────────────────────────────────────────────────
  modalOverlay: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.45)',
    backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 50,
  },
  modalCard: {
    backgroundColor: '#FFFFFF', borderRadius: '24px', width: '100%',
    maxWidth: '480px', maxHeight: '90vh', padding: '30px',
    border: '1px solid #E8EAF0',
    boxShadow: '0 24px 64px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.06)',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '22px',
  },
  modalTitle: { fontSize: '15px', fontWeight: 700, color: '#1A1D23', margin: 0 },
  modalSub: { fontSize: '12px', color: '#9CA3AF', margin: '3px 0 0 0' },
  closeBtn: {
    background: '#F3F4F6', border: '1px solid #E5E7EB', width: '30px', height: '30px',
    borderRadius: '50%', cursor: 'pointer', fontWeight: 700, color: '#6B7280',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  label: {
    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280',
    display: 'block', marginBottom: '5px', letterSpacing: '0.06em',
  },
  input: {
    width: '100%', padding: '10px 13px', backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '13px',
    outline: 'none', color: '#1A1D23', boxSizing: 'border-box', fontFamily: 'inherit',
  },
  rowGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  modalFooter: {
    display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px',
  },
};