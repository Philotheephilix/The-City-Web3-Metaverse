import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  define: {
    global: 'globalThis',
    'process.env.VITE_CONTRACT_ADDRESS': JSON.stringify(process.env.VITE_CONTRACT_ADDRESS),
    'process.env.VITE_NETWORK_ID': JSON.stringify(process.env.VITE_NETWORK_ID),
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        return; 
      },
    },
  },
  logLevel: 'error',
});