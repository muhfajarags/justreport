# API Reference

Base URL: `/api`

## Health Check

```
GET /api/health
```

Response:
```json
{
  "success": true,
  "status": "ok",
  "time": "2026-06-07T12:00:00.000Z"
}
```

## File Upload

```
POST /api/upload
Content-Type: multipart/form-data

Body: file (JSON, CSV, TSV, XLSX, XLS)
```

Response:
```json
{
  "success": true,
  "data": {
    "filename": "data.csv",
    "format": "tabular",
    "rows": 100,
    "columns": 5,
    "columnNames": ["Name", "Age", ...],
    "preview": [...],
    "allData": [...]
  }
}
```

## Template Preview

```
POST /api/preview
Content-Type: application/json

{
  "template_id": "tpl-dashboard",
  "data": [...]
}
```

Response:
```json
{
  "success": true,
  "html": "<!DOCTYPE html>..."
}
```

## PDF Generation

```
POST /api/generate
Content-Type: application/json

{
  "report_name": "My Report",
  "template_id": "tpl-dashboard",
  "data": [...],
  "save_template": true
}
```

Response: `application/pdf` binary stream.

## Templates

### List Templates

```
GET /api/templates
```

Response:
```json
{
  "success": true,
  "defaults": [...],
  "custom": [...]
}
```

### Get Single Template

```
GET /api/templates/:id
```

### Upload Template

```
POST /api/templates
Content-Type: multipart/form-data

Body: file (.html or .htm), name (optional)
```

### Delete Template

```
DELETE /api/templates/:id
```

Note: Default templates cannot be deleted.

## Reports

### List Reports

```
GET /api/reports?sort=date&order=desc&search=&page=1&limit=20
```

Query Parameters:
| Param | Default | Description |
|-------|---------|-------------|
| `sort` | `date` | Sort by: `date`, `name`, `size` |
| `order` | `desc` | Sort order: `asc`, `desc` |
| `search` | `` | Search by name or source filename |
| `page` | `1` | Page number |
| `limit` | `20` | Items per page (max 100) |

### Download Report

```
GET /api/reports/:id/download
```

Response: `application/pdf` binary stream.

### Delete Report

```
DELETE /api/reports/:id
```

Note: Reports use soft-delete (sets `deleted_at` timestamp).
