<script setup>
import {onBeforeUnmount, onMounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {AVAILABLE_LOCALES, setLocale} from '../i18n';

const { t, locale } = useI18n();
const isOpen = ref(false);
const dropdownId = 'language-dropdown';
const buttonId = 'language-button';

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const changeLocale = (localeCode) => {
  setLocale(localeCode);
  isOpen.value = false;
};

// Handle keyboard navigation
const handleKeyDown = (event) => {
  if (!isOpen.value && event.key === 'Escape') {
    isOpen.value = false;
    return;
  }

  if (isOpen.value) {
    const options = document.querySelectorAll('.language-option');
    const currentIndex = Array.from(options).findIndex(option => option === document.activeElement);

    switch (event.key) {
      case 'Escape':
        isOpen.value = false;
        document.getElementById(buttonId)?.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < options.length - 1) {
          options[currentIndex + 1].focus();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          options[currentIndex - 1].focus();
        } else {
          document.getElementById(buttonId)?.focus();
        }
        break;
      case 'Home':
        event.preventDefault();
        options[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        options[options.length - 1]?.focus();
        break;
    }
  }
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const switcher = document.querySelector('.language-switcher');
  if (switcher && !switcher.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="language-switcher">
    <label id="language-label" class="visually-hidden">{{ t('language.select') }}</label>
    <button 
      :id="buttonId"
      @click="toggleDropdown" 
      class="language-button"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-labelledby="'language-label'"
      :aria-controls="isOpen ? dropdownId : undefined"
    >
      {{ t(`language.${locale}`) }}
      <span class="arrow" :class="{ 'arrow-up': isOpen }" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
          <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
        </svg>
      </span>
    </button>

    <div 
      v-if="isOpen" 
      :id="dropdownId" 
      class="language-dropdown"
      role="listbox"
      :aria-labelledby="'language-label'"
    >
      <button
        v-for="loc in AVAILABLE_LOCALES"
        :key="loc.code"
        @click="changeLocale(loc.code)"
        class="language-option"
        :class="{ active: locale === loc.code }"
        role="option"
        :aria-selected="locale === loc.code"
        :tabindex="locale === loc.code ? 0 : -1"
      >
        {{ t(`language.${loc.code}`) }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.language-switcher {
  position: relative;
  display: inline-block;
  margin: 1rem;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.language-button {
  background-color: var(--color-surface);
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: background-color var(--transition-fast), 
              box-shadow var(--transition-fast), 
              outline var(--transition-fast),
              border-color var(--transition-fast);
}

.language-button:hover {
  background-color: var(--color-surface-hover);
}

.language-button:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.arrow {
  font-size: 0.75rem;
  transition: transform 0.2s;
}

.arrow-up {
  transform: rotate(180deg);
}

.language-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--color-surface);
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-md);
  margin-top: var(--spacing-xs);
  overflow: hidden;
  z-index: 10;
  box-shadow: var(--shadow-md);
}

.language-option {
  width: 100%;
  text-align: left;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  background: none;
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  transition: background-color var(--transition-fast), 
              outline var(--transition-fast),
              color var(--transition-fast);
}

.language-option:hover {
  background-color: var(--color-surface-hover);
}

.language-option:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
  background-color: var(--color-surface-hover);
}

.language-option.active {
  background-color: var(--color-surface-hover);
  font-weight: var(--font-weight-bold);
}
</style>
