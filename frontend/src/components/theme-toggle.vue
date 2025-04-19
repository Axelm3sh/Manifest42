<script setup>
import {onBeforeUnmount, onMounted, ref} from 'vue';

// Theme state
const currentTheme = ref(localStorage.getItem('theme') || 'light');

// Apply theme on component mount and when it changes
const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  currentTheme.value = theme;
};

// Toggle between light and dark themes
const toggleTheme = () => {
  const newTheme = currentTheme.value === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
};

// Initialize theme on component mount
onMounted(() => {
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  // Cleanup
  onBeforeUnmount(() => {
    mediaQuery.removeEventListener('change', handleChange);
  });
});
</script>

<template>
  <button 
    class="theme-toggle" 
    @click="toggleTheme" 
    :aria-label="currentTheme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'"
    :title="currentTheme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'"
  >
    <!-- Sun icon for light mode -->
    <span v-if="currentTheme === 'dark'" class="icon sun" aria-hidden="true">
      ☀️
    </span>
    <!-- Moon icon for dark mode -->
    <span v-else class="icon moon" aria-hidden="true">
      🌙
    </span>
    <span class="theme-label">{{ currentTheme === 'light' ? 'Dark Mode' : 'Light Mode' }}</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background-color: var(--color-surface);
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: background-color var(--transition-fast), 
              box-shadow var(--transition-fast), 
              border-color var(--transition-fast);
}

.theme-toggle:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
}

.theme-toggle:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.icon {
  font-size: var(--font-size-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.theme-label {
  margin-left: var(--spacing-xs);
}

/* Add animation for icon transitions */
.sun, .moon {
  transition: transform var(--transition-normal);
}

.sun {
  transform: rotate(0deg);
}

.theme-toggle:hover .sun {
  transform: rotate(45deg);
}

.theme-toggle:hover .moon {
  transform: scale(1.1);
}

@media (max-width: 640px) {
  .theme-label {
    display: none;
  }
}
</style>