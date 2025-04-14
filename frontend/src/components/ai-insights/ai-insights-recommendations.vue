<script setup>
import {useI18n} from 'vue-i18n';
import BaseCard from '../base/base-card.vue';

const { t } = useI18n();

const props = defineProps({
  recommendations: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['clearOverride']);

// Methods
const clearOverride = (productId) => {
  emit('clearOverride', productId);
};

// Helper methods
const getUrgencyClass = (urgency) => {
  const urgencyMap = {
    'high': 'urgency-high',
    'medium': 'urgency-medium',
    'low': 'urgency-low'
  };
  return urgencyMap[urgency] || urgencyMap.low;
};

const formatConfidence = (confidence) => {
  return `${Math.round(confidence * 100)}%`;
};
</script>

<template>
  <div class="recommendations-container">
    <BaseCard v-if="recommendations.length === 0" class="empty-state-card">
      <p>{{ t('ai_insights.no_recommendations') }}</p>
    </BaseCard>

    <BaseCard 
      v-else 
      v-for="recommendation in recommendations" 
      :key="recommendation.id" 
      class="recommendation-card"
    >
      <template #header>
        <div class="recommendation-header">
          <h3>{{ recommendation.productName }}</h3>
          <span 
            class="urgency-badge" 
            :class="getUrgencyClass(recommendation.urgency)"
          >
            {{ t(`ai_insights.urgency_levels.${recommendation.urgency}`) }}
          </span>
        </div>
      </template>

      <div class="recommendation-details">
        <div class="detail-item">
          <span class="detail-label">{{ t('ai_insights.recommendation_type') }}:</span>
          <span class="detail-value">{{ t(`ai_insights.recommendation_types.${recommendation.type}`) }}</span>
        </div>

        <div v-if="recommendation.type === 'restock'" class="detail-item">
          <span class="detail-label">{{ t('ai_insights.recommended_order') }}:</span>
          <span class="detail-value">{{ recommendation.recommendedOrder }}</span>
        </div>

        <div v-if="recommendation.type === 'overstock'" class="detail-item">
          <span class="detail-label">{{ t('ai_insights.excess_stock') }}:</span>
          <span class="detail-value">{{ recommendation.excessStock }}</span>
        </div>

        <div class="detail-item">
          <span class="detail-label">{{ t('ai_insights.reason') }}:</span>
          <span class="detail-value">{{ recommendation.reason }}</span>
        </div>

        <div class="detail-item">
          <span class="detail-label">{{ t('ai_insights.confidence') }}:</span>
          <span class="detail-value">{{ formatConfidence(recommendation.confidence) }}</span>
        </div>
      </div>

      <template #footer>
        <div class="recommendation-actions">
          <button class="action-button">
            {{ recommendation.type === 'restock' ? t('ai_insights.create_order') : t('ai_insights.manage_stock') }}
          </button>
          <button 
            @click="clearOverride(recommendation.productId)" 
            class="dismiss-button"
          >
            {{ t('ai_insights.dismiss') }}
          </button>
        </div>
      </template>
    </BaseCard>
  </div>
</template>

<style scoped>
.recommendations-container {
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

.recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.recommendation-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.urgency-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.urgency-high {
  background-color: #fee2e2;
  color: #b91c1c;
}

.urgency-medium {
  background-color: #fef3c7;
  color: #b45309;
}

.urgency-low {
  background-color: #dcfce7;
  color: #15803d;
}

.recommendation-details {
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

.recommendation-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.action-button {
  background-color: #3b82f6;
  border: 1px solid #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #2563eb;
}

.dismiss-button {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #4b5563;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.dismiss-button:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}
</style>