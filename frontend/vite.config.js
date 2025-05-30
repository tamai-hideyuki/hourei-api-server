import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'hideyukionline.net',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://api:8080',
        changeOrigin: true,
      },
    },
  }
})
//この部分を自由に書き換えれれば、一枚で複数のAPIを取得できるかも？
//target: 'http://api:8080',
