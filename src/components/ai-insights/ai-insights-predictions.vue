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
  gap: 1rem;
}

.empty-state-card {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
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
  font-weight: 600;
}

.risk-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.risk-critical {
  background-color: #fee2e2;
  color: #b91c1c;
}

.risk-high {
  background-color: #fef3c7;
  color: #b45309;
}

.risk-medium {
  background-color: #e0f2fe;
  color: #0369a1;
}

.risk-low {
  background-color: #dcfce7;
  color: #15803d;
}

.risk-none {
  background-color: #f3f4f6;
  color: #4b5563;
}

.prediction-details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.detail-value {
  font-weight: 500;
}

.stockout-date {
  color: #b91c1c;
}

.prediction-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.override-button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #4b5563;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.override-button:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}
</style>