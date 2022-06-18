import * as path from 'path';

import { defineConfig } from 'vite';

import callCountPlugin from './plugins/call-count-plugin';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  plugins: [callCountPlugin()],
});
