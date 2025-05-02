<script setup>
import {computed} from 'vue';
import Card from 'primevue/card';
import Panel from 'primevue/panel';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  toggleable: {
    type: Boolean,
    default: false
  },
  collapsed: {
    type: Boolean,
    default: false
  },
  usePanel: {
    type: Boolean,
    default: false
  },
  noPadding: {
    type: Boolean,
    default: false
  }
});

// Emit events for panel toggle
const emit = defineEmits(['toggle']);

// Handle panel toggle event
const onToggle = (event) => {
  emit('toggle', event);
};

// Computed property for card classes
const containerClasses = computed(() => ({
  'bg-surface shadow-sm rounded-lg overflow-hidden flex flex-col transition-all': true,
  'form-container-no-padding': props.noPadding
}));

// Pass-through customization for PrimeVue Card
const cardPT = computed(() => ({
  root: { 
    class: containerClasses.value 
  },
  content: { 
    class: props.noPadding ? 'p-0' : 'p-4' 
  },
  title: { 
    class: 'text-lg font-semibold text-text-primary m-0' 
  },
  subtitle: {
    class: 'text-sm text-text-secondary mt-1 mb-0'
  },
  header: { 
    class: 'p-4 border-b border-border flex justify-between items-center' 
  },
  footer: { 
    class: 'p-4 border-t border-border' 
  }
}));

// Pass-through customization for PrimeVue Panel
const panelPT = computed(() => ({
  root: { 
    class: `${containerClasses.value} form-panel` 
  },
  content: { 
    class: props.noPadding ? 'p-0' : 'p-4' 
  },
  header: { 
    class: 'p-4 border-b border-border flex justify-between items-center' 
  },
  title: { 
    class: 'text-lg font-semibold text-text-primary m-0' 
  },
  toggler: {
    class: 'p-panel-toggler ml-2 text-text-secondary hover:text-text-primary transition-colors'
  }
}));
</script>

<template>
  <!-- Use Panel component when toggleable is true -->
  <Panel v-if="usePanel || toggleable" 
         :pt="panelPT" 
         :toggleable="toggleable"
         :collapsed="collapsed"
         @toggle="onToggle">
    <template #header>
      <div class="flex flex-col">
        <h3 v-if="title" class="text-lg font-semibold text-text-primary m-0">{{ title }}</h3>
        <p v-if="subtitle" class="text-sm text-text-secondary mt-1 mb-0">{{ subtitle }}</p>
      </div>
      <slot name="header-actions"></slot>
    </template>
    <template #default>
      <slot></slot>
    </template>
    <template #footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>
  </Panel>

  <!-- Use Card component when not toggleable -->
  <Card v-else :pt="cardPT">
    <template #header v-if="title || subtitle || $slots.header || $slots['header-actions']">
      <div class="flex justify-between items-center w-full">
        <div class="flex flex-col">
          <h3 v-if="title" class="text-lg font-semibold text-text-primary m-0">{{ title }}</h3>
          <p v-if="subtitle" class="text-sm text-text-secondary mt-1 mb-0">{{ subtitle }}</p>
          <slot name="header"></slot>
        </div>
        <slot name="header-actions"></slot>
      </div>
    </template>
    <template #content>
      <slot></slot>
    </template>
    <template #footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>
  </Card>
</template>

<style scoped>
.form-container-no-padding :deep(.p-card-content),
.form-container-no-padding :deep(.p-panel-content) {
  padding: 0;
}

/* Panel specific styles */
.form-panel :deep(.p-panel-header) {
  background: transparent;
  border-width: 0 0 1px 0;
  border-color: var(--border-color, #e5e7eb);
}

.form-panel :deep(.p-panel-content) {
  background: transparent;
  border: none;
}

.form-panel :deep(.p-panel-toggler) {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-panel :deep(.p-panel-toggler:hover) {
  background-color: rgba(0, 0, 0, 0.04);
}

.form-panel :deep(.p-panel-toggler-icon) {
  transition: transform 0.2s;
}

.form-panel :deep(.p-panel-collapsed .p-panel-toggler-icon) {
  transform: rotate(-90deg);
}

/* Responsive styles */
@media (max-width: 640px) {
  .form-panel :deep(.p-panel-header),
  :deep(.p-card-header) {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-panel :deep(.p-panel-header) > div,
  :deep(.p-card-header) > div {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .form-panel :deep(.p-panel-toggler) {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
}
</style>