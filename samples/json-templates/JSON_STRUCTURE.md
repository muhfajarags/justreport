# JustReport JSON Schema

All data is converted to a standardized JSON format before being injected into templates.
The mechanism is simple: **JSON tags to Template placeholders**.

## Standard JSON Structure

{
  "metadata": {
    "title": "string",
    "subtitle": "string", 
    "generatedDate": "string",
    "reportDate": "string",
    "author": "string",
    "version": "string"
  },
  "content": {
    "summary": "string",
    "introduction": "string",
    "conclusion": "string",
    "notes": "string"
  },
  "metrics": [
    { "label": "string", "value": "any", "trend": "string", "change": "number" }
  ],
  "charts": [
    { "type": "bar|line", "title": "string", "data": [{ "label": "string", "value": "number" }] }
  ],
  "tables": [
    { "title": "string", "headers": ["string"], "rows": [["any"]] }
  ],
  "data": [ { ... } ],
  "headers": ["string"],
  "rows": [["any"]],
  "items": [ { ... } ]
}

## Placeholder Mapping

| JSON Path                    | Handlebars              | Usage          |
|------------------------------|-------------------------|----------------|
| metadata.title               | {{title}}               | Report title   |
| metadata.subtitle            | {{subtitle}}            | Subtitle       |
| metadata.generatedDate       | {{generatedDate}}       | Date           |
| content.summary              | {{summary}}             | Summary text   |
| metrics[].value              | {{this.value}}          | KPI values     |
| charts[].data[].value        | {{this.value}}          | Chart values   |
| tables[].headers             | {{this}}                | Table headers  |
| tables[].rows                | {{this}}                | Table row data |

All input formats (flat array, object, standard JSON) are auto-converted to this schema.
