import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import initSqlJs from 'sql.js';
import dedupService from '../dedupService';

const MIGRATIONS_SQL = `
  CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    html_content TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    is_default INTEGER DEFAULT 0,
    created_by TEXT DEFAULT 'system',
    created_at TEXT DEFAULT (datetime('now')),
    last_used_at TEXT DEFAULT (datetime('now'))
  );
`;

let db;

beforeAll(async () => {
  const SQL = await initSqlJs();
  db = new SQL.Database();
  db.run(MIGRATIONS_SQL);
});

afterAll(() => {
  db.close();
});

describe('dedupService', () => {
  describe('calculateHash', () => {
    it('should return a SHA-256 hex string', () => {
      const hash = dedupService.calculateHash('<html></html>');
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(64);
    });

    it('should normalize whitespace before hashing', () => {
      const hash1 = dedupService.calculateHash('<html>  <body></body>  </html>');
      const hash2 = dedupService.calculateHash('<html> <body></body> </html>');
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different content', () => {
      const hash1 = dedupService.calculateHash('<h1>Hello</h1>');
      const hash2 = dedupService.calculateHash('<h1>World</h1>');
      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty strings', () => {
      const hash = dedupService.calculateHash('');
      expect(hash).toBeDefined();
      expect(hash.length).toBe(64);
    });
  });

  describe('checkDuplicate', () => {
    it('should return null when no duplicate exists', () => {
      const result = dedupService.checkDuplicate(db, 'nonexistenthash');
      expect(result).toBeNull();
    });

    it('should return the template id when duplicate exists', () => {
      const html = '<h1>Duplicate Test</h1>';
      const hash = dedupService.calculateHash(html);
      db.run(
        `INSERT INTO templates (id, name, html_content, content_hash, is_default)
         VALUES (?, ?, ?, ?, ?)`,
        ['dup-test-id', 'Dup Test', html, hash, 0]
      );
      const result = dedupService.checkDuplicate(db, hash);
      expect(result).toBe('dup-test-id');
    });
  });

  describe('generateId', () => {
    it('should generate an id starting with tpl-', () => {
      const id = dedupService.generateId();
      expect(id).toMatch(/^tpl-/);
    });

    it('should generate unique ids', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(dedupService.generateId());
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('saveTemplate', () => {
    it('should insert a template and return id and hash', () => {
      const result = dedupService.saveTemplate(db, {
        id: 'save-test-id',
        name: 'Save Test',
        htmlContent: '<h1>Save Test</h1>',
        isDefault: 0,
        createdBy: 'test'
      });
      expect(result.id).toBe('save-test-id');
      expect(result.hash).toBeDefined();
      expect(result.hash.length).toBe(64);
    });

    it('should throw when saving a duplicate', () => {
      expect(() => {
        dedupService.saveTemplate(db, {
          id: 'save-dup-id',
          name: 'Save Dup',
          htmlContent: '<h1>Save Test</h1>',
          isDefault: 0
        });
      }).toThrow('A template with this content already exists');
    });
  });
});
