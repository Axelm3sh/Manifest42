<script setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {useAiInsightsStore} from '../../stores/aiInsights';
import BaseCard from '../base/base-card.vue';

const { t } = useI18n();
const aiInsightsStore = useAiInsightsStore();

const props = defineProps({
  hasOverrides: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['clearAllOverrides']);

// Computed properties
const modelParameters = computed(() => aiInsightsStore.modelParameters);

// Methods
const updateModelParameter = (key, value) => {
  const params = { [key]: value };
  aiInsightsStore.updateModelParameters(params);
};

const clearAllOverrides = () => {
  emit('clearAllOverrides');
};

// Helper methods
const formatConfidence = (confidence) => {
  return `${Math.round(confidence * 100)}%`;
};
</script>

<template>
  <BaseCard class="model-settings-card">
    <template #header>
      <h3>{{ t('ai_insights.model_parameters') }}</h3>
    </template>
    
    <div class="model-parameters">
      <div class="parameter-group">
        <label for="confidence-threshold">{{ t('ai_insights.confidence_threshold') }}</label>
        <div class="parameter-control">
          <input 
            id="confidence-threshold"
            type="range" 
            min="0" 
            max="1" 
            step="0.05"
            :value="modelParameters.confidenceThreshold"
            @input="updateModelParameter('confidenceThreshold', parseFloat($event.target.value))"
          />
          <span class="parameter-value">{{ formatConfidence(modelParameters.confidenceThreshold) }}</span>
        </div>
      </div>

      <div class="parameter-group">
        <label for="time-horizon">{{ t('ai_insights.time_horizon') }}</label>
        <div class="parameter-control">
          <input 
            id="time-horizon"
            type="range" 
            min="7" 
            max="90" 
            step="1"
            :value="modelParameters.timeHorizon"
            @input="updateModelParameter('timeHorizon', parseInt($event.target.value))"
          />
          <span class="parameter-value">{{ modelParameters.timeHorizon }} {{ t('ai_insights.days') }}</span>
        </div>
      </div>

      <div class="parameter-group">
        <label for="seasonality-enabled">{{ t('ai_insights.seasonality') }}</label>
        <div class="parameter-control">
          <input 
            id="seasonality-enabled"
            type="checkbox"
            :checked="modelParameters.seasonalityEnabled"
            @change="updateModelParameter('seasonalityEnabled', $event.target.checked)"
          />
        </div>
      </div>

      <div class="parameter-group">
        <label for="external-factors">{{ t('ai_insights.external_factors') }}</label>
        <div class="parameter-control">
          <input 
            id="external-factors"
            type="checkbox"
            :checked="modelParameters.includeExternalFactors"
            @change="updateModelParameter('includeExternalFactors', $event.target.checked)"
          />
        </div>
      </div>
    </div>

    <template #footer v-if="hasOverrides">
      <div class="overrides-section">
        <h4>{{ t('ai_insights.user_overrides') }}</h4>
        <button @click="clearAllOverrides" class="clear-overrides-button">
          {{ t('ai_insights.clear_all_overrides') }}
        </button>
      </div>
    </template>
  </BaseCard>
</template>

<style scoped>
.model-parameters {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.parameter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.parameter-group label {
  font-weight: 600;
  font-size: 0.875rem;
}

.parameter-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.parameter-value {
  min-width: 3rem;
  text-align: right;
  font-size: 0.875rem;
  color: #4b5563;
}

.overrides-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.overrides-section h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.clear-overrides-button {
  background-color: #ef4444;
  border: 1px solid #dc2626;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clear-overrides-button:hover {
  background-color: #dc2626;
}
</style>