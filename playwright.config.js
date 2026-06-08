import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:9120',
    headless: true,
    viewport: { width: 1280, height: 720 }
  },
  webServer: [
    {
      command: 'node src/app.js',
      port: 9121,
      reuseExistingServer: true
    },
    {
      command: 'npx vite --port 9120',
      port: 9120,
      reuseExistingServer: true
    }
  ]
});
