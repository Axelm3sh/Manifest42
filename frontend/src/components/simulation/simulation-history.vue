<script setup>
import {useI18n} from 'vue-i18n';
import BaseCard from '../base/base-card.vue';

const { t } = useI18n();

const props = defineProps({
  history: {
    type: Array,
    default: () => []
  }
});

// Helper methods
const formatNumber = (value, decimals = 0) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

const formatPercent = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString();
};
</script>

<template>
  <BaseCard :title="t('simulation.simulation_history')">
    <div v-if="history.length === 0" class="no-history">
      {{ t('simulation.no_history') }}
    </div>

    <table v-else class="history-table">
      <thead>
        <tr>
          <th>{{ t('simulation.timestamp') }}</th>
          <th>{{ t('simulation.parameters') }}</th>
          <th>{{ t('simulation.results') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in history" :key="item.id" class="history-item">
          <td>{{ formatDate(item.timestamp) }}</td>
          <td>
            <div class="parameter-summary">
              <div>{{ t('simulation.demand_variability') }}: {{ item.parameters.demandVariability.toFixed(1) }}</div>
              <div>{{ t('simulation.lead_time') }}: {{ item.parameters.leadTime }} {{ t('simulation.days') }}</div>
              <div>{{ t('simulation.reorder_point') }}: {{ item.parameters.reorderPoint }}</div>
              <div>{{ t('simulation.order_quantity') }}: {{ item.parameters.orderQuantity }}</div>
            </div>
          </td>
          <td>
            <div class="result-summary">
              <div>{{ t('simulation.average_stock_level') }}: {{ formatNumber(item.summary.averageStockLevel, 1) }}</div>
              <div>{{ t('simulation.service_level') }}: {{ formatPercent(item.summary.serviceLevel) }}</div>
              <div>{{ t('simulation.stockout_days') }}: {{ item.summary.stockoutDays }}</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </BaseCard>
</template>

<style scoped>
.no-history {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.history-table th {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
  font-weight: 600;
}

.history-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: top;
}

.parameter-summary,
.result-summary {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
}
</style>