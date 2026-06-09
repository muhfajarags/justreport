const express = require('express');
const router = express.Router();
const { upload: uploadMiddleware } = require('../middleware/validateFile');
const fileParser = require('../../services/fileParser');
const { AppError } = require('../middleware/errorHandler');

router.post('/', uploadMiddleware.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    const result = await fileParser.parseFile(req.file.path, req.file.mimetype);

    res.json({
      success: true,
      data: {
        filename: req.file.originalname,
        format: result.columns ? 'tabular' : 'json',
        rows: result.rowCount,
        columns: result.columnCount,
        columnNames: result.columns,
        preview: result.preview,
        // Return standardized JSON structure
        allData: result.data,
        // Include metadata for understanding the JSON structure
        metadata: result.metadata
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
