CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  html_content TEXT NOT NULL,
  content_hash TEXT NOT NULL UNIQUE,
  is_default INTEGER DEFAULT 0,
  thumbnail_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  last_used_at TEXT,
  created_by TEXT DEFAULT 'system'
);

CREATE INDEX IF NOT EXISTS idx_templates_hash ON templates(content_hash);
CREATE INDEX IF NOT EXISTS idx_templates_is_default ON templates(is_default);
