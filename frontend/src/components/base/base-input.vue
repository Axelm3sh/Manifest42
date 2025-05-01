<script setup>
import {computed} from 'vue';
import InputText from 'primevue/inputtext';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  required: {
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

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'input']);

// Handle input changes
const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
  emit('input', event);
};

// Handle focus event
const handleFocus = (event) => {
  emit('focus', event);
};

// Handle blur event
const handleBlur = (event) => {
  emit('blur', event);
};

// Compute input classes based on props
const inputClasses = computed(() => ({
  'w-full transition-colors duration-200': true,
  'text-sm': props.size === 'small',
  'text-base': props.size === 'medium',
  'text-lg': props.size === 'large',
  'border-danger': props.invalid
}));

// Pass-through customization for PrimeVue InputText
const inputPT = computed(() => ({
  root: { 
    class: [
      inputClasses.value,
      props.invalid ? 'p-invalid' : ''
    ]
  }
}));
</script>

<template>
  <div class="base-input">
    <InputText
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :class="[
        'bg-background border border-border rounded-md px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none',
        disabled ? 'bg-background-muted text-text-disabled cursor-not-allowed' : '',
        invalid ? 'border-danger focus:border-danger focus:ring-danger' : '',
        size === 'small' ? 'px-2 py-1 text-sm' : '',
        size === 'large' ? 'px-4 py-3 text-lg' : ''
      ]"
      :pt="inputPT"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <div v-if="invalid && errorMessage" class="text-danger text-sm mt-1">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style>
/* No scoped styles needed - using TailwindCSS and PrimeVue styling */
</style>