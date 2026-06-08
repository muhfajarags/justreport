const Handlebars = require('handlebars');

class TemplateEngine {
  constructor() {
    this.compiledCache = new Map();
    this.registerHelpers();
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
      const templateData = this.prepareData(data);
      const compiled = this.compile(htmlTemplate);
      const html = compiled(templateData);
      return html;
    } catch (err) {
      throw new Error(`Template rendering failed: ${err.message}`);
    }
  }

  prepareData(data) {
    if (!Array.isArray(data)) return data;

    const headers = data.length > 0 ? Object.keys(data[0]) : [];
    const rows = data.map(row => {
      const values = headers.map(h => row[h] !== undefined ? row[h] : '');
      return values;
    });

    return {
      title: 'Report',
      generatedDate: new Date().toLocaleDateString('id-ID'),
      headers,
      rows,
      items: data,
      rowsRaw: data
    };
  }
}

module.exports = new TemplateEngine();
