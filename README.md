# JustReport

A powerful and flexible report generation platform that allows users to create, manage, and schedule reports with various data sources and templates.

## Features

- **Dynamic Report Generation**: Create reports from CSV, JSON, and API data sources
- **Template System**: Design custom templates with charts, tables, and text elements
- **Live Preview**: See your reports in real-time as you build them
- **Data Upload**: Upload and manage your data files
- **Template Library**: Save and reuse your favorite templates
- **Report Management**: Organize and manage your generated reports

## Tech Stack

### Frontend
- React
- Tailwind CSS
- Chart.js for data visualization

### Backend
- Node.js with Express
- File upload and processing
- Template engine for report generation

### Database
- MongoDB (for user data, templates, and reports)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/justreport.git
   cd justreport
   ```

2. **Install dependencies**
   ```bash
   # Install both client and server dependencies
   npm run install:all
   # Or separately
   cd client && npm install
   cd ../server && npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp server/.env.example server/.env
   
   # Edit the environment variables
   nano server/.env
   ```
   
   Required environment variables:
   ```
   PORT=9120
   MONGODB_URI=mongodb://localhost:27017/justreport
   JWT_SECRET=your-jwt-secret-key
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker (recommended)
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or start MongoDB service based on your OS
   # macOS: brew services start mongodb-community
   # Linux: sudo systemctl start mongodb
   # Windows: net start MongoDB
   ```

5. **Start the development servers**
   ```bash
   # Start both client and server
   npm run dev:all
   
   # Or start separately
   # Terminal 1: Start server
   cd server && npm run dev
   
   # Terminal 2: Start client
   cd client && npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:9120
   - API Documentation: http://localhost:9120/docs (coming soon)

## Project Structure

```
justreport/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── styles/        # Global styles
│   │   └── App.jsx        # Main App component
│   └── public/            # Static files
├── server/                # Node.js backend
│   ├── src/
│   │   ├── api/          # API routes
│   │   ├── services/     # Business logic services
│   │   ├── database/     # Database models and seeds
│   │   └── middlewares/  # Custom middlewares
│   ├── storage/          # File storage (uploads)
│   └── tests/           # Test files
├── samples/              # Sample data and templates
├── roadmap.md           # Development roadmap
└── target.md            # Project goals and objectives
```

## Usage

### Creating a Report

1. **Upload Data**: Go to the Generator page and upload your CSV or JSON file
2. **Preview Data**: Review your uploaded data in the preview section
3. **Choose Template**: Select from existing templates or create a new one
4. **Customize**: Add charts, tables, and text elements to your template
5. **Generate Report**: Click "Generate Report" to create your report
6. **Download**: Download the generated report in your preferred format

### Creating Templates

1. **Template Editor**: Use the template editor to design your report layout
2. **Add Elements**:
   - **Charts**: Pie charts, bar charts, line charts from your data
   - **Tables**: Display your data in tabular format
   - **Text**: Add titles, descriptions, and custom text
3. **Save Template**: Save your template for future use

### Managing Reports

1. **My Reports**: Access all your generated reports
2. **Filter and Search**: Find reports by date or name
3. **Download**: Download reports in various formats
4. **Delete**: Remove reports you no longer need

## Development

### Available Scripts

```bash
# Client-side (React)
cd client
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Run ESLint

# Server-side (Node.js)
cd server
npm run dev        # Start development server with auto-reload
npm start         # Start production server
npm test          # Run tests
npm run lint      # Run ESLint

# Both (Project root)
npm run dev:all    # Start both client and server
npm run install:all # Install all dependencies
```

### Testing

```bash
# Run client tests
npm test

# Run server tests
cd server && npm test

# Run all tests
npm run test:all
```

## Current Status

This project is currently in active development. Check the [roadmap.md](roadmap.md) for the development timeline and upcoming features.

### Completed Features
- [x] Basic report generation from CSV/JSON data
- [x] Template system with live preview
- [x] File upload and data preview
- [x] Basic chart and table components
- [x] Report management (save, view, download)

### In Development
- [ ] User authentication system
- [ ] Report scheduling system
- [ ] API endpoint integration
- [ ] Docker containerization
- [ ] Library packages (Node.js and Python)

### Planned Features
- [ ] Interactive API documentation
- [ ] Email delivery of scheduled reports
- [ ] Advanced template editor
- [ ] More chart types and customization options
- [ ] Multi-tenant support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/your-username/justreport/issues) page
2. Create a new issue if your problem hasn't been reported yet
3. For general inquiries, email: support@justreport.com

## Roadmap

Check the [roadmap.md](roadmap.md) file for detailed development plans and timeline.

---

**JustReport** - Making report generation simple and powerful. 🚀