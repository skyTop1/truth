import { createPinia } from 'pinia'
import { createSSRApp } from 'vue'

import App from './App.vue'
import AppThemePage from './components/app/AppThemePage.vue'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()

  app.component('AppThemePage', AppThemePage)
  app.use(pinia)

  return {
    app,
    pinia
  }
}
