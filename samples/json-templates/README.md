# JustReport - JSON Template Samples

All data flows through a single pipeline:

    Input (CSV/Excel/JSON/API) -> convertToStandardJSON() -> mapJSONToTemplate() -> Handlebars Render

## How It Works

1. **Convert**: Any input format is converted to a standardized JSON structure
2. **Map**: JSON fields are mapped to Handlebars template placeholders  
3. **Render**: Placeholders are filled with data to produce HTML

## JSON Schema

### metadata (text output)
```
{{title}}         -> Report title
{{subtitle}}      -> Subtitle
{{generatedDate}} -> Date string
{{reportDate}}    -> Report period
{{author}}        -> Author name
{{version}}       -> Version string
```

### content (text output)
```
{{summary}}       -> Summary paragraph
{{introduction}}  -> Introduction text
{{conclusion}}    -> Conclusion text
{{notes}}         -> Additional notes
```

### metrics (KPI cards)
```
{{#each metrics}}
  {{this.label}}   -> Metric name
  {{this.value}}   -> Metric value
  {{this.trend}}   -> Trend indicator
  {{this.change}}  -> Numeric change value
{{/each}}
```

### charts (bar/line visualization)
```
{{#each charts}}
  {{this.type}}    -> "bar" or "line"
  {{this.title}}   -> Chart title
  {{#each this.data}}
    {{this.label}} -> Bar/point label
    {{this.value}} -> Bar/point value
  {{/each}}
{{/each}}
```

### tables (data grid)
```
{{#each tables}}
  {{this.title}}    -> Table title
  {{#each this.headers}}
    {{this}}        -> Column header text
  {{/each}}
  {{#each this.rows}}
    {{#each this}}
      {{this}}      -> Cell value
    {{/each}}
  {{/each}}
{{/each}}
```

### legacy (flat array compatibility)
```
{{headers}}        -> Column names array
{{rows}}           -> Row values 2D array
{{items}}          -> Raw object array
{{#each items}}{{@key}}: {{this}}{{/each}}
```

### invoice (special fields)
```
{{invoiceNumber}}  -> Invoice number
{{invoiceDate}}    -> Invoice date
{{total}}          -> Total amount
{{#each items}}
  {{this.name}}    -> Item name
  {{this.qty}}     -> Quantity
  {{this.price}}   -> Unit price
  {{this.amount}}  -> Line total
{{/each}}
```

## Sample Files

| File | Description |
|------|-------------|
| sample-full-report.json | Complete report: text + charts + tables |
| sample-flat-data.json | Flat array (simulates CSV/Excel upload) |
| sample-invoice.json | Invoice with line items |
