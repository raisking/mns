/**
 * Marietta Nepali Samaj — Contact form intake.
 *
 * Receives POSTs from the Cloudflare Worker (never directly from the
 * browser) and appends one row per submission to the "Contact Submissions"
 * sheet. See docs/contact-form-google-sheets.md for full setup steps.
 *
 * Required Script Properties (Project Settings -> Script Properties):
 *   SHEET_ID              Spreadsheet ID (from its URL)
 *   SHEET_NAME             e.g. "Contact Submissions"
 *   CONTACT_FORM_SECRET     Must match the Worker's CONTACT_FORM_SECRET secret
 *
 * Never hardcode the values above directly in this file.
 */

var REQUIRED_FIELDS = ['fullName', 'email', 'subject', 'message'];
var HEADER_ROW = [
  'Submitted At',
  'Full Name',
  'Email Address',
  'Phone Number',
  'Subject',
  'Message',
  'Source Page',
  'Status',
];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({ success: false, error: 'Missing request body.' });
    }

    // 1. Parse JSON from the request.
    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonResponse_({ success: false, error: 'Invalid JSON.' });
    }

    // 2. Read Script Properties.
    var props = PropertiesService.getScriptProperties();
    var sheetId = props.getProperty('SHEET_ID');
    var sheetName = props.getProperty('SHEET_NAME');
    var expectedSecret = props.getProperty('CONTACT_FORM_SECRET');

    if (!sheetId || !sheetName || !expectedSecret) {
      // Never describe which one is missing to the caller — that's an
      // internal misconfiguration detail, not something to leak.
      return jsonResponse_({ success: false, error: 'Server misconfigured.' });
    }

    // 3. Verify the shared secret.
    if (typeof payload.secret !== 'string' || payload.secret !== expectedSecret) {
      return jsonResponse_({ success: false, error: 'Unauthorized.' });
    }

    // 4. Validate required fields again — independent of the Worker.
    for (var i = 0; i < REQUIRED_FIELDS.length; i++) {
      var field = REQUIRED_FIELDS[i];
      if (typeof payload[field] !== 'string' || payload[field].trim() === '') {
        return jsonResponse_({ success: false, error: 'Missing required field: ' + field });
      }
    }

    // 5 & 6. Open the Google Sheet and the Contact Submissions tab.
    var spreadsheet = SpreadsheetApp.openById(sheetId);
    var sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      return jsonResponse_({ success: false, error: 'Sheet tab not found.' });
    }
    ensureHeaderRow_(sheet);

    // 7. Sanitize every user-controlled value before it touches the sheet.
    var fullName = sanitizeForSpreadsheet_(toText_(payload.fullName));
    var email = sanitizeForSpreadsheet_(toText_(payload.email));
    var phone = sanitizeForSpreadsheet_(toText_(payload.phone));
    var subject = sanitizeForSpreadsheet_(toText_(payload.subject));
    var message = sanitizeForSpreadsheet_(toText_(payload.message));
    var sourcePage = sanitizeForSpreadsheet_(toText_(payload.sourcePage));

    // 8. Append exactly one row. Timestamp is generated here, server-side —
    // never trust a timestamp supplied by the browser/Worker.
    sheet.appendRow([
      new Date(),
      fullName,
      email,
      phone,
      subject,
      message,
      sourcePage,
      'New',
    ]);

    // 9. Return JSON.
    return jsonResponse_({ success: true });
  } catch (err) {
    return jsonResponse_({ success: false, error: 'Unexpected server error.' });
  }
}

/** Rejects GET so the deployed web app doesn't silently 200 on the wrong verb. */
function doGet(e) {
  return jsonResponse_({ success: false, error: 'Method not allowed.' });
}

function ensureHeaderRow_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER_ROW);
  }
}

function toText_(value) {
  return typeof value === 'string' ? value : '';
}

/**
 * Neutralizes spreadsheet formula injection. A value that starts with
 * =, +, -, or @ would otherwise execute as a formula (e.g.
 * =IMPORTXML("...")) when read back in Sheets/Excel. A leading apostrophe
 * forces it to be stored and displayed as plain text.
 */
function sanitizeForSpreadsheet_(value) {
  var trimmed = value.replace(/^\s+/, '');
  if (/^[=+\-@]/.test(trimmed)) {
    return "'" + value;
  }
  return value;
}

function jsonResponse_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
