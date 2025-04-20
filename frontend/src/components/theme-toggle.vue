<script setup>
import {onBeforeUnmount, onMounted, ref} from 'vue';

// Theme state
const currentTheme = ref('light');

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
  try {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage?.getItem('theme');
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      // Check system preference
      if (typeof window !== 'undefined' && window.matchMedia) {
        try {
          // In test environment, we need to handle the case where matchMedia might be mocked
          let prefersDark = false;
          try {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            prefersDark = mediaQuery && typeof mediaQuery.matches === 'boolean' && mediaQuery.matches;
          } catch (e) {
            // If we can't access mediaQuery.matches, check if matchMedia was mocked to return a specific value
            const mockResult = window.matchMedia('(prefers-color-scheme: dark)');
            prefersDark = mockResult && typeof mockResult.matches === 'boolean' && mockResult.matches;
          }
          applyTheme(prefersDark ? 'dark' : 'light');
        } catch (error) {
          // If matchMedia fails, default to light theme
          console.error('Error checking media query:', error);
          applyTheme('light');
        }
      } else {
        // Default to light theme if matchMedia is not available (e.g., in test environment)
        applyTheme('light');
      }
    }

    // Listen for system theme changes
    if (typeof window !== 'undefined' && window.matchMedia) {
      try {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
          if (!localStorage?.getItem('theme')) {
            applyTheme(e && e.matches ? 'dark' : 'light');
          }
        };

        if (mediaQuery && typeof mediaQuery.addEventListener === 'function') {
          mediaQuery.addEventListener('change', handleChange);

          // Cleanup
          onBeforeUnmount(() => {
            try {
              if (mediaQuery && typeof mediaQuery.removeEventListener === 'function') {
                mediaQuery.removeEventListener('change', handleChange);
              }
            } catch (error) {
              console.error('Error removing event listener:', error);
            }
          });
        }
      } catch (error) {
        console.error('Error setting up media query listener:', error);
      }
    }
  } catch (error) {
    console.error('Error initializing theme:', error);
    // Ensure we have a fallback theme
    applyTheme('light');
  }
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
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
        <path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z"></path>
      </svg>
    </span>
    <!-- Moon icon for dark mode -->
    <span v-else class="icon moon" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
        <path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z"></path>
      </svg>
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
