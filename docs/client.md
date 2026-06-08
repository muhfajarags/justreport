# Client Architecture

## Tech Stack

- **React 18** with hooks
- **Vite** (build tool + dev server)
- **Tailwind CSS** (utility-first styling)
- **Zustand** (state management)
- **Axios** (HTTP client)
- **React Router v6** (routing)
- **CodeMirror** (template editor - removed)
- **Vitest** (unit testing)

## Directory Structure

```
client/src/
  api/
    client.js           # Axios instance with base config
  components/
    DataPreview.jsx     # Parsed data table preview
    FileUpload.jsx      # Drag & drop file upload
    LivePreview.jsx     # HTML preview iframe
    Navigation.jsx      # Top navigation bar
    ReportCard.jsx      # Report list card
    TemplateCard.jsx    # Template list card
    TemplatePicker.jsx  # Template selection grid
  hooks/
    useFileUpload.js    # File upload logic
    useReports.js       # Reports CRUD operations
    useTemplates.js     # Templates CRUD operations
  pages/
    GeneratorPage.jsx   # Main report generation page
    MyReportsPage.jsx   # Reports list with search/sort/paginate
    MyTemplatesPage.jsx # Templates management
  store/
    fileStore.js        # Uploaded file state
    reportStore.js      # Reports list state
    templateStore.js    # Templates list state
  styles/
    globals.css         # Tailwind directives
  App.jsx               # Router setup
  main.jsx              # App entry point
```

## Pages

### Generator Page (`/`)
The main workflow:
1. Upload a data file (CSV, JSON, TSV, XLSX, XLS)
2. Select a template from the gallery
3. View live preview
4. Generate and download PDF

### My Reports (`/reports`)
Lists generated reports with:
- Search by name/filename
- Sort by date, name, or size
- Pagination
- Preview, download, and soft-delete

### My Templates (`/templates`)
Manage custom templates:
- Upload HTML templates
- Delete custom templates
- View default templates (read-only)

## State Management (Zustand)

Three stores manage application state:

**fileStore**: Upload progress, parsed data, preview rows.

**templateStore**: Default/custom templates list, selected template, loading/error states.

**reportStore**: Reports list with pagination, sort, and search state.
