<script setup>
import {computed} from 'vue';
import Dialog from 'primevue/dialog';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  visible: {
    type: Boolean,
    default: false
  },
  modal: {
    type: Boolean,
    default: true
  },
  closable: {
    type: Boolean,
    default: true
  },
  dismissableMask: {
    type: Boolean,
    default: false
  },
  position: {
    type: String,
    default: 'center',
    validator: (value) => ['center', 'top', 'bottom', 'left', 'right', 'topleft', 'topright', 'bottomleft', 'bottomright'].includes(value)
  },
  maximizable: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: '50vw'
  },
  minWidth: {
    type: String,
    default: '20rem'
  },
  fullScreen: {
    type: Boolean,
    default: false
  }
});

// Emit events for dialog
const emit = defineEmits(['update:visible', 'show', 'hide', 'maximize', 'unmaximize']);

// Handle dialog events
const onShow = () => {
  emit('show');
};

const onHide = () => {
  emit('update:visible', false);
  emit('hide');
};

const onMaximize = (event) => {
  emit('maximize', event);
};

const onUnmaximize = () => {
  emit('unmaximize');
};

// Computed property for dialog classes
const dialogClasses = computed(() => ({
  'bg-surface shadow-lg rounded-lg overflow-hidden transition-all': true,
  'modal-dialog-fullscreen': props.fullScreen
}));

// Pass-through customization for PrimeVue Dialog
const dialogPT = computed(() => ({
  root: { 
    class: dialogClasses.value 
  },
  header: { 
    class: 'p-4 border-b border-border flex justify-between items-center bg-surface-50' 
  },
  headerTitle: { 
    class: 'text-lg font-semibold text-text-primary m-0' 
  },
  headerIcons: {
    class: 'flex items-center'
  },
  closeButton: {
    class: 'p-2 rounded-full hover:bg-surface-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500'
  },
  closeButtonIcon: {
    class: 'text-text-secondary'
  },
  maximizeButton: {
    class: 'p-2 rounded-full hover:bg-surface-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 mr-2'
  },
  content: { 
    class: 'p-4 bg-surface' 
  },
  footer: { 
    class: 'p-4 border-t border-border bg-surface-50 flex justify-end gap-2' 
  },
  mask: {
    class: 'bg-black/50'
  }
}));

// Computed style for dialog width
const dialogStyle = computed(() => ({
  width: props.width,
  minWidth: props.minWidth
}));
</script>

<template>
  <Dialog
    :visible="visible"
    :modal="modal"
    :closable="closable"
    :dismissable-mask="dismissableMask"
    :pt="dialogPT"
    :position="position"
    :maximizable="maximizable"
    :style="dialogStyle"
    @update:visible="(value) => emit('update:visible', value)"
    @show="onShow"
    @hide="onHide"
    @maximize="onMaximize"
    @unmaximize="onUnmaximize"
  >
    <template #header>
      <h3 v-if="title" class="text-lg font-semibold text-text-primary m-0">{{ title }}</h3>
      <slot name="header"></slot>
    </template>
    
    <template #default>
      <slot></slot>
    </template>
    
    <template #footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>
  </Dialog>
</template>

<style scoped>
.modal-dialog-fullscreen {
  width: 100vw !important;
  height: 100vh !important;
  max-height: 100vh !important;
  top: 0 !important;
  left: 0 !important;
  margin: 0 !important;
}

/* Responsive styles */
@media (max-width: 640px) {
  :deep(.p-dialog) {
    width: 90vw !important;
    max-width: 90vw;
    margin: 0 auto;
  }
  
  :deep(.p-dialog-header) {
    padding: 0.75rem;
  }
  
  :deep(.p-dialog-content) {
    padding: 0.75rem;
  }
  
  :deep(.p-dialog-footer) {
    padding: 0.75rem;
  }
}
</style>