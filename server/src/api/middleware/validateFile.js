const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { ALLOWED_MIMETYPES, MAX_FILE_SIZE } = require('../../config/constants');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve(process.env.UPLOAD_DIR || './storage/uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = uuidv4() + ext;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type '${file.mimetype}' is not supported. Allowed: JSON, CSV, TSV, XLSX, XLS`), false);
  }
};

const htmlFileFilter = (req, file, cb) => {
  const allowed = ['text/html', 'text/plain'];
  if (allowed.includes(file.mimetype) || file.originalname.endsWith('.html') || file.originalname.endsWith('.htm')) {
    cb(null, true);
  } else {
    cb(new Error('Only .html and .htm files are allowed for template upload'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});

const uploadHtml = multer({
  storage,
  fileFilter: htmlFileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});

module.exports = { upload, uploadHtml };
