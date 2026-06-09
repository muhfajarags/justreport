const Handlebars = require('handlebars');

class TemplateEngine {
  constructor() {
    this.compiledCache = new Map();
    this.jsonSchema = this.defineJSONSchema();
    this.registerHelpers();
  }

  defineJSONSchema() {
    // Define the standardized JSON schema that all templates will use
    return {
      // Metadata section
      metadata: {
        title: 'string',
        subtitle: 'string',
        generatedDate: 'string',
        reportDate: 'string',
        author: 'string',
        version: 'string'
      },
      // Text content sections
      content: {
        summary: 'string',
        introduction: 'string',
        conclusion: 'string',
        notes: 'string'
      },
      // Metrics/KPIs for dashboard-style templates
      metrics: [{
        label: 'string',
        value: 'any',
        trend: 'string',
        change: 'number'
      }],
      // Chart data
      charts: [{
        type: 'string', // 'bar', 'line', 'pie', etc.
        title: 'string',
        data: [{
          label: 'string',
          value: 'number'
        }],
        options: 'object'
      }],
      // Table data
      tables: [{
        title: 'string',
        headers: ['string'],
        rows: [['any']],
        summary: 'object'
      }],
      // Legacy support - flat data array
      data: [{
        // Dynamic key-value pairs
      }],
      // Additional legacy fields for backward compatibility
      headers: ['string'],
      rows: [['any']],
      items: [{
        // Dynamic key-value pairs
      }]
    };
  }

  registerHelpers() {
    Handlebars.registerHelper('formatDate', (date) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    });

    Handlebars.registerHelper('currency', (value) => {
      if (value === null || value === undefined) return '';
      const num = typeof value === 'string' ? parseFloat(value) : value;
      if (isNaN(num)) return String(value);
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(num);
    });

    Handlebars.registerHelper('percentage', (value) => {
      if (value === null || value === undefined) return '';
      const num = typeof value === 'string' ? parseFloat(value) : value;
      if (isNaN(num)) return String(value);
      return (num * 100).toFixed(2) + '%';
    });

    Handlebars.registerHelper('eq', (a, b) => a === b);

    Handlebars.registerHelper('gt', (a, b) => a > b);

    Handlebars.registerHelper('lt', (a, b) => a < b);

    // Math helpers for chart calculations
    Handlebars.registerHelper('math', (a, operator, b) => {
      const numA = parseFloat(a) || 0;
      const numB = parseFloat(b) || 0;
      switch (operator) {
        case '+': return numA + numB;
        case '-': return numA - numB;
        case '*': return numA * numB;
        case '/': return numB !== 0 ? numA / numB : 0;
        case '%': return numA % numB;
        default: return numA;
      }
    });

    // Calculate bar height percentage (max value = 100%)
    Handlebars.registerHelper('barHeight', (value, max) => {
      const numValue = parseFloat(value) || 0;
      const numMax = parseFloat(max) || 1;
      return numMax > 0 ? Math.round((numValue / numMax) * 100) : 0;
    });

    // Find max value in an array
    Handlebars.registerHelper('maxValue', (array) => {
      if (!Array.isArray(array) || array.length === 0) return 0;
      const values = array.map(item => parseFloat(item.value) || 0);
      return Math.max(...values);
    });

    // Calculate total value in an array
    Handlebars.registerHelper('totalValue', (array) => {
      if (!Array.isArray(array) || array.length === 0) return 0;
      const total = array.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
      return total;
    });

    // Calculate percentage of total
    Handlebars.registerHelper('percentageOfTotal', (value, total) => {
      const numValue = parseFloat(value) || 0;
      const numTotal = parseFloat(total) || 1;
      return numTotal > 0 ? ((numValue / numTotal) * 100).toFixed(1) : 0;
    });

    // Generate pie chart slice angles
    Handlebars.registerHelper('pieAngleStart', (index, array) => {
      if (!Array.isArray(array) || index === 0) return 0;
      const total = array.reduce((sum, item, i) => {
        return i < index ? sum + (parseFloat(item.value) || 0) : sum;
      }, 0);
      const totalSum = array.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
      return totalSum > 0 ? (total / totalSum) * 360 : 0;
    });

    // Generate pie chart slice angle extent
    Handlebars.registerHelper('pieAngleExtent', (value, total) => {
      const numValue = parseFloat(value) || 0;
      const numTotal = parseFloat(total) || 1;
      return numTotal > 0 ? ((numValue / numTotal) * 360).toFixed(2) : 0;
    });
  }

  compile(templateHtml) {
    const key = this.hashKey(templateHtml);
    if (this.compiledCache.has(key)) {
      return this.compiledCache.get(key);
    }
    const compiled = Handlebars.compile(templateHtml);
    this.compiledCache.set(key, compiled);
    return compiled;
  }

  hashKey(templateHtml) {
    let hash = 0;
    for (let i = 0; i < templateHtml.length; i++) {
      const char = templateHtml.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return String(hash);
  }

  async renderTemplate(htmlTemplate, data) {
    try {
      const jsonData = this.convertToStandardJSON(data);
      const templateData = this.mapJSONToTemplate(jsonData);
      const compiled = this.compile(htmlTemplate);
      const html = compiled(templateData);
      return html;
    } catch (err) {
      throw new Error(`Template rendering failed: ${err.message}`);
    }
  }

  /**
   * Core method: convert ANY input into standardized JSON structure
   * This is the single entry point for all data normalization
   */
  convertToStandardJSON(data) {
    // Already in standard format (has metadata + data)
    if (data && typeof data === 'object' && !Array.isArray(data) && data.metadata) {
      return this.normalizeStandardJSON(data);
    }

    // Flat array of objects (from CSV/Excel upload)
    if (Array.isArray(data)) {
      return this.arrayToStandardJSON(data);
    }

    // Object with structured properties (API payload)
    if (data && typeof data === 'object') {
      return this.objectToStandardJSON(data);
    }

    // Primitive value
    return this.primitiveToStandardJSON(data);
  }

  normalizeStandardJSON(data) {
    const generatedDate = new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return {
      metadata: {
        title: data.metadata?.title || 'Report',
        subtitle: data.metadata?.subtitle || '',
        generatedDate: data.metadata?.generatedDate || generatedDate,
        reportDate: data.metadata?.reportDate || generatedDate,
        author: data.metadata?.author || 'JustReport',
        version: data.metadata?.version || '1.0',
        ...(data.metadata || {})
      },
      content: {
        summary: data.content?.summary || '',
        introduction: data.content?.introduction || '',
        conclusion: data.content?.conclusion || '',
        notes: data.content?.notes || '',
        ...(data.content || {})
      },
      metrics: data.metrics || [],
      charts: this.normalizeCharts(data.charts || []),
      tables: this.normalizeTables(data.tables || []),
      data: data.data || [],
      // Legacy compatibility
      headers: data.headers || [],
      rows: data.rows || [],
      items: data.items || data.data || []
    };
  }

  arrayToStandardJSON(dataArray) {
    const generatedDate = new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const headers = dataArray.length > 0 ? Object.keys(dataArray[0]) : [];
    const rows = dataArray.map(row =>
      headers.map(h => row[h] !== undefined && row[h] !== null ? String(row[h]) : '')
    );

    return {
      metadata: {
        title: 'Report',
        subtitle: `${dataArray.length} records`,
        generatedDate,
        reportDate: generatedDate,
        author: 'JustReport',
        version: '1.0'
      },
      content: {
        summary: '',
        introduction: '',
        conclusion: '',
        notes: ''
      },
      metrics: this.extractMetricsFromArray(dataArray, headers),
      charts: [],
      tables: [{
        title: 'Data Table',
        headers,
        rows
      }],
      data: dataArray,
      // Legacy compatibility
      headers,
      rows,
      items: dataArray,
      rowsRaw: dataArray
    };
  }

  objectToStandardJSON(obj) {
    const generatedDate = new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Check if it's a structured report object with known keys
    const knownKeys = ['title', 'subtitle', 'summary', 'metrics', 'charts', 'tables', 'items', 'data', 'headers', 'rows', 'content', 'metadata', 'sections'];
    const hasKnownKeys = Object.keys(obj).some(k => knownKeys.includes(k));

    if (hasKnownKeys) {
      // Merge with standard format, keeping any extra properties
      const data = obj.data || obj.items || [];
      const headers = obj.headers || (Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : []);
      const rows = obj.rows || (Array.isArray(data) ? data.map(row => headers.map(h => row[h] !== undefined && row[h] !== null ? String(row[h]) : '')) : []);

      return {
        metadata: {
          title: obj.title || obj.metadata?.title || 'Report',
          subtitle: obj.subtitle || obj.metadata?.subtitle || '',
          generatedDate: obj.generatedDate || obj.metadata?.generatedDate || generatedDate,
          reportDate: obj.reportDate || generatedDate,
          author: obj.author || obj.metadata?.author || 'JustReport',
          version: obj.version || obj.metadata?.version || '1.0',
          ...(obj.metadata || {})
        },
        content: {
          summary: obj.summary || obj.content?.summary || '',
          introduction: obj.introduction || obj.content?.introduction || '',
          conclusion: obj.conclusion || obj.content?.conclusion || '',
          notes: obj.notes || obj.content?.notes || '',
          ...(obj.content || {})
        },
        metrics: obj.metrics || [],
        charts: this.normalizeCharts(obj.charts || []),
        tables: obj.tables ? this.normalizeTables(obj.tables) : [{
          title: 'Data Table',
          headers,
          rows
        }],
        data: Array.isArray(data) ? data : [],
        // Legacy compatibility
        headers,
        rows,
        items: Array.isArray(data) ? data : [],
        rowsRaw: Array.isArray(data) ? data : [],
        // Preserve extra properties from the input object
        sections: obj.sections || [],
        invoiceNumber: obj.invoiceNumber || '',
        invoiceDate: obj.invoiceDate || '',
        total: obj.total || 0,
        // Pass through all unknown keys so templates can reference them
        _extra: this.extractExtraKeys(obj, knownKeys)
      };
    }

    // Plain object with no known keys - spread all properties directly
    // This supports cases like { value: 150000, date: '2024-06-15' }
    return {
      metadata: {
        title: obj.title || 'Report',
        subtitle: '',
        generatedDate,
        reportDate: generatedDate,
        author: 'JustReport',
        version: '1.0'
      },
      content: {
        summary: '',
        introduction: '',
        conclusion: '',
        notes: ''
      },
      metrics: [],
      charts: [],
      tables: [],
      data: [obj],
      headers: Object.keys(obj),
      rows: [Object.values(obj).map(v => String(v))],
      items: [obj],
      rowsRaw: [obj],
      // Pass through ALL keys so {{value}}, {{date}}, etc. work
      _extra: { ...obj }
    };
  }

  /**
   * Extract keys that are not part of the known schema
   * so they can be spread into the template context
   */
  extractExtraKeys(obj, knownKeys) {
    const extra = {};
    for (const key of Object.keys(obj)) {
      if (!knownKeys.includes(key)) {
        extra[key] = obj[key];
      }
    }
    return extra;
  }

  primitiveToStandardJSON(value) {
    const generatedDate = new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return {
      metadata: {
        title: 'Report',
        subtitle: '',
        generatedDate,
        reportDate: generatedDate,
        author: 'JustReport',
        version: '1.0'
      },
      content: { summary: String(value), introduction: '', conclusion: '', notes: '' },
      metrics: [],
      charts: [],
      tables: [],
      data: [{ value: String(value) }],
      headers: ['value'],
      rows: [[String(value)]],
      items: [{ value: String(value) }],
      rowsRaw: [{ value: String(value) }]
    };
  }

  /**
   * Normalize chart data to ensure consistent structure
   */
  normalizeCharts(charts) {
    if (!Array.isArray(charts)) return [];
    return charts.map(chart => ({
      type: chart.type || 'bar',
      title: chart.title || 'Chart',
      data: Array.isArray(chart.data) ? chart.data.map(d => ({
        label: d.label || d.name || d.category || '',
        value: Number(d.value || d.amount || d.count || 0),
        color: d.color || null
      })) : [],
      options: chart.options || {}
    }));
  }

  /**
   * Normalize table data to ensure consistent structure
   */
  normalizeTables(tables) {
    if (!Array.isArray(tables)) return [];
    return tables.map(table => {
      const headers = table.headers || [];
      const rows = table.rows || [];
      return {
        title: table.title || 'Table',
        headers,
        rows,
        summary: table.summary || null
      };
    });
  }

  /**
   * Auto-extract metrics from flat data array
   */
  extractMetricsFromArray(dataArray, headers) {
    if (dataArray.length === 0 || headers.length === 0) return [];

    // Try to detect numeric columns and create summary metrics
    const metrics = [];
    const numericColumns = headers.filter(h => {
      const sampleValues = dataArray.slice(0, 5).map(row => parseFloat(row[h]));
      return sampleValues.filter(v => !isNaN(v)).length >= Math.min(3, sampleValues.length);
    });

    for (const col of numericColumns.slice(0, 4)) {
      const values = dataArray.map(row => parseFloat(row[col])).filter(v => !isNaN(v));
      if (values.length > 0) {
        const sum = values.reduce((a, b) => a + b, 0);
        metrics.push({
          label: col,
          value: this.formatNumber(sum),
          trend: '',
          change: 0
        });
      }
    }

    // Always add total rows metric
    metrics.unshift({
      label: 'Total Records',
      value: String(dataArray.length),
      trend: '',
      change: 0
    });

    return metrics;
  }

  formatNumber(num) {
    if (Math.abs(num) >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (Math.abs(num) >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Number.isInteger(num) ? String(num) : num.toFixed(2);
  }

  /**
   * Map standardized JSON to template placeholders
   * This is the final mapping step before Handlebars rendering
   */
  mapJSONToTemplate(jsonData) {
    // Build the flat context object that Handlebars templates expect
    const context = {
      // Direct metadata fields
      title: jsonData.metadata.title,
      subtitle: jsonData.metadata.subtitle,
      generatedDate: jsonData.metadata.generatedDate,
      reportDate: jsonData.metadata.reportDate,
      author: jsonData.metadata.author,
      version: jsonData.metadata.version,

      // Content fields
      summary: jsonData.content.summary,
      introduction: jsonData.content.introduction,
      conclusion: jsonData.content.conclusion,
      notes: jsonData.content.notes,

      // Structured data
      metrics: jsonData.metrics,
      charts: this.preprocessChartsForRendering(jsonData.charts),
      tables: jsonData.tables,

      // Legacy compatibility - flat data
      headers: jsonData.headers,
      rows: jsonData.rows,
      items: jsonData.items,
      data: jsonData.data,
      rowsRaw: jsonData.rowsRaw || jsonData.data || [],

      // Sections support (for Dashboard template)
      sections: jsonData.sections || [],

      // Invoice support
      invoiceNumber: jsonData.invoiceNumber || '',
      invoiceDate: jsonData.invoiceDate || '',
      total: jsonData.total || 0
    };

    // Spread any extra keys from input so {{value}}, {{date}}, etc. resolve
    if (jsonData._extra && typeof jsonData._extra === 'object') {
      Object.assign(context, jsonData._extra);
    }

    return context;
  }

  /**
   * Pre-process chart data to add rendering coordinates
   * This converts abstract chart data into SVG-ready coordinates
   */
  preprocessChartsForRendering(charts) {
    if (!Array.isArray(charts) || charts.length === 0) return charts;

    return charts.map(chart => {
      if (!Array.isArray(chart.data) || chart.data.length === 0) return chart;

      const maxVal = Math.max(...chart.data.map(d => Number(d.value) || 0), 1);
      const totalVal = chart.data.reduce((sum, d) => sum + (Number(d.value) || 0), 0);

      if (chart.type === 'line') {
        // Calculate SVG coordinates for line chart
        const padding = 40;
        const chartWidth = 340;
        const chartHeight = 140;
        const step = chartWidth / Math.max(chart.data.length - 1, 1);

        chart.data = chart.data.map((d, i) => ({
          ...d,
          x: padding + (i * step),
          y: padding + chartHeight - ((Number(d.value) || 0) / maxVal) * chartHeight
        }));
      }

      if (chart.type === 'pie') {
        // Calculate SVG arc coordinates for pie chart
        const cx = 150;
        const cy = 150;
        const r = 120;
        const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

        let currentAngle = -90; // Start from top

        chart.data = chart.data.map((d, i) => {
          const value = Number(d.value) || 0;
          const percentage = totalVal > 0 ? (value / totalVal) * 100 : 0;
          const angleExtent = totalVal > 0 ? (value / totalVal) * 360 : 0;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angleExtent;

          // Convert degrees to radians
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;

          // Calculate SVG arc path
          const x1 = cx + r * Math.cos(startRad);
          const y1 = cy + r * Math.sin(startRad);
          const x2 = cx + r * Math.cos(endRad);
          const y2 = cy + r * Math.sin(endRad);

          const largeArcFlag = angleExtent > 180 ? 1 : 0;

          // SVG path for pie slice
          const path = `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;

          // Label position (at midpoint of arc, slightly outside)
          const midAngle = (startAngle + endAngle) / 2;
          const midRad = (midAngle * Math.PI) / 180;
          const labelR = r * 0.65;
          const labelX = cx + labelR * Math.cos(midRad);
          const labelY = cy + labelR * Math.sin(midRad);

          // Outer label position
          const outerLabelR = r + 25;
          const outerLabelX = cx + outerLabelR * Math.cos(midRad);
          const outerLabelY = cy + outerLabelR * Math.sin(midRad);

          currentAngle = endAngle;

          return {
            ...d,
            percentage: percentage.toFixed(1),
            color: d.color || defaultColors[i % defaultColors.length],
            path,
            labelX: labelX.toFixed(2),
            labelY: labelY.toFixed(2),
            outerLabelX: outerLabelX.toFixed(2),
            outerLabelY: outerLabelY.toFixed(2),
            midAngle: midAngle.toFixed(2),
            startAngle: startAngle.toFixed(2),
            endAngle: endAngle.toFixed(2)
          };
        });

        chart.cx = cx;
        chart.cy = cy;
        chart.r = r;
      }

      // Store max for bar chart height calculation
      chart.maxValue = maxVal;
      chart.totalValue = totalVal;

      return chart;
    });
  }
}

module.exports = new TemplateEngine();
