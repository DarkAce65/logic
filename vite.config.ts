import * as path from 'path';

import { defineConfig } from 'vite';

import checker from 'vite-plugin-checker';

import callCountPlugin from './plugins/call-count-plugin';

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  plugins: [
    callCountPlugin(),
    checker({
      overlay: { initialIsOpen: false },
      terminal: mode !== 'test',
      typescript: true,
      eslint: { lintCommand: "eslint './src/**/*.{ts,tsx}'" },
    }),
  ],
}));
