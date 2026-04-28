import { defineConfig } from 'vite';

export default defineConfig({
  base: '/emir/',
  server: { host: '0.0.0.0', port: 5173 },
  preview: { host: '0.0.0.0', port: 4173 },
  build: {
    target: 'es2022',
    sourcemap: true,
    assetsInlineLimit: 4096,
    outDir: '../emir',
    emptyOutDir: true
  }
});
