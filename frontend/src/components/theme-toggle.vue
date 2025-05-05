<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';

// Initialize i18n
const { t } = useI18n();

// Determine initial theme: saved or system preference
const saved = localStorage.getItem('theme');
const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
const currentTheme = ref(saved || (systemDark ? 'dark' : 'light'));

// Apply theme to document and persist choice
const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

// Watch for theme changes
watch(currentTheme, (theme) => applyTheme(theme), { immediate: true });

// Toggle between light and dark
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
};

// Listen to system preference changes if no manual override
let mediaQueryList;
const handleSystemChange = (e) => {
  if (!localStorage.getItem('theme')) {
    currentTheme.value = e.matches ? 'dark' : 'light';
  }
};

onMounted(() => {
  mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQueryList.addEventListener('change', handleSystemChange);
});

onUnmounted(() => {
  mediaQueryList?.removeEventListener('change', handleSystemChange);
});

// Computed helpers for labels and icon classes
const isDark = computed(() => currentTheme.value === 'dark');
const ariaLabel = computed(() => isDark.value ? t('theme.switch_to_light') : t('theme.switch_to_dark'));
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

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  background: var(--color-surface);
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: background var(--transition-fast), border-color var(--transition-fast);
}
.theme-toggle:hover {
  background: var(--color-surface-hover);
  border-color: var(--color-primary);
}
.theme-toggle:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}
/* Adjust PrimeIcons size */
.theme-toggle .pi {
  font-size: var(--font-size-lg);
  transition: transform var(--transition-normal);
}
.theme-toggle:hover .pi {
  transform: scale(1.2);
}
.theme-label {
  margin-left: var(--spacing-xs);
}
@media (max-width: 640px) {
  .theme-label { display: none; }
}
</style>
