# JustReport 📊

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green)

**JustReport** is a powerful and flexible report generation platform that allows users to create, manage, and schedule reports with various data sources and templates. Build stunning reports from CSV, JSON, and Excel files with a modern, intuitive interface.

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/Express-4.19-000000?logo=express" alt="Express">
  <img src="https://img.shields.io/badge/MongoDB-Latest-47A248?logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss" alt="Tailwind">
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📁 **Multi-Format Data Import** | Upload and process CSV, JSON, and Excel (.xlsx) files |
| 🎨 **Template System** | Design custom templates with charts, tables, and text elements |
| 👁️ **Live Preview** | See your reports in real-time as you build them |
| 📊 **Data Visualization** | Interactive charts with Chart.js integration |
| 📦 **File Management** | Upload, preview, and manage your data files |
| 📝 **Template Library** | Save and reuse your favorite templates |
| 📥 **Report Management** | Organize, view, and download generated reports |
| 🔄 **Auto-Refresh** | Watch mode for real-time development |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Lightning fast build tool
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Beautiful data visualization
- **Zustand** - Lightweight state management
- **CodeMirror** - Template code editor
- **Axios** - HTTP client

### Backend
- **Node.js** with **Express**
- **Handlebars** - Template engine
- **Multer** - File upload handling
- **PapaParse** - CSV parsing
- **SQL.js** - SQLite in the browser
- **Puppeteer** - PDF generation
- **xlsx** - Excel file processing

### Database & Tools
- **MongoDB** - User data, templates, and reports
- **Vitest** - Unit testing
- **Playwright** - E2E testing

---

## 🚀 Getting Started

### Prerequisites

- Node.js **v16 or higher**
- MongoDB **v4.4 or higher**
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/muhfajarags/justreport.git
cd justreport

# Install all dependencies
npm run install:all

# Or install separately
cd client && npm install
cd ../server && npm install
```

### Configuration

```bash
# Copy environment file
cp server/.env.example server/.env

# Edit with your settings
nano server/.env
```

**Required variables:**

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `9120` | Server port |
| `MONGODB_URI` | `mongodb://localhost:27017/justreport` | MongoDB connection string |
| `JWT_SECRET` | - | Secret key for JWT tokens |

### Running the Application

```bash
# Start both client and server (recommended)
npm run dev:all

# Or run separately
# Terminal 1 - Server
cd server && npm run dev

# Terminal 2 - Client
cd client && npm run dev
```

### Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:9120 |

---

## 📁 Project Structure

```
justreport/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── styles/           # Global styles
│   │   └── App.jsx          # Main application
│   └── public/              # Static assets
│
├── server/                    # Node.js backend
│   ├── src/
│   │   ├── api/             # API routes
│   │   ├── services/        # Business logic
│   │   ├── database/        # Models & seeds
│   │   └── middlewares/     # Express middlewares
│   ├── storage/             # File uploads
│   └── tests/              # Server tests
│
├── samples/                   # Sample data
├── .github/                   # GitHub workflows
├── LICENSE                    # MIT License
└── README.md                  # This file
```

---

## 📖 Usage Guide

### Creating a Report

```
1️⃣  Upload Data
    └─ Go to Generator → Upload CSV, JSON, or Excel file

2️⃣  Preview Data  
    └─ Review your data in the preview section

3️⃣  Choose Template
    └─ Select from library or create new

4️⃣  Customize
    └─ Add charts, tables, and text elements

5️⃣  Generate
    └─ Click "Generate Report" to create

6️⃣  Download
    └─ Download in your preferred format
```

### Creating Templates

```javascript
// Example template structure
{
  "name": "Monthly Sales Report",
  "elements": [
    { "type": "chart", "chartType": "bar", "dataKey": "sales" },
    { "type": "table", "columns": ["Date", "Amount", "Status"] },
    { "type": "text", "content": "Monthly Sales Summary" }
  ]
}
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Server tests only
npm run test:server

# Client tests only
npm run test:client

# E2E tests
npm run test:e2e
```

---

## 🔄 Available Scripts

### Root Level
| Command | Description |
|---------|-------------|
| `npm run install:all` | Install all dependencies |
| `npm run dev:all` | Start client and server |
| `npm test` | Run all tests |

### Client (`/client`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

### Server (`/server`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start with watch mode |
| `npm start` | Start production server |

---

## 📊 Project Status

### ✅ Completed
- [x] Dynamic report generation from CSV/JSON/Excel
- [x] Template system with live preview
- [x] File upload and data preview
- [x] Chart and table components
- [x] Report management (save, view, download)
- [x] MIT License

### 🚧 In Development
- [ ] User authentication system
- [ ] Report scheduling
- [ ] API endpoint integration
- [ ] Docker containerization

### 📋 Planned
- [ ] Email report delivery
- [ ] Advanced template editor
- [ ] Multi-tenant support
- [ ] Library packages (Node.js & Python)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m 'Add amazing feature'

# 4. Push to the branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies.

**JustReport** — Making report generation simple and powerful. 🚀

[![GitHub Stars](https://img.shields.io/github/stars/muhfajarags/justreport?style=social)](https://github.com/muhfajarags/justreport)
[![GitHub Forks](https://img.shields.io/github/forks/muhfajarags/justreport?style=social)](https://github.com/muhfajarags/justreport)