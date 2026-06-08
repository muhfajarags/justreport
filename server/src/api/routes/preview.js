const express = require('express');
const router = express.Router();
const templateEngine = require('../../services/templateEngine');
const { getDb } = require('../../database/connection');
const { AppError } = require('../middleware/errorHandler');

router.post('/', async (req, res, next) => {
  try {
    const { template_id, data, custom_html } = req.body;

    if (!data) {
      throw new AppError('Data is required', 400);
    }

    let htmlTemplate;

    if (custom_html) {
      htmlTemplate = custom_html;
    } else if (template_id) {
      const db = await getDb();
      const result = db.exec('SELECT html_content FROM templates WHERE id = ?', [template_id]);
      if (result.length === 0 || result[0].values.length === 0) {
        throw new AppError('Template not found', 404);
      }
      htmlTemplate = result[0].values[0][0];
    } else {
      throw new AppError('template_id or custom_html is required', 400);
    }

    const html = await templateEngine.renderTemplate(htmlTemplate, data);

    res.json({
      success: true,
      html
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
