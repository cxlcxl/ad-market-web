import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  return {
    plugins: [vue()],
    define: {
      "process.env": env,
    },
    server: {
      proxy: {
        "/api/": {
          target: process.env.VUE_APP_BASE_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/backend/, ""),
        },
      },
    },
  }
})
