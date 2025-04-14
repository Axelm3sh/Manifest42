<script setup>
import {computed, onMounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useSimulationControlsStore} from '../../stores/simulationControls';
import BaseTabs from '../base/base-tabs.vue';
import BaseButton from '../base/base-button.vue';
import SimulationParameters from './simulation-parameters.vue';
import SimulationResults from './simulation-results.vue';
import SimulationHistory from './simulation-history.vue';
import SimulationScenarios from './simulation-scenarios.vue';
import SimulationComparison from './simulation-comparison.vue';

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

// Tab configuration
const tabs = computed(() => {
  const baseTabs = [
    { id: 'parameters', label: t('simulation.parameters') },
    { id: 'results', label: t('simulation.results') },
    { id: 'history', label: t('simulation.history') },
    { id: 'scenarios', label: t('simulation.scenarios') }
  ];
  
  if (comparisonMode.value) {
    baseTabs.push({ id: 'comparison', label: t('simulation.comparison') });
  }
  
  return baseTabs;
});

// Methods
const setActiveTab = (tabId) => {
  activeTab.value = tabId;
};

const updateParameter = ({ key, value }) => {
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
  simulationStore.deleteScenario(id);
};

const toggleComparisonMode = () => {
  simulationStore.toggleComparisonMode();
  if (comparisonMode.value) {
    activeTab.value = 'comparison';
  } else {
    activeTab.value = 'parameters';
  }
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
</script>

<template>
  <div class="simulation-controls">
    <div class="simulation-header">
      <h2>{{ t('simulation.title') }}</h2>
      <div class="scenario-controls">
        <div class="current-scenario">
          <span>{{ t('simulation.current_scenario') }}:</span>
          <strong>{{ savedScenarios[currentScenario]?.name }}</strong>
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
          <BaseButton 
            @click="addToComparison" 
            :disabled="!selectedScenarioForComparison || comparisonMode"
          >
            {{ t('simulation.add_to_comparison') }}
          </BaseButton>
          <BaseButton 
            @click="toggleComparisonMode" 
            :active="comparisonMode"
            :disabled="comparisonScenarios.length < 2"
          >
            {{ comparisonMode ? t('simulation.exit_comparison') : t('simulation.compare') }}
          </BaseButton>
          <BaseButton @click="openSaveDialog">
            {{ t('simulation.save_scenario') }}
          </BaseButton>
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
          <BaseButton 
            variant="primary"
            @click="saveScenario"
          >
            {{ t('simulation.save') }}
          </BaseButton>
          <BaseButton 
            @click="cancelSaveDialog"
          >
            {{ t('simulation.cancel') }}
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <BaseTabs 
      v-model="activeTab"
      :tabs="tabs"
      :disabled="comparisonMode && activeTab !== 'comparison'"
      @update:modelValue="setActiveTab"
    >
      <!-- Parameters Tab -->
      <template #parameters>
        <div v-if="!comparisonMode">
          <SimulationParameters 
            :parameters="parameters"
            :isRunning="isRunning"
            :error="error"
            @update:parameter="updateParameter"
            @run="runSimulation"
            @reset="resetToDefaults"
          />
        </div>
      </template>

      <!-- Results Tab -->
      <template #results>
        <div v-if="!comparisonMode">
          <SimulationResults 
            :results="results"
            :summary="summary"
            :stockLevelsData="stockLevelsData"
            :demandData="demandData"
          />
        </div>
      </template>

      <!-- History Tab -->
      <template #history>
        <div v-if="!comparisonMode">
          <SimulationHistory :history="history" />
        </div>
      </template>

      <!-- Scenarios Tab -->
      <template #scenarios>
        <div v-if="!comparisonMode">
          <SimulationScenarios 
            :scenarios="availableScenarios"
            :currentScenario="currentScenario"
            @load="loadScenario"
            @delete="deleteScenario"
          />
        </div>
      </template>

      <!-- Comparison Tab -->
      <template #comparison>
        <div v-if="comparisonMode">
          <SimulationComparison 
            :comparisonScenarios="comparisonScenarios"
            :scenarioData="savedScenarios"
            :comparisonData="comparisonData"
            @remove="removeFromComparison"
            @clear="clearComparison"
          />
        </div>
      </template>
    </BaseTabs>
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
</style>