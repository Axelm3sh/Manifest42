import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import {visualizer} from 'rollup-plugin-visualizer'
import {fileURLToPath, URL} from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // Base public path when served in development or production
    base: env.BASE_URL || '/',

    // Define aliases for cleaner imports
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },

    // Configure plugins
    plugins: [
      vue(),
      // Only include the visualizer in build mode
      mode === 'analyze' && visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
    ].filter(Boolean),

    // Development server configuration
    server: {
      port: 3000,
      open: true,
      cors: true,
      // Proxy API requests to backend during development
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      // Add security headers to development server
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        // Add CSP in development mode if explicitly enabled, always in production
        ...((env.VITE_ENABLE_CSP_IN_DEV === 'true' || mode === 'production') ? {
          'Content-Security-Policy': `
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
            style-src 'self' ${mode === 'development' ? "'unsafe-inline'" : ''};
            img-src 'self' data:;
            font-src 'self';
            connect-src 'self' ${env.VITE_API_URL || 'http://localhost:8080'};
            frame-src 'none';
            object-src 'none';
            base-uri 'self';
            form-action 'self';
            frame-ancestors 'none';
          `.replace(/\s+/g, ' ').trim()
        } : {})
      }
    },

    // Build optimization
    build: {
      // Output directory
      outDir: 'dist',

      // Enable/disable source maps in production
      sourcemap: env.VITE_ENABLE_SOURCEMAP === 'true',

      // Minification options
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: env.NODE_ENV === 'production',
          drop_debugger: env.NODE_ENV === 'production',
        }
      },

      // Chunk size warning limit
      chunkSizeWarningLimit: 1000,

      // Rollup options
      rollupOptions: {
        output: {
          // Chunk files by type
          manualChunks: {
            'vendor': ['vue', 'vue-router', 'pinia'],
            'ui': ['@/components/ui'],
          },
          // Control chunk file naming
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        }
      }
    },

    // CSS optimization
    css: {
      // Enable/disable CSS source maps
      devSourcemap: true,
      // CSS pre-processor options
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/styles/variables.scss";`
        }
      }
    }
  }
})
