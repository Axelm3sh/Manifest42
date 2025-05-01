<script setup>
import {computed} from 'vue';
import Card from 'primevue/card';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  noPadding: {
    type: Boolean,
    default: false
  }
});

// Computed property for card classes
const cardClasses = computed(() => ({
  'bg-surface shadow-sm rounded-lg overflow-hidden flex flex-col transition-all': true,
  'card-no-padding': props.noPadding
}));

// Pass-through customization for PrimeVue Card
const cardPT = computed(() => ({
  root: { 
    class: cardClasses.value 
  },
  content: { 
    class: props.noPadding ? 'p-0' : 'p-4' 
  },
  title: { 
    class: 'text-lg font-semibold text-text-primary m-0' 
  },
  header: { 
    class: 'p-4 border-b border-border flex justify-between items-center' 
  },
  footer: { 
    class: 'p-4 border-t border-border' 
  }
}));
</script>

<template>
  <Card :pt="cardPT">
    <template #header v-if="title || $slots.header">
      <h3 v-if="title" class="text-lg font-semibold text-text-primary m-0">{{ title }}</h3>
      <slot name="header"></slot>
    </template>
    <template #content>
      <slot></slot>
    </template>
    <template #footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>
  </Card>
</template>

<style>
/* No scoped styles needed - using TailwindCSS and PrimeVue styling */
</style>
