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

  return (
    <div style={styles.container}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header-bar { display: flex !important; }
          .main-header { padding: 14px 16px !important; flex-direction: column !important; align-items: stretch !important; gap: 12px !important; }
          .header-actions-row { width: 100% !important; justify-content: space-between !important; flex-wrap: wrap !important; }
          .search-input-field { width: 100% !important; }
          .content-area-wrapper { padding: 16px !important; }
          .grid-container-cards { grid-template-columns: 1fr !important; }
          .modal-box-card { max-width: 100% !important; height: 100% !important; max-height: 100vh !important; border-radius: 0 !important; padding: 20px !important; }
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
          <label style={styles.sectionLabel}>Periode 2026</label>
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
          <div style={styles.mobileDrawer}>
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

            <label style={styles.sectionLabel}>Periode 2026</label>
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

      <main style={styles.main}>
        <header className="main-header" style={styles.header}>
          <div>
            <span style={styles.headerSub}>Sistem Estafet Otomatis</span>
            <h2 style={styles.headerTitle}>
              {selectedSheet.replace('26', ' 2026')} <span style={styles.countBadge}>{contentList.length} Konten</span>
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
                    <div style={styles.cardHeader}>
                      <span style={styles.dateBadge}>{item.date}</span>
                      <button onClick={() => handleOpenEditModal(item)} style={styles.editBtn}>Update Estafet</button>
                    </div>

                    <h3 style={styles.cardTitle}>{item.title}</h3>

                    <div style={{ ...styles.workflowBadge, backgroundColor: isFinished ? '#DCFCE7' : '#FEF3C7', borderColor: isFinished ? '#86EFAC' : '#FDE68A', color: isFinished ? '#166534' : '#92400E' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

              <div style={styles.rowGrid}>
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

                <div style={{ ...styles.rowGrid, marginTop: '8px' }}>
                  <div>
                    <label style={styles.label}>Copywriter</label>
                    <input type="text" value={copywriter} onChange={(e) => setCopywriter(e.target.value)} style={styles.input} />
                  </div>
                  <div>
                    <label style={styles.label}>Tim Produksi / Syuting</label>
                    <input type="text" value={productionTeam} onChange={(e) => setProductionTeam(e.target.value)} style={styles.input} />
                  </div>
                </div>

                <div style={{ ...styles.rowGrid, marginTop: '8px' }}>
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