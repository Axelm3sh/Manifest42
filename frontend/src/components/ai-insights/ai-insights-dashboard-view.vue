<script setup>
import {onMounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useAiInsightsStore} from '../../stores/aiInsights';
import AiInsightsModelSettings from './ai-insights-model-settings.vue';
import AiInsightsPredictions from './ai-insights-predictions.vue';
import AiInsightsRecommendations from './ai-insights-recommendations.vue';
import AiInsightsRiskTable from './ai-insights-risk-table.vue';
//Currently might not be in use. Potentially used in analyst dashboard and views
const { t } = useI18n();
const aiInsightsStore = useAiInsightsStore();

// Reactive state
const activeTab = ref('predictions');
const showModelSettings = ref(false);

// Fetch data on component mount
onMounted(() => {
  aiInsightsStore.fetchPredictions();
  aiInsightsStore.fetchRecommendations();
});

// Methods
const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const toggleModelSettings = () => {
  showModelSettings.value = !showModelSettings.value;
};

const refreshData = () => {
  aiInsightsStore.fetchPredictions();
  aiInsightsStore.fetchRecommendations();
};
</script>

<template>
  <div class="ai-insights-dashboard">
    <div class="dashboard-header">
      <h2>{{ t('ai_insights.title') }}</h2>
      <div class="dashboard-actions">
        <button 
          @click="toggleModelSettings" 
          class="settings-button"
          :class="{ 'active': showModelSettings }"
        >
          {{ t('ai_insights.model_settings') }}
        </button>
        <button @click="refreshData" class="refresh-button">
          {{ t('ai_insights.refresh') }}
        </button>
      </div>
    </div>

    <!-- Model Settings Panel -->
    <AiInsightsModelSettings 
      v-if="showModelSettings"
      :has-overrides="aiInsightsStore.hasOverride"
      @clear-all-overrides="aiInsightsStore.clearAllUserOverrides"
    />

    <!-- Tabs Navigation -->
    <div class="tabs-navigation">
      <button 
        @click="setActiveTab('predictions')" 
        class="tab-button"
        :class="{ 'active': activeTab === 'predictions' }"
      >
        {{ t('ai_insights.predictions') }}
      </button>
      <button 
        @click="setActiveTab('recommendations')" 
        class="tab-button"
        :class="{ 'active': activeTab === 'recommendations' }"
      >
        {{ t('ai_insights.recommendations') }}
      </button>
      <button 
        @click="setActiveTab('risk')" 
        class="tab-button"
        :class="{ 'active': activeTab === 'risk' }"
      >
        {{ t('ai_insights.stock_risk') }}
      </button>
    </div>

    <!-- Loading Indicator -->
    <div v-if="aiInsightsStore.isLoading" class="loading-indicator">
      {{ t('common.loading') }}
    </div>

    <!-- Tab Content -->
    <AiInsightsPredictions 
      v-else-if="activeTab === 'predictions'"
      :predictions="aiInsightsStore.filteredPredictions"
      @apply-override="aiInsightsStore.setUserOverride"
    />

    <AiInsightsRecommendations 
      v-else-if="activeTab === 'recommendations'"
      :recommendations="aiInsightsStore.recommendations"
      @clear-override="aiInsightsStore.clearUserOverride"
    />

    <AiInsightsRiskTable 
      v-else-if="activeTab === 'risk'"
      :stock-risk-items="aiInsightsStore.stockRiskItems"
    />
  </div>
</template>

<style scoped>
.ai-insights-dashboard {
  margin-bottom: 2rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.dashboard-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.dashboard-actions {
  display: flex;
  gap: 0.5rem;
}

.settings-button,
.refresh-button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.settings-button {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #4b5563;
}

.settings-button.active {
  background-color: #e5e7eb;
  color: #1f2937;
}

.refresh-button {
  background-color: #3b82f6;
  border: 1px solid #2563eb;
  color: white;
}

.refresh-button:hover {
  background-color: #2563eb;
}

.tabs-navigation {
  display: flex;
  gap: 0.25rem;
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

.tab-button:hover {
  color: #4b5563;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
}
</style>