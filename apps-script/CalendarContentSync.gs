/************************************************************
 * DREAM FIELD - WORKSPACE & GOOGLE CALENDAR SYNC FULL SCRIPT
 * -----------------------------------------------------------------
 * File ini adalah KODE LENGKAP untuk Google Apps Script (Code.gs).
 * 
 * ATURAN WAKTU SEBARIS (SINGLE ROW DATE):
 * 1. Setiap baris di spreadsheet mewakili satu tanggal (Kolom Date / Kolom C).
 * 2. Jadwal Produksi (Kolom 5) ➡️ Mengambil tanggal dari baris tersebut (Jam 09:00).
 * 3. Jadwal Timeline Upload (Kolom 10) ➡️ JUGA MENGAMBIL TANGGAL DARI BARIS TERSEBUT (Jam 17:00).
 *    (Tidak lagi mengambil dari deadline, sehingga tanggalnya 100% tepat sebaris).
 * 4. Keduanya otomatis masuk ke Google Calendar 5 anggota:
 *    - 🎬 [PRODUKSI] Judul Konten (Jam 09:00)
 *    - 🚀 [UPLOAD] Judul Konten (Jam 17:00)
 * 5. Event pribadi anggota tim AMAN & TIDAK DIHAPUS.
 ************************************************************/

// 1. CONFIGURASI EMAIL KALENDER 5 ANGGOTA
const CONTENT_CALENDAR_CONFIG = [
  { member: 'Filius (Planner)',  calendarId: 'filiuspllahendra@gmail.com', enabled: true },
  { member: 'Raka (Copywriter)', calendarId: 'Khittahno2@gmail.com',       enabled: true },
  { member: 'Tim Produksi',      calendarId: 'chtrnflorencia@gmail.com',   enabled: true },
  { member: 'Kevin (Designer)',  calendarId: 'alinlilin122@gmail.com',     enabled: true },
  { member: 'Alya (Editor)',     calendarId: 'najwabalqisazzahra25@gmail.com', enabled: true },
];

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
 * 4. HELPER: Parse Tanggal (Date, Excel Serial, String)
 ************************************************************/
function parseEventDate_(val) {
  if (!val || val === '-') return null;

  if (val instanceof Date) {
    if (isNaN(val.getTime())) return null;
    return new Date(val.getFullYear(), val.getMonth(), val.getDate(), 0, 0, 0);
  }

  if (typeof val === 'number' && val > 30000 && val < 70000) {
    var dExcel = new Date((val - 25569) * 86400 * 1000);
    if (!isNaN(dExcel.getTime())) {
      return new Date(dExcel.getFullYear(), dExcel.getMonth(), dExcel.getDate(), 0, 0, 0);
    }
  }

  var s = String(val).trim();
  if (!s || s === '-' || s.toLowerCase() === 'not started') return null;

  if (!isNaN(Number(s)) && Number(s) > 30000 && Number(s) < 70000) {
    var dExcelStr = new Date((Number(s) - 25569) * 86400 * 1000);
    if (!isNaN(dExcelStr.getTime())) {
      return new Date(dExcelStr.getFullYear(), dExcelStr.getMonth(), dExcelStr.getDate(), 0, 0, 0);
    }
  }

  var datePart = s.split('T')[0];
  var parts = datePart.split('-');
  if (parts.length === 3) {
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1;
    var day = parseInt(parts[2], 10);
    var d = new Date(year, month, day, 0, 0, 0);
    if (!isNaN(d.getTime())) return d;
  }

  var fallback = new Date(datePart);
  if (!isNaN(fallback.getTime())) {
    return new Date(fallback.getFullYear(), fallback.getMonth(), fallback.getDate(), 0, 0, 0);
  }

  return null;
}

/************************************************************
 * 5. SYNC 1 BARIS (PRODUKSI & TIMELINE UPLOAD SEBARIS) KE 5 KALENDER
 ************************************************************/
function syncContentToCalendars_(row) {
  var id = String(row[0] || '').trim();
  var week = String(row[1] || '').trim();
  var rowDate = parseEventDate_(row[2]);
  if (!rowDate) return { synced: 0, skipped: 0 };

  var prodDate = new Date(rowDate.getFullYear(), rowDate.getMonth(), rowDate.getDate(), PROD_EVENT_START_HOUR, 0, 0);
  var uploadDate = new Date(rowDate.getFullYear(), rowDate.getMonth(), rowDate.getDate(), UPLOAD_EVENT_START_HOUR, 0, 0);

  var prodTitle = String(row[5] || '').trim();
  if (prodTitle === '-' || prodTitle.toLowerCase() === 'not started') prodTitle = '';

  var uploadTitle = row.length > 10 ? String(row[10] || '').trim() : '';
  if (uploadTitle === '-' || uploadTitle.toLowerCase() === 'not started') uploadTitle = '';

  if (!prodTitle && !uploadTitle) {
    var alt = String(row[4] || '').trim();
    if (alt && alt !== '-' && alt.toLowerCase() !== 'not started') prodTitle = alt;
  }

  if (!id || (!prodTitle && !uploadTitle)) {
    return { synced: 0, skipped: 0 };
  }

  var stage = String(row[6] || '').trim();
  var platform = String(row[7] || '').trim();
  var format = String(row[8] || '').trim();
  var planner = String(row[13] || row[12] || '-');
  var copywriter = String(row[14] || row[13] || '-');
  var prodTeam = String(row[14] || '-');
  var designer = String(row[15] || '-');
  var editor = String(row[16] || '-');

  var synced = 0;
  var skipped = 0;
  var searchStart = new Date(2026, 0, 1, 0, 0, 0);
  var searchEnd = new Date(2026, 11, 31, 23, 59, 59);

  var baseDesc = [
    'Week: ' + week,
    'Tahap: ' + stage,
    'Platform: ' + platform + ' (' + format + ')',
    'Planner: ' + planner,
    'Copywriter: ' + copywriter,
    'Produksi: ' + prodTeam,
    'Designer: ' + designer,
    'Editor: ' + editor,
  ].join('\n');

  CONTENT_CALENDAR_CONFIG.forEach(function (cfg) {
    if (cfg.enabled === false) return;
    try {
      var cal = CalendarApp.getCalendarById(cfg.calendarId);
      if (!cal) {
        skipped++;
        return;
      }

      var existing = cal.getEvents(searchStart, searchEnd);
      existing.forEach(function (ev) {
        var desc = ev.getDescription ? String(ev.getDescription() || '') : '';
        if (desc.indexOf('Content ID: ' + id) !== -1) {
          ev.deleteEvent();
        }
      });

      // 1. Event Timeline Produksi (jam 09:00 di tanggal baris ini)
      if (prodTitle) {
        var prodEnd = new Date(prodDate.getTime() + EVENT_DURATION_HOURS * 3600 * 1000);
        var prodEvTitle = '🎬 [PRODUKSI] ' + (stage ? '[' + stage + '] ' : '') + prodTitle;
        var prodDesc = 'Content ID: ' + id + '-PROD\nTipe: Jadwal Produksi / Syuting\n' + baseDesc;
        cal.createEvent(prodEvTitle, prodDate, prodEnd, { description: prodDesc });
        synced++;
      }

      // 2. Event Timeline Upload (jam 17:00 di tanggal baris yang sama!)
      if (uploadTitle) {
        var upEnd = new Date(uploadDate.getTime() + EVENT_DURATION_HOURS * 3600 * 1000);
        var upEvTitle = '🚀 [UPLOAD] ' + uploadTitle + (platform && platform !== 'Not Started' ? ' (' + platform + ')' : '');
        var upDesc = 'Content ID: ' + id + '-UP\nTipe: Jadwal Timeline Upload / Tayang\n' + baseDesc;
        cal.createEvent(upEvTitle, uploadDate, upEnd, { description: upDesc });
        synced++;
      }

    } catch (err) {
      skipped++;
    }
  });

  return { synced: synced, skipped: skipped };
}

/************************************************************
 * 6. SINKRONISASI TOTAL: SEMUA KONTEN PRODUKSI & UPLOAD KE KALENDER
 ************************************************************/
function syncAllContentToCalendars() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var ignoredSheets = ['team', 'socmedreport', 'calendarconfig', 'summary', 'template'];

  var validItems = [];

  sheets.forEach(function (sheet) {
    var name = sheet.getName();
    if (ignoredSheets.indexOf(name.toLowerCase()) !== -1) return;

    var values = sheet.getDataRange().getValues();
    var headerRow = -1;
    var colMap = {
      id: 0,
      week: 1,
      date: 2,
      prodTitle: 5,
      status: 6,
      platform: 7,
      format: 8,
      uploadTitle: 10,
      planner: 13,
      copywriter: 14,
      designer: 15,
      editor: 16,
      admin: 17,
    };

    for (var i = 0; i < values.length; i++) {
      var rowSlice = values[i].slice(0, 15).map(function(c) { return String(c || '').trim().toLowerCase(); });
      if (rowSlice.indexOf('content id') !== -1 || rowSlice.indexOf('id') !== -1 || rowSlice.indexOf('post title') !== -1 || rowSlice.indexOf('judul') !== -1 || rowSlice.indexOf('timeline produksi') !== -1) {
        headerRow = i;
        values[i].forEach(function(c, colIdx) {
          var h = String(c || '').trim().toLowerCase();
          if (h === 'content id' || h === 'id') colMap.id = colIdx;
          else if (h === 'week') colMap.week = colIdx;
          else if (h === 'date' || h === 'tanggal') colMap.date = colIdx;
          else if (h.indexOf('produksi') !== -1 || h === 'post title' || h === 'judul') colMap.prodTitle = colIdx;
          else if (h.indexOf('upload') !== -1 && h.indexOf('timeline') !== -1) colMap.uploadTitle = colIdx;
          else if (h === 'status') colMap.status = colIdx;
          else if (h === 'platform') colMap.platform = colIdx;
          else if (h === 'format') colMap.format = colIdx;
          else if (h.indexOf('planner') !== -1) colMap.planner = colIdx;
          else if (h.indexOf('copywriter') !== -1) colMap.copywriter = colIdx;
          else if (h.indexOf('designer') !== -1) colMap.designer = colIdx;
          else if (h.indexOf('editor') !== -1) colMap.editor = colIdx;
          else if (h.indexOf('admin') !== -1) colMap.admin = colIdx;
        });
        break;
      }
    }
    if (headerRow === -1) headerRow = 0;

    for (var j = headerRow + 1; j < values.length; j++) {
      var row = values[j];
      var id = String(row[colMap.id] || '').trim();
      var prodTitle = String(row[colMap.prodTitle] || '').trim();
      if (prodTitle === '-' || prodTitle.toLowerCase() === 'not started') prodTitle = '';

      var uploadTitle = colMap.uploadTitle < row.length ? String(row[colMap.uploadTitle] || '').trim() : '';
      if (uploadTitle === '-' || uploadTitle.toLowerCase() === 'not started') uploadTitle = '';

      if (!prodTitle && !uploadTitle) {
        var alt = String(row[4] || '').trim();
        if (alt && alt !== '-' && alt.toLowerCase() !== 'not started') prodTitle = alt;
      }

      if (!id || (!prodTitle && !uploadTitle)) continue;

      // Ambil tanggal murni dari baris ini!
      var rowDate = parseEventDate_(row[colMap.date]);
      if (!rowDate) continue;

      var prodDate = new Date(rowDate.getFullYear(), rowDate.getMonth(), rowDate.getDate(), PROD_EVENT_START_HOUR, 0, 0);
      var uploadDate = new Date(rowDate.getFullYear(), rowDate.getMonth(), rowDate.getDate(), UPLOAD_EVENT_START_HOUR, 0, 0);

      var week = String(row[colMap.week] || '').trim();
      var stage = String(row[colMap.status] || '').trim();
      var platform = String(row[colMap.platform] || '').trim();
      var format = String(row[colMap.format] || '').trim();
      var planner = String(row[colMap.planner] || '-');
      var copywriter = String(row[colMap.copywriter] || '-');
      var prodTeam = String(row[colMap.designer - 1] || row[14] || '-');
      var designer = String(row[colMap.designer] || '-');
      var editor = String(row[colMap.editor] || '-');

      var baseDesc = [
        'Week: ' + week,
        'Tahap: ' + stage,
        'Platform: ' + platform + ' (' + format + ')',
        'Planner: ' + planner,
        'Copywriter: ' + copywriter,
        'Produksi: ' + prodTeam,
        'Designer: ' + designer,
        'Editor: ' + editor,
      ].join('\n');

      // 1. Konten Timeline Produksi (waktu baris ini jam 09:00)
      if (prodTitle) {
        validItems.push({
          contentId: id + '-PROD',
          eventTitle: '🎬 [PRODUKSI] ' + (stage ? '[' + stage + '] ' : '') + prodTitle,
          start: prodDate,
          end: new Date(prodDate.getTime() + EVENT_DURATION_HOURS * 3600 * 1000),
          desc: 'Content ID: ' + id + '-PROD\nTipe: Jadwal Produksi / Syuting\n' + baseDesc
        });
      }

      // 2. Konten Timeline Upload (waktu persis sebaris sama baris timeline upload, jam 17:00)
      if (uploadTitle) {
        validItems.push({
          contentId: id + '-UP',
          eventTitle: '🚀 [UPLOAD] ' + uploadTitle + (platform && platform !== 'Not Started' ? ' (' + platform + ')' : ''),
          start: uploadDate,
          end: new Date(uploadDate.getTime() + EVENT_DURATION_HOURS * 3600 * 1000),
          desc: 'Content ID: ' + id + '-UP\nTipe: Jadwal Timeline Upload / Tayang\n' + baseDesc
        });
      }
    }
  });

  var rangeStart = new Date(2026, 0, 1, 0, 0, 0);
  var rangeEnd = new Date(2026, 11, 31, 23, 59, 59);

  var totalSynced = 0;
  var totalDeleted = 0;
  var skippedCalendars = 0;

  CONTENT_CALENDAR_CONFIG.forEach(function (cfg) {
    if (cfg.enabled === false) return;
    try {
      var cal = CalendarApp.getCalendarById(cfg.calendarId);
      if (!cal) {
        console.error('Kalender tidak ditemukan: ' + cfg.member + ' (' + cfg.calendarId + ')');
        skippedCalendars++;
        return;
      }

      // Bersihkan event konten lama
      var existingEvents = cal.getEvents(rangeStart, rangeEnd);
      existingEvents.forEach(function (ev) {
        var desc = ev.getDescription ? String(ev.getDescription() || '') : '';
        if (desc.indexOf('Content ID:') !== -1) {
          ev.deleteEvent();
          totalDeleted++;
        }
      });

      // Masukkan semua konten
      validItems.forEach(function (item) {
        cal.createEvent(item.eventTitle, item.start, item.end, { description: item.desc });
        totalSynced++;
      });

    } catch (err) {
      console.error('Gagal memproses kalender ' + cfg.member + ': ' + err.toString());
      skippedCalendars++;
    }
  });

  Logger.log('Selesai! Total konten diproses: ' + validItems.length + ' | Event lama dibersihkan: ' + totalDeleted + ' | Event baru dibuat: ' + totalSynced);

  return {
    success: true,
    totalItems: validItems.length,
    synced: totalSynced,
    deleted: totalDeleted,
    skipped: skippedCalendars
  };
}