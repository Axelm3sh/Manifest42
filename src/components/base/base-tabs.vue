<script setup>
import {ref, watch} from 'vue';

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(tab => 
        typeof tab.id === 'string' && 
        typeof tab.label === 'string' && 
        (tab.icon === undefined || typeof tab.icon === 'string') &&
        (tab.badge === undefined || tab.badge === null || typeof tab.badge === 'string') &&
        (tab.badgeClass === undefined || tab.badgeClass === null || typeof tab.badgeClass === 'string')
      );
    }
  },
  modelValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const activeTab = ref(props.modelValue || (props.tabs.length > 0 ? props.tabs[0].id : ''));

watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue !== activeTab.value) {
    activeTab.value = newValue;
  }
});

const setActiveTab = (tabId) => {
  if (!props.disabled) {
    activeTab.value = tabId;
    emit('update:modelValue', tabId);
  }
};
</script>

<template>
  <div class="base-tabs">
    <div class="tabs-navigation">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="setActiveTab(tab.id)" 
        class="tab-button"
        :class="{ 
          'active': activeTab === tab.id,
          'disabled': disabled
        }"
        :disabled="disabled"
      >
        <i v-if="tab.icon" class="pi" :class="tab.icon"></i>
        <span>{{ tab.label }}</span>
        <span v-if="tab.badge" class="tab-badge" :class="tab.badgeClass">{{ tab.badge }}</span>
      </button>
    </div>
    <div class="tab-content">
      <slot :name="activeTab"></slot>
    </div>
  </div>
</template>

<style scoped>
.base-tabs {
  display: flex;
  flex-direction: column;
}

.tabs-navigation {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
  border-bottom: var(--border-width-thin) solid var(--color-border);
}

.tab-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: none;
  border-bottom: var(--border-width-thick) solid transparent;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color var(--transition-fast), border-color var(--transition-fast);
}

.tab-button .pi {
  font-size: var(--font-size-md);
}

.tab-button:hover:not(.disabled) {
  color: var(--color-text-primary);
}

.tab-button.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.tab-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tab-content {
  flex: 1;
}

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  padding: 2px var(--spacing-xs);
  border-radius: var(--border-radius-full);
  background-color: var(--color-danger);
  color: var(--color-white);
  margin-left: var(--spacing-sm);
}

.new-result-badge {
  background-color: var(--color-success);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
