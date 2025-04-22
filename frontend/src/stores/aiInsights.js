import {defineStore} from 'pinia';
import {computed, ref, shallowRef} from 'vue';

/**
 * Store for AI-driven insights and predictions
 * Manages AI model parameters, predictions, and user overrides
 */
export const useAiInsightsStore = defineStore('aiInsights', () => {
  // State
  const predictions = shallowRef([]);
  const recommendations = shallowRef([]);
  const modelParameters = ref({
    confidenceThreshold: 0.7,
    timeHorizon: 30, // days
    seasonalityEnabled: true,
    includeExternalFactors: true
  });
  const userOverrides = ref({});
  const isLoading = ref(false);
  const error = ref(null);

  // Getters
  const filteredPredictions = computed(() => {
    return predictions.value.filter(prediction => 
      prediction.confidence >= modelParameters.value.confidenceThreshold
    );
  });

  const stockRiskItems = computed(() => {
    return predictions.value.filter(prediction => 
      prediction.stockRisk === 'high' || prediction.stockRisk === 'critical'
    ).sort((a, b) => b.riskScore - a.riskScore);
  });

  const restockRecommendations = computed(() => {
    return recommendations.value.filter(rec => rec.type === 'restock');
  });

  const hasOverride = computed(() => {
    return Object.keys(userOverrides.value).length > 0;
  });

  // Actions
  function fetchPredictions() {
    isLoading.value = true;
    error.value = null;

    // In a real app, this would be an API call
    setTimeout(() => {
      try {
        // Simulate API response
        predictions.value = generateMockPredictions();
        isLoading.value = false;
      } catch (err) {
        error.value = err.message || 'Failed to fetch predictions';
        isLoading.value = false;
      }
    }, 1000);
  }

  function fetchRecommendations() {
    isLoading.value = true;
    error.value = null;

    // In a real app, this would be an API call
    setTimeout(() => {
      try {
        // Simulate API response
        recommendations.value = generateMockRecommendations();
        isLoading.value = false;
      } catch (err) {
        error.value = err.message || 'Failed to fetch recommendations';
        isLoading.value = false;
      }
    }, 1000);
  }

  function updateModelParameters(params) {
    modelParameters.value = { ...modelParameters.value, ...params };
    // Re-fetch predictions with new parameters
    fetchPredictions();
  }

  function setUserOverride(itemId, overrideData) {
    userOverrides.value = { 
      ...userOverrides.value, 
      [itemId]: { ...overrideData, timestamp: new Date().toISOString() } 
    };
  }

  function clearUserOverride(itemId) {
    const { [itemId]: removed, ...rest } = userOverrides.value;
    userOverrides.value = rest;
  }

  function clearAllUserOverrides() {
    userOverrides.value = {};
  }

  // Helper function to generate mock data
  function generateMockPredictions() {
    const products = [
      'Laptop', 'Smartphone', 'Tablet', 'Monitor', 'Keyboard', 
      'Mouse', 'Headphones', 'Printer', 'Scanner', 'Router'
    ];

    return products.map((product, index) => {
      const confidence = Math.random() * 0.5 + 0.5; // 0.5 to 1.0
      const currentStock = Math.floor(Math.random() * 100);
      const predictedDemand = Math.floor(Math.random() * 150);
      const stockRisk = getStockRisk(currentStock, predictedDemand);

      return {
        id: `prod-${index + 1}`,
        productName: product,
        currentStock,
        predictedDemand,
        confidence,
        stockRisk,
        riskScore: getRiskScore(currentStock, predictedDemand),
        predictedStockout: currentStock < predictedDemand ? 
          new Date(Date.now() + Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString() : null,
        timestamp: new Date().toISOString()
      };
    });
  }

  function generateMockRecommendations() {
    return predictions.value.map(prediction => {
      if (prediction.stockRisk === 'high' || prediction.stockRisk === 'critical') {
        const recommendedOrder = Math.max(0, prediction.predictedDemand - prediction.currentStock);
        return {
          id: `rec-${prediction.id}`,
          productId: prediction.id,
          productName: prediction.productName,
          type: 'restock',
          recommendedOrder,
          urgency: prediction.stockRisk === 'critical' ? 'high' : 'medium',
          reason: `Predicted demand (${prediction.predictedDemand}) exceeds current stock (${prediction.currentStock})`,
          confidence: prediction.confidence,
          timestamp: new Date().toISOString()
        };
      } else if (prediction.currentStock > prediction.predictedDemand * 2) {
        return {
          id: `rec-${prediction.id}`,
          productId: prediction.id,
          productName: prediction.productName,
          type: 'overstock',
          excessStock: prediction.currentStock - prediction.predictedDemand,
          urgency: 'low',
          reason: `Current stock (${prediction.currentStock}) significantly exceeds predicted demand (${prediction.predictedDemand})`,
          confidence: prediction.confidence,
          timestamp: new Date().toISOString()
        };
      }
      return null;
    }).filter(Boolean);
  }

  function getStockRisk(currentStock, predictedDemand) {
    const ratio = currentStock / predictedDemand;
    if (ratio <= 0.25) return 'critical';
    if (ratio <= 0.5) return 'high';
    if (ratio <= 0.75) return 'medium';
    if (ratio <= 1.0) return 'low';
    return 'none';
  }

  function getRiskScore(currentStock, predictedDemand) {
    const deficit = predictedDemand - currentStock;
    if (deficit <= 0) return 0;
    return (deficit / predictedDemand) * 100;
  }

  return {
    // State
    predictions,
    recommendations,
    modelParameters,
    userOverrides,
    isLoading,
    error,

    // Getters
    filteredPredictions,
    stockRiskItems,
    restockRecommendations,
    hasOverride,

    // Actions
    fetchPredictions,
    fetchRecommendations,
    updateModelParameters,
    setUserOverride,
    clearUserOverride,
    clearAllUserOverrides
  };
});

// Export an alias for backward compatibility
export const useAiStore = useAiInsightsStore;
