import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig, type PluginOption } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
type UniPluginFactory = (...args: unknown[]) => PluginOption

const uniPlugin: UniPluginFactory =
  (uni as unknown as { default?: UniPluginFactory }).default ??
  (uni as unknown as UniPluginFactory)

export default defineConfig({
  plugins: [uniPlugin()],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api']
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src')
    }
  }
})
