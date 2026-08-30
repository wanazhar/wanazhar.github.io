import { defineConfig } from 'vite';

// base './' lets the built files work when copied into /kualalumpur
// inside wanazhar.github.io, and also works for local previews.
export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  preview: {
    host: '0.0.0.0',
    port: 4173
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    assetsDir: 'assets',
    outDir: '../kualalumpur',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1400
  }
});
