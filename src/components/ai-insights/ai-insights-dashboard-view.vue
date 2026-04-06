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
  margin-bottom: var(--spacing-md);
}

.dashboard-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: var(--font-weight-semibold);
}

.dashboard-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.settings-button,
.refresh-button {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.settings-button {
  background-color: var(--color-surface);
  border: var(--border-width-thin) solid var(--color-border);
  color: var(--color-text-secondary);
}

.settings-button.active {
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
}

.refresh-button {
  background-color: var(--color-primary);
  border: var(--border-width-thin) solid var(--color-primary-dark);
  color: var(--color-button-text);
}

.refresh-button:hover {
  background-color: var(--color-primary-hover);
}

.tabs-navigation {
  display: flex;
  gap: 0.25rem;
  margin-bottom: var(--spacing-md);
  border-bottom: var(--border-width-thin) solid var(--color-border);
}

.tab-button {
  padding: 0.75rem var(--spacing-md);
  background: none;
  border: none;
  border-bottom: var(--border-width-thick) solid transparent;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color var(--transition-fast), border-color var(--transition-fast);
}

.tab-button:hover {
  color: var(--color-text-primary);
}

.tab-button.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: var(--color-text-secondary);
  font-style: italic;
}
</style>