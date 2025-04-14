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
      {{ t('simulation.no_scenarios') }}
    </div>

    <div v-else class="scenarios-list">
      <div 
        v-for="scenario in scenarios" 
        :key="scenario.id"
        class="scenario-item"
        :class="{ 'active': currentScenario === scenario.id }"
      >
        <div class="scenario-name">{{ scenario.name }}</div>
        <div class="scenario-actions">
          <BaseButton 
            variant="primary"
            size="small"
            @click="loadScenario(scenario.id)" 
            :disabled="currentScenario === scenario.id"
          >
            {{ t('simulation.load') }}
          </BaseButton>
          <BaseButton 
            v-if="scenario.id !== 'default'"
            variant="danger"
            size="small"
            @click="deleteScenario(scenario.id)" 
          >
            {{ t('simulation.delete') }}
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
  color: #6b7280;
  font-style: italic;
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
  background-color: #f9fafb;
  border-radius: 0.25rem;
  border-left: 4px solid transparent;
}

.scenario-item.active {
  border-left-color: #3b82f6;
  background-color: #eff6ff;
}

.scenario-name {
  font-weight: 500;
}

.scenario-actions {
  display: flex;
  gap: 0.5rem;
}
</style>