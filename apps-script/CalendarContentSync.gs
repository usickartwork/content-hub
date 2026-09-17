/************************************************************
 * DREAM FIELD - WORKSPACE & GOOGLE CALENDAR SYNC FULL SCRIPT
 * -----------------------------------------------------------------
 * File ini adalah KODE LENGKAP untuk Google Apps Script (Code.gs).
 * 
 * FITUR DUAL TIMELINE:
 * 1. 🎬 Jadwal Produksi / Syuting (diambil dari Kolom C / Date)
 * 2. 🚀 Jadwal Upload / Tayang (diambil dari Kolom R / Deadline / Upload)
 * 3. Keduanya otomatis masuk ke Google Calendar masing-masing anggota!
 * 4. Pembersihan otomatis: event lama yang tidak ada di spreadsheet akan dihapus.
 * 5. Event pribadi anggota tim AMAN & TIDAK DIHAPUS.
 ************************************************************/

/************************************************************
 * 1. CONFIGURASI EMAIL KALENDER 5 ANGGOTA
 ************************************************************/
const CONTENT_CALENDAR_CONFIG = [
  { member: 'Filius (Planner)',  calendarId: 'filiuspllahendra@gmail.com', enabled: true },
  { member: 'Raka (Copywriter)', calendarId: 'Khittahno2@gmail.com',       enabled: true },
  { member: 'Tim Produksi',      calendarId: 'chtrnflorencia@gmail.com',   enabled: true },
  { member: 'Kevin (Designer)',  calendarId: 'alinlilin122@gmail.com',     enabled: true },
  { member: 'Alya (Editor)',     calendarId: 'najwabalqisazzahra25@gmail.com', enabled: true },
];

// Jam default mulai event produksi dan upload
const PROD_EVENT_START_HOUR = 9;   // Jam 09:00 pagi (Produksi / Syuting)
const UPLOAD_EVENT_START_HOUR = 17; // Jam 17:00 sore (Upload / Tayang)
const EVENT_DURATION_HOURS = 1;

/************************************************************
 * 2. GET API: Mengirim data spreadsheet ke Web Dashboard
 ************************************************************/
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    var resultSheets = {};
    var sheetNames = [];
    
    sheets.forEach(function(sheet) {
      var name = sheet.getName();
      sheetNames.push(name);
      resultSheets[name] = sheet.getDataRange().getValues();
    });
    
    var output = {
      sheets: resultSheets,
      sheetNames: sheetNames
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(output))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/************************************************************
 * 3. POST API: Update data baris & tombol Sync Kalender
 ************************************************************/
function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }
    
    // Trigger dari tombol "📅 Sync Kalender" di Web
    if (body.action === 'sync_all') {
      var syncResult = syncAllContentToCalendars();
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: true, 
          synced: syncResult.synced, 
          deleted: syncResult.deleted,
          total: syncResult.totalItems, 
          skipped: syncResult.skipped 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheetName = body.sheetName;
    var newRowData = body.newRowData;

    if (!sheetName || !newRowData) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Data tidak lengkap' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    // Khusus sheet SocmedReport
    if (sheetName === 'SocmedReport') {
      var data = sheet.getDataRange().getValues();
      var targetDate = String(newRowData[0] || '').trim();
      var targetPlat = String(newRowData[1] || '').trim();
      var foundRow = -1;

      for (var i = 0; i < data.length; i++) {
        var rDate = String(data[i][0] || '').trim();
        var rPlat = String(data[i][1] || '').trim();
        if (rDate === targetDate && rPlat === targetPlat) {
          foundRow = i + 1;
          break;
        }
      }

      if (foundRow > 0) {
        sheet.getRange(foundRow, 1, 1, newRowData.length).setValues([newRowData]);
      } else {
        sheet.appendRow(newRowData);
      }

      return ContentService
        .createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Sheet Konten Bulanan (August26, September26, dll)
    var contentId = String(newRowData[0] || '').trim();
    var allRows = sheet.getDataRange().getValues();
    var existingRowIdx = -1;

    for (var j = 0; j < allRows.length; j++) {
      var firstCol = String(allRows[j][0] || '').trim();
      if (firstCol.toLowerCase() === contentId.toLowerCase()) {
        existingRowIdx = j + 1;
        break;
      }
    }

    if (existingRowIdx > 0) {
      sheet.getRange(existingRowIdx, 1, 1, newRowData.length).setValues([newRowData]);
    } else {
      sheet.appendRow(newRowData);
    }

    // Otomatis sinkronkan konten yang diedit ke kalender 5 anggota (Produksi & Upload)
    var calResult = { synced: 0, skipped: 0 };
    try {
      calResult = syncContentToCalendars_(newRowData);
    } catch (calErr) {
      console.error('Warning auto sync: ' + calErr.toString());
    }

    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        calendarSync: calResult 
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/************************************************************
 * 4. HELPER: Parse Tanggal (Mendukung Date, Angka Serial Excel, dan String)
 ************************************************************/
function parseEventDate_(val, defaultHour) {
  if (!val || val === '-') return null;
  var hour = typeof defaultHour === 'number' ? defaultHour : PROD_EVENT_START_HOUR;

  // 1. Objek Date dari Google Sheets
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return null;
    return new Date(val.getFullYear(), val.getMonth(), val.getDate(), hour, 0, 0);
  }

  // 2. Angka Serial Tanggal Excel / Sheets (misal 46266 = 2026-09-01)
  if (typeof val === 'number' && val > 30000 && val < 70000) {
    var dExcel = new Date((val - 25569) * 86400 * 1000);
    if (!isNaN(dExcel.getTime())) {
      return new Date(dExcel.getFullYear(), dExcel.getMonth(), dExcel.getDate(), hour, 0, 0);
    }
  }

  var s = String(val).trim();
  if (!s || s === '-' || s.toLowerCase() === 'not started') return null;

  if (!isNaN(Number(s)) && Number(s) > 30000 && Number(s) < 70000) {
    var dExcelStr = new Date((Number(s) - 25569) * 86400 * 1000);
    if (!isNaN(dExcelStr.getTime())) {
      return new Date(dExcelStr.getFullYear(), dExcelStr.getMonth(), dExcelStr.getDate(), hour, 0, 0);
    }
  }

  // 3. String YYYY-MM-DD
  var datePart = s.split('T')[0];
  var parts = datePart.split('-');
  if (parts.length === 3) {
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1;
    var day = parseInt(parts[2], 10);
    var d = new Date(year, month, day, hour, 0, 0);
    if (!isNaN(d.getTime())) return d;
  }

  var fallback = new Date(datePart);
  if (!isNaN(fallback.getTime())) {
    fallback.setHours(hour, 0, 0, 0);
    return fallback;
  }

  return null;
}

/************************************************************
 * 5. SYNC 1 BARIS KONTEN (PRODUKSI & UPLOAD) KE 5 KALENDER
 ************************************************************/
function syncContentToCalendars_(row) {
  var id = String(row[0] || '').trim();
  var week = String(row[1] || '').trim();
  var prodDate = parseEventDate_(row[2], PROD_EVENT_START_HOUR);
  var uploadDate = parseEventDate_(row[17], UPLOAD_EVENT_START_HOUR); // Kolom Deadline / Upload
  
  var title = String(row[5] || '').trim();
  if (!title || title === '-' || title.toLowerCase() === 'not started') {
    title = String(row[4] || '').trim(); // Fallback ke Kolom E (Agenda / Topik)
  }

  var stage = String(row[6] || '').trim();
  var platform = String(row[7] || '').trim();
  var format = String(row[8] || '').trim();

  if (!id || !title || title === '-' || title.toLowerCase() === 'not started') {
    return { synced: 0, skipped: 0 };
  }

  // Jika tidak ada uploadDate terpisah, tapi barisnya sendiri adalah baris timeline upload
  if (!uploadDate && (stage.toLowerCase().indexOf('upload') !== -1 || title.toLowerCase().indexOf('upload') !== -1)) {
    uploadDate = prodDate;
  }

  var synced = 0;
  var skipped = 0;
  var searchStart = new Date(2026, 0, 1, 0, 0, 0);
  var searchEnd = new Date(2026, 11, 31, 23, 59, 59);

  var baseDesc = [
    'Week: ' + week,
    'Tahap: ' + stage,
    'Platform: ' + platform + ' (' + format + ')',
    'Planner/Admin: ' + String(row[12] || '-'),
    'Copywriter: ' + String(row[13] || '-'),
    'Production: ' + String(row[14] || '-'),
    'Designer: ' + String(row[15] || '-'),
    'Editor: ' + String(row[16] || '-'),
  ].join('\n');

  CONTENT_CALENDAR_CONFIG.forEach(function (cfg) {
    if (cfg.enabled === false) return;
    try {
      var cal = CalendarApp.getCalendarById(cfg.calendarId);
      if (!cal) {
        skipped++;
        return;
      }

      // Hapus event lama ber-Content ID ini (baik produksi maupun upload)
      var existing = cal.getEvents(searchStart, searchEnd);
      existing.forEach(function (ev) {
        var desc = ev.getDescription ? String(ev.getDescription() || '') : '';
        if (desc.indexOf('Content ID: ' + id) !== -1) {
          ev.deleteEvent();
        }
      });

      // 1. Buat Event Jadwal Produksi / Syuting
      if (prodDate) {
        var prodEnd = new Date(prodDate.getTime() + EVENT_DURATION_HOURS * 3600 * 1000);
        var prodTitle = '🎬 [PRODUKSI] ' + (stage ? '[' + stage + '] ' : '') + title;
        var prodDesc = 'Content ID: ' + id + ' (PRODUKSI)\nTipe: Jadwal Produksi / Syuting\n' + baseDesc;
        cal.createEvent(prodTitle, prodDate, prodEnd, { description: prodDesc });
        synced++;
      }

      // 2. Buat Event Jadwal Upload / Tayang (Timeline Upload)
      if (uploadDate) {
        var upEnd = new Date(uploadDate.getTime() + EVENT_DURATION_HOURS * 3600 * 1000);
        var upTitle = '🚀 [UPLOAD] ' + title + ' (' + platform + ')';
        var upDesc = 'Content ID: ' + id + ' (UPLOAD)\nTipe: Jadwal Upload / Tayang Konten\n' + baseDesc;
        cal.createEvent(upTitle, uploadDate, upEnd, { description: upDesc });
        synced++;
      }

    } catch (err) {
      skipped++;
    }
  });

  return { synced: synced, skipped: skipped };
}

/************************************************************
 * 6. PEMBERSIHAN & SINKRONISASI TOTAL SEMUA JADWAL
 *    (PRODUKSI + TIMELINE UPLOAD DARI SPREADSHEET)
 ************************************************************/
function syncAllContentToCalendars() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var ignoredSheets = ['team', 'socmedreport', 'calendarconfig', 'summary', 'template'];

  // 1. Kumpulkan semua jadwal (Produksi & Upload) dari semua sheet
  var validItems = [];

  sheets.forEach(function (sheet) {
    var name = sheet.getName();
    if (ignoredSheets.indexOf(name.toLowerCase()) !== -1) return;

    var values = sheet.getDataRange().getValues();
    var headerRow = -1;

    for (var i = 0; i < values.length; i++) {
      var rowSlice = values[i].slice(0, 10).map(function(c) { return String(c || '').trim().toLowerCase(); });
      if (rowSlice.indexOf('content id') !== -1 || rowSlice.indexOf('id') !== -1 || rowSlice.indexOf('post title') !== -1 || rowSlice.indexOf('judul') !== -1) {
        headerRow = i;
        break;
      }
    }
    if (headerRow === -1) headerRow = 0;

    for (var j = headerRow + 1; j < values.length; j++) {
      var row = values[j];
      var id = String(row[0] || '').trim();
      var title = String(row[5] || '').trim();
      if (!title || title === '-' || title.toLowerCase() === 'not started') {
        title = String(row[4] || '').trim(); // Fallback ke Kolom E (Agenda / Topik)
      }

      if (!id || !title || title === '-' || title.toLowerCase() === 'not started') {
        continue;
      }

      var prodDate = parseEventDate_(row[2], PROD_EVENT_START_HOUR);
      var uploadDate = parseEventDate_(row[17], UPLOAD_EVENT_START_HOUR); // Kolom Deadline / Upload
      var stage = String(row[6] || '').trim();
      var platform = String(row[7] || '').trim();
      var format = String(row[8] || '').trim();

      // Jika tidak ada uploadDate terpisah, tapi barisnya sendiri adalah baris timeline upload
      if (!uploadDate && (stage.toLowerCase().indexOf('upload') !== -1 || title.toLowerCase().indexOf('upload') !== -1)) {
        uploadDate = prodDate;
      }

      if (!prodDate && !uploadDate) continue;

      validItems.push({
        id: id,
        week: String(row[1] || '').trim(),
        prodDate: prodDate,
        uploadDate: uploadDate,
        title: title,
        stage: stage,
        platform: platform,
        format: format,
        planner: String(row[12] || '-'),
        copywriter: String(row[13] || '-'),
        production: String(row[14] || '-'),
        designer: String(row[15] || '-'),
        editor: String(row[16] || '-'),
      });
    }
  });

  var rangeStart = new Date(2026, 0, 1, 0, 0, 0);
  var rangeEnd = new Date(2026, 11, 31, 23, 59, 59);

  var totalSynced = 0;
  var totalDeleted = 0;
  var skippedCalendars = 0;

  // 2. Bersihkan event lama & masukkan jadwal Produksi + Upload ke 5 kalender
  CONTENT_CALENDAR_CONFIG.forEach(function (cfg) {
    if (cfg.enabled === false) return;
    try {
      var cal = CalendarApp.getCalendarById(cfg.calendarId);
      if (!cal) {
        console.error('Kalender tidak ditemukan: ' + cfg.member + ' (' + cfg.calendarId + ')');
        skippedCalendars++;
        return;
      }

      // Hapus SEMUA event konten sistem sebelumnya (Event pribadi anggota tidak disentuh)
      var existingEvents = cal.getEvents(rangeStart, rangeEnd);
      existingEvents.forEach(function (ev) {
        var desc = ev.getDescription ? String(ev.getDescription() || '') : '';
        if (desc.indexOf('Content ID:') !== -1) {
          ev.deleteEvent();
          totalDeleted++;
        }
      });

      // Masukkan jadwal Produksi & jadwal Upload dari spreadsheet
      validItems.forEach(function (item) {
        var baseDesc = [
          'Week: ' + item.week,
          'Tahap: ' + item.stage,
          'Platform: ' + item.platform + ' (' + item.format + ')',
          'Planner/Admin: ' + item.planner,
          'Copywriter: ' + item.copywriter,
          'Production: ' + item.production,
          'Designer: ' + item.designer,
          'Editor: ' + item.editor,
        ].join('\n');

        // 1. Jadwal Produksi / Syuting
        if (item.prodDate) {
          var prodEnd = new Date(item.prodDate.getTime() + EVENT_DURATION_HOURS * 3600 * 1000);
          var prodTitle = '🎬 [PRODUKSI] ' + (item.stage ? '[' + item.stage + '] ' : '') + item.title;
          var prodDesc = 'Content ID: ' + item.id + ' (PRODUKSI)\nTipe: Jadwal Produksi / Syuting\n' + baseDesc;
          cal.createEvent(prodTitle, item.prodDate, prodEnd, { description: prodDesc });
          totalSynced++;
        }

        // 2. Jadwal Upload / Tayang (Timeline Upload)
        if (item.uploadDate) {
          var upEnd = new Date(item.uploadDate.getTime() + EVENT_DURATION_HOURS * 3600 * 1000);
          var upTitle = '🚀 [UPLOAD] ' + item.title + ' (' + item.platform + ')';
          var upDesc = 'Content ID: ' + item.id + ' (UPLOAD)\nTipe: Jadwal Upload / Tayang Konten\n' + baseDesc;
          cal.createEvent(upTitle, item.uploadDate, upEnd, { description: upDesc });
          totalSynced++;
        }
      });

    } catch (err) {
      console.error('Gagal memproses kalender ' + cfg.member + ': ' + err.toString());
      skippedCalendars++;
    }
  });

  Logger.log('Selesai! Jadwal spreadsheet: ' + validItems.length + ' | Dihapus: ' + totalDeleted + ' | Baru dibuat (Prod + Upload): ' + totalSynced);

  return {
    success: true,
    totalItems: validItems.length,
    synced: totalSynced,
    deleted: totalDeleted,
    skipped: skippedCalendars
  };
}