const crypto = require('crypto');

class DedupService {
  calculateHash(htmlContent) {
    const normalized = htmlContent
      .replace(/\s+/g, ' ')
      .trim();
    return crypto
      .createHash('sha256')
      .update(normalized)
      .digest('hex');
  }

  checkDuplicate(db, hash) {
    const result = db.exec(
      'SELECT id FROM templates WHERE content_hash = ?',
      [hash]
    );
    if (result.length > 0 && result[0].values.length > 0) {
      return result[0].values[0][0];
    }
    return null;
  }

  saveTemplate(db, { id, name, htmlContent, isDefault = 0, createdBy = 'system' }) {
    const hash = this.calculateHash(htmlContent);

    const existing = this.checkDuplicate(db, hash);
    if (existing) {
      const { AppError } = require('../api/middleware/errorHandler');
      throw new AppError('A template with this content already exists', 409);
    }

    db.run(
      `INSERT INTO templates (id, name, html_content, content_hash, is_default, created_by, last_used_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
      [id, name, htmlContent, hash, isDefault, createdBy]
    );

    return { id, hash };
  }

  generateId() {
    const { v4: uuidv4 } = require('uuid');
    return 'tpl-' + uuidv4().slice(0, 8);
  }
}

module.exports = new DedupService();
