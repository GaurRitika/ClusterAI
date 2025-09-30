import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Minimal declaration to satisfy TS when used by some linters
declare const process: { cwd: () => string }

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isGhPages = env.GITHUB_PAGES === 'true'
  return {
    plugins: [react()],
    base: isGhPages ? '/ClusterAI/' : '/',
    server: {
      port: 3000,
      host: true
    }
  }
})