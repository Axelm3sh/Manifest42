<script setup>
import {useI18n} from 'vue-i18n';
import BaseCard from '../base/base-card.vue';

const { t, locale } = useI18n();

const props = defineProps({
  stockRiskItems: {
    type: Array,
    default: () => []
  }
});

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
</script>

<template>
  <div class="risk-table-container">
    <BaseCard v-if="stockRiskItems.length === 0" class="empty-state-card">
      <p>{{ t('ai_insights.no_risk_items') }}</p>
    </BaseCard>

    <BaseCard v-else class="risk-summary-card">
      <template #header>
        <h3>{{ t('ai_insights.high_risk_items', { count: stockRiskItems.length }) }}</h3>
      </template>

      <table class="risk-table">
        <thead>
          <tr>
            <th>{{ t('ai_insights.product') }}</th>
            <th>{{ t('ai_insights.risk_level') }}</th>
            <th>{{ t('ai_insights.current_stock') }}</th>
            <th>{{ t('ai_insights.predicted_demand') }}</th>
            <th>{{ t('ai_insights.stockout_date') }}</th>
            <th>{{ t('ai_insights.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in stockRiskItems" :key="item.id">
            <td>{{ item.productName }}</td>
            <td>
              <span 
                class="risk-badge" 
                :class="getRiskClass(item.stockRisk)"
              >
                {{ t(`ai_insights.risk_levels.${item.stockRisk}`) }}
              </span>
            </td>
            <td>{{ item.currentStock }}</td>
            <td>{{ item.predictedDemand }}</td>
            <td>{{ formatDate(item.predictedStockout) }}</td>
            <td>
              <button class="action-button small">
                {{ t('ai_insights.restock') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </BaseCard>
  </div>
</template>

<style scoped>
.risk-table-container {
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

.risk-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.risk-table th {
  text-align: left;
  padding: 0.75rem;
  border-bottom: var(--border-width-thick) solid var(--color-border);
  font-weight: var(--font-weight-semibold);
}

.risk-table td {
  padding: 0.75rem;
  border-bottom: var(--border-width-thin) solid var(--color-border);
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

.action-button.small {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
}
</style>