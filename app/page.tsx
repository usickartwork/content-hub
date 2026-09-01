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

// Definisi Akun & Tahapan Estafet Maju
const ACCOUNTS = [
  { name: 'Admin / Planner', stageName: '1. Concept', allowedStages: ['1. Concept', '2. Copywriting', '5. Done / Posted'] },
  { name: 'Raka (Copywriter)', stageName: '2. Copywriting', allowedStages: ['2. Copywriting', '3. Produksi / Syuting'] },
  { name: 'Tim Produksi / Syuting', stageName: '3. Produksi / Syuting', allowedStages: ['3. Produksi / Syuting', '4. Visual & Editing'] },
  { name: 'Kevin & Alya (Design/Editor)', stageName: '4. Visual & Editing', allowedStages: ['4. Visual & Editing', '5. Done / Posted'] },
];

export default function WorkflowWorkspace() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState('September26');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  
  const [currentAccount, setCurrentAccount] = useState(ACCOUNTS[0]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
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
    if (currentAccount.name !== 'Admin / Planner') return;
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
    const rowStr = JSON.stringify(currentRows[i]);
    if (rowStr.includes('Date') || rowStr.includes('Post Title') || rowStr.includes('Content ID')) {
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
        <div onClick={() => setIsLoginModalOpen(true)} style={{ fontSize: '11px', fontWeight: 600, color: '#10B981', backgroundColor: '#ECFDF5', padding: '4px 10px', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
          {currentAccount.name.split(' ')[0]} 👤
        </div>
      </div>

      <aside className="desktop-sidebar" style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logoBadge}>D</div>
          <div>
            <h1 style={styles.brandTitle}>Dream Field</h1>
            <p style={styles.brandSubtitle}>Workspace Jobdesk</p>
          </div>
        </div>

        <div style={styles.accountBox}>
          <span style={styles.accountLabel}>Akun Jobdesk Aktif:</span>
          <div style={styles.accountCard} onClick={() => setIsLoginModalOpen(true)}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#09090B' }}>{currentAccount.name}</div>
            <div style={{ fontSize: '10px', color: '#10B981', fontWeight: 600, marginTop: '2px' }}>Ganti Akun</div>
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
                  <p style={styles.brandSubtitle}>Workspace Jobdesk</p>
                </div>
              </div>
              <button onClick={() => setIsMobileSidebarOpen(false)} style={styles.closeBtn}>✕</button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={styles.accountLabel}>Akun Jobdesk Aktif:</span>
              <div style={styles.accountCard} onClick={() => { setIsMobileSidebarOpen(false); setIsLoginModalOpen(true); }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#09090B' }}>{currentAccount.name}</div>
                <div style={{ fontSize: '10px', color: '#10B981', fontWeight: 600, marginTop: '2px' }}>Ganti Akun</div>
              </div>
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
            {currentAccount.name === 'Admin / Planner' && (
              <button onClick={handleOpenAddModal} style={styles.primaryButton}>+ Input Konten Baru</button>
            )}
          </div>
        </header>

        <div className="content-area-wrapper" style={styles.contentArea}>
          <div className="grid-container-cards" style={styles.gridContainer}>
            {contentList.length === 0 ? (
              <div style={styles.emptyState}>
                Belum ada konten aktif di periode ini.<br />
                <span style={{ fontSize: '11px', color: '#A1A1AA', marginTop: '6px', display: 'inline-block' }}>Gunakan akun Admin / Planner untuk mulai input konten baru.</span>
              </div>
            ) : (
              contentList.map((item: any, idx: number) => {
                const itemStage = item.parsedStage || STAGE_NAMES[0];
                const itemStageIdx = STAGE_NAMES.indexOf(itemStage);
                const myAccountStageIdx = STAGE_NAMES.indexOf(currentAccount.stageName);

                const isMyTurn = currentAccount.name === 'Admin / Planner' 
                  ? (itemStage === '1. Concept' || itemStage === '5. Done / Posted')
                  : (itemStageIdx === myAccountStageIdx);

                const isFinished = item.checkStatus === 'Selesai';

                return (
                  <div key={idx} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <span style={styles.dateBadge}>{item.date}</span>
                      {isMyTurn ? (
                        <button onClick={() => handleOpenEditModal(item)} style={styles.editBtn}>Update Estafet</button>
                      ) : (
                        <span style={styles.lockedBadge}>Menunggu Giliran</span>
                      )}
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

      {isLoginModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalCard, maxWidth: '400px' }}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={styles.modalTitle}>Pilih Akun Jobdesk</h3>
                <p style={styles.modalSub}>Sistem estafet otomatis menyesuaikan hak akses akun.</p>
              </div>
              <button onClick={() => setIsLoginModalOpen(false)} style={styles.closeBtn}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ACCOUNTS.map((acc, i) => (
                <button key={i} onClick={() => { setCurrentAccount(acc); setIsLoginModalOpen(false); }} style={{ padding: '12px 16px', borderRadius: '12px', border: currentAccount.name === acc.name ? '2px solid #09090B' : '1px solid #E4E4E7', backgroundColor: currentAccount.name === acc.name ? '#F4F4F5' : '#FFFFFF', textAlign: 'left', cursor: 'pointer', fontWeight: 600, fontSize: '13px', color: '#09090B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{acc.name}</span>
                  {currentAccount.name === acc.name && <span style={{ fontSize: '11px', color: '#10B981' }}>Aktif</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div className="modal-box-card" style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={styles.modalTitle}>{isEditing ? 'Update Estafet Checklist' : 'Input Konten Baru'}</h3>
                <p style={styles.modalSub}>{isEditing ? `Sedang dikerjakan oleh: ${currentAccount.name}` : 'Konten baru otomatis dimulai dari 1. Concept.'}</p>
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
  container: { display: 'flex', height: '100vh', backgroundColor: '#FAFAFA', color: '#09090B', fontFamily: 'system-ui, sans-serif', overflow: 'hidden', position: 'relative' },
  fullScreenLoader: { display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA', position: 'fixed', inset: 0, zIndex: 999 },
  loaderCard: { backgroundColor: '#FFFFFF', padding: '36px 48px', borderRadius: '24px', border: '1px solid #E4E4E7', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)' },
  spinner: { width: '36px', height: '36px', border: '3px solid #E4E4E7', borderTop: '3px solid #09090B', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  loaderTitle: { fontSize: '15px', fontWeight: 700, color: '#09090B', margin: 0 },
  loaderSub: { fontSize: '12px', color: '#71717A', margin: 0 },
  mobileHeaderBar: { height: '56px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E4E4E7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40 },
  hamburgerBtn: { background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#09090B', padding: '4px 8px' },
  mobileDrawer: { backgroundColor: '#FFFFFF', borderRadius: '16px', width: '90%', maxWidth: '320px', padding: '24px', border: '1px solid #E4E4E7', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  sidebar: { width: '260px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E4E4E7', display: 'flex', flexDirection: 'column', zIndex: 10 },
  sidebarHeader: { padding: '20px 24px', borderBottom: '1px solid #E4E4E7', display: 'flex', alignItems: 'center', gap: '12px' },
  logoBadge: { width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#09090B', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' },
  brandTitle: { fontSize: '13px', fontWeight: 700, margin: 0, color: '#09090B' },
  brandSubtitle: { fontSize: '11px', color: '#71717A', margin: 0 },
  accountBox: { padding: '16px', borderBottom: '1px solid #E4E4E7' },
  accountLabel: { fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#A1A1AA', display: 'block', marginBottom: '6px', letterSpacing: '0.05em' },
  accountCard: { backgroundColor: '#FAFAFA', border: '1px solid #E4E4E7', padding: '10px 12px', borderRadius: '10px', cursor: 'pointer' },
  sidebarContent: { padding: '20px 16px', overflowY: 'auto', flex: 1 },
  sectionLabel: { fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#A1A1AA', paddingLeft: '8px', display: 'block', marginBottom: '8px' },
  menuList: { display: 'flex', flexDirection: 'column', gap: '4px' },
  menuButton: { width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 500, border: 'none', background: 'transparent', cursor: 'pointer', color: '#52525B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  menuButtonActive: { backgroundColor: '#09090B', color: '#FFFFFF', fontWeight: 600 },
  activeDot: { width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34D399' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' },
  header: { padding: '20px 32px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E4E4E7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20 },
  headerSub: { fontSize: '10px', textTransform: 'uppercase', color: '#71717A', letterSpacing: '0.05em', fontWeight: 600 },
  headerTitle: { fontSize: '16px', fontWeight: 700, color: '#09090B', margin: '2px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px' },
  countBadge: { fontSize: '11px', fontWeight: 500, color: '#71717A', backgroundColor: '#F4F4F5', padding: '2px 8px', borderRadius: '20px', border: '1px solid #E4E4E7' },
  headerActions: { boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: '12px' },
  searchInput: { width: '220px', padding: '8px 14px', backgroundColor: '#FAFAFA', border: '1px solid #E4E4E7', borderRadius: '10px', fontSize: '12px', outline: 'none', color: '#09090B' },
  primaryButton: { backgroundColor: '#09090B', color: '#FFFFFF', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' },
  secondaryButton: { backgroundColor: '#FAFAFA', color: '#09090B', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, border: '1px solid #E4E4E7', cursor: 'pointer' },
  contentArea: { flex: '1', padding: '24px 32px', overflowY: 'auto', backgroundColor: '#FAFAFA' },
  gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '16px' },
  card: { backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E4E4E7', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  dateBadge: { fontSize: '11px', fontWeight: 600, color: '#52525B', backgroundColor: '#F4F4F5', padding: '4px 8px', borderRadius: '6px' },
  editBtn: { backgroundColor: '#09090B', color: '#FFFFFF', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' },
  lockedBadge: { fontSize: '11px', fontWeight: 500, color: '#71717A', backgroundColor: '#F4F4F5', padding: '4px 8px', borderRadius: '6px', border: '1px solid #E4E4E7' },
  cardTitle: { fontSize: '14px', fontWeight: 700, color: '#09090B', margin: '2px 0', lineHeight: '1.4' },
  workflowBadge: { padding: '10px 12px', borderRadius: '10px', border: '1px solid' },
  teamGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', borderTop: '1px solid #F4F4F5', paddingTop: '10px' },
  teamBadge: { fontSize: '11px', color: '#52525B', backgroundColor: '#FAFAFA', padding: '4px 8px', borderRadius: '6px', border: '1px solid #F4F4F5' },
  cardFooter: { fontSize: '11px', fontWeight: 600, color: '#71717A', borderTop: '1px solid #F4F4F5', paddingTop: '8px' },
  emptyState: { gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: '#A1A1AA', fontSize: '13px' },
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '480px', maxHeight: '90vh', padding: '28px', border: '1px solid #E4E4E7', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  modalTitle: { fontSize: '14px', fontWeight: 700, color: '#09090B', margin: 0 },
  modalSub: { fontSize: '11px', color: '#71717A', margin: '2px 0 0 0' },
  closeBtn: { background: '#F4F4F5', border: 'none', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', fontWeight: 600, color: '#52525B' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  label: { fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#52525B', display: 'block', marginBottom: '4px', letterSpacing: '0.05em' },
  input: { width: '100%', padding: '9px 12px', backgroundColor: '#FAFAFA', border: '1px solid #E4E4E7', borderRadius: '10px', fontSize: '12px', outline: 'none', color: '#09090B', boxSizing: 'border-box' },
  rowGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }
};