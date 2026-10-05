import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps the built site portable (works from any sub-path or static host).
// STANDALONE=1 inlines every asset so scripts/build-standalone.mjs can produce
// one self-contained HTML file that opens by double-click (file://) or in a viewer.
const standalone = !!process.env.STANDALONE;

export default defineConfig({
  base: './',
  plugins: [react()],
  build: standalone
    ? { outDir: 'dist-standalone', assetsInlineLimit: 100_000_000, cssCodeSplit: false, modulePreload: false }
    : {},
});
