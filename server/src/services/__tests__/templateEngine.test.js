import { describe, it, expect } from 'vitest';
import templateEngine from '../templateEngine';

describe('templateEngine', () => {
  describe('compile', () => {
    it('should compile a Handlebars template', () => {
      const compiled = templateEngine.compile('<h1>{{title}}</h1>');
      expect(typeof compiled).toBe('function');
    });

    it('should cache compiled templates', () => {
      const fn1 = templateEngine.compile('<h1>{{title}}</h1>');
      const fn2 = templateEngine.compile('<h1>{{title}}</h1>');
      expect(fn1).toBe(fn2);
    });
  });

  describe('renderTemplate', () => {
    it('should render a simple template with data', async () => {
      const html = await templateEngine.renderTemplate(
        '<h1>{{title}}</h1>',
        { title: 'Test Report' }
      );
      expect(html).toContain('<h1>Test Report</h1>');
    });

    it('should render with headers and rows', async () => {
      const data = [
        { name: 'Alice', age: '30' },
        { name: 'Bob', age: '25' }
      ];
      const tpl = '<table>{{#each headers}}<th>{{this}}</th>{{/each}}{{#each rows}}<tr>{{#each this}}<td>{{this}}</td>{{/each}}</tr>{{/each}}</table>';
      const html = await templateEngine.renderTemplate(tpl, data);
      expect(html).toContain('<th>name</th>');
      expect(html).toContain('<th>age</th>');
      expect(html).toContain('<td>Alice</td>');
      expect(html).toContain('<td>Bob</td>');
    });

    it('should use the currency helper', async () => {
      const html = await templateEngine.renderTemplate(
        '{{currency value}}',
        { value: 150000 }
      );
      expect(html).toContain('Rp');
      expect(html).toContain('150.000');
    });

    it('should use the formatDate helper', async () => {
      const html = await templateEngine.renderTemplate(
        '{{formatDate date}}',
        { date: '2024-06-15' }
      );
      expect(html).toContain('Juni');
      expect(html).toContain('2024');
    });

    it('should use the percentage helper', async () => {
      const html = await templateEngine.renderTemplate(
        '{{percentage rate}}',
        { rate: 0.85 }
      );
      expect(html).toBe('85.00%');
    });

    it('should use the eq helper', async () => {
      const html = await templateEngine.renderTemplate(
        '{{#if (eq a b)}}equal{{else}}not equal{{/if}}',
        { a: 5, b: 5 }
      );
      expect(html).toBe('equal');
    });

    it('should use the gt helper', async () => {
      const html = await templateEngine.renderTemplate(
        '{{#if (gt a b)}}greater{{else}}not greater{{/if}}',
        { a: 10, b: 5 }
      );
      expect(html).toBe('greater');
    });

    it('should throw on invalid template syntax', async () => {
      await expect(templateEngine.renderTemplate(
        '{{#invalid}}',
        {}
      )).rejects.toThrow('Template rendering failed');
    });

    it('should render items as the raw data array', async () => {
      const data = [
        { x: '1', y: '2' },
        { x: '3', y: '4' }
      ];
      const tpl = '{{#each items}}{{x}}-{{y}} {{/each}}';
      const html = await templateEngine.renderTemplate(tpl, data);
      expect(html).toBe('1-2 3-4 ');
    });
  });

  describe('hashKey', () => {
    it('should produce consistent keys', () => {
      const key1 = templateEngine.hashKey('<h1>Test</h1>');
      const key2 = templateEngine.hashKey('<h1>Test</h1>');
      expect(key1).toBe(key2);
    });

    it('should produce different keys for different content', () => {
      const key1 = templateEngine.hashKey('<h1>A</h1>');
      const key2 = templateEngine.hashKey('<h1>B</h1>');
      expect(key1).not.toBe(key2);
    });
  });
});
