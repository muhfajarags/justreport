import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.js', 'src/**/__tests__/**/*.test.js'],
    environment: 'node',
    testTimeout: 30000,
    setupFiles: []
  }
});
