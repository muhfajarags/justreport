const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databasePath: process.env.DATABASE_PATH || './database.db',
  uploadDir: process.env.UPLOAD_DIR || './storage/uploads',
  reportDir: process.env.REPORT_DIR || './storage/reports',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:9120'
};

module.exports = config;
