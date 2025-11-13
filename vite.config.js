import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        twoFactor: './two-factor-authentication.html',
        twoFactorLogin: './two-factor-authentication-login.html',
        messages: './messages.html'
      }
    }
  },
  css: {
    preprocessorOptions: {
      css: {
        additionalData: `@import "@/styles/variables.css";`
      }
    }
  }
});
