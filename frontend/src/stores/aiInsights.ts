import {defineStore} from 'pinia';
import {computed, ref, shallowRef} from 'vue';

// Define types for the store
interface Prediction {
  id: string;
  productId: string;
  productName: string;
  predictedDemand: number;
  confidence: number;
  stockRisk: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  timestamp: string;
  factors: string[];
}

interface Recommendation {
  id: string;
  type: string;
  productId: string;
  productName: string;
  action: string;
  impact: number;
  confidence: number;
  reasoning: string;
}

interface ModelParameters {
  confidenceThreshold: number;
  timeHorizon: number;
  seasonalityEnabled: boolean;
  includeExternalFactors: boolean;
}

interface UserOverride {
  productId: string;
  overriddenDemand: number;
  reason: string;
}

/**
 * Store for AI-driven insights and predictions
 * Manages AI model parameters, predictions, and user overrides
 */
export const useAiInsightsStore = defineStore('aiInsights', () => {
  // State
  const predictions = shallowRef<Prediction[]>([]);
  const recommendations = shallowRef<Recommendation[]>([]);
  const modelParameters = ref<ModelParameters>({
    confidenceThreshold: 0.7,
    timeHorizon: 30, // days
    seasonalityEnabled: true,
    includeExternalFactors: true
  });
  const userOverrides = ref<Record<string, UserOverride>>({});
  const isLoading = ref(false);
  const error = ref<string | null>(null);

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
  function fetchPredictions(): void {
    isLoading.value = true;
    error.value = null;

    // In a real app, this would be an API call
    setTimeout(() => {
      try {
        // Simulate API response
        predictions.value = generateMockPredictions();
        isLoading.value = false;
      } catch (err: any) {
        error.value = err.message || 'Failed to fetch predictions';
        isLoading.value = false;
      }
    }, 1000);
  }

  function fetchRecommendations(): void {
    isLoading.value = true;
    error.value = null;

    // In a real app, this would be an API call
    setTimeout(() => {
      try {
        // Simulate API response
        recommendations.value = generateMockRecommendations();
        isLoading.value = false;
      } catch (err: any) {
        error.value = err.message || 'Failed to fetch recommendations';
        isLoading.value = false;
      }
    }, 1000);
  }

  function updateModelParameters(params: Partial<ModelParameters>): void {
    modelParameters.value = { ...modelParameters.value, ...params };
    // In a real app, we might want to refetch predictions with new parameters
  }

  function addUserOverride(productId: string, overriddenDemand: number, reason: string): void {
    userOverrides.value[productId] = {
      productId,
      overriddenDemand,
      reason
    };
  }

  function removeUserOverride(productId: string): void {
    const { [productId]: removed, ...rest } = userOverrides.value;
    userOverrides.value = rest;
  }

  function clearAllOverrides(): void {
    userOverrides.value = {};
  }

  // Helper function to generate mock predictions
  function generateMockPredictions(): Prediction[] {
    const products = [
      { id: 'P1001', name: 'Premium Widgets' },
      { id: 'P1002', name: 'Economy Widgets' },
      { id: 'P1003', name: 'Luxury Gadgets' },
      { id: 'P1004', name: 'Basic Gadgets' },
      { id: 'P1005', name: 'Pro Tools' },
      { id: 'P1006', name: 'Standard Tools' },
      { id: 'P1007', name: 'Deluxe Package' },
      { id: 'P1008', name: 'Starter Package' }
    ];

    const riskLevels: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
    const factors = [
      'Seasonal demand',
      'Market trends',
      'Competitor pricing',
      'Supply chain disruption',
      'Marketing campaign',
      'Economic indicators',
      'Weather patterns',
      'Social media sentiment'
    ];

    return products.map((product, index) => {
      const confidence = 0.5 + Math.random() * 0.5; // 0.5 to 1.0
      const riskIndex = Math.floor(Math.random() * riskLevels.length);
      const riskLevel = riskLevels[riskIndex];
      const riskScore = (riskIndex + 1) * 25; // 25, 50, 75, or 100

      // Select 1-3 random factors
      const factorCount = 1 + Math.floor(Math.random() * 3);
      const selectedFactors: string[] = [];
      for (let i = 0; i < factorCount; i++) {
        const factor = factors[Math.floor(Math.random() * factors.length)];
        if (!selectedFactors.includes(factor)) {
          selectedFactors.push(factor);
        }
      }

      return {
        id: `pred-${Date.now()}-${index}`,
        productId: product.id,
        productName: product.name,
        predictedDemand: Math.floor(100 + Math.random() * 900), // 100 to 999
        confidence,
        stockRisk: riskLevel,
        riskScore,
        timestamp: new Date().toISOString(),
        factors: selectedFactors
      };
    });
  }

  // Helper function to generate mock recommendations
  function generateMockRecommendations(): Recommendation[] {
    const products = [
      { id: 'P1001', name: 'Premium Widgets' },
      { id: 'P1002', name: 'Economy Widgets' },
      { id: 'P1003', name: 'Luxury Gadgets' },
      { id: 'P1004', name: 'Basic Gadgets' },
      { id: 'P1005', name: 'Pro Tools' }
    ];

    const recommendationTypes = ['restock', 'pricing', 'bundling', 'promotion'];
    const actions = {
      restock: ['Increase order quantity', 'Expedite delivery', 'Find alternative supplier'],
      pricing: ['Increase price', 'Decrease price', 'Implement dynamic pricing'],
      bundling: ['Bundle with complementary products', 'Create value pack', 'Offer quantity discount'],
      promotion: ['Run limited-time offer', 'Target specific customer segment', 'Highlight in marketing']
    };

    const reasoning = [
      'Historical demand patterns indicate potential stockout',
      'Price elasticity analysis suggests optimal price point',
      'Customer purchase behavior shows strong affinity',
      'Competitive analysis reveals market opportunity',
      'Seasonal trends suggest increased demand',
      'Inventory aging analysis indicates slow movement'
    ];

    const recommendations: Recommendation[] = [];

    // Generate 5-10 random recommendations
    const count = 5 + Math.floor(Math.random() * 6);
    for (let i = 0; i < count; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const type = recommendationTypes[Math.floor(Math.random() * recommendationTypes.length)];
      const actionList = actions[type as keyof typeof actions];
      const action = actionList[Math.floor(Math.random() * actionList.length)];
      const reason = reasoning[Math.floor(Math.random() * reasoning.length)];

      recommendations.push({
        id: `rec-${Date.now()}-${i}`,
        type,
        productId: product.id,
        productName: product.name,
        action,
        impact: Math.floor(Math.random() * 100), // 0 to 99
        confidence: 0.6 + Math.random() * 0.4, // 0.6 to 1.0
        reasoning: reason
      });
    }

    return recommendations;
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
    addUserOverride,
    removeUserOverride,
    clearAllOverrides
  };
});