# Architecture

## Overview

JustReport is a full-stack JavaScript application split into two main parts:

- **Client** (`client/`): React single-page application built with Vite, Tailwind CSS, and Zustand for state management.
- **Server** (`server/`): Express.js REST API with SQLite (via sql.js) for data persistence and Puppeteer for PDF generation.

Both services run independently and communicate via HTTP. In development, Vite proxies `/api` requests to the Express server.

## Data Flow

```
User Uploads File (CSV/JSON/XLSX)
        |
        v
  Client -> POST /api/upload -> fileParser -> parsed data
        |
        v
  User Selects Template
        |
        v
  Client -> POST /api/preview -> templateEngine renders HTML
        |
        v
  User Generates PDF
        |
        v
  Client -> POST /api/generate -> templateEngine + puppeteer -> PDF
        |
        v
  PDF saved to storage, report record created
```

## Key Design Decisions

- **sql.js** (SQLite compiled to WebAssembly): Zero-dependency database, no separate DB server needed. Data is persisted to a single file (`database.db`).
- **Handlebars**: Templates use Handlebars syntax for data interpolation and iteration.
- **Puppeteer**: Renders HTML to PDF via headless Chromium.
- **Zustand**: Lightweight state management for React, no boilerplate.
- **Vite**: Fast dev server with HMR and API proxy.
