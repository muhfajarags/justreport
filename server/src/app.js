const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDb, saveDb, closeDb } = require('./database/connection');
const { errorHandler } = require('./api/middleware/errorHandler');
const dedupService = require('./services/dedupService');
const defaultTemplates = require('./database/seeds/defaultTemplates');
const config = require('./config/database');

const uploadRoutes = require('./api/routes/upload');
const previewRoutes = require('./api/routes/preview');
const generateRoutes = require('./api/routes/generate');
const reportsRoutes = require('./api/routes/reports');
const templatesRoutes = require('./api/routes/templates');

async function seedDefaults() {
  const db = await getDb();
  const result = db.exec('SELECT COUNT(*) as cnt FROM templates WHERE is_default = 1');
  const count = result[0].values[0][0];

  if (count > 0) return;

  for (const tpl of defaultTemplates) {
    const hash = dedupService.calculateHash(tpl.html_content);
    db.run(
      `INSERT OR IGNORE INTO templates (id, name, html_content, content_hash, is_default)
       VALUES (?, ?, ?, ?, ?)`,
      [tpl.id, tpl.name, tpl.html_content, hash, tpl.is_default]
    );
  }
  saveDb();
}

async function runMigrations() {
  const db = await getDb();
  const fs = require('fs');
  const migrationsDir = path.join(__dirname, 'database', 'migrations');

  const files = fs.readdirSync(migrationsDir).sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    db.run(sql);
  }
  saveDb();
}

async function start() {
  try {
    const storageDirs = [
      path.resolve(process.env.UPLOAD_DIR || './storage/uploads'),
      path.resolve(process.env.REPORT_DIR || './storage/reports')
    ];
    for (const dir of storageDirs) {
      if (!require('fs').existsSync(dir)) {
        require('fs').mkdirSync(dir, { recursive: true });
      }
    }

    await runMigrations();
    await seedDefaults();

    const app = express();

    app.use(cors({ origin: config.corsOrigin, credentials: true }));
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    app.use('/api/upload', uploadRoutes);
    app.use('/api/preview', previewRoutes);
    app.use('/api/generate', generateRoutes);
    app.use('/api/reports', reportsRoutes);
    app.use('/api/templates', templatesRoutes);

    app.get('/api/health', (req, res) => {
      res.json({ success: true, status: 'ok', time: new Date().toISOString() });
    });

    app.use(errorHandler);

    app.listen(config.port, () => {
      console.log(`JustReport server running on http://localhost:${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });

    process.on('SIGINT', () => {
      closeDb();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      closeDb();
      process.exit(0);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
