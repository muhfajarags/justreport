# Server Architecture

## Tech Stack

- **Express.js** (web framework)
- **sql.js** (SQLite via WebAssembly)
- **Handlebars** (template engine)
- **Puppeteer** (HTML to PDF)
- **Multer** (file uploads)
- **PapaParse** (CSV parsing)
- **xlsx** (Excel parsing)
- **Vitest** + **Supertest** (testing)

## Directory Structure

```
server/src/
  api/
    middleware/
      errorHandler.js   # Global error handler + AppError class
      validateFile.js   # Multer config for data & HTML uploads
    routes/
      generate.js       # POST /api/generate - PDF generation
      preview.js        # POST /api/preview - template preview
      reports.js        # GET/DELETE /api/reports
      templates.js      # GET/POST/DELETE /api/templates
      upload.js         # POST /api/upload - file parsing
  config/
    constants.js        # PDF settings, allowed MIME types, limits
    database.js         # DB path, port, CORS, env config
  database/
    connection.js       # sql.js init, load/save/close DB
    migrations/
      001-create-templates.sql
      002-create-reports.sql
    seeds/
      defaultTemplates.js  # 8 built-in templates
  services/
    dedupService.js     # Content deduplication (SHA-256)
    fileParser.js       # Multi-format file parser
    pdfGenerator.js     # Puppeteer HTML-to-PDF
    templateEngine.js   # Handlebars compilation & rendering
  app.js                # Express app setup and startup
```

## Services

### templateEngine.js
- Compiles Handlebars templates with caching
- Registers helpers: `formatDate`, `currency` (IDR), `percentage`, `eq`, `gt`, `lt`
- Prepares data with `title`, `generatedDate`, `headers`, `rows`, `items`, `rowsRaw`

### pdfGenerator.js
- Launches headless Chromium via Puppeteer
- Renders HTML to A4 PDF with configurable margins

### fileParser.js
- Detects format by file extension and MIME type
- Supports JSON, CSV, TSV, XLSX, XLS
- Normalizes data (all values to strings, null to empty)
- Returns preview (first 5 rows), column info

### dedupService.js
- SHA-256 hashing of normalized HTML content
- Duplicate detection before insert
- Generates template IDs (`tpl-uuid`)

## Database Schema

### templates
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | Template ID (e.g., `tpl-dashboard`) |
| name | TEXT | Display name |
| html_content | TEXT | Handlebars template HTML |
| content_hash | TEXT UNIQUE | SHA-256 hash for dedup |
| is_default | INTEGER | 1 for built-in templates |
| thumbnail_url | TEXT | (unused) |
| created_at | TEXT | ISO datetime |
| last_used_at | TEXT | Last generation timestamp |
| created_by | TEXT | `system` or `user` |

### reports
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | Report ID (e.g., `rpt-uuid`) |
| name | TEXT | Report name |
| source_filename | TEXT | Original uploaded filename |
| template_id | TEXT FK | Reference to templates.id |
| pdf_path | TEXT | Filesystem path to PDF |
| file_size_kb | INTEGER | PDF file size in KB |
| row_count | INTEGER | Number of data rows |
| created_at | TEXT | ISO datetime |
| deleted_at | TEXT | Soft-delete timestamp |

## Error Handling

All routes wrap logic in `try/catch` and pass errors to `next(err)`. The global `errorHandler` middleware:

- Returns structured JSON errors: `{ "success": false, "error": "message" }`
- Handles Multer file size errors
- Handles JSON parse errors
- Logs unhandled 500 errors