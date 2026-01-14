import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron/simple';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// 讀取 package.json 獲取版本號
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  plugins: [
    react(),
    electron({
      main: {
        entry: 'src/main/main.ts',
      },
      preload: {
        input: 'src/main/preload.ts',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@main': resolve(__dirname, './src/main'),
      '@renderer': resolve(__dirname, './src/renderer'),
      '@shared': resolve(__dirname, './src/shared'),
    },
  },
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
});
