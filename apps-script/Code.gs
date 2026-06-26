const SHEET_NAME = 'responses';
const MAX_CHOICES = 100;

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    if (!payload || payload.action !== 'snapshot') {
      return json_({ ok: false, error: 'invalid_action' });
    }

    const sheet = getSheet_();
    ensureHeader_(sheet);
    upsertSnapshot_(sheet, payload);

    return json_({ ok: true });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: String(error) });
  }
}

function doGet() {
  return json_({ ok: true, service: 'visual-novel-survey-api' });
}

function parsePayload_(e) {
  const raw = e && e.postData && e.postData.contents;
  if (!raw) return null;
  return JSON.parse(raw);
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function ensureHeader_(sheet) {
  const headers = [
    'timestamp',
    'session_id',
    'nickname',
    'gender',
    ...Array.from({ length: MAX_CHOICES }, (_, index) => `choice_${index + 1}`),
    'play_time',
    'completed',
    'updated_at',
  ];

  const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const needsHeader = current.every((value) => value === '');
  if (needsHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

function upsertSnapshot_(sheet, payload) {
  const sessionId = String(payload.sessionId || '');
  if (!sessionId) {
    throw new Error('sessionId is required');
  }

  const rowIndex = findRowBySession_(sheet, sessionId) || sheet.getLastRow() + 1;
  const now = new Date();
  const choices = Array.isArray(payload.choices) ? payload.choices : [];
  const existingTimestamp = rowIndex <= sheet.getLastRow() ? sheet.getRange(rowIndex, 1).getValue() : '';

  const row = [
    existingTimestamp || now,
    sessionId,
    String(payload.nickname || '김행동'),
    String(payload.gender || ''),
    ...Array.from({ length: MAX_CHOICES }, (_, index) => {
      const choice = choices[index];
      return choice ? JSON.stringify(choice) : '';
    }),
    Number(payload.playTime || 0),
    Boolean(payload.completed),
    now,
  ];

  sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
}

function findRowBySession_(sheet, sessionId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  const values = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
  for (let index = 0; index < values.length; index += 1) {
    if (String(values[index][0]) === sessionId) {
      return index + 2;
    }
  }
  return 0;
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
