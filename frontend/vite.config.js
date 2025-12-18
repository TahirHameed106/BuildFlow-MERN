import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ✅ ADD THIS TEST SECTION
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js', // We will create this next
  }
})