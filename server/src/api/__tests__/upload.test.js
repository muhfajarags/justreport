import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import path from 'path';
import fs from 'fs';
import os from 'os';
import initSqlJs from 'sql.js';

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
let tmpDir;

vi.mock('../../database/connection', () => ({
  getDb: vi.fn(),
  saveDb: vi.fn()
}));

const { getDb, saveDb } = await import('../../database/connection');

async function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const uploadRoutes = (await import('../routes/upload')).default;
  app.use('/api/upload', uploadRoutes);
  app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ error: err.message });
  });
  return app;
}

beforeAll(async () => {
  const SQL = await initSqlJs();
  db = new SQL.Database();
  db.run(MIGRATIONS_SQL);
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'upload-test-'));
  getDb.mockResolvedValue(db);
  saveDb.mockImplementation(() => {});
});

afterAll(() => {
  db.close();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('POST /api/upload', () => {
  it('should reject when no file is provided', async () => {
    const app = await createApp();
    const res = await request(app).post('/api/upload');
    expect(res.status).toBe(400);
  });

  it('should parse a CSV file successfully', async () => {
    const csvPath = path.join(tmpDir, 'test.csv');
    fs.writeFileSync(csvPath, 'name,age\nAlice,30\nBob,25', 'utf-8');

    const app = await createApp();
    const res = await request(app)
      .post('/api/upload')
      .attach('file', csvPath);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.rows).toBe(2);
    expect(res.body.data.columnNames).toContain('name');
    expect(res.body.data.columnNames).toContain('age');
    expect(res.body.data.columns).toBe(2);
  });

  it('should parse a JSON file successfully', async () => {
    const jsonPath = path.join(tmpDir, 'test.json');
    fs.writeFileSync(jsonPath, JSON.stringify([{ id: 1, value: 'foo' }, { id: 2, value: 'bar' }]), 'utf-8');

    const app = await createApp();
    const res = await request(app)
      .post('/api/upload')
      .attach('file', jsonPath);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.rows).toBe(2);
  });
});
