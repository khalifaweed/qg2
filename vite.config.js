import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'assets/src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'assets/src/main.jsx')
      },
      output: {
        entryFileNames: 'main.js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'main.css';
          }
          return 'assets/[name].[ext]';
        }
      }
    }
  },
  server: {
    // @ts-ignore
    allowedHosts: process.env.TEMPO === "true" ? true : undefined
  }
});