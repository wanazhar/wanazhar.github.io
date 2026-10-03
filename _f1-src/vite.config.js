import { defineConfig } from 'vite';

export default defineConfig({
  base: '/f1/',
  server: { host: '0.0.0.0', port: 5174 },
  preview: { host: '0.0.0.0', port: 4174 },
  build: {
    target: 'es2022',
    sourcemap: false,
    assetsInlineLimit: 4096,
    outDir: '../f1',
    emptyOutDir: true
  }
});