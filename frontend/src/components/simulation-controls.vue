<script setup>
import {computed, onMounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useSimulationControlsStore} from '../stores/simulationControls';
import BaseCard from './base/base-card.vue';

const { t } = useI18n();
const simulationStore = useSimulationControlsStore();

// Reactive state
const activeTab = ref('parameters');
const showSaveDialog = ref(false);
const newScenarioName = ref('');
const selectedScenarioForComparison = ref('');

// Fetch data on component mount
onMounted(() => {
  // Run initial simulation with default parameters
  if (!simulationStore.simulationResults) {
    simulationStore.runSimulation();
  }
});

// Computed properties
const parameters = computed(() => simulationStore.simulationParameters);
const results = computed(() => simulationStore.simulationResults);
const history = computed(() => simulationStore.simulationHistory);
const isRunning = computed(() => simulationStore.isRunning);
const currentScenario = computed(() => simulationStore.currentScenario);
const savedScenarios = computed(() => simulationStore.savedScenarios);
const availableScenarios = computed(() => simulationStore.availableScenarios);
const comparisonMode = computed(() => simulationStore.comparisonMode);
const comparisonScenarios = computed(() => simulationStore.comparisonScenarios);
const error = computed(() => simulationStore.error);

const stockLevelsData = computed(() => simulationStore.stockLevelsOverTime);
const demandData = computed(() => simulationStore.demandOverTime);
const ordersData = computed(() => simulationStore.ordersOverTime);
const stockoutsData = computed(() => simulationStore.stockoutsOverTime);
const summary = computed(() => simulationStore.simulationSummary);

const scenariosForComparison = computed(() => {
  return availableScenarios.value.filter(
    scenario => !comparisonScenarios.value.includes(scenario.id)
  );
});

const comparisonData = computed(() => {
  if (!comparisonMode.value) return null;

  const data = comparisonScenarios.value.map(scenarioId => {
    const scenario = savedScenarios.value[scenarioId];
    if (!scenario || !scenario.results) return null;

    return {
      id: scenarioId,
      name: scenario.name,
      parameters: scenario.parameters,
      results: scenario.results,
      summary: {
        averageStockLevel: scenario.results.averageStockLevel,
        totalDemand: scenario.results.totalDemand,
        totalOrders: scenario.results.totalOrders,
        stockoutDays: scenario.results.stockoutDays,
        serviceLevel: scenario.results.serviceLevel,
        inventoryTurnover: scenario.results.inventoryTurnover,
        averageOrderCycle: scenario.results.averageOrderCycle
      }
    };
  }).filter(Boolean);

  return data;
});

// Methods
const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const updateParameter = (key, value) => {
  simulationStore.updateParameters({ [key]: value });
};

const runSimulation = () => {
  simulationStore.runSimulation();
};

const openSaveDialog = () => {
  newScenarioName.value = '';
  showSaveDialog.value = true;
};

const saveScenario = () => {
  if (newScenarioName.value.trim()) {
    simulationStore.saveScenario(newScenarioName.value.trim());
    showSaveDialog.value = false;
  }
};

const cancelSaveDialog = () => {
  showSaveDialog.value = false;
};

const loadScenario = (id) => {
  simulationStore.loadScenario(id);
};

const deleteScenario = (id) => {
  if (confirm(t('simulation.confirm_delete_scenario'))) {
    simulationStore.deleteScenario(id);
  }
};

const toggleComparisonMode = () => {
  simulationStore.toggleComparisonMode();
};

const addToComparison = () => {
  if (selectedScenarioForComparison.value) {
    simulationStore.addToComparison(selectedScenarioForComparison.value);
    selectedScenarioForComparison.value = '';
  }
};

const removeFromComparison = (id) => {
  simulationStore.removeFromComparison(id);
};

const clearComparison = () => {
  simulationStore.clearComparison();
};

const resetToDefaults = () => {
  if (confirm(t('simulation.confirm_reset_parameters'))) {
    simulationStore.resetToDefaults();
  }
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

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString();
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
  if (!stockLevelsData.value.length) return;

  // In a real app, this would use a charting library like Chart.js
  // For now, we'll create a simple SVG chart

  const data = stockLevelsData.value;
  const width = 600;
  const height = 200;
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
        stroke="#3b82f6"
        stroke-width="2"
        points="${points}"
      />

      <!-- X-axis -->
      <line
        x1="${padding}"
        y1="${height - padding}"
        x2="${width - padding}"
        y2="${height - padding}"
        stroke="#9ca3af"
      />

      <!-- Y-axis -->
      <line
        x1="${padding}"
        y1="${padding}"
        x2="${padding}"
        y2="${height - padding}"
        stroke="#9ca3af"
      />

      <!-- X-axis label -->
      <text
        x="${width / 2}"
        y="${height - 5}"
        text-anchor="middle"
        font-size="12"
      >
        ${sanitize(t('simulation.days'))}
      </text>

      <!-- Y-axis label -->
      <text
        x="15"
        y="${height / 2}"
        text-anchor="middle"
        font-size="12"
        transform="rotate(-90, 15, ${height / 2})"
      >
        ${sanitize(t('simulation.stock_level'))}
      </text>
    </svg>
  `;
};

const renderDemandChart = () => {
  if (!demandData.value.length) return;

  // Similar to stock level chart, but for demand data
  const data = demandData.value;
  const width = 600;
  const height = 200;
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
        stroke="#ef4444"
        stroke-width="2"
        points="${points}"
      />

      <!-- X-axis -->
      <line
        x1="${padding}"
        y1="${height - padding}"
        x2="${width - padding}"
        y2="${height - padding}"
        stroke="#9ca3af"
      />

      <!-- Y-axis -->
      <line
        x1="${padding}"
        y1="${padding}"
        x2="${padding}"
        y2="${height - padding}"
        stroke="#9ca3af"
      />

      <!-- X-axis label -->
      <text
        x="${width / 2}"
        y="${height - 5}"
        text-anchor="middle"
        font-size="12"
      >
        ${sanitize(t('simulation.days'))}
      </text>

      <!-- Y-axis label -->
      <text
        x="15"
        y="${height / 2}"
        text-anchor="middle"
        font-size="12"
        transform="rotate(-90, 15, ${height / 2})"
      >
        ${sanitize(t('simulation.demand'))}
      </text>
    </svg>
  `;
};

const renderComparisonChart = () => {
  if (!comparisonData.value || comparisonData.value.length === 0) return;

  const width = 600;
  const height = 300;
  const padding = 60;
  const barWidth = (width - padding * 2) / (comparisonData.value.length * 4 + (comparisonData.value.length - 1));

  // Find max values for scaling
  const maxStockLevel = Math.max(...comparisonData.value.map(d => d.summary.averageStockLevel));
  const maxServiceLevel = 1; // Service level is always between 0 and 1
  const maxTurnover = Math.max(...comparisonData.value.map(d => d.summary.inventoryTurnover));

  // Generate SVG content
  let svg = `<svg width="${width}" height="${height}" class="chart">`;

  // Add bars for each scenario
  comparisonData.value.forEach((scenario, index) => {
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
  <div class="simulation-controls">
    <div class="simulation-header">
      <h2>{{ t('simulation.title') }}</h2>
      <div class="scenario-controls">
        <div class="current-scenario">
          <span>{{ t('simulation.current_scenario') }}:</span>
          <strong>{{ savedScenarios[currentScenario].name }}</strong>
        </div>
        <div class="scenario-actions">
          <select 
            v-model="selectedScenarioForComparison"
            class="scenario-select"
            :disabled="comparisonMode"
          >
            <option value="">{{ t('simulation.select_scenario') }}</option>
            <option 
              v-for="scenario in scenariosForComparison" 
              :key="scenario.id" 
              :value="scenario.id"
            >
              {{ scenario.name }}
            </option>
          </select>
          <button 
            @click="addToComparison" 
            class="action-button"
            :disabled="!selectedScenarioForComparison || comparisonMode"
          >
            {{ t('simulation.add_to_comparison') }}
          </button>
          <button 
            @click="toggleComparisonMode" 
            class="action-button"
            :class="{ 'active': comparisonMode }"
            :disabled="comparisonScenarios.length < 2"
          >
            {{ comparisonMode ? t('simulation.exit_comparison') : t('simulation.compare') }}
          </button>
          <button @click="openSaveDialog" class="action-button">
            {{ t('simulation.save_scenario') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Save Scenario Dialog -->
    <div v-if="showSaveDialog" class="save-dialog-overlay">
      <div class="save-dialog">
        <h3>{{ t('simulation.save_scenario') }}</h3>
        <div class="dialog-content">
          <label for="scenario-name">{{ t('simulation.scenario_name') }}</label>
          <input 
            id="scenario-name"
            v-model="newScenarioName"
            type="text"
            class="scenario-name-input"
            :placeholder="t('simulation.enter_scenario_name')"
          />
        </div>
        <div class="dialog-actions">
          <button @click="saveScenario" class="save-button">
            {{ t('simulation.save') }}
          </button>
          <button @click="cancelSaveDialog" class="cancel-button">
            {{ t('simulation.cancel') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="tabs-navigation">
      <button 
        @click="setActiveTab('parameters')" 
        class="tab-button"
        :class="{ 'active': activeTab === 'parameters' }"
        :disabled="comparisonMode"
      >
        {{ t('simulation.parameters') }}
      </button>
      <button 
        @click="setActiveTab('results')" 
        class="tab-button"
        :class="{ 'active': activeTab === 'results' }"
        :disabled="comparisonMode"
      >
        {{ t('simulation.results') }}
      </button>
      <button 
        @click="setActiveTab('history')" 
        class="tab-button"
        :class="{ 'active': activeTab === 'history' }"
        :disabled="comparisonMode"
      >
        {{ t('simulation.history') }}
      </button>
      <button 
        @click="setActiveTab('scenarios')" 
        class="tab-button"
        :class="{ 'active': activeTab === 'scenarios' }"
        :disabled="comparisonMode"
      >
        {{ t('simulation.scenarios') }}
      </button>
      <button 
        v-if="comparisonMode"
        @click="setActiveTab('comparison')" 
        class="tab-button"
        :class="{ 'active': activeTab === 'comparison' }"
      >
        {{ t('simulation.comparison') }}
      </button>
    </div>

    <!-- Parameters Tab -->
    <div v-if="activeTab === 'parameters' && !comparisonMode" class="tab-content">
      <BaseCard class="parameters-card">
        <template #header>
          <h3>{{ t('simulation.simulation_parameters') }}</h3>
        </template>

        <div class="parameters-grid">
          <div class="parameter-group">
            <label for="demand-variability">{{ t('simulation.demand_variability') }}</label>
            <div class="parameter-control">
              <input 
                id="demand-variability"
                type="range" 
                min="0" 
                max="1" 
                step="0.1"
                :value="parameters.demandVariability"
                @input="updateParameter('demandVariability', parseFloat($event.target.value))"
              />
              <span class="parameter-value">{{ parameters.demandVariability.toFixed(1) }}</span>
            </div>
          </div>

          <div class="parameter-group">
            <label for="lead-time">{{ t('simulation.lead_time') }}</label>
            <div class="parameter-control">
              <input 
                id="lead-time"
                type="range" 
                min="1" 
                max="30" 
                step="1"
                :value="parameters.leadTime"
                @input="updateParameter('leadTime', parseInt($event.target.value))"
              />
              <span class="parameter-value">{{ parameters.leadTime }} {{ t('simulation.days') }}</span>
            </div>
          </div>

          <div class="parameter-group">
            <label for="reorder-point">{{ t('simulation.reorder_point') }}</label>
            <div class="parameter-control">
              <input 
                id="reorder-point"
                type="range" 
                min="5" 
                max="50" 
                step="5"
                :value="parameters.reorderPoint"
                @input="updateParameter('reorderPoint', parseInt($event.target.value))"
              />
              <span class="parameter-value">{{ parameters.reorderPoint }} {{ t('simulation.units') }}</span>
            </div>
          </div>

          <div class="parameter-group">
            <label for="order-quantity">{{ t('simulation.order_quantity') }}</label>
            <div class="parameter-control">
              <input 
                id="order-quantity"
                type="range" 
                min="10" 
                max="200" 
                step="10"
                :value="parameters.orderQuantity"
                @input="updateParameter('orderQuantity', parseInt($event.target.value))"
              />
              <span class="parameter-value">{{ parameters.orderQuantity }} {{ t('simulation.units') }}</span>
            </div>
          </div>

          <div class="parameter-group">
            <label for="initial-stock">{{ t('simulation.initial_stock') }}</label>
            <div class="parameter-control">
              <input 
                id="initial-stock"
                type="range" 
                min="0" 
                max="200" 
                step="10"
                :value="parameters.initialStock"
                @input="updateParameter('initialStock', parseInt($event.target.value))"
              />
              <span class="parameter-value">{{ parameters.initialStock }} {{ t('simulation.units') }}</span>
            </div>
          </div>

          <div class="parameter-group">
            <label for="simulation-duration">{{ t('simulation.simulation_duration') }}</label>
            <div class="parameter-control">
              <input 
                id="simulation-duration"
                type="range" 
                min="30" 
                max="365" 
                step="30"
                :value="parameters.simulationDuration"
                @input="updateParameter('simulationDuration', parseInt($event.target.value))"
              />
              <span class="parameter-value">{{ parameters.simulationDuration }} {{ t('simulation.days') }}</span>
            </div>
          </div>

          <div class="parameter-group checkbox-group">
            <label for="seasonality-enabled">{{ t('simulation.seasonality_enabled') }}</label>
            <div class="parameter-control">
              <input 
                id="seasonality-enabled"
                type="checkbox"
                :checked="parameters.seasonalityEnabled"
                @change="updateParameter('seasonalityEnabled', $event.target.checked)"
              />
            </div>
          </div>

          <div class="parameter-group checkbox-group">
            <label for="external-factors-enabled">{{ t('simulation.external_factors_enabled') }}</label>
            <div class="parameter-control">
              <input 
                id="external-factors-enabled"
                type="checkbox"
                :checked="parameters.externalFactorsEnabled"
                @change="updateParameter('externalFactorsEnabled', $event.target.checked)"
              />
            </div>
          </div>
        </div>

        <div class="parameters-actions">
          <button @click="runSimulation" class="run-button" :disabled="isRunning">
            {{ isRunning ? t('simulation.running') : t('simulation.run_simulation') }}
          </button>
          <button @click="resetToDefaults" class="reset-button">
            {{ t('simulation.reset_to_defaults') }}
          </button>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </BaseCard>
    </div>

    <!-- Results Tab -->
    <div v-if="activeTab === 'results' && !comparisonMode" class="tab-content">
      <div v-if="!results" class="no-results">
        {{ t('simulation.no_results') }}
      </div>

      <template v-else>
        <!-- Summary Card -->
        <BaseCard class="summary-card">
          <template #header>
            <h3>{{ t('simulation.simulation_summary') }}</h3>
          </template>

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
        <BaseCard class="chart-card">
          <template #header>
            <h3>{{ t('simulation.stock_level_over_time') }}</h3>
          </template>

          <div class="chart-container" v-html="renderStockLevelChart()"></div>
        </BaseCard>

        <!-- Demand Chart -->
        <BaseCard class="chart-card">
          <template #header>
            <h3>{{ t('simulation.demand_over_time') }}</h3>
          </template>

          <div class="chart-container" v-html="renderDemandChart()"></div>
        </BaseCard>
      </template>
    </div>

    <!-- History Tab -->
    <div v-if="activeTab === 'history' && !comparisonMode" class="tab-content">
      <BaseCard class="history-card">
        <template #header>
          <h3>{{ t('simulation.simulation_history') }}</h3>
        </template>

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
    </div>

    <!-- Scenarios Tab -->
    <div v-if="activeTab === 'scenarios' && !comparisonMode" class="tab-content">
      <BaseCard class="scenarios-card">
        <template #header>
          <h3>{{ t('simulation.saved_scenarios') }}</h3>
        </template>

        <div v-if="availableScenarios.length === 0" class="no-scenarios">
          {{ t('simulation.no_scenarios') }}
        </div>

        <div v-else class="scenarios-list">
          <div 
            v-for="scenario in availableScenarios" 
            :key="scenario.id"
            class="scenario-item"
            :class="{ 'active': currentScenario === scenario.id }"
          >
            <div class="scenario-name">{{ scenario.name }}</div>
            <div class="scenario-actions">
              <button 
                @click="loadScenario(scenario.id)" 
                class="load-button"
                :disabled="currentScenario === scenario.id"
              >
                {{ t('simulation.load') }}
              </button>
              <button 
                v-if="scenario.id !== 'default'"
                @click="deleteScenario(scenario.id)" 
                class="delete-button"
              >
                {{ t('simulation.delete') }}
              </button>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Comparison Tab -->
    <div v-if="activeTab === 'comparison' && comparisonMode" class="tab-content">
      <BaseCard class="comparison-card">
        <template #header>
          <div class="comparison-header">
            <h3>{{ t('simulation.scenario_comparison') }}</h3>
            <div class="comparison-actions">
              <button @click="clearComparison" class="clear-button">
                {{ t('simulation.clear_comparison') }}
              </button>
            </div>
          </div>
        </template>

        <div class="comparison-scenarios">
          <div 
            v-for="scenarioId in comparisonScenarios" 
            :key="scenarioId"
            class="comparison-scenario"
          >
            <div class="scenario-name">{{ savedScenarios[scenarioId].name }}</div>
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
    </div>
  </div>
</template>

<style scoped>
.simulation-controls {
  margin-bottom: 2rem;
}

.simulation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.simulation-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.scenario-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-scenario {
  font-size: 0.875rem;
}

.scenario-actions {
  display: flex;
  gap: 0.5rem;
}

.scenario-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.action-button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #4b5563;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.action-button:hover:not(:disabled) {
  background-color: #e5e7eb;
  color: #1f2937;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button.active {
  background-color: #3b82f6;
  border-color: #2563eb;
  color: white;
}

/* Save Dialog */
.save-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.save-dialog {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 400px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.save-dialog h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.dialog-content {
  margin-bottom: 1.5rem;
}

.dialog-content label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.scenario-name-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.save-button,
.cancel-button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.save-button {
  background-color: #3b82f6;
  border: 1px solid #2563eb;
  color: white;
}

.save-button:hover {
  background-color: #2563eb;
}

.cancel-button {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #4b5563;
}

.cancel-button:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}

/* Tabs Navigation */
.tabs-navigation {
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.tab-button {
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.tab-button:hover:not(:disabled) {
  color: #4b5563;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.tab-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Parameters Tab */
.parameters-card {
  padding: 1rem;
}

.parameters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.parameter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.parameter-group label {
  font-weight: 600;
  font-size: 0.875rem;
}

.parameter-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.parameter-value {
  min-width: 4rem;
  text-align: right;
  font-size: 0.875rem;
  color: #4b5563;
}

.checkbox-group .parameter-control {
  justify-content: flex-start;
}

.parameters-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.run-button,
.reset-button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.run-button {
  background-color: #3b82f6;
  border: 1px solid #2563eb;
  color: white;
}

.run-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.run-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reset-button {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #4b5563;
}

.reset-button:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

/* Results Tab */
.no-results {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
}

.summary-card {
  padding: 1rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-item {
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.25rem;
}

.summary-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.summary-value {
  font-size: 1.25rem;
  font-weight: 600;
}

.chart-card {
  padding: 1rem;
}

.chart-container {
  display: flex;
  justify-content: center;
  padding: 1rem;
}

/* History Tab */
.history-card {
  padding: 1rem;
}

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

/* Scenarios Tab */
.scenarios-card {
  padding: 1rem;
}

.no-scenarios {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
}

.scenarios-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.scenario-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.25rem;
  border-left: 4px solid transparent;
}

.scenario-item.active {
  border-left-color: #3b82f6;
  background-color: #eff6ff;
}

.scenario-name {
  font-weight: 500;
}

.scenario-actions {
  display: flex;
  gap: 0.5rem;
}

.load-button,
.delete-button {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.load-button {
  background-color: #3b82f6;
  border: 1px solid #2563eb;
  color: white;
}

.load-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.load-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.delete-button {
  background-color: #ef4444;
  border: 1px solid #dc2626;
  color: white;
}

.delete-button:hover {
  background-color: #dc2626;
}

/* Comparison Tab */
.comparison-card {
  padding: 1rem;
}

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

.clear-button {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  background-color: #ef4444;
  border: 1px solid #dc2626;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clear-button:hover {
  background-color: #dc2626;
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
