const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { getDb, saveDb } = require('../../database/connection');
const templateEngine = require('../../services/templateEngine');
const pdfGenerator = require('../../services/pdfGenerator');
const dedupService = require('../../services/dedupService');
const { AppError } = require('../middleware/errorHandler');

router.post('/', async (req, res, next) => {
  try {
    const { report_name, template_id, data, save_template } = req.body;

    if (!report_name) throw new AppError('report_name is required', 400);
    if (!template_id) throw new AppError('template_id is required', 400);
    if (!data) throw new AppError('data is required', 400);

    const db = await getDb();

    const tplResult = db.exec('SELECT id, html_content, name, is_default FROM templates WHERE id = ?', [template_id]);
    if (tplResult.length === 0 || tplResult[0].values.length === 0) {
      throw new AppError('Template not found', 404);
    }

    const tplRow = tplResult[0].values[0];
    const htmlContent = tplRow[1];
    const isDefault = tplRow[3] === 1;

    db.run('UPDATE templates SET last_used_at = datetime(\'now\') WHERE id = ?', [template_id]);
    saveDb();

    if (save_template && !isDefault) {
      const hash = dedupService.calculateHash(htmlContent);
      const existing = dedupService.checkDuplicate(db, hash);
      if (!existing || existing === template_id) {
        if (!existing) {
          const newId = dedupService.generateId();
          dedupService.saveTemplate(db, {
            id: newId,
            name: tplRow[2],
            htmlContent,
            isDefault: 0
          });
        }
      }
    }

    const html = await templateEngine.renderTemplate(htmlContent, data);
    const pdfBuffer = await pdfGenerator.htmlToPdf(html);

    const reportId = 'rpt-' + uuidv4().slice(0, 8);
    const reportDir = path.resolve(process.env.REPORT_DIR || './storage/reports');
    const pdfFilename = reportId + '.pdf';
    const pdfPath = path.join(reportDir, pdfFilename);
    fs.writeFileSync(pdfPath, pdfBuffer);

    const fileSizeKb = Math.round(pdfBuffer.length / 1024);
    const rowCount = Array.isArray(data) ? data.length : 1;

    db.run(
      `INSERT INTO reports (id, name, source_filename, template_id, pdf_path, file_size_kb, row_count)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [reportId, report_name, 'uploaded-data', template_id, pdfPath, fileSizeKb, rowCount]
    );
    saveDb();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${report_name}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
