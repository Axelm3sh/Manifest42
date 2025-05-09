<script setup>
import {useI18n} from 'vue-i18n';
import BaseCard from '../base/base-card.vue';
import BaseButton from '../base/base-button.vue';

const { t } = useI18n();

const props = defineProps({
  comparisonScenarios: {
    type: Array,
    default: () => []
  },
  scenarioData: {
    type: Object,
    default: () => ({})
  },
  comparisonData: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['remove', 'clear']);

const removeFromComparison = (id) => {
  emit('remove', id);
};

const clearComparison = () => {
  emit('clear');
};

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

// Chart rendering function
const renderComparisonChart = () => {
  if (!props.comparisonData || props.comparisonData.length === 0) return;

  const width = 600;
  const height = 300;
  const padding = 60;
  const barWidth = (width - padding * 2) / (props.comparisonData.length * 4 + (props.comparisonData.length - 1));

  // Find max values for scaling
  const maxStockLevel = Math.max(...props.comparisonData.map(d => d.summary.averageStockLevel));
  const maxServiceLevel = 1; // Service level is always between 0 and 1
  const maxTurnover = Math.max(...props.comparisonData.map(d => d.summary.inventoryTurnover));

  // Generate SVG content
  let svg = `<svg width="${width}" height="${height}" class="chart">`;

  // Add bars for each scenario
  props.comparisonData.forEach((scenario, index) => {
    const x = padding + index * (barWidth * 4 + barWidth);

    // Average Stock Level bar
    const stockLevelHeight = (scenario.summary.averageStockLevel / maxStockLevel) * (height - padding * 2);
    svg += `
      <rect
        x="${x}"
        y="${height - padding - stockLevelHeight}"
        width="${barWidth}"
        height="${stockLevelHeight}"
        fill="#3b82f6"
      />
    `;

    // Service Level bar
    const serviceLevelHeight = scenario.summary.serviceLevel * (height - padding * 2);
    svg += `
      <rect
        x="${x + barWidth}"
        y="${height - padding - serviceLevelHeight}"
        width="${barWidth}"
        height="${serviceLevelHeight}"
        fill="#10b981"
      />
    `;

    // Inventory Turnover bar
    const turnoverHeight = (scenario.summary.inventoryTurnover / maxTurnover) * (height - padding * 2);
    svg += `
      <rect
        x="${x + barWidth * 2}"
        y="${height - padding - turnoverHeight}"
        width="${barWidth}"
        height="${turnoverHeight}"
        fill="#f59e0b"
      />
    `;

    // Stockout Days bar
    const stockoutRatio = scenario.summary.stockoutDays / scenario.results.dailyData.length;
    const stockoutHeight = stockoutRatio * (height - padding * 2);
    svg += `
      <rect
        x="${x + barWidth * 3}"
        y="${height - padding - stockoutHeight}"
        width="${barWidth}"
        height="${stockoutHeight}"
        fill="#ef4444"
      />
    `;

    // Scenario name
    svg += `
      <text
        x="${x + barWidth * 2}"
        y="${height - 10}"
        text-anchor="middle"
        font-size="12"
      >
        ${sanitize(scenario.name)}
      </text>
    `;
  });

  // Add legend
  svg += `
    <rect x="${padding}" y="${padding / 2}" width="10" height="10" fill="#3b82f6" />
    <text x="${padding + 15}" y="${padding / 2 + 8}" font-size="10">${sanitize(t('simulation.avg_stock'))}</text>

    <rect x="${padding + 100}" y="${padding / 2}" width="10" height="10" fill="#10b981" />
    <text x="${padding + 115}" y="${padding / 2 + 8}" font-size="10">${sanitize(t('simulation.service_level'))}</text>

    <rect x="${padding + 220}" y="${padding / 2}" width="10" height="10" fill="#f59e0b" />
    <text x="${padding + 235}" y="${padding / 2 + 8}" font-size="10">${sanitize(t('simulation.turnover'))}</text>

    <rect x="${padding + 320}" y="${padding / 2}" width="10" height="10" fill="#ef4444" />
    <text x="${padding + 335}" y="${padding / 2 + 8}" font-size="10">${sanitize(t('simulation.stockouts'))}</text>
  `;

  // Close SVG
  svg += `</svg>`;

  return svg;
};
</script>

<template>
  <BaseCard class="comparison-card">
    <template #header>
      <div class="comparison-header">
        <h3>{{ t('simulation.scenario_comparison') }}</h3>
        <div class="comparison-actions">
          <BaseButton 
            variant="danger"
            size="small"
            @click="clearComparison"
          >
            {{ t('simulation.clear_comparison') }}
          </BaseButton>
        </div>
      </div>
    </template>

    <div class="comparison-scenarios">
      <div 
        v-for="scenarioId in comparisonScenarios" 
        :key="scenarioId"
        class="comparison-scenario"
      >
        <div class="scenario-name">{{ scenarioData[scenarioId]?.name }}</div>
        <button 
          @click="removeFromComparison(scenarioId)" 
          class="remove-button"
        >
          {{ t('simulation.remove') }}
        </button>
      </div>
    </div>

    <!-- Comparison Chart -->
    <div class="comparison-chart-container">
      <div class="chart-container" v-html="renderComparisonChart()"></div>
    </div>

    <!-- Comparison Table -->
    <table class="comparison-table">
      <thead>
        <tr>
          <th>{{ t('simulation.metric') }}</th>
          <th 
            v-for="scenario in comparisonData" 
            :key="scenario.id"
          >
            {{ scenario.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ t('simulation.average_stock_level') }}</td>
          <td 
            v-for="scenario in comparisonData" 
            :key="`stock-${scenario.id}`"
          >
            {{ formatNumber(scenario.summary.averageStockLevel, 1) }}
          </td>
        </tr>
        <tr>
          <td>{{ t('simulation.service_level') }}</td>
          <td 
            v-for="scenario in comparisonData" 
            :key="`service-${scenario.id}`"
          >
            {{ formatPercent(scenario.summary.serviceLevel) }}
          </td>
        </tr>
        <tr>
          <td>{{ t('simulation.inventory_turnover') }}</td>
          <td 
            v-for="scenario in comparisonData" 
            :key="`turnover-${scenario.id}`"
          >
            {{ formatNumber(scenario.summary.inventoryTurnover, 2) }}
          </td>
        </tr>
        <tr>
          <td>{{ t('simulation.stockout_days') }}</td>
          <td 
            v-for="scenario in comparisonData" 
            :key="`stockout-${scenario.id}`"
          >
            {{ formatNumber(scenario.summary.stockoutDays) }}
          </td>
        </tr>
        <tr>
          <td>{{ t('simulation.average_order_cycle') }}</td>
          <td 
            v-for="scenario in comparisonData" 
            :key="`cycle-${scenario.id}`"
          >
            {{ formatNumber(scenario.summary.averageOrderCycle, 1) }}
          </td>
        </tr>
      </tbody>
    </table>
  </BaseCard>
</template>

<style scoped>
.comparison-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comparison-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.comparison-scenarios {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.comparison-scenario {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.remove-button {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.remove-button:hover {
  color: #ef4444;
}

.comparison-chart-container {
  margin: 1.5rem 0;
}

.chart-container {
  display: flex;
  justify-content: center;
  padding: 1rem;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.comparison-table th {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
  font-weight: 600;
}

.comparison-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.comparison-table tr td:first-child {
  font-weight: 500;
}
</style>