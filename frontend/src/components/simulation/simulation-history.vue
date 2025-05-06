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
      <i class="pi pi-info-circle"></i> {{ t('simulation.no_history') }}
    </div>

    <table v-else class="history-table">
      <thead>
        <tr>
          <th><i class="pi pi-calendar"></i> {{ t('simulation.timestamp') }}</th>
          <th><i class="pi pi-cog"></i> {{ t('simulation.parameters') }}</th>
          <th><i class="pi pi-chart-line"></i> {{ t('simulation.results') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in history" :key="item.id" class="history-item">
          <td>
            <div class="timestamp">
              <i class="pi pi-clock"></i>
              {{ formatDate(item.timestamp) }}
            </div>
          </td>
          <td>
            <div class="parameter-summary">
              <div><i class="pi pi-chart-bar"></i> {{ t('simulation.demand_variability') }}: {{ item.parameters.demandVariability.toFixed(1) }}</div>
              <div><i class="pi pi-hourglass"></i> {{ t('simulation.lead_time') }}: {{ item.parameters.leadTime }} {{ t('simulation.days') }}</div>
              <div><i class="pi pi-flag"></i> {{ t('simulation.reorder_point') }}: {{ item.parameters.reorderPoint }}</div>
              <div><i class="pi pi-box"></i> {{ t('simulation.order_quantity') }}: {{ item.parameters.orderQuantity }}</div>
            </div>
          </td>
          <td>
            <div class="result-summary">
              <div><i class="pi pi-chart-line"></i> {{ t('simulation.average_stock_level') }}: {{ formatNumber(item.summary.averageStockLevel, 1) }}</div>
              <div><i class="pi pi-percentage"></i> {{ t('simulation.service_level') }}: {{ formatPercent(item.summary.serviceLevel) }}</div>
              <div><i class="pi pi-exclamation-triangle"></i> {{ t('simulation.stockout_days') }}: {{ item.summary.stockoutDays }}</div>
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
  color: var(--color-text-tertiary);
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.no-history .pi {
  color: var(--color-primary);
  font-size: 1.25rem;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  border-radius: 0.25rem;
  overflow: hidden;
  box-shadow: 0 1px 3px var(--color-shadow);
}

.history-table th {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 2px solid var(--color-border);
  font-weight: 600;
  background-color: var(--color-surface);
  color: var(--color-text-primary);
}

.history-table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--color-border);
  vertical-align: top;
  transition: background-color 0.2s;
}

.history-table tr:hover td {
  background-color: var(--color-surface-hover);
}

.timestamp {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-primary);
}

.parameter-summary,
.result-summary {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.parameter-summary div,
.result-summary div {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pi {
  color: var(--color-primary);
  font-size: 1rem;
}

th .pi {
  margin-right: 0.5rem;
}
</style>
