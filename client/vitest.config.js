import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/**/*.test.jsx', 'src/**/__tests__/**/*.test.{js,jsx}'],
    environment: 'jsdom',
    testTimeout: 10000,
    globals: true,
    setupFiles: []
  }
});
