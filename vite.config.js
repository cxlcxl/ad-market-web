import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: tag => tag.includes('wx-open-launch')
          }
        }
      })
    ],
    define: {
      "process.env": env,
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    server: {
      proxy: {
        "/api/": {
          target: process.env.VUE_APP_BASE_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/api"),
        },
      },
    },
  }
})
