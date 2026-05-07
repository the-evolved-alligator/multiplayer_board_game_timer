import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Multiplayer Board Game Timer',
        short_name: 'Game Timer',
        description: 'Fair and fast multiplayer turn timer.',
        theme_color: '#0b1220',
        background_color: '#0b1220',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/pwa.svg', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
      },
    }),
  ],
})
