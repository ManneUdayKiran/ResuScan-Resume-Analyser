import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 5173,
    allowedHosts: [
      'resuscan-resume-analyser-1.onrender.com',
      'https://resuscan-resume-analyser.onrender.com',
      'https://melodious-sundae-7cef94.netlify.app/analyze',
      'frontend-two-pi-49.vercel.app',
      'https://frontend-two-pi-49.vercel.app/analyze'
    ]
  },
})
