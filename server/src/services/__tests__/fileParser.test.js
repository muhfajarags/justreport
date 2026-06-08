import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import fileParser from '../fileParser';

const SAMPLES_DIR = path.resolve(__dirname, '..', '..', '..', '..', 'samples');
let tmpDir;

function copySample(name) {
  const src = path.join(SAMPLES_DIR, name);
  const dst = path.join(tmpDir, name);
  fs.copyFileSync(src, dst);
  return dst;
}

beforeAll(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fileparser-test-'));
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('fileParser', () => {
  describe('detectFormat', () => {
    it('should detect JSON from extension', () => {
      const result = fileParser.detectFormat('data.json', 'application/json');
      expect(result).toBe('json');
    });

    it('should detect CSV from extension', () => {
      const result = fileParser.detectFormat('data.csv', 'text/csv');
      expect(result).toBe('csv');
    });

    it('should detect TSV from extension', () => {
      const result = fileParser.detectFormat('data.tsv', 'text/plain');
      expect(result).toBe('tsv');
    });

    it('should detect XLSX from extension', () => {
      const result = fileParser.detectFormat('data.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      expect(result).toBe('xlsx');
    });

    it('should detect XLS from extension', () => {
      const result = fileParser.detectFormat('data.xls', 'application/vnd.ms-excel');
      expect(result).toBe('xls');
    });

    it('should detect CSV from text/plain mime', () => {
      const result = fileParser.detectFormat('unknown.txt', 'text/plain');
      expect(result).toBe('csv');
    });

    it('should throw on unknown format', () => {
      expect(() => fileParser.detectFormat('data.pdf', 'application/pdf')).toThrow('Cannot detect format');
    });
  });

  describe('parseFile', () => {
    it('should parse a CSV file', async () => {
      const filePath = copySample('sales.csv');
      const result = await fileParser.parseFile(filePath, 'text/csv');
      expect(result.rows).toBeDefined();
      expect(result.rowCount).toBeGreaterThan(0);
      expect(result.columns).toContain('id');
      expect(result.columns).toContain('product');
      expect(result.preview.length).toBeLessThanOrEqual(5);
    });

    it('should parse a JSON file', async () => {
      const filePath = copySample('sales.json');
      const result = await fileParser.parseFile(filePath, 'application/json');
      expect(result.rows).toBeDefined();
      expect(result.rowCount).toBeGreaterThan(0);
      expect(result.columns).toContain('id');
      expect(result.columns).toContain('product');
    });

    it('should parse a TSV file', async () => {
      const filePath = copySample('sales.tsv');
      const result = await fileParser.parseFile(filePath, 'text/plain');
      expect(result.rows).toBeDefined();
      expect(result.rowCount).toBeGreaterThan(0);
      expect(result.columns).toContain('id');
      expect(result.columns).toContain('product');
    });

    it('should parse an XLSX file', async () => {
      const filePath = copySample('sales.xlsx');
      const result = await fileParser.parseFile(filePath, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      expect(result.rows).toBeDefined();
      expect(result.rowCount).toBeGreaterThan(0);
      expect(result.columns).toContain('OrderID');
    });

    it('should throw on empty file', async () => {
      const emptyPath = path.join(tmpDir, 'empty.csv');
      fs.writeFileSync(emptyPath, 'header\n', 'utf-8');
      await expect(fileParser.parseFile(emptyPath, 'text/csv')).rejects.toThrow();
    });

    it('should normalize all values to strings', async () => {
      const filePath = copySample('sales.csv');
      const result = await fileParser.parseFile(filePath, 'text/csv');
      result.rows.forEach(row => {
        Object.values(row).forEach(val => {
          expect(typeof val).toBe('string');
        });
      });
    });
  });

  describe('parseJSON', () => {
    it('should parse a JSON array', () => {
      const filePath = path.join(tmpDir, 'test-array.json');
      fs.writeFileSync(filePath, JSON.stringify([{ a: 1 }, { a: 2 }]), 'utf-8');
      const result = fileParser.parseJSON(filePath);
      expect(result).toHaveLength(2);
    });

    it('should wrap a JSON object in array', () => {
      const filePath = path.join(tmpDir, 'test-object.json');
      fs.writeFileSync(filePath, JSON.stringify({ name: 'test' }), 'utf-8');
      const result = fileParser.parseJSON(filePath);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });

    it('should throw on invalid JSON', () => {
      const filePath = path.join(tmpDir, 'bad.json');
      fs.writeFileSync(filePath, 'not json', 'utf-8');
      expect(() => fileParser.parseJSON(filePath)).toThrow();
    });
  });

  describe('normalizeData', () => {
    it('should convert null values to empty strings', () => {
      const result = fileParser.normalizeData([{ a: null, b: 'hello' }]);
      expect(result[0].a).toBe('');
      expect(result[0].b).toBe('hello');
    });

    it('should convert numbers to strings', () => {
      const result = fileParser.normalizeData([{ a: 42 }]);
      expect(result[0].a).toBe('42');
    });

    it('should convert Date objects to ISO strings', () => {
      const date = new Date('2024-01-01');
      const result = fileParser.normalizeData([{ a: date }]);
      expect(result[0].a).toBe(date.toISOString());
    });
  });
});
