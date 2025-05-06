<script setup>
import {useI18n} from 'vue-i18n';
import BaseCard from '../base/base-card.vue';
import BaseButton from '../base/base-button.vue';

const { t } = useI18n();

const props = defineProps({
  scenarios: {
    type: Array,
    default: () => []
  },
  currentScenario: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['load', 'delete']);

const loadScenario = (id) => {
  emit('load', id);
};

const deleteScenario = (id) => {
  if (confirm(t('simulation.confirm_delete_scenario'))) {
    emit('delete', id);
  }
};
</script>

<template>
  <BaseCard :title="t('simulation.saved_scenarios')">
    <div v-if="scenarios.length === 0" class="no-scenarios">
      <i class="pi pi-info-circle"></i> {{ t('simulation.no_scenarios') }}
    </div>

    <div v-else class="scenarios-list">
      <div 
        v-for="scenario in scenarios" 
        :key="scenario.id"
        class="scenario-item"
        :class="{ 'active': currentScenario === scenario.id }"
      >
        <div class="scenario-name">
          <i class="pi" :class="currentScenario === scenario.id ? 'pi-bookmark-fill' : 'pi-bookmark'"></i>
          {{ scenario.name }}
        </div>
        <div class="scenario-actions">
          <BaseButton 
            variant="primary"
            size="small"
            @click="loadScenario(scenario.id)" 
            :disabled="currentScenario === scenario.id"
          >
            <i class="pi pi-download"></i> {{ t('simulation.load') }}
          </BaseButton>
          <BaseButton 
            v-if="scenario.id !== 'default'"
            variant="danger"
            size="small"
            @click="deleteScenario(scenario.id)" 
          >
            <i class="pi pi-trash"></i> {{ t('simulation.delete') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
.no-scenarios {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-tertiary);
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.no-scenarios .pi {
  color: var(--color-primary);
  font-size: 1.25rem;
}

.scenarios-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.scenario-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: var(--color-surface);
  border-radius: 0.25rem;
  border-left: 4px solid transparent;
  transition: background-color 0.2s, border-color 0.2s;
  box-shadow: 0 1px 3px var(--color-shadow);
}

.scenario-item:hover {
  background-color: var(--color-surface-hover);
}

.scenario-item.active {
  border-left-color: var(--color-primary);
  background-color: var(--color-primary-muted);
}

.scenario-name {
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-primary);
}

.scenario-name .pi {
  color: var(--color-primary);
  font-size: 1rem;
}

.scenario-actions {
  display: flex;
  gap: 0.5rem;
}
</style>
