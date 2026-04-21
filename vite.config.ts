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
      'import.meta.env.VITE_OLA_MAP_API_KEY': JSON.stringify(env.VITE_OLA_MAP_API_KEY),
      'import.meta.env.clientId': JSON.stringify(env.clientId),
      'import.meta.env.clientSecret': JSON.stringify(env.clientSecret),
      // Only inject dev auth credentials in development — stripped from production builds
      ...(mode === 'development' ? {
        '__DEV_AUTH_USERS__': JSON.stringify(env.DEV_AUTH_USERS || ''),
      } : {
        '__DEV_AUTH_USERS__': JSON.stringify(''),
      }),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
