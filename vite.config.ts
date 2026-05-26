/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

export default defineConfig({
  base: '/',

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@engine': resolve(__dirname, './src/engine'),
      '@network': resolve(__dirname, './src/network'),
      '@ui': resolve(__dirname, './src/ui'),
      '@store': resolve(__dirname, './src/store'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types'),
    },
  },

  build: {
    target: 'es2022',
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'chess-engine': ['./src/engine/index.ts'],
          'network': ['./src/network/index.ts'],
          'ui': ['./src/ui/components/index.ts'],
        },
      },
    },
  },

  plugins: [
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: [
        'icons/*.svg',
        'pieces/**/*.svg',
      ],
      manifest: {
        name: 'JemaChess',
        short_name: 'JemaChess',
        description: "Jeu d'échecs moderne avec IA et multijoueur",
        theme_color: '#7d82ea',
        background_color: '#0a0a0f',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        lang: 'fr',
        dir: 'ltr',
        categories: ['games', 'entertainment'],
        icons: [
          {
            src: '/icons/icon-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-384x384.svg',
            sizes: '384x384',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
        prefer_related_applications: false,
      },
      workbox: {
        // Precache all built assets (JS, CSS, HTML, icons, pieces)
        globPatterns: ['**/*.{js,css,html,svg,ico,woff2}'],
        // Navigation fallback to index.html for SPA routing
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        // Don't precache sourcemaps
        globIgnores: ['**/*.map'],
        // Clean old precaches on activate
        cleanupOutdatedCaches: true,
        // Take control immediately when new SW activates
        clientsClaim: true,
        // Runtime caching strategies
        runtimeCaching: [
          {
            // PeerJS signaling server - network first, fallback to cache
            urlPattern: /^https:\/\/.*peerjs\.com/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'peerjs-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              networkTimeoutSeconds: 5,
            },
          },
          {
            // GunDB relay servers - network only (real-time data)
            urlPattern: /^https:\/\/.*gun\./,
            handler: 'NetworkOnly',
          },
          {
            // Google Fonts or external CSS (if any)
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
    }),
  ],

  server: {
    port: 3000,
    host: true,
  },

  preview: {
    port: 4173,
  },

  test: {
    include: ['tests/unit/**/*.{test,spec}.ts'],
  },
});
