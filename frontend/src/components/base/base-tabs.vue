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
  gap: 0.25rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.tab-button .pi {
  font-size: 1rem;
}

.tab-button:hover:not(.disabled) {
  color: #4b5563;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
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
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.15rem 0.35rem;
  border-radius: 1rem;
  background-color: #ef4444;
  color: white;
  margin-left: 0.5rem;
}

.new-result-badge {
  background-color: #10b981;
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
