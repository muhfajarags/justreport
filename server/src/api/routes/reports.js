const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { getDb, saveDb } = require('../../database/connection');
const { AppError } = require('../middleware/errorHandler');

router.get('/', async (req, res, next) => {
  try {
    const db = await getDb();
    const { sort = 'date', order = 'desc', search = '', page = '1', limit = '20' } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    let sortCol = 'r.created_at';
    if (sort === 'name') sortCol = 'r.name';
    if (sort === 'size') sortCol = 'r.file_size_kb';
    const orderDir = order === 'asc' ? 'ASC' : 'DESC';

    let whereClause = 'WHERE r.deleted_at IS NULL';
    const params = [];

    if (search) {
      whereClause += ' AND (r.name LIKE ? OR r.source_filename LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const countResult = db.exec(
      `SELECT COUNT(*) as total FROM reports r ${whereClause}`,
      params
    );
    const total = countResult[0].values[0][0];

    const results = db.exec(
      `SELECT r.id, r.name, r.source_filename, r.template_id, t.name as template_name,
              r.file_size_kb, r.row_count, r.created_at
       FROM reports r
       LEFT JOIN templates t ON r.template_id = t.id
       ${whereClause}
       ORDER BY ${sortCol} ${orderDir}
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    const data = results.length > 0 ? results[0].values.map(row => ({
      id: row[0],
      name: row[1],
      source_filename: row[2],
      template_id: row[3],
      template_name: row[4] || 'Unknown',
      file_size_kb: row[5],
      row_count: row[6],
      created_at: row[7]
    })) : [];

    res.json({
      success: true,
      data,
      total,
      page: pageNum,
      limit: limitNum
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/download', async (req, res, next) => {
  try {
    const db = await getDb();
    const result = db.exec(
      'SELECT pdf_path, name FROM reports WHERE id = ? AND deleted_at IS NULL',
      [req.params.id]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      throw new AppError('Report not found', 404);
    }

    const [pdfPath, reportName] = result[0].values[0];

    if (!fs.existsSync(pdfPath)) {
      throw new AppError('PDF file not found on disk', 404);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${reportName}.pdf"`);
    fs.createReadStream(pdfPath).pipe(res);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const db = await getDb();
    const result = db.exec('SELECT id FROM reports WHERE id = ? AND deleted_at IS NULL', [req.params.id]);

    if (result.length === 0 || result[0].values.length === 0) {
      throw new AppError('Report not found', 404);
    }

    db.run('UPDATE reports SET deleted_at = datetime(\'now\') WHERE id = ?', [req.params.id]);
    saveDb();

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
