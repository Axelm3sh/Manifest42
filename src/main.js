import {createApp} from 'vue'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmDialog from "primevue/confirmdialog";
import {createPinia} from 'pinia'
import router from './router/index.js'

// Import order matters for CSS
import './base.css' // fonts, spacing, etc.
import Lara from '@primevue/themes/lara' // PrimeVue theme
import './overrides.css' // color tokens
import 'primeicons/primeicons.css' // PrimeIcons
import 'primeflex/primeflex.css' // tiny flex/grid helper set
import App from './App.vue'
import {i18n} from './i18n/index.js'
import {initializeSecurity} from './utils/security'

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
                darkModeSelector: `[data-theme="dark"]`,
                cssLayer: false
            }
        },
    ripple: true})
// app.use(PhosphorVue)
app.use(i18n)
app.use(router)
app.use(ConfirmationService)
app.component('ConfirmDialog', ConfirmDialog)

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
