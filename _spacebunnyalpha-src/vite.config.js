import { defineConfig } from 'vite';

// base './' so the built files work unchanged when the output is served from
// /spacebunnyalpha/ inside wanazhar.github.io, and also from a local preview.
export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5174
  },
  preview: {
    host: '0.0.0.0',
    port: 4174
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    assetsDir: 'assets',
    outDir: '../spacebunnyalpha',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1400
  }
});