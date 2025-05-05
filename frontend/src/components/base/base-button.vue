<script setup>
import {computed} from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'danger', 'success', 'warning'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event);
  }
};

const buttonClasses = computed(() => {
  return {
    'base-button': true,
    [`variant-${props.variant}`]: true,
    [`size-${props.size}`]: true,
    'disabled': props.disabled,
    'active': props.active
  };
});
</script>

<template>
  <button 
    :class="buttonClasses" 
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}

.base-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Variants */
.variant-default {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}
.variant-default:hover:not(.disabled),
.variant-default.active {
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
}

.variant-primary {
  background-color: var(--color-primary);
  border: 1px solid var(--color-primary-dark);
  color: var(--color-button-text);
}
.variant-primary:hover:not(.disabled) {
  background-color: var(--color-primary-hover);
}
.variant-primary.active {
  background-color: var(--color-primary-dark);
}

.variant-danger {
  background-color: var(--color-danger);
  border: 1px solid var(--color-danger-dark);
  color: var(--color-button-text);
}
.variant-danger:hover:not(.disabled) {
  background-color: var(--color-danger-dark);
}

.variant-success {
  background-color: var(--color-success);
  border: 1px solid var(--color-success-dark);
  color: var(--color-button-text);
}
.variant-success:hover:not(.disabled) {
  background-color: var(--color-success-dark);
}

.variant-warning {
  background-color: var(--color-warning);
  border: 1px solid var(--color-warning-dark);
  color: var(--color-button-text);
}
.variant-warning:hover:not(.disabled) {
  background-color: var(--color-warning-dark);
}

/* Sizes */
.size-small {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
}

.size-medium {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
}

.size-large {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-md);
}
</style>