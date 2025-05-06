<script setup>
import {useI18n} from 'vue-i18n';
import BaseCard from '../base/base-card.vue';

const { t } = useI18n();

const props = defineProps({
  results: {
    type: Object,
    default: null
  },
  summary: {
    type: Object,
    default: null
  },
  stockLevelsData: {
    type: Array,
    default: () => []
  },
  demandData: {
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

// Security: Sanitize strings to prevent XSS
const sanitize = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Chart rendering functions
const renderStockLevelChart = () => {
  if (!props.stockLevelsData.length) return;

  // In a real app, this would use a charting library like Chart.js
  // For now, we'll create a simple SVG chart
  const data = props.stockLevelsData;
  const width = 800;
  const height = 300;
  const padding = 40;

  const maxStock = Math.max(...data.map(d => d.stockLevel));
  const maxDay = Math.max(...data.map(d => d.day));

  const xScale = (width - padding * 2) / maxDay;
  const yScale = (height - padding * 2) / maxStock;

  const points = data.map(d => 
    `${padding + d.day * xScale},${height - padding - d.stockLevel * yScale}`
  ).join(' ');

  return `
    <svg width="${width}" height="${height}" class="chart">
      <polyline
        fill="none"
        stroke="var(--color-info)"
        stroke-width="2"
        points="${points}"
      />

      <!-- X-axis -->
      <line
        x1="${padding}"
        y1="${height - padding}"
        x2="${width - padding}"
        y2="${height - padding}"
        stroke="var(--color-border)"
      />

      <!-- Y-axis -->
      <line
        x1="${padding}"
        y1="${padding}"
        x2="${padding}"
        y2="${height - padding}"
        stroke="var(--color-border)"
      />

      <!-- X-axis label -->
      <text
        x="${width / 2}"
        y="${height - 5}"
        text-anchor="middle"
        font-size="14"
        fill="var(--color-text-secondary)"
      >
        ${sanitize(t('simulation.days'))}
      </text>

      <!-- Y-axis label -->
      <text
        x="15"
        y="${height / 2}"
        text-anchor="middle"
        font-size="14"
        fill="var(--color-text-secondary)"
        transform="rotate(-90, 15, ${height / 2})"
      >
        ${sanitize(t('simulation.stock_level'))}
      </text>
    </svg>
  `;
};

const renderDemandChart = () => {
  if (!props.demandData.length) return;

  // Similar to stock level chart, but for demand data
  const data = props.demandData;
  const width = 800;
  const height = 300;
  const padding = 40;

  const maxDemand = Math.max(...data.map(d => d.demand));
  const maxDay = Math.max(...data.map(d => d.day));

  const xScale = (width - padding * 2) / maxDay;
  const yScale = (height - padding * 2) / maxDemand;

  const points = data.map(d => 
    `${padding + d.day * xScale},${height - padding - d.demand * yScale}`
  ).join(' ');

  return `
    <svg width="${width}" height="${height}" class="chart">
      <polyline
        fill="none"
        stroke="var(--color-danger)"
        stroke-width="2"
        points="${points}"
      />

      <!-- X-axis -->
      <line
        x1="${padding}"
        y1="${height - padding}"
        x2="${width - padding}"
        y2="${height - padding}"
        stroke="var(--color-border)"
      />

      <!-- Y-axis -->
      <line
        x1="${padding}"
        y1="${padding}"
        x2="${padding}"
        y2="${height - padding}"
        stroke="var(--color-border)"
      />

      <!-- X-axis label -->
      <text
        x="${width / 2}"
        y="${height - 5}"
        text-anchor="middle"
        font-size="14"
        fill="var(--color-text-secondary)"
      >
        ${sanitize(t('simulation.days'))}
      </text>

      <!-- Y-axis label -->
      <text
        x="15"
        y="${height / 2}"
        text-anchor="middle"
        font-size="14"
        fill="var(--color-text-secondary)"
        transform="rotate(-90, 15, ${height / 2})"
      >
        ${sanitize(t('simulation.demand'))}
      </text>
    </svg>
  `;
};
</script>

<template>
  <div>
    <div v-if="!results" class="no-results">
      <i class="pi pi-info-circle"></i> {{ t('simulation.no_results') }}
    </div>

    <template v-else>
      <!-- Summary Card -->
      <BaseCard :title="t('simulation.simulation_summary')" class="summary-card">
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-label">{{ t('simulation.average_stock_level') }}</div>
            <div class="summary-value">{{ formatNumber(summary.averageStockLevel, 1) }}</div>
          </div>

          <div class="summary-item">
            <div class="summary-label">{{ t('simulation.total_demand') }}</div>
            <div class="summary-value">{{ formatNumber(summary.totalDemand) }}</div>
          </div>

          <div class="summary-item">
            <div class="summary-label">{{ t('simulation.total_orders') }}</div>
            <div class="summary-value">{{ formatNumber(summary.totalOrders) }}</div>
          </div>

          <div class="summary-item">
            <div class="summary-label">{{ t('simulation.stockout_days') }}</div>
            <div class="summary-value">{{ formatNumber(summary.stockoutDays) }}</div>
          </div>

          <div class="summary-item">
            <div class="summary-label">{{ t('simulation.service_level') }}</div>
            <div class="summary-value">{{ formatPercent(summary.serviceLevel) }}</div>
          </div>

          <div class="summary-item">
            <div class="summary-label">{{ t('simulation.inventory_turnover') }}</div>
            <div class="summary-value">{{ formatNumber(summary.inventoryTurnover, 2) }}</div>
          </div>

          <div class="summary-item">
            <div class="summary-label">{{ t('simulation.average_order_cycle') }}</div>
            <div class="summary-value">{{ formatNumber(summary.averageOrderCycle, 1) }} {{ t('simulation.days') }}</div>
          </div>
        </div>
      </BaseCard>

      <!-- Stock Level Chart -->
      <BaseCard :title="t('simulation.stock_level_over_time')" class="chart-card">
        <div class="chart-container" v-html="renderStockLevelChart()"></div>
      </BaseCard>

      <!-- Demand Chart -->
      <BaseCard :title="t('simulation.demand_over_time')" class="chart-card">
        <div class="chart-container" v-html="renderDemandChart()"></div>
      </BaseCard>
    </template>
  </div>
</template>

<style scoped>
.no-results {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-tertiary);
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.no-results .pi {
  color: var(--color-primary);
  font-size: 1.25rem;
}

.summary-card {
  margin-bottom: 1.5rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-item {
  padding: 0.75rem;
  background-color: var(--color-surface);
  border-radius: 0.25rem;
  border: 1px solid var(--color-border);
  transition: background-color 0.2s, border-color 0.2s;
}

.summary-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.25rem;
}

.summary-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.chart-card {
  margin-bottom: 1.5rem;
}

.chart-container {
  display: flex;
  justify-content: center;
  padding: 1rem;
}
</style>
