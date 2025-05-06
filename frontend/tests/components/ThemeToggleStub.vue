<script setup>
import {computed, ref} from 'vue';
import {useI18n} from 'vue-i18n';

// Initialize i18n
const { t } = useI18n();

// Determine initial theme: saved or system preference
const saved = localStorage.getItem('theme');
// For testing, we'll default to light theme if no saved preference
const currentTheme = ref(saved || 'light');

// Apply theme to document and persist choice
const applyTheme = (theme) => {
  currentTheme.value = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

// Apply initial theme
applyTheme(currentTheme.value);

// Toggle between light and dark
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
  applyTheme(currentTheme.value);
};

// Computed helpers for labels and icon classes
const isDark = computed(() => currentTheme.value === 'dark');
const ariaLabel = computed(() => isDark.value ? t('theme.switch_to_light') : t('theme.switch_to_dark'));

// Expose for testing
defineExpose({
  currentTheme,
  toggleTheme,
  applyTheme
});
</script>

<template>
  <button
      class="theme-toggle"
      @click="toggleTheme"
      :aria-label="ariaLabel"
      :title="ariaLabel"
  >
    <!-- PrimeIcons sun/moon -->
    <i :class="['pi', isDark ? 'pi-sun' : 'pi-moon']" aria-hidden="true" />
    <span class="theme-label">{{ isDark ? t('theme.light_mode') : t('theme.dark_mode') }}</span>
  </button>
</template>
