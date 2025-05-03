import {createApp} from 'vue'
import PrimeVue from 'primevue/config'
import {createPinia} from 'pinia'
import router from './router/index.js'

// Import order matters for CSS
import Lara from '@primeuix/themes/lara'
//import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css' // PrimeIcons
import 'primeflex/primeflex.css' // tiny flex/grid helper set
import './style.css'

import App from './App.vue'
import {i18n} from './i18n/index.js'
import {initializeSecurity} from './utils/security'
// import {PhosphorVue} from 'phosphor-vue'

// Initialize security measures
initializeSecurity()

// Create app instance
const app = createApp(App)

// Create and use Pinia store
const pinia = createPinia()
app.use(pinia)

// Use plugins
app.use(PrimeVue,
    {
        theme: {
            preset: Lara,
            options: {
                prefix: 'p',
                darkModeSelector: 'system',
                cssLayer: false
            }
        },
    ripple: true})
// app.use(PhosphorVue)
app.use(i18n)
app.use(router)

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err)
  console.error('Info:', info)

  // In production, you might want to log errors to a monitoring service
  if (import.meta.env.PROD) {
    // Example: logErrorToService(err, info)
  }
}

// Mount app
app.mount('#app')
