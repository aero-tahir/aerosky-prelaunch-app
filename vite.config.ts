import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      // Expose env vars that don't start with VITE_
      'import.meta.env.VITE_OLA_MAP_API_KEY': JSON.stringify(env.VITE_OLA_MAP_API_KEY),
      'import.meta.env.clientId': JSON.stringify(env.clientId),
      'import.meta.env.clientSecret': JSON.stringify(env.clientSecret)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
