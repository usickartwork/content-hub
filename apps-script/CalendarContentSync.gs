/************************************************************
 * CONFIGURASI KALENDER
 * -----------------------------------------------------------------
 * Isi tiap "calendarId" dengan ID kalender 5 anggota, SETELAH tiap
 * anggota selesai share kalendernya ke email admin dengan izin
 * "Buat & ubah event" (Make changes to events).
 *
 * Cara dapat ID kalender:
 *   Google Calendar (admin) -> Settings -> "Settings for my calendars"
 *   -> pilih kalender anggota -> Integrate calendar -> Calendar ID.
 *   Contoh: nama@gmail.com (kalender utama) atau xxx@group.calendar.google.com
 *
 * CARA ANGGOTA SHARE KE ADMIN:
 *   Google Calendar -> pengaturan kalender -> "Share with specific people"
 *   -> tambahkan email admin -> permission: "Make changes to events".
 ************************************************************/
const CONTENT_CALENDAR_CONFIG = [
  { member: 'Filius (Planner)',  calendarId: 'GANTI_EMAIL_FILIUS@gmail.com' },
  { member: 'Raka (Copywriter)', calendarId: 'GANTI_EMAIL_RAKA@gmail.com' },
  { member: 'Tim Produksi',      calendarId: 'GANTI_EMAIL_TIM_PRODUKSI@gmail.com' },
  { member: 'Kevin (Designer)',  calendarId: 'GANTI_EMAIL_KEVIN@gmail.com' },
  { member: 'Alya (Editor)',     calendarId: 'GANTI_EMAIL_ALYA@gmail.com' },
];

// Mulai event jam berapa & durasi (jam). Hanya menampilkan tanggal, jam menyesuaikan.
const CONTENT_EVENT_START_HOUR = 9;
const CONTENT_EVENT_DURATION_HOURS = 1;

/************************************************************
 * CARA PAKAI:
 * Panggil di bagian akhir doPost(e) SETELAH row sukses disimpan
 * ke sheet:
 *
 *   if (params.action === 'calendar_sync') {
 *     return ContentService.createTextOutput(JSON.stringify(syncContentToCalendars_(params.newRowData)));
 *   }
 *   ... (kode simpan sheet yang sudah ada) ...
 *   syncContentToCalendars_(body.newRowData);
 ************************************************************/

// Membuat / update event konten ke 5 kalender. Menghapus event lama yang
// ber-Content ID sama di tanggal tsb (anti duplikat saat edit/ulang simpan).
function syncContentToCalendars_(row) {
  var id = String(row[0] || '').trim();
  var week = String(row[1] || '').trim();
  var dateRaw = String(row[2] || '').trim();
  var title = String(row[5] || '').trim();
  var stage = String(row[6] || '').trim();
  var platform = String(row[7] || '').trim();

  if (!id || !dateRaw || !title) return { synced: 0, skipped: 0 };

  var datePart = dateRaw.split('T')[0];
  var start = new Date(datePart + 'T00:00:00');
  start.setHours(CONTENT_EVENT_START_HOUR, 0, 0, 0);
  var end = new Date(start.getTime() + CONTENT_EVENT_DURATION_HOURS * 3600 * 1000);

  var description = [
    'Content ID: ' + id,
    'Week: ' + week,
    'Tahap: ' + stage,
    'Platform: ' + platform,
    'Planner/Admin: ' + String(row[12] || '-'),
    'Copywriter: ' + String(row[13] || '-'),
    'Production: ' + String(row[14] || '-'),
    'Designer: ' + String(row[15] || '-'),
    'Editor: ' + String(row[16] || '-'),
  ].join('\n');

  var eventTitle = '[' + stage + '] ' + title;

  var synced = 0;
  var skipped = 0;

  CONTENT_CALENDAR_CONFIG.forEach(function (cfg) {
    try {
      var cal = CalendarApp.getCalendarById(cfg.calendarId);
      if (!cal) {
        console.error('Kalender tidak ditemukan / akses edit belum ada: ' + cfg.member + ' (' + cfg.calendarId + ')');
        skipped++;
        return;
      }

      // Hapus event lama ber-Content ID sama di hari tsb agar tidak dobel
      var existing = cal.getEvents(start, end);
      existing.forEach(function (ev) {
        if (ev.getDescription && String(ev.getDescription() || '').indexOf('Content ID: ' + id) !== -1) {
          ev.deleteEvent();
        }
      });

      cal.createEvent(eventTitle, start, end, { description: description });
      synced++;
    } catch (err) {
      console.error('Gagal sync ke ' + cfg.member + ': ' + err.toString());
      skipped++;
    }
  });

  return { synced: synced, skipped: skipped };
}

// Menghapus semua event ber-Content ID tertentu (dipakai bila konten dihapus).
function deleteContentEvents_(id) {
  var targetId = String(id || '').trim();
  if (!targetId) return 0;

  var deleted = 0;
  CONTENT_CALENDAR_CONFIG.forEach(function (cfg) {
    try {
      var cal = CalendarApp.getCalendarById(cfg.calendarId);
      if (!cal) return;

      var from = new Date();
      var to = new Date(Date.now() + 14 * 24 * 3600 * 1000);
      var events = cal.getEvents(from, to);
      events.forEach(function (ev) {
        var desc = ev.getDescription ? String(ev.getDescription() || '') : '';
        var ttl = ev.getTitle();
        if (desc.indexOf('Content ID: ' + targetId) !== -1) {
          ev.deleteEvent();
          deleted++;
        }
      });
    } catch (err) {
      console.error('Gagal hapus di ' + cfg.member + ': ' + err.toString());
    }
  });
  return deleted;
}

/************************************************************
 * BACKFILL: SYNC SEMUA KONTEN YANG SUDAH ADA DI SPREADSHEET KE KALENDER
 * ---------------------------------------------------------------
 * Jalankan sekali dari editor Apps Script (nama fungsi tanpa awalan _),
 * atau panggil manual lewat endpoint:
 *    doPost dengan body { action: 'sync_all', sheetNames: [...] }
 *
 * Fungsi ini membaca semua sheet periode, lalu membuat/update event
 * untuk setiap baris yang punya judul + tanggal. Aman dijalankan
 * berulang (event lama ber-Content ID sama otomatis dihapus).
 ************************************************************/
function syncAllContentToCalendars() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var monthSheets = ['August26', 'September26', 'October26', 'November26', 'December26']
    .filter(function (n) { return ss.getSheetByName(n) !== null; });

  var total = 0;
  var syncedTotal = 0;
  var skippedTotal = 0;

  monthSheets.forEach(function (name) {
    var sheet = ss.getSheetByName(name);
    var values = sheet.getDataRange().getValues();

    // Cari baris header (kolom pertama 'Content ID' / 'id')
    var headerRow = -1;
    for (var i = 0; i < values.length; i++) {
      var first = String(values[i][0] || '').trim().toLowerCase();
      if (first === 'content id' || first === 'id') {
        headerRow = i;
        break;
      }
    }
    if (headerRow === -1) {
      console.log('Sheet ' + name + ': header tidak ditemukan, dilewati');
      return;
    }

    for (var j = headerRow + 1; j < values.length; j++) {
      total++;
      var res = syncContentToCalendars_(values[j]);
      syncedTotal += res.synced;
      skippedTotal += res.skipped;
    }
  });

  Logger.log('Sync selesai -> Total baris: ' + total + ', Event dibuat/diupdate: ' + syncedTotal + ', Dilewati: ' + skippedTotal);
  return { total: total, synced: syncedTotal, skipped: skippedTotal };
}