import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // Exposes to the network
    port: process.env.PORT || 5173 // Default to 5173 if no PORT is set
  }
});
