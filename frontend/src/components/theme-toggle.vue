<script setup>
import {onMounted, ref, watch} from 'vue';
import {PhMoon, PhSun} from 'phosphor-vue';

const theme = ref('light');

// Initialize theme based on user preference or system preference
onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    theme.value = savedTheme;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme.value = 'dark';
  }
  applyTheme(theme.value);
});

// Watch for changes to theme and apply them
watch(theme, (newTheme) => {
  applyTheme(newTheme);
  localStorage.setItem('theme', newTheme);
});

// Apply theme to document
function applyTheme(newTheme) {
  document.documentElement.setAttribute('data-theme', newTheme);
}

// Toggle between light and dark themes
function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
}
</script>

<template>
  <button 
    class="theme-toggle" 
    @click="toggleTheme" 
    :aria-label="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
  >
    <PhMoon v-if="theme === 'light'" class="theme-icon" />
    <PhSun v-else class="theme-icon" />
  </button>
</template>

<style scoped>
.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--transition-normal);
}

.theme-toggle:hover {
  background-color: var(--color-surface-hover);
}

.theme-icon {
  font-size: var(--font-size-xl);
  color: var(--color-text-primary);
}
</style>