import { describe, it, expect } from 'vitest';
import templateEngine from '../templateEngine';

describe('JSON Mapping Pipeline', () => {
  describe('convertToStandardJSON', () => {
    it('should convert flat array to standard JSON', () => {
      const input = [
        { Name: 'John', Sales: 1000 },
        { Name: 'Jane', Sales: 2000 }
      ];
      const result = templateEngine.convertToStandardJSON(input);

      expect(result.metadata).toBeDefined();
      expect(result.metadata.title).toBe('Report');
      expect(result.data).toHaveLength(2);
      expect(result.headers).toEqual(['Name', 'Sales']);
      expect(result.metrics.length).toBeGreaterThan(0);
      expect(result.metrics[0].label).toBe('Total Records');
      expect(result.metrics[0].value).toBe('2');
    });

    it('should convert plain object to standard JSON', () => {
      const input = {
        title: 'Test Report',
        summary: 'A test summary',
        items: [{ a: 1 }, { a: 2 }]
      };
      const result = templateEngine.convertToStandardJSON(input);

      expect(result.metadata.title).toBe('Test Report');
      expect(result.content.summary).toBe('A test summary');
      expect(result.data).toHaveLength(2);
    });

    it('should pass through standard JSON with metadata', () => {
      const input = {
        metadata: { title: 'Custom Title', author: 'Test' },
        content: { summary: 'Hello' },
        metrics: [{ label: 'KPI', value: 42, trend: '+10%' }],
        charts: [],
        tables: [],
        data: []
      };
      const result = templateEngine.convertToStandardJSON(input);

      expect(result.metadata.title).toBe('Custom Title');
      expect(result.metadata.author).toBe('Test');
      expect(result.content.summary).toBe('Hello');
      expect(result.metrics[0].value).toBe(42);
    });

    it('should handle primitive values', () => {
      const result = templateEngine.convertToStandardJSON('hello');
      expect(result.content.summary).toBe('hello');
      expect(result.data).toHaveLength(1);
      expect(result.data[0].value).toBe('hello');
    });
  });

  describe('normalizeCharts', () => {
    it('should normalize chart data with default values', () => {
      const charts = [
        {
          type: 'bar',
          title: 'Sales Chart',
          data: [
            { label: 'A', value: 100 },
            { label: 'B', value: 200 }
          ]
        }
      ];
      const result = templateEngine.normalizeCharts(charts);
      expect(result).toHaveLength(1);
      expect(result[0].data).toHaveLength(2);
      expect(result[0].data[0].value).toBe(100);
    });

    it('should handle empty charts', () => {
      expect(templateEngine.normalizeCharts(null)).toEqual([]);
      expect(templateEngine.normalizeCharts([])).toEqual([]);
    });
  });

  describe('mapJSONToTemplate', () => {
    it('should map all JSON fields to template context', () => {
      const jsonData = {
        metadata: {
          title: 'Report Title',
          subtitle: 'Sub',
          generatedDate: '8 Juni 2026',
          reportDate: '8 Juni 2026',
          author: 'Test',
          version: '1.0'
        },
        content: {
          summary: 'Summary text',
          introduction: 'Intro',
          conclusion: 'End',
          notes: 'Notes'
        },
        metrics: [{ label: 'Sales', value: 1000, trend: '+5%', change: 5 }],
        charts: [],
        tables: [{
          title: 'Data',
          headers: ['A', 'B'],
          rows: [['1', '2']]
        }],
        headers: ['A', 'B'],
        rows: [['1', '2']],
        items: [{ A: '1', B: '2' }],
        data: [{ A: '1', B: '2' }],
        rowsRaw: [{ A: '1', B: '2' }]
      };

      const context = templateEngine.mapJSONToTemplate(jsonData);

      expect(context.title).toBe('Report Title');
      expect(context.subtitle).toBe('Sub');
      expect(context.generatedDate).toBe('8 Juni 2026');
      expect(context.summary).toBe('Summary text');
      expect(context.introduction).toBe('Intro');
      expect(context.conclusion).toBe('End');
      expect(context.notes).toBe('Notes');
      expect(context.metrics[0].label).toBe('Sales');
      expect(context.tables[0].title).toBe('Data');
    });
  });

  describe('Full pipeline: JSON -> Template -> HTML', () => {
    it('should render text, metrics, and tables from JSON', async () => {
      const template = `
<h1>{{title}}</h1>
<p>{{summary}}</p>
<div>{{#each metrics}}{{this.label}}: {{this.value}}{{/each}}</div>
<table>{{#each tables}}{{#each this.rows}}<tr>{{#each this}}<td>{{this}}</td>{{/each}}</tr>{{/each}}{{/each}}</table>`;

      const data = {
        metadata: { title: 'Test', subtitle: '', generatedDate: '2026', reportDate: '2026', author: 'T', version: '1' },
        content: { summary: 'Hello World', introduction: '', conclusion: '', notes: '' },
        metrics: [{ label: 'KPI', value: 42, trend: '', change: 0 }],
        charts: [],
        tables: [{ title: 'T', headers: ['A'], rows: [['val1']] }],
        data: [],
        headers: [],
        rows: [],
        items: [],
        rowsRaw: []
      };

      const html = await templateEngine.renderTemplate(template, data);
      expect(html).toContain('Test');
      expect(html).toContain('Hello World');
      expect(html).toContain('KPI');
      expect(html).toContain('42');
      expect(html).toContain('val1');
    });

    it('should handle flat array input for legacy templates', async () => {
      const template = `
<h1>{{title}}</h1>
<p>{{generatedDate}}</p>
<table><tr>{{#each headers}}<th>{{this}}</th>{{/each}}</tr>
{{#each rows}}<tr>{{#each this}}<td>{{this}}</td>{{/each}}</tr>{{/each}}</table>`;

      const data = [
        { Name: 'Alice', Score: '90' },
        { Name: 'Bob', Score: '85' }
      ];

      const html = await templateEngine.renderTemplate(template, data);
      expect(html).toContain('Alice');
      expect(html).toContain('Bob');
      expect(html).toContain('90');
      expect(html).toContain('85');
    });
  });
});
