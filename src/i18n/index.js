import {createI18n} from 'vue-i18n';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';

/**
 * Configure i18n instance with options
 */
export const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: localStorage.getItem('language') || 'en', // Default locale
  fallbackLocale: 'en', // Fallback locale
  messages: {
    en,
    es,
    fr
  },
  // Enable hot module replacement for locales
  globalInjection: true,
  // Warn about HTML in translations for security
  warnHtmlMessage: true
});

/**
 * Available locales for language switching
 */
export const AVAILABLE_LOCALES = [
  {
    code: 'en',
    name: 'English'
  },
  {
    code: 'es',
    name: 'Español'
  },
  {
    code: 'fr',
    name: 'Français'
  }
];

/**
 * Set the current locale
 * @param {string} locale - The locale code to set
 */
export const setLocale = (locale) => {
  i18n.global.locale.value = locale;
  localStorage.setItem('language', locale);
  document.querySelector('html').setAttribute('lang', locale);
};
