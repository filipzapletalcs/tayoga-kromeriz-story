import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // SSG options for vite-react-ssg
  ssgOptions: {
    criticalCSS: true, // Use beasties for critical CSS extraction
    script: 'async',   // Load JS asynchronously
    formatting: 'minify', // Minify HTML output
  },
  build: {
    sourcemap: false, // Disabled for production (20-30% smaller bundle)
    chunkSizeWarningLimit: 500,
    // Only use manualChunks for client build, not SSR
    rollupOptions: !isSsrBuild ? {
      output: {
        sourcemapExcludeSources: true, // Exclude source code from source maps (security)
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion'],
          'supabase': ['@supabase/supabase-js'],
        },
      },
    } : undefined,
  },
}));
