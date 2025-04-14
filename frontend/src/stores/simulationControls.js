import {defineStore} from 'pinia';
import {computed, ref} from 'vue';

/**
 * Store for simulation controls and data
 * Manages simulation parameters, outcomes, and history
 */
export const useSimulationControlsStore = defineStore('simulationControls', () => {
  // State
  const simulationParameters = ref({
    demandVariability: 0.5, // 0 to 1, where 1 is high variability
    leadTime: 7, // days
    reorderPoint: 20, // units
    orderQuantity: 50, // units
    initialStock: 100, // units
    simulationDuration: 90, // days
    seasonalityEnabled: true,
    externalFactorsEnabled: true
  });

  const simulationResults = ref(null);
  const simulationHistory = ref([]);
  const isRunning = ref(false);
  const currentScenario = ref('default');
  const savedScenarios = ref({
    default: {
      name: 'Default Scenario',
      parameters: { ...simulationParameters.value },
      results: null
    }
  });
  const comparisonMode = ref(false);
  const comparisonScenarios = ref([]);
  const error = ref(null);

  // Getters
  const stockLevelsOverTime = computed(() => {
    if (!simulationResults.value) return [];
    return simulationResults.value.dailyData.map(day => ({
      day: day.day,
      stockLevel: day.stockLevel
    }));
  });

  const demandOverTime = computed(() => {
    if (!simulationResults.value) return [];
    return simulationResults.value.dailyData.map(day => ({
      day: day.day,
      demand: day.demand
    }));
  });

  const ordersOverTime = computed(() => {
    if (!simulationResults.value) return [];
    return simulationResults.value.dailyData
      .filter(day => day.orderPlaced)
      .map(day => ({
        day: day.day,
        quantity: day.orderQuantity
      }));
  });

  const stockoutsOverTime = computed(() => {
    if (!simulationResults.value) return [];
    return simulationResults.value.dailyData
      .filter(day => day.stockLevel === 0)
      .map(day => ({
        day: day.day,
        duration: day.stockoutDuration
      }));
  });

  const simulationSummary = computed(() => {
    if (!simulationResults.value) return null;

    return {
      averageStockLevel: simulationResults.value.averageStockLevel,
      totalDemand: simulationResults.value.totalDemand,
      totalOrders: simulationResults.value.totalOrders,
      stockoutDays: simulationResults.value.stockoutDays,
      serviceLevel: simulationResults.value.serviceLevel,
      inventoryTurnover: simulationResults.value.inventoryTurnover,
      averageOrderCycle: simulationResults.value.averageOrderCycle
    };
  });

  const availableScenarios = computed(() => {
    return Object.keys(savedScenarios.value).map(key => ({
      id: key,
      name: savedScenarios.value[key].name
    }));
  });

  // Actions
  function updateParameters(params) {
    simulationParameters.value = { ...simulationParameters.value, ...params };
  }

  function runSimulation() {
    isRunning.value = true;
    error.value = null;

    try {
      // In a real app, this might be an API call or a more complex simulation
      const results = generateSimulationResults(simulationParameters.value);
      simulationResults.value = results;

      // Add to history
      simulationHistory.value.push({
        id: `sim-${Date.now()}`,
        timestamp: new Date().toISOString(),
        parameters: { ...simulationParameters.value },
        summary: {
          averageStockLevel: results.averageStockLevel,
          totalDemand: results.totalDemand,
          stockoutDays: results.stockoutDays,
          serviceLevel: results.serviceLevel
        }
      });

      // Limit history to last 10 simulations
      if (simulationHistory.value.length > 10) {
        simulationHistory.value = simulationHistory.value.slice(-10);
      }

      // Update current scenario results
      if (savedScenarios.value[currentScenario.value]) {
        savedScenarios.value[currentScenario.value].results = results;
      }

      isRunning.value = false;
    } catch (err) {
      error.value = err.message || 'Failed to run simulation';
      isRunning.value = false;
    }
  }

  function saveScenario(name) {
    const id = name.toLowerCase().replace(/\s+/g, '-');

    savedScenarios.value[id] = {
      name,
      parameters: { ...simulationParameters.value },
      results: simulationResults.value
    };

    currentScenario.value = id;

    return id;
  }

  function loadScenario(id) {
    if (savedScenarios.value[id]) {
      simulationParameters.value = { ...savedScenarios.value[id].parameters };
      simulationResults.value = savedScenarios.value[id].results;
      currentScenario.value = id;
    }
  }

  function deleteScenario(id) {
    if (id !== 'default' && savedScenarios.value[id]) {
      const { [id]: removed, ...rest } = savedScenarios.value;
      savedScenarios.value = rest;

      // If we deleted the current scenario, switch to default
      if (currentScenario.value === id) {
        currentScenario.value = 'default';
        loadScenario('default');
      }

      // Remove from comparison if it's there
      comparisonScenarios.value = comparisonScenarios.value.filter(s => s !== id);
    }
  }

  function toggleComparisonMode() {
    comparisonMode.value = !comparisonMode.value;

    if (comparisonMode.value && !comparisonScenarios.value.includes(currentScenario.value)) {
      comparisonScenarios.value.push(currentScenario.value);
    }
  }

  function addToComparison(id) {
    if (savedScenarios.value[id] && !comparisonScenarios.value.includes(id)) {
      comparisonScenarios.value.push(id);
    }
  }

  function removeFromComparison(id) {
    comparisonScenarios.value = comparisonScenarios.value.filter(s => s !== id);
  }

  function clearComparison() {
    comparisonScenarios.value = [];
    comparisonMode.value = false;
  }

  function resetToDefaults() {
    loadScenario('default');
  }

  // Helper function to generate simulation results
  function generateSimulationResults(params) {
    const {
      demandVariability,
      leadTime,
      reorderPoint,
      orderQuantity,
      initialStock,
      simulationDuration,
      seasonalityEnabled,
      externalFactorsEnabled
    } = params;

    // Initialize simulation data
    let stockLevel = initialStock;
    let day = 1;
    let pendingOrders = [];
    let dailyData = [];
    let totalDemand = 0;
    let totalOrders = 0;
    let stockoutDays = 0;
    let cumulativeStockLevel = 0;
    let orderCycles = [];
    let lastOrderDay = 0;

    // Run simulation for the specified duration
    while (day <= simulationDuration) {
      // Generate demand for the day
      let baseDemand = 10; // Base daily demand

      // Add seasonality effect if enabled
      if (seasonalityEnabled) {
        // Simple sine wave seasonality with 30-day cycle
        const seasonalFactor = Math.sin((day / 30) * Math.PI) * 0.3 + 1;
        baseDemand *= seasonalFactor;
      }

      // Add external factors if enabled
      if (externalFactorsEnabled) {
        // Random external events that can spike demand
        if (Math.random() < 0.05) { // 5% chance of external event
          baseDemand *= (Math.random() * 1.5) + 1; // 1x to 2.5x demand spike
        }
      }

      // Add variability
      const variabilityFactor = 1 + (Math.random() * 2 - 1) * demandVariability;
      const demand = Math.max(0, Math.round(baseDemand * variabilityFactor));

      totalDemand += demand;

      // Process any orders that have arrived
      const arrivedOrders = pendingOrders.filter(order => order.arrivalDay === day);
      const arrivedQuantity = arrivedOrders.reduce((sum, order) => sum + order.quantity, 0);

      stockLevel += arrivedQuantity;
      pendingOrders = pendingOrders.filter(order => order.arrivalDay !== day);

      // Fulfill demand
      const fulfilledDemand = Math.min(stockLevel, demand);
      stockLevel -= fulfilledDemand;

      // Check if we need to place a new order
      let orderPlaced = false;
      let orderQuantityPlaced = 0;

      if (stockLevel <= reorderPoint && pendingOrders.length === 0) {
        pendingOrders.push({
          quantity: orderQuantity,
          orderDay: day,
          arrivalDay: day + leadTime
        });

        orderPlaced = true;
        orderQuantityPlaced = orderQuantity;
        totalOrders++;

        // Record order cycle
        if (lastOrderDay > 0) {
          orderCycles.push(day - lastOrderDay);
        }
        lastOrderDay = day;
      }

      // Record stockout
      const isStockout = stockLevel === 0;
      if (isStockout) {
        stockoutDays++;
      }

      // Add to cumulative stock level for average calculation
      cumulativeStockLevel += stockLevel;

      // Record daily data
      dailyData.push({
        day,
        demand,
        stockLevel,
        orderPlaced,
        orderQuantity: orderQuantityPlaced,
        stockout: isStockout,
        stockoutDuration: isStockout ? 1 : 0 // Will be updated in post-processing
      });

      day++;
    }

    // Post-process data to calculate stockout durations
    let currentStockoutStart = -1;
    for (let i = 0; i < dailyData.length; i++) {
      if (dailyData[i].stockout) {
        if (currentStockoutStart === -1) {
          currentStockoutStart = i;
        }
      } else {
        if (currentStockoutStart !== -1) {
          const stockoutDuration = i - currentStockoutStart;
          for (let j = currentStockoutStart; j < i; j++) {
            dailyData[j].stockoutDuration = stockoutDuration;
          }
          currentStockoutStart = -1;
        }
      }
    }

    // Handle stockout at the end of simulation
    if (currentStockoutStart !== -1) {
      const stockoutDuration = dailyData.length - currentStockoutStart;
      for (let j = currentStockoutStart; j < dailyData.length; j++) {
        dailyData[j].stockoutDuration = stockoutDuration;
      }
    }

    // Calculate summary statistics
    const averageStockLevel = cumulativeStockLevel / simulationDuration;
    const serviceLevel = 1 - (stockoutDays / simulationDuration);
    const inventoryTurnover = totalDemand / averageStockLevel;
    const averageOrderCycle = orderCycles.length > 0 
      ? orderCycles.reduce((sum, cycle) => sum + cycle, 0) / orderCycles.length 
      : 0;

    return {
      dailyData,
      averageStockLevel,
      totalDemand,
      totalOrders,
      stockoutDays,
      serviceLevel,
      inventoryTurnover,
      averageOrderCycle
    };
  }

  return {
    // State
    simulationParameters,
    simulationResults,
    simulationHistory,
    isRunning,
    currentScenario,
    savedScenarios,
    comparisonMode,
    comparisonScenarios,
    error,

    // Getters
    stockLevelsOverTime,
    demandOverTime,
    ordersOverTime,
    stockoutsOverTime,
    simulationSummary,
    availableScenarios,

    // Actions
    updateParameters,
    runSimulation,
    saveScenario,
    loadScenario,
    deleteScenario,
    toggleComparisonMode,
    addToComparison,
    removeFromComparison,
    clearComparison,
    resetToDefaults
  };
});

// Export an alias for backward compatibility
export const useSimulationStore = useSimulationControlsStore;
