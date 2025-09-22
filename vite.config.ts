import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

/// <reference types="vitest" />

// https://vitejs.dev/config/
export default defineConfig(({}) => ({
  plugins: [
    react({
      // Enable Fast Refresh
      jsxImportSource: '@emotion/react',
    }),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.ts',
      injectRegister: false,
      manifest: {
        short_name: 'SnowB Bitmap Font',
        name: 'Snow Bamboo BitmapFont',
        description: 'Snow Bamboo BitmapFont Editor Online.',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '128x128 64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          },
          {
            src: 'logo192.png',
            type: 'image/png',
            sizes: '192x192'
          },
          {
            src: 'logo512.png',
            type: 'image/png',
            sizes: '512x512'
          }
        ],
        start_url: '.',
        display: 'fullscreen',
        theme_color: '#1e1e1e',
        background_color: '#1e1e1e'
      }
    }),
  ],
  
  // Development server configuration
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true,
  },
  
  // Preview server configuration
  preview: {
    port: 3000,
    host: true,
  },
  
  // Build configuration
  build: {
    outDir: 'build',
    sourcemap: true,
    // Build target
    target: 'es2015',
    // Code splitting optimization
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mobx: ['mobx', 'mobx-react-lite', 'mobx-utils'],
          mui: ['@mui/material', '@mui/icons-material'],
          utils: ['color', 'clsx', 'file-saver', 'jszip'],
        },
      },
    },
    // Asset inline threshold
    assetsInlineLimit: 4096,
  },
  
  // Path aliases
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/store': resolve(__dirname, 'src/store'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/types': resolve(__dirname, 'types'),
      'src': resolve(__dirname, 'src'),
    },
  },
  
  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  
  // Web Workers configuration
  worker: {
    format: 'es',
  },
  
  // Environment variables configuration
  envPrefix: 'VITE_',
  
  // esbuild configuration
  esbuild: {
    // Support TypeScript decorators
    target: 'es2020',
    jsx: 'automatic',
  },
  
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'mobx',
      'mobx-react-lite',
      '@emotion/react',
      '@emotion/styled',
      '@mui/material',
      'color',
      'clsx',
    ],
    exclude: [
      // Exclude packages that may cause issues
    ],
  },
  
  // Test configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: true,
  },
})) 