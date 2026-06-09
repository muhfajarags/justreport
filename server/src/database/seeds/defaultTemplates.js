const { v4: uuidv4 } = require('uuid');

const defaultTemplates = [
  {
    id: 'tpl-full-report',
    name: 'Full Report (Text + Chart + Table)',
    is_default: 1,
    html_content: `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f8fafc; color: #1e293b; padding: 30px; }
    .container { max-width: 1000px; margin: 0 auto; }

    /* Header */
    .header { background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 24px; }
    .header h1 { font-size: 26px; font-weight: 700; margin-bottom: 6px; }
    .header .subtitle { font-size: 14px; opacity: 0.9; }
    .header .meta { display: flex; gap: 20px; margin-top: 12px; font-size: 12px; opacity: 0.8; }

    /* Content / Text sections */
    .content-section { background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .content-section h2 { font-size: 16px; font-weight: 600; color: #334155; margin-bottom: 12px; border-left: 4px solid #7c3aed; padding-left: 12px; }
    .content-section p { font-size: 14px; line-height: 1.7; color: #475569; }

    /* Metrics / KPI Cards */
    .metrics-row { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
    .metric-card { flex: 1; min-width: 140px; background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); text-align: center; }
    .metric-card .metric-value { font-size: 28px; font-weight: 700; color: #0f172a; }
    .metric-card .metric-label { font-size: 12px; color: #94a3b8; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    .metric-card .metric-trend-up { color: #16a34a; font-size: 13px; font-weight: 600; margin-top: 6px; }
    .metric-card .metric-trend-down { color: #dc2626; font-size: 13px; font-weight: 600; margin-top: 6px; }

    /* Chart sections - SVG bar/line rendering */
    .chart-section { background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .chart-section h2 { font-size: 16px; font-weight: 600; color: #334155; margin-bottom: 16px; border-left: 4px solid #3b82f6; padding-left: 12px; }
    .chart-container { width: 100%; margin: 0 auto; }
    .bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 200px; padding: 0 10px; border-bottom: 2px solid #e2e8f0; }
    .bar-item { flex: 1; display: flex; flex-direction: column; align-items: center; }
    .bar-fill { width: 100%; max-width: 60px; background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 6px 6px 0 0; min-height: 4px; transition: height 0.3s; position: relative; }
    .bar-fill .bar-value { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 600; color: #334155; white-space: nowrap; }
    .bar-label { margin-top: 8px; font-size: 11px; color: #64748b; text-align: center; word-break: break-word; }
    .chart-row { display: flex; gap: 20px; }
    .chart-row .chart-section { flex: 1; }

    /* Line chart via SVG */
    .line-chart svg { width: 100%; height: 180px; }
    .line-chart .line { fill: none; stroke: #3b82f6; stroke-width: 3; }
    .line-chart .dot { fill: #3b82f6; }
    .line-chart .line-label { font-size: 11px; fill: #64748b; }
    .line-chart .line-value { font-size: 10px; fill: #334155; font-weight: 600; }

    /* Table sections */
    .table-section { background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .table-section h2 { font-size: 16px; font-weight: 600; color: #334155; margin-bottom: 16px; border-left: 4px solid #10b981; padding-left: 12px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f1f5f9; padding: 10px 14px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600; border-bottom: 2px solid #e2e8f0; }
    td { padding: 10px 14px; font-size: 13px; border-bottom: 1px solid #f1f5f9; color: #334155; }
    tr:hover td { background: #f8fafc; }
    tr:nth-child(even) td { background: #fafbfc; }

    /* Footer */
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #94a3b8; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">

    <!-- HEADER: mapped from metadata -->
    <div class="header">
      <h1>{{title}}</h1>
      {{#if subtitle}}<div class="subtitle">{{subtitle}}</div>{{/if}}
      <div class="meta">
        <span>{{generatedDate}}</span>
        {{#if author}}<span>Author: {{author}}</span>{{/if}}
      </div>
    </div>

    <!-- TEXT: mapped from content.summary -->
    {{#if summary}}
    <div class="content-section">
      <h2>Summary</h2>
      <p>{{summary}}</p>
    </div>
    {{/if}}

    {{#if introduction}}
    <div class="content-section">
      <h2>Introduction</h2>
      <p>{{introduction}}</p>
    </div>
    {{/if}}

    <!-- METRICS: mapped from metrics[] -->
    {{#if metrics}}
    <div class="metrics-row">
      {{#each metrics}}
      <div class="metric-card">
        <div class="metric-value">{{this.value}}</div>
        <div class="metric-label">{{this.label}}</div>
        {{#if this.trend}}
          {{#if (gt this.change 0)}}
          <div class="metric-trend-up">{{this.trend}}</div>
          {{else}}
          <div class="metric-trend-down">{{this.trend}}</div>
          {{/if}}
        {{/if}}
      </div>
      {{/each}}
    </div>
    {{/if}}

    <!-- CHARTS: mapped from charts[] - renders as visual bars -->
    {{#if charts}}
    <div class="chart-row">
      {{#each charts}}
      <div class="chart-section">
        <h2>{{this.title}}</h2>
        <div class="chart-container">
          {{#eq this.type "bar"}}
            {{#if (maxValue this.data)}}
          <div class="bar-chart">
            {{#each this.data}}
            <div class="bar-item">
              <div class="bar-fill" style="height: {{barHeight this.value (maxValue ../this.data)}}%;">
                <span class="bar-value">{{this.value}}</span>
              </div>
              <div class="bar-label">{{this.label}}</div>
            </div>
            {{/each}}
          </div>
            {{/if}}
          {{/eq}}
          {{#eq this.type "line"}}
          <div class="line-chart">
            <svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMid meet">
              <line x1="40" y1="160" x2="380" y2="160" stroke="#e2e8f0" stroke-width="1"/>
              <line x1="40" y1="20" x2="40" y2="160" stroke="#e2e8f0" stroke-width="1"/>
              {{#each this.data}}
              <circle cx="{{this.x}}" cy="{{this.y}}" r="5" class="dot"/>
              <text x="{{this.x}}" y="175" class="line-label" text-anchor="middle">{{this.label}}</text>
              <text x="{{this.x}}" y="{{math this.y '-' 10}}" class="line-value" text-anchor="middle">{{this.value}}</text>
              {{/each}}
            </svg>
          </div>
          {{/eq}}
        </div>
      </div>
      {{/each}}
    </div>
    {{/if}}

    <!-- TABLES: mapped from tables[] -->
    {{#if tables}}
    {{#each tables}}
    <div class="table-section">
      <h2>{{this.title}}</h2>
      <table>
        <thead>
          <tr>{{#each this.headers}}<th>{{this}}</th>{{/each}}</tr>
        </thead>
        <tbody>
          {{#each this.rows}}
          <tr>{{#each this}}<td>{{this}}</td>{{/each}}</tr>
          {{/each}}
        </tbody>
      </table>
    </div>
    {{/each}}
    {{/if}}

    <!-- LEGACY: fallback for flat data arrays -->
    {{#if items}}
    {{#unless tables}}
    <div class="table-section">
      <h2>Data Overview ({{items.length}} records)</h2>
      <table>
        <thead>
          <tr>{{#each headers}}<th>{{this}}</th>{{/each}}</tr>
        </thead>
        <tbody>
          {{#each items}}
          <tr>{{#each this}}<td>{{this}}</td>{{/each}}</tr>
          {{/each}}
        </tbody>
      </table>
    </div>
    {{/unless}}
    {{/if}}

    {{#if conclusion}}
    <div class="content-section">
      <h2>Conclusion</h2>
      <p>{{conclusion}}</p>
    </div>
    {{/if}}

    {{#if notes}}
    <div class="content-section">
      <h2>Notes</h2>
      <p>{{notes}}</p>
    </div>
    {{/if}}

    <div class="footer">
      Generated by JustReport &mdash; {{generatedDate}}
      {{#if version}} &bull; v{{version}}{{/if}}
    </div>

  </div>
</body>
</html>`
  },
  {
    id: 'tpl-dashboard',
    name: 'Dashboard',
    is_default: 1,
    html_content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, sans-serif; margin: 30px; color: #2d3748; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 10px; margin-bottom: 25px; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 5px 0 0; opacity: 0.9; }
    .section { margin-bottom: 20px; }
    .section h2 { color: #4a5568; font-size: 18px; border-left: 4px solid #667eea; padding-left: 12px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th { background: #667eea; color: white; padding: 12px; text-align: left; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
    tr:nth-child(even) td { background: #f7fafc; }
    .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 2px solid #e2e8f0; color: #a0aec0; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{title}}</h1>
    <p>{{subtitle}} &mdash; {{generatedDate}}</p>
  </div>
  {{#each sections}}
  <div class="section">
    <h2>{{this.title}}</h2>
    <table>
      <thead>
        <tr>{{#each this.headers}}<th>{{this}}</th>{{/each}}</tr>
      </thead>
      <tbody>
        {{#each this.rows}}
        <tr>{{#each this}}<td>{{this}}</td>{{/each}}</tr>
        {{/each}}
      </tbody>
    </table>
  </div>
  {{/each}}
  <div class="footer">Generated by JustReport &mdash; {{generatedDate}}</div>
</body>
</html>`
  },
  {
    id: 'tpl-analytics',
    name: 'Modern Analytics',
    is_default: 1,
    html_content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', 'Segoe UI', sans-serif; margin: 0; padding: 0; background: #f8fafc; color: #1e293b; }
    .container { max-width: 1000px; margin: 0 auto; padding: 30px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
    .header h1 { font-size: 24px; font-weight: 700; margin: 0; }
    .header .date { color: #94a3b8; font-size: 13px; }
    .kpi-row { display: flex; gap: 15px; margin-bottom: 25px; }
    .kpi-card { flex: 1; background: white; border-radius: 12px; padding: 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .kpi-card .value { font-size: 28px; font-weight: 700; color: #0f172a; }
    .kpi-card .label { font-size: 12px; color: #94a3b8; margin-top: 4px; }
    .kpi-card .trend-up { color: #22c55e; font-size: 13px; }
    .kpi-card .trend-down { color: #ef4444; font-size: 13px; }
    .card { background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .card h2 { font-size: 16px; font-weight: 600; margin: 0 0 15px 0; color: #334155; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; border-bottom: 2px solid #f1f5f9; }
    td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 500; }
    .badge-green { background: #dcfce7; color: #16a34a; }
    .badge-yellow { background: #fef9c3; color: #ca8a04; }
    .badge-red { background: #fee2e2; color: #dc2626; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>{{title}}</h1>
      <span class="date">{{generatedDate}}</span>
    </div>
    {{#if metrics}}
    <div class="kpi-row">
      {{#each metrics}}
      <div class="kpi-card">
        <div class="value">{{this.value}}</div>
        <div class="label">{{this.label}}</div>
        {{#if this.trend}}<div class="trend-up">{{this.trend}}</div>{{/if}}
      </div>
      {{/each}}
    </div>
    {{/if}}
    <div class="card">
      <h2>Data Overview</h2>
      <table>
        <thead>
          <tr>{{#each headers}}<th>{{this}}</th>{{/each}}</tr>
        </thead>
        <tbody>
          {{#each rows}}
          <tr>{{#each this}}<td>{{this}}</td>{{/each}}</tr>
          {{/each}}
        </tbody>
      </table>
    </div>
    {{#if items}}
    <div class="card">
      <h2>Detail Records ({{items.length}} items)</h2>
      <table>
        <thead>
          <tr>{{#each headers}}<th>{{this}}</th>{{/each}}</tr>
        </thead>
        <tbody>
          {{#each items}}
          <tr>
            {{#each this}}
            <td>{{this}}</td>
            {{/each}}
          </tr>
          {{/each}}
        </tbody>
      </table>
    </div>
    {{/if}}
  </div>
</body>
</html>`
  },
  {
    id: 'tpl-compact',
    name: 'Compact Report',
    is_default: 1,
    html_content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica', Arial, sans-serif; margin: 15px; font-size: 10px; color: #222; }
    .header { border-bottom: 2px solid #333; padding-bottom: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; }
    .header h1 { font-size: 16px; margin: 0; }
    .header .meta { text-align: right; font-size: 9px; color: #666; }
    table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 9px; }
    th { background: #333; color: white; padding: 5px 6px; text-align: left; font-size: 8px; text-transform: uppercase; letter-spacing: 0.3px; }
    td { padding: 4px 6px; border-bottom: 1px solid #ddd; }
    tr:nth-child(even) td { background: #fafafa; }
    .summary { display: flex; gap: 10px; margin: 10px 0; flex-wrap: wrap; }
    .stat { flex: 1; min-width: 100px; background: #f5f5f5; padding: 8px 10px; border-radius: 4px; }
    .stat .num { font-size: 14px; font-weight: bold; }
    .stat .lbl { font-size: 8px; color: #888; text-transform: uppercase; }
    .footer { margin-top: 15px; padding-top: 6px; border-top: 1px solid #ddd; font-size: 8px; color: #999; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{title}}</h1>
    <div class="meta">{{reportDate}}<br>{{#if subtitle}}{{subtitle}}{{/if}}</div>
  </div>
  {{#if summary}}
  <p style="margin:10px 0;font-size:9px;color:#555;">{{summary}}</p>
  {{/if}}
  {{#if metrics}}
  <div class="summary">
    {{#each metrics}}
    <div class="stat">
      <div class="num">{{this.value}}</div>
      <div class="lbl">{{this.label}}</div>
    </div>
    {{/each}}
  </div>
  {{/if}}
  <table>
    <thead>
      <tr>{{#each headers}}<th>{{this}}</th>{{/each}}</tr>
    </thead>
    <tbody>
      {{#each rows}}
      <tr>{{#each this}}<td>{{this}}</td>{{/each}}</tr>
      {{/each}}
    </tbody>
  </table>
  <div class="footer">Generated by JustReport on {{generatedDate}} &bull; Page 1/1</div>
</body>
</html>`
  },
  {
    id: 'tpl-simple-table',
    name: 'Simple Table',
    is_default: 1,
    html_content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #f5f5f5; border: 1px solid #ddd; padding: 8px; text-align: left; }
    td { border: 1px solid #ddd; padding: 8px; }
    tr:nth-child(even) { background: #fafafa; }
  </style>
</head>
<body>
  <h1>{{title}}</h1>
  <p>Generated: {{generatedDate}}</p>
  <table>
    <thead>
      <tr>
        {{#each headers}}<th>{{this}}</th>{{/each}}
      </tr>
    </thead>
    <tbody>
      {{#each rows}}
      <tr>
        {{#each this}}<td>{{this}}</td>{{/each}}
      </tr>
      {{/each}}
    </tbody>
  </table>
</body>
</html>`
  },
  {
    id: 'tpl-summary-card',
    name: 'Summary Card',
    is_default: 1,
    html_content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f9f9f9; }
    .container { max-width: 800px; margin: 0 auto; }
    .header { background: #2c3e50; color: white; padding: 20px; border-radius: 8px; }
    .header h1 { margin: 0 0 5px 0; }
    .header p { margin: 0; opacity: 0.85; }
    .cards { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
    .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .card-value { font-size: 32px; font-weight: bold; color: #2c3e50; }
    .card-label { color: #7f8c8d; margin-top: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>{{title}}</h1>
      <p>{{subtitle}}</p>
    </div>
    <div class="cards">
      {{#each metrics}}
      <div class="card">
        <div class="card-value">{{this.value}}</div>
        <div class="card-label">{{this.label}}</div>
      </div>
      {{/each}}
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'tpl-invoice',
    name: 'Invoice',
    is_default: 1,
    html_content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .logo { font-size: 24px; font-weight: bold; color: #2c3e50; }
    .invoice-info { text-align: right; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #f0f0f0; border-bottom: 2px solid #333; padding: 10px; text-align: left; }
    td { border-bottom: 1px solid #ddd; padding: 10px; }
    .total-row td { font-weight: bold; background: #f0f0f0; border-top: 2px solid #333; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">INVOICE</div>
    <div class="invoice-info">
      <p>Invoice #: {{invoiceNumber}}</p>
      <p>Date: {{invoiceDate}}</p>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      {{#each items}}
      <tr>
        <td>{{this.name}}</td>
        <td>{{this.qty}}</td>
        <td>{{currency this.price}}</td>
        <td>{{currency this.amount}}</td>
      </tr>
      {{/each}}
      <tr class="total-row">
        <td colspan="3">TOTAL</td>
        <td>{{currency total}}</td>
      </tr>
    </tbody>
  </table>
</body>
</html>`
  },
  {
    id: 'tpl-report-header',
    name: 'Business Report',
    is_default: 1,
    html_content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Georgia', serif; margin: 30px; color: #333; }
    .cover { text-align: center; padding: 60px 20px; border-bottom: 3px solid #2c3e50; margin-bottom: 30px; }
    .cover h1 { font-size: 32px; color: #2c3e50; margin-bottom: 10px; }
    .cover .subtitle { font-size: 18px; color: #7f8c8d; }
    .section { margin-bottom: 25px; }
    .section h2 { color: #2c3e50; border-bottom: 2px solid #ecf0f1; padding-bottom: 5px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th { background: #2c3e50; color: white; padding: 10px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #ecf0f1; }
    tr:nth-child(even) td { background: #f9f9f9; }
  </style>
</head>
<body>
  <div class="cover">
    <h1>{{title}}</h1>
    <p class="subtitle">{{subtitle}}</p>
    <p>Date: {{reportDate}}</p>
  </div>
  <div class="section">
    <h2>Summary</h2>
    <p>{{summary}}</p>
  </div>
  <div class="section">
    <h2>Data</h2>
    <table>
      <thead>
        <tr>{{#each headers}}<th>{{this}}</th>{{/each}}</tr>
      </thead>
      <tbody>
        {{#each rows}}
        <tr>{{#each this}}<td>{{this}}</td>{{/each}}</tr>
        {{/each}}
      </tbody>
    </table>
  </div>
</body>
</html>`
  },
  {
    id: 'tpl-minimal',
    name: 'Minimal List',
    is_default: 1,
    html_content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 40px; max-width: 700px; }
    h1 { font-size: 24px; font-weight: 600; color: #111; margin-bottom: 5px; }
    .date { color: #888; font-size: 14px; margin-bottom: 25px; }
    .item { padding: 12px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
    .item:last-child { border-bottom: none; }
    .item-label { font-weight: 500; }
    .item-value { color: #555; }
  </style>
</head>
<body>
  <h1>{{title}}</h1>
  <p class="date">{{generatedDate}}</p>
  {{#each items}}
  <div class="item">
    {{#each this}}
    <span class="item-label">{{@key}}</span>
    <span class="item-value">{{this}}</span>
    {{/each}}
  </div>
  {{/each}}
</body>
</html>`
  },
  {
    id: 'tpl-pie-report',
    name: 'Executive Pie Report',
    is_default: 1,
    html_content: `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f8fafc; color: #1e293b; padding: 30px; }
    .container { max-width: 1000px; margin: 0 auto; }

    /* Header */
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #7c3aed 100%); color: white; padding: 32px; border-radius: 14px; margin-bottom: 24px; }
    .header h1 { font-size: 26px; font-weight: 700; margin-bottom: 6px; letter-spacing: -0.3px; }
    .header .subtitle { font-size: 14px; opacity: 0.85; }
    .header .meta { display: flex; gap: 20px; margin-top: 14px; font-size: 12px; opacity: 0.75; }

    /* Metric cards */
    .metrics-row { display: flex; gap: 14px; margin-bottom: 24px; flex-wrap: wrap; }
    .metric-card { flex: 1; min-width: 140px; background: white; border-radius: 12px; padding: 18px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); text-align: center; }
    .metric-card .metric-value { font-size: 26px; font-weight: 700; color: #0f172a; }
    .metric-card .metric-label { font-size: 11px; color: #94a3b8; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
    .metric-card .metric-trend-up { color: #16a34a; font-size: 12px; font-weight: 600; margin-top: 6px; }
    .metric-card .metric-trend-down { color: #dc2626; font-size: 12px; font-weight: 600; margin-top: 6px; }

    /* Content / Text sections */
    .content-section { background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .content-section h2 { font-size: 16px; font-weight: 600; color: #334155; margin-bottom: 12px; border-left: 4px solid #7c3aed; padding-left: 12px; }
    .content-section p { font-size: 14px; line-height: 1.75; color: #475569; }

    /* Pie chart section */
    .pie-section { background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .pie-section h2 { font-size: 16px; font-weight: 600; color: #334155; margin-bottom: 20px; border-left: 4px solid #3b82f6; padding-left: 12px; }
    .pie-wrapper { display: flex; align-items: center; gap: 30px; flex-wrap: wrap; }
    .pie-svg-container { flex: 0 0 320px; max-width: 320px; }
    .pie-svg-container svg { width: 100%; height: auto; }
    .pie-legend { flex: 1; min-width: 200px; }
    .legend-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
    .legend-item:last-child { border-bottom: none; }
    .legend-color { width: 14px; height: 14px; border-radius: 4px; flex-shrink: 0; }
    .legend-label { flex: 1; font-size: 13px; color: #334155; }
    .legend-value { font-size: 13px; font-weight: 600; color: #0f172a; }
    .legend-pct { font-size: 12px; color: #94a3b8; min-width: 45px; text-align: right; }

    /* Table sections */
    .table-section { background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .table-section h2 { font-size: 16px; font-weight: 600; color: #334155; margin-bottom: 16px; border-left: 4px solid #10b981; padding-left: 12px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f1f5f9; padding: 10px 14px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600; border-bottom: 2px solid #e2e8f0; }
    td { padding: 10px 14px; font-size: 13px; border-bottom: 1px solid #f1f5f9; color: #334155; }
    tr:hover td { background: #f8fafc; }
    tr:nth-child(even) td { background: #fafbfc; }

    /* Footer */
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #94a3b8; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">

    <!-- HEADER -->
    <div class="header">
      <h1>{{title}}</h1>
      {{#if subtitle}}<div class="subtitle">{{subtitle}}</div>{{/if}}
      <div class="meta">
        <span>{{generatedDate}}</span>
        {{#if author}}<span>Prepared by: {{author}}</span>{{/if}}
        {{#if version}}<span>v{{version}}</span>{{/if}}
      </div>
    </div>

    <!-- METRICS -->
    {{#if metrics}}
    <div class="metrics-row">
      {{#each metrics}}
      <div class="metric-card">
        <div class="metric-value">{{this.value}}</div>
        <div class="metric-label">{{this.label}}</div>
        {{#if this.trend}}
          {{#if (gt this.change 0)}}
          <div class="metric-trend-up">{{this.trend}}</div>
          {{else}}
          <div class="metric-trend-down">{{this.trend}}</div>
          {{/if}}
        {{/if}}
      </div>
      {{/each}}
    </div>
    {{/if}}

    <!-- TEXT: Summary -->
    {{#if summary}}
    <div class="content-section">
      <h2>Executive Summary</h2>
      <p>{{summary}}</p>
    </div>
    {{/if}}

    {{#if introduction}}
    <div class="content-section">
      <h2>Introduction</h2>
      <p>{{introduction}}</p>
    </div>
    {{/if}}

    <!-- PIE CHARTS -->
    {{#if charts}}
    {{#each charts}}
    {{#eq this.type "pie"}}
    <div class="pie-section">
      <h2>{{this.title}}</h2>
      <div class="pie-wrapper">
        <div class="pie-svg-container">
          <svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
            <circle cx="150" cy="150" r="120" fill="#f1f5f9" />
            {{#each this.data}}
            <path d="{{this.path}}" fill="{{this.color}}" stroke="white" stroke-width="2" />
            {{/each}}
            <!-- Center donut hole -->
            <circle cx="150" cy="150" r="55" fill="white" />
            <text x="150" y="145" text-anchor="middle" font-size="11" fill="#94a3b8" font-family="Segoe UI, sans-serif">TOTAL</text>
            <text x="150" y="165" text-anchor="middle" font-size="15" font-weight="700" fill="#0f172a" font-family="Segoe UI, sans-serif">{{../this.totalValue}}</text>
          </svg>
        </div>
        <div class="pie-legend">
          {{#each this.data}}
          <div class="legend-item">
            <div class="legend-color" style="background: {{this.color}};"></div>
            <span class="legend-label">{{this.label}}</span>
            <span class="legend-pct">{{this.percentage}}%</span>
          </div>
          {{/each}}
        </div>
      </div>
    </div>
    {{/eq}}
    {{/each}}
    {{/if}}

    <!-- TABLES -->
    {{#if tables}}
    {{#each tables}}
    <div class="table-section">
      <h2>{{this.title}}</h2>
      <table>
        <thead>
          <tr>{{#each this.headers}}<th>{{this}}</th>{{/each}}</tr>
        </thead>
        <tbody>
          {{#each this.rows}}
          <tr>{{#each this}}<td>{{this}}</td>{{/each}}</tr>
          {{/each}}
        </tbody>
      </table>
    </div>
    {{/each}}
    {{/if}}

    <!-- Conclusion / Notes -->
    {{#if conclusion}}
    <div class="content-section">
      <h2>Conclusion</h2>
      <p>{{conclusion}}</p>
    </div>
    {{/if}}

    {{#if notes}}
    <div class="content-section">
      <h2>Notes</h2>
      <p>{{notes}}</p>
    </div>
    {{/if}}

    <div class="footer">
      Generated by JustReport &mdash; {{generatedDate}}
      {{#if version}} &bull; v{{version}}{{/if}}
    </div>

  </div>
</body>
</html>`
  }
];

module.exports = defaultTemplates;
