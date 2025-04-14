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
  gap: 1rem;
}

.empty-state-card {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  font-style: italic;
}

.risk-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.risk-table th {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
  font-weight: 600;
}

.risk-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
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

.action-button.small {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}
</style>