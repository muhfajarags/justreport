# Setup & Installation

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- For Puppeteer (PDF generation), system dependencies may be required for Chromium. See [Puppeteer docs](https://pptr.dev/).

## Environment Variables

### Server (`server/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment mode |
| `PORT` | `9121` | Server port |
| `DATABASE_PATH` | `./database.db` | SQLite database file path |
| `UPLOAD_DIR` | `./storage/uploads` | Uploaded file storage directory |
| `REPORT_DIR` | `./storage/reports` | Generated PDF storage directory |
| `MAX_FILE_SIZE` | `10485760` | Max upload file size in bytes (10MB) |
| `CORS_ORIGIN` | `http://localhost:9120` | Allowed CORS origin |

## Installation

### 1. Server

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

The server starts on port 9121. On first run, it:
- Runs database migrations (creates `templates` and `reports` tables)
- Seeds default templates (Dashboard, Modern Analytics, Compact Report, etc.)
- Creates storage directories (`./storage/uploads`, `./storage/reports`)

### 2. Client

```bash
cd client
npm install
npm run dev
```

The client starts on port 9120 with Vite's dev server, proxying `/api` requests to the server.

### 3. Docker

```bash
docker-compose up --build
```

- Client (Nginx): http://localhost:80
- Server: http://localhost:5000

## Running Tests

```bash
# All tests
npm test

# Server tests only
npm run test:server

# Client tests only
npm run test:client

# E2E tests (Playwright)
npm run test:e2e
```
