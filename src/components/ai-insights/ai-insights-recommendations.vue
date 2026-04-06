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
  gap: var(--spacing-md);
}

.empty-state-card {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-secondary);
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
  font-weight: var(--font-weight-semibold);
}

.urgency-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.urgency-high {
  background-color: var(--color-danger-bg);
  color: var(--color-danger-text);
}

.urgency-medium {
  background-color: var(--color-warning-bg);
  color: var(--color-warning-text);
}

.urgency-low {
  background-color: var(--color-success-bg);
  color: var(--color-success-text);
}

.recommendation-details {
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

.recommendation-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}

.action-button {
  background-color: var(--color-primary);
  border: var(--border-width-thin) solid var(--color-primary-dark);
  color: var(--color-button-text);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.action-button:hover {
  background-color: var(--color-primary-hover);
}

.dismiss-button {
  background-color: var(--color-surface);
  border: var(--border-width-thin) solid var(--color-border);
  color: var(--color-text-secondary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.dismiss-button:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
}
</style>