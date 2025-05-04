<script setup>
import {computed} from 'vue';
import Button from 'primevue/button';

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

// Map our variant to PrimeVue severity
const severity = computed(() => {
  const variantMap = {
    'default': null,
    'primary': 'primary',
    'danger': 'danger',
    'success': 'success',
    'warning': 'warning'
  };
  return variantMap[props.variant];
});

// Map our size to PrimeVue size
const buttonSize = computed(() => {
  const sizeMap = {
    'small': 'small',
    'medium': null, // Default size
    'large': 'large'
  };
  return sizeMap[props.size];
});

// Tailwind classes for the button
const buttonClasses = computed(() => {
  return {
    'active': props.active
  };
});
</script>

<template>
  <Button 
    :severity="severity"
    :size="buttonSize"
    :disabled="disabled"
    :class="[
      'transition-colors duration-200',
      props.active ? 'ring-2 ring-primary-light' : '',
      props.variant === 'default' ? 'bg-surface border-border text-text hover:bg-surface-hover' : ''
    ]"
    @click="handleClick"
    :pt="{
      root: { class: 'font-medium' }
    }"
  >
    <slot></slot>
  </Button>
</template>

<style>
/* No scoped styles needed - using TailwindCSS and PrimeVue styling */
</style>
