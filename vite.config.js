import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
  define: {
    'import.meta.env.VITE_API_GATEWAY': JSON.stringify(process.env.VITE_API_GATEWAY),
    'import.meta.env.VITE_CRYPTO_PASSWORD': JSON.stringify(process.env.VITE_CRYPTO_PASSWORD),
  },
});