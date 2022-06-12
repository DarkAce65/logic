import * as path from 'path';

import { defineConfig } from 'vite';

import callGraphPlugin from './plugins/call-graph-plugin';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  plugins: [callGraphPlugin()],
});
