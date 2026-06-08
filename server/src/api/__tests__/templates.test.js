import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
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

vi.mock('../../database/connection', () => ({
  getDb: vi.fn(),
  saveDb: vi.fn()
}));

const { getDb, saveDb } = await import('../../database/connection');

async function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const templatesRoutes = (await import('../routes/templates')).default;
  app.use('/api/templates', templatesRoutes);
  app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ error: err.message });
  });
  return app;
}

beforeAll(async () => {
  const SQL = await initSqlJs();
  db = new SQL.Database();
  db.run(MIGRATIONS_SQL);
  getDb.mockResolvedValue(db);
  saveDb.mockImplementation(() => {});
});

afterAll(() => {
  db.close();
});

describe('Templates API error handling', () => {
  it('GET /api/templates/:id should return 404 for non-existent', async () => {
    const app = await createApp();
    const res = await request(app).get('/api/templates/nonexistent');
    expect(res.status).toBe(404);
  });

  it('PUT /api/templates/:id should return 404 for non-existent', async () => {
    const app = await createApp();
    const res = await request(app).put('/api/templates/nonexistent').send({
      html_content: '<h1>Updated</h1>',
      name: 'Updated'
    });
    expect(res.status).toBe(404);
  });

  it('DELETE /api/templates/:id should return 404 for non-existent', async () => {
    const app = await createApp();
    const res = await request(app).delete('/api/templates/nonexistent');
    expect(res.status).toBe(404);
  });
});
