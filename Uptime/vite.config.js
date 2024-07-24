import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://webalert-mern.onrender.com', // Adjust if your backend runs on a different port
    },
  },
});
