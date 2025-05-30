import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    // 既存のプロキシ設定
    proxy: {
      '/api': {
        target: 'http://api:8080',
        changeOrigin: true,
      },
    },

    allowedHosts: [
      'hideyukionline.net',

    ]
  }
})