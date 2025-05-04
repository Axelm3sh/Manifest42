<script setup>
import {computed} from 'vue';
import Dropdown from 'primevue/dropdown';

const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: null
  },
  options: {
    type: Array,
    required: true,
    default: () => []
  },
  optionLabel: {
    type: String,
    default: 'label'
  },
  optionValue: {
    type: String,
    default: 'value'
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  invalid: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
});

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur']);

// Handle value change
const handleChange = (event) => {
  emit('update:modelValue', event.value);
  emit('change', event);
};

// Handle focus event
const handleFocus = (event) => {
  emit('focus', event);
};

// Handle blur event
const handleBlur = (event) => {
  emit('blur', event);
};

// Compute dropdown classes based on props
const dropdownClasses = computed(() => ({
  'w-full transition-colors duration-200': true,
  'text-sm': props.size === 'small',
  'text-base': props.size === 'medium',
  'text-lg': props.size === 'large'
}));

// Pass-through customization for PrimeVue Dropdown
const dropdownPT = computed(() => ({
  root: { 
    class: [
      dropdownClasses.value,
      props.invalid ? 'p-invalid' : ''
    ]
  },
  input: {
    class: [
      'bg-background border border-border rounded-md px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none',
      props.disabled ? 'bg-background-muted text-text-disabled cursor-not-allowed' : '',
      props.invalid ? 'border-danger focus:border-danger focus:ring-danger' : '',
      props.size === 'small' ? 'px-2 py-1 text-sm' : '',
      props.size === 'large' ? 'px-4 py-3 text-lg' : ''
    ]
  },
  panel: {
    class: 'bg-surface border border-border rounded-md shadow-md'
  },
  item: {
    class: [
      'px-3 py-2 cursor-pointer hover:bg-surface-hover',
      props.size === 'small' ? 'px-2 py-1 text-sm' : '',
      props.size === 'large' ? 'px-4 py-3 text-lg' : ''
    ]
  },
  itemGroup: {
    class: 'font-semibold px-3 py-2 text-text-secondary'
  },
  emptyMessage: {
    class: 'px-3 py-2 text-text-tertiary'
  }
}));
</script>

<template>
  <div class="base-dropdown">
    <Dropdown
      :modelValue="modelValue"
      :options="options"
      :optionLabel="optionLabel"
      :optionValue="optionValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :pt="dropdownPT"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <template #value="slotProps" v-if="$slots.value">
        <slot name="value" :value="slotProps.value" />
      </template>
      
      <template #option="slotProps" v-if="$slots.option">
        <slot name="option" :option="slotProps.option" />
      </template>
      
      <template #empty v-if="$slots.empty">
        <slot name="empty" />
      </template>
    </Dropdown>
    
    <div v-if="invalid && errorMessage" class="text-danger text-sm mt-1">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style>
/* No scoped styles needed - using TailwindCSS and PrimeVue styling */
</style>