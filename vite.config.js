import { defineConfig } from 'vite';
import { terser } from 'rollup-plugin-terser';

export default defineConfig({
  build: {
    // Enable code splitting 
    rollupOptions: {
      output: {
        manualChunks: id => {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      },
    },
    // Minify the output
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
      mangle: true,
    },
    // Enable gzip compression
    chunkSizeWarningLimit: 600,
    outDir: 'dist',
    emptyOutDir: true,
  },
});