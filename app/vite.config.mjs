import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_URL || './',
  server: {
    port: 3000,
    open: false,
  },
  build: {
    outDir: 'dist',
  }
});
