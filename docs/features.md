# Features

## Data Upload

Upload data files in multiple formats:
- **CSV** (.csv, .txt)
- **JSON** (.json)
- **TSV** (.tsv)
- **Excel** (.xlsx, .xls)

Files up to 10MB are supported. Data is parsed server-side and returned as structured rows with column headers.

## Template System

### Default Templates
8 built-in templates with distinct styles:
1. **Dashboard** - Gradient header, colorful table with KPIs
2. **Modern Analytics** - KPI cards, card-based layout, badges
3. **Compact Report** - Dense layout for printing, minimal styling
4. **Simple Table** - Clean bordered table
5. **Summary Card** - Grid of metric cards
6. **Invoice** - Professional invoice layout with currency formatting
7. **Business Report** - Serif font, formal cover page
8. **Minimal List** - Clean list view

### Custom Templates
Users can upload their own `.html` files as templates. These are stored in the database and available alongside default templates.

Template actions:
- **Upload**: Submit an `.html` or `.htm` file
- **Delete**: Remove custom templates (default templates are protected)

Templates use **Handlebars** syntax for data binding:
- `{{title}}`, `{{generatedDate}}` - Auto-injected variables
- `{{#each rows}}...{{/each}}` - Iterate over data rows
- `{{#each headers}}...{{/each}}` - Iterate over column headers
- `{{formatDate date}}` - Date formatting helper
- `{{currency value}}` - IDR currency formatting helper
- `{{percentage value}}` - Percentage formatting helper
- `{{eq a b}}`, `{{gt a b}}`, `{{lt a b}}` - Comparison helpers

Data context passed to templates:
- `title`: "Report"
- `generatedDate`: Current date in Indonesian locale
- `headers`: Array of column names
- `rows`: 2D array of row values
- `items`: Array of row objects
- `rowsRaw`: Same as `items`

## PDF Generation

1. Upload data file
2. Select a template
3. View live preview (auto-updates on selection)
4. Enter report name
5. Generate PDF (downloads automatically)

PDF settings:
- A4 page size
- 20mm top/bottom, 15mm left/right margins
- Background graphics printed

## Template Deduplication

When uploading or generating with custom templates, the system checks for duplicate content using SHA-256 hashing. If identical template content already exists, the operation is rejected with a 409 Conflict error.

## Reports Management

- **List**: Paginated, sortable, searchable report list
- **Preview**: In-app PDF preview modal
- **Download**: Direct PDF download
- **Delete**: Soft-delete (sets `deleted_at` timestamp, data remains in database)

## Docker Deployment

The project includes a `docker-compose.yml` for production deployment:
- **Server**: Express API with persistent volume for database and storage
- **Client**: Nginx serving built React app, proxying API requests

Environment variables control server configuration (port, database path, storage directories, CORS origin).
