# JustReport

A web application for generating PDF reports from structured data (CSV, JSON, XLSX) using customizable HTML templates.

## Project Structure

```
justreport/
  client/          # React frontend (Vite)
  server/          # Express backend API
  docs/            # Documentation
  e2e/             # Playwright end-to-end tests
  docker-compose.yml
```

## Quick Start

```bash
# Server
cd server
cp .env.example .env
npm install
npm run dev

# Client (separate terminal)
cd client
npm install
npm run dev
```

- Client: http://localhost:9120
- Server: http://localhost:9121
- API Health: http://localhost:9121/api/health

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](architecture.md) | System architecture overview |
| [Setup & Installation](setup.md) | Detailed setup guide |
| [API Reference](api.md) | REST API endpoints |
| [Client](client.md) | Frontend architecture |
| [Server](server.md) | Backend architecture |
| [Features](features.md) | Features guide |
