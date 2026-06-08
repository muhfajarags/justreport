const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const Papa = require('papaparse');
const { PREVIEW_ROW_LIMIT } = require('../config/constants');

class FileParser {
  async parseFile(filePath, mimeType) {
    const format = this.detectFormat(filePath, mimeType);
    let data;

    switch (format) {
      case 'json':
        data = this.parseJSON(filePath);
        break;
      case 'csv':
      case 'tsv':
        data = this.parseCSV(filePath);
        break;
      case 'xlsx':
      case 'xls':
        data = this.parseExcel(filePath);
        break;
      default:
        throw new Error(`Unsupported file format: ${mimeType}`);
    }

    if (!Array.isArray(data)) {
      data = [data];
    }

    data = this.normalizeData(data);

    if (data.length === 0) {
      throw new Error('File contains no data rows');
    }

    return {
      rows: data,
      rowCount: data.length,
      columns: Object.keys(data[0]),
      columnCount: Object.keys(data[0]).length,
      preview: data.slice(0, PREVIEW_ROW_LIMIT)
    };
  }

  detectFormat(filePath, mimeType) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.json' || mimeType === 'application/json') return 'json';
    if (ext === '.csv' || mimeType === 'text/csv') return 'csv';
    if (ext === '.tsv') return 'tsv';
    if (ext === '.xlsx' || mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return 'xlsx';
    if (ext === '.xls' || mimeType === 'application/vnd.ms-excel') return 'xls';
    if (mimeType === 'text/plain') return 'csv';
    throw new Error(`Cannot detect format for: ${filePath}`);
  }

  parseJSON(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [data];
  }

  parseCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const result = Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false
    });

    if (result.errors.length > 0) {
      const errors = result.errors.slice(0, 3).map(e => e.message).join('; ');
      throw new Error(`CSV parse error: ${errors}`);
    }

    return result.data;
  }

  parseExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    return data;
  }

  normalizeData(data) {
    return data.map((row) => {
      const normalized = {};
      for (const key of Object.keys(row)) {
        let value = row[key];
        if (value === null || value === undefined) {
          value = '';
        } else if (value instanceof Date) {
          value = value.toISOString();
        }
        normalized[key] = String(value);
      }
      return normalized;
    });
  }
}

module.exports = new FileParser();
