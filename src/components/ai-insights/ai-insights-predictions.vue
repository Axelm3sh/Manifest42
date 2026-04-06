<script setup>
import {useI18n} from 'vue-i18n';
import BaseCard from '../base/base-card.vue';

const { t, locale } = useI18n();

const props = defineProps({
  predictions: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['applyOverride']);

// Methods
const applyOverride = (itemId, overrideData) => {
  emit('applyOverride', itemId, overrideData);
};

// Helper methods
const getRiskClass = (risk) => {
  const riskMap = {
    'critical': 'risk-critical',
    'high': 'risk-high',
    'medium': 'risk-medium',
    'low': 'risk-low',
    'none': 'risk-none'
  };
  return riskMap[risk] || riskMap.none;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

const formatConfidence = (confidence) => {
  return `${Math.round(confidence * 100)}%`;
};
</script>

<template>
  <div class="predictions-container">
    <BaseCard v-if="predictions.length === 0" class="empty-state-card">
      <p>{{ t('ai_insights.no_predictions') }}</p>
    </BaseCard>

    <BaseCard 
      v-else 
      v-for="prediction in predictions" 
      :key="prediction.id" 
      class="prediction-card"
    >
      <template #header>
        <div class="prediction-header">
          <h3>{{ prediction.productName }}</h3>
          <span 
            class="risk-badge" 
            :class="getRiskClass(prediction.stockRisk)"
          >
            {{ t(`ai_insights.risk_levels.${prediction.stockRisk}`) }}
          </span>
        </div>
      </template>

      <div class="prediction-details">
        <div class="detail-item">
          <span class="detail-label">{{ t('ai_insights.current_stock') }}:</span>
          <span class="detail-value">{{ prediction.currentStock }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">{{ t('ai_insights.predicted_demand') }}:</span>
          <span class="detail-value">{{ prediction.predictedDemand }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">{{ t('ai_insights.confidence') }}:</span>
          <span class="detail-value">{{ formatConfidence(prediction.confidence) }}</span>
        </div>
        <div v-if="prediction.predictedStockout" class="detail-item">
          <span class="detail-label">{{ t('ai_insights.predicted_stockout') }}:</span>
          <span class="detail-value stockout-date">{{ formatDate(prediction.predictedStockout) }}</span>
        </div>
      </div>

      <template #footer>
        <div class="prediction-actions">
          <button 
            @click="applyOverride(prediction.id, { predictedDemand: Math.round(prediction.predictedDemand * 1.2) })" 
            class="override-button"
          >
            {{ t('ai_insights.increase_demand') }}
          </button>
          <button 
            @click="applyOverride(prediction.id, { predictedDemand: Math.round(prediction.predictedDemand * 0.8) })" 
            class="override-button"
          >
            {{ t('ai_insights.decrease_demand') }}
          </button>
        </div>
      </template>
    </BaseCard>
  </div>
</template>

<style scoped>
.predictions-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.empty-state-card {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-secondary);
  font-style: italic;
}

.prediction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.prediction-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: var(--font-weight-semibold);
}

.risk-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.risk-critical {
  background-color: var(--color-danger-bg);
  color: var(--color-danger-text);
}

.risk-high {
  background-color: var(--color-warning-bg);
  color: var(--color-warning-text);
}

.risk-medium {
  background-color: var(--color-info-bg);
  color: var(--color-info-text);
}

.risk-low {
  background-color: var(--color-success-bg);
  color: var(--color-success-text);
}

.risk-none {
  background-color: var(--color-surface-hover);
  color: var(--color-text-secondary);
}

.prediction-details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.detail-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.detail-value {
  font-weight: var(--font-weight-medium);
}

.stockout-date {
  color: var(--color-danger-text);
}

.prediction-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}

.override-button {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  background-color: var(--color-surface);
  border: var(--border-width-thin) solid var(--color-border);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.override-button:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
}
</style>