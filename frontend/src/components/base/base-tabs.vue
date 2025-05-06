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
        (tab.icon === undefined || typeof tab.icon === 'string')
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
</style>
