const puppeteer = require('puppeteer');
const { PDF_SETTINGS, PUPPETEER_ARGS } = require('../config/constants');

class PDFGenerator {
  async htmlToPdf(html) {
    let browser = null;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: PUPPETEER_ARGS
      });

      const page = await browser.newPage();
      await page.setContent(html, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      const pdf = await page.pdf(PDF_SETTINGS);

      return pdf;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}

module.exports = new PDFGenerator();
