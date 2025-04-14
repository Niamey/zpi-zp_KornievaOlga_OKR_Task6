import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  base: '/zpi-zp_KornievaOlga_OKR_Task6/',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        timer: resolve(__dirname, 'src/1-timer.html'),
        snackbar: resolve(__dirname, 'src/2-snackbar.html'),
        imagesearch: resolve(__dirname, 'src/3-image-search.html'),
      },
    },
  },
});