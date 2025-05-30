import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // 開発サーバーがすべてのネットワークインターフェースでリッスンするように設定
    // これにより、Nginxなどのリバースプロキシからのアクセスも可能になる
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://api:8080',
        changeOrigin: true,
      },
    },
    fs: {
      allow: ['.', 'hideyukionline.net'],
    },
  }
})