const ALLOWED_MIMETYPES = [
  'application/json',
  'text/csv',
  'text/plain',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const PDF_SETTINGS = {
  format: 'A4',
  margin: {
    top: '20mm',
    right: '15mm',
    bottom: '20mm',
    left: '15mm'
  },
  printBackground: true
};

const PREVIEW_ROW_LIMIT = 5;

const PUPPETEER_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage'
];

module.exports = {
  ALLOWED_MIMETYPES,
  MAX_FILE_SIZE,
  PDF_SETTINGS,
  PREVIEW_ROW_LIMIT,
  PUPPETEER_ARGS
};
