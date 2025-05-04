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
  border-radius: 0.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}

.base-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Variants */
.variant-default {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #4b5563;
}

.variant-default:hover:not(.disabled) {
  background-color: #e5e7eb;
  color: #1f2937;
}

.variant-default.active {
  background-color: #e5e7eb;
  color: #1f2937;
}

.variant-primary {
  background-color: #3b82f6;
  border: 1px solid #2563eb;
  color: white;
}

.variant-primary:hover:not(.disabled) {
  background-color: #2563eb;
}

.variant-primary.active {
  background-color: #1d4ed8;
}

.variant-danger {
  background-color: #ef4444;
  border: 1px solid #dc2626;
  color: white;
}

.variant-danger:hover:not(.disabled) {
  background-color: #dc2626;
}

.variant-success {
  background-color: #10b981;
  border: 1px solid #059669;
  color: white;
}

.variant-success:hover:not(.disabled) {
  background-color: #059669;
}

.variant-warning {
  background-color: #f59e0b;
  border: 1px solid #d97706;
  color: white;
}

.variant-warning:hover:not(.disabled) {
  background-color: #d97706;
}

/* Sizes */
.size-small {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.size-medium {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.size-large {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}
</style>