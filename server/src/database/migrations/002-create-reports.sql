CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  source_filename TEXT NOT NULL,
  template_id TEXT NOT NULL,
  pdf_path TEXT NOT NULL,
  file_size_kb INTEGER,
  row_count INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  deleted_at TEXT,
  FOREIGN KEY (template_id) REFERENCES templates(id)
);

CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_template_id ON reports(template_id);
