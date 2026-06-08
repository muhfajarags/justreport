const express = require('express');
const router = express.Router();
const { uploadHtml } = require('../middleware/validateFile');
const { getDb, saveDb } = require('../../database/connection');
const dedupService = require('../../services/dedupService');
const { AppError } = require('../middleware/errorHandler');

router.get('/', async (req, res, next) => {
  try {
    const db = await getDb();
    const results = db.exec(
      'SELECT id, name, is_default, content_hash, created_at, last_used_at, created_by FROM templates ORDER BY is_default DESC, created_at DESC'
    );

    const allTemplates = results.length > 0 ? results[0].values.map(row => ({
      id: row[0],
      name: row[1],
      is_default: row[2] === 1,
      content_hash: row[3],
      created_at: row[4],
      last_used_at: row[5],
      created_by: row[6]
    })) : [];

    const defaults = allTemplates.filter(t => t.is_default);
    const custom = allTemplates.filter(t => !t.is_default);

    res.json({
      success: true,
      defaults,
      custom
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const db = await getDb();
    const result = db.exec(
      'SELECT id, name, html_content, is_default, content_hash, created_at, last_used_at, created_by FROM templates WHERE id = ?',
      [req.params.id]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      throw new AppError('Template not found', 404);
    }

    const row = result[0].values[0];
    res.json({
      success: true,
      template: {
        id: row[0],
        name: row[1],
        html_content: row[2],
        is_default: row[3] === 1,
        content_hash: row[4],
        created_at: row[5],
        last_used_at: row[6],
        created_by: row[7]
      }
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', uploadHtml.single('file'), async (req, res, next) => {
  try {
    const db = await getDb();
    const fs = require('fs');

    if (!req.file) {
      throw new AppError('HTML file is required', 400);
    }

    const htmlContent = fs.readFileSync(req.file.path, 'utf-8');
    const templateName = req.body.name || req.file.originalname.replace(/\.\w+$/, '');

    if (!htmlContent || htmlContent.trim().length === 0) {
      throw new AppError('Template content is empty', 400);
    }

    const templateId = dedupService.generateId();
    await dedupService.saveTemplate(db, {
      id: templateId,
      name: templateName,
      htmlContent,
      isDefault: 0,
      createdBy: 'user'
    });
    saveDb();

    res.status(201).json({
      success: true,
      template: {
        id: templateId,
        name: templateName,
        is_default: false,
        created_by: 'user'
      }
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const db = await getDb();
    const result = db.exec('SELECT is_default FROM templates WHERE id = ?', [req.params.id]);

    if (result.length === 0 || result[0].values.length === 0) {
      throw new AppError('Template not found', 404);
    }

    if (result[0].values[0][0] === 1) {
      throw new AppError('Cannot delete default templates', 403);
    }

    db.run('DELETE FROM templates WHERE id = ?', [req.params.id]);
    saveDb();

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
