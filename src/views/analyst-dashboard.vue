<script setup>
import {computed, onMounted, ref, shallowRef} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRoute} from 'vue-router';
import {useAuthStore} from '../stores/auth';
import {useInventoryStore} from '../stores/inventoryData';
import {useAiInsightsStore} from '../stores/aiInsights';
import {useSimulationStore} from '../stores/simulationControls';
import DashboardLayout from '../components/dashboard-layout.vue';

const {t} = useI18n();
const route = useRoute();
const authStore = useAuthStore();
const inventoryStore = useInventoryStore();
const aiInsightsStore = useAiInsightsStore();
const simulationStore = useSimulationStore();

// Determine if we're on the main dashboard route (not a child route)
const isMainDashboardRoute = computed(() => {
  return route.path === '/analyst';
});

// Get the active sidebar item based on the current route
const getActiveItem = () => {
  const path = route.path;
  if (path === '/analyst') return 'dashboard';
  if (path === '/analyst/inventory') return 'inventory';
  if (path === '/analyst/simulations') return 'simulations';
  if (path === '/analyst/reports') return 'reports';
  if (path === '/analyst/ai-insights') return 'ai_insights';
  if (path === '/analyst/analytics') return 'analytics';
  return 'dashboard';
};

// Dashboard state
const isLoading = ref(true);

// Analyst-specific metrics
const analystMetrics = ref({
  activeSimulations: 0,
  completedReports: 0,
  dataAccuracy: 0,
  predictionsGenerated: 0,
});

// KPIs
const kpis = computed(() => [
  {
    id: 'simulations',
    title: t('analyst.kpi.active_simulations'),
    value: analystMetrics.value.activeSimulations,
    change: '+3',
    trend: 'up',
  },
  {
    id: 'reports',
    title: t('analyst.kpi.completed_reports'),
    value: analystMetrics.value.completedReports,
    change: '+5',
    trend: 'up',
  },
  {
    id: 'accuracy',
    title: t('analyst.kpi.data_accuracy'),
    value: `${analystMetrics.value.dataAccuracy}%`,
    change: '+2.5%',
    trend: 'up',
  },
  {
    id: 'predictions',
    title: t('analyst.kpi.predictions_generated'),
    value: analystMetrics.value.predictionsGenerated,
    change: '+12',
    trend: 'up',
  },
]);

// Recent reports
const recentReports = shallowRef([]);

// Recent simulations
const recentSimulations = shallowRef([]);

// AI recommendations
const aiRecommendations = shallowRef([]);

// UI state
const showQuickActions = ref(true);
const showRecentSimulations = ref(true);
const showRecentReports = ref(true);

// Toggle visibility functions
const toggleQuickActions = () => {
  showQuickActions.value = !showQuickActions.value;
};

const toggleRecentSimulations = () => {
  showRecentSimulations.value = !showRecentSimulations.value;
};

const toggleRecentReports = () => {
  showRecentReports.value = !showRecentReports.value;
};

// Load dashboard data
onMounted(async () => {
  try {
    // Simulate API calls
    await Promise.all([
      loadAnalystMetrics(),
      loadRecentReports(),
      loadRecentSimulations(),
      loadAiRecommendations(),
    ]);
  } catch (error) {
    console.error('Error loading analyst dashboard data:', error);
  } finally {
    isLoading.value = false;
  }
});

// Load analyst metrics
const loadAnalystMetrics = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));

  analystMetrics.value = {
    activeSimulations: 3,
    completedReports: 28,
    dataAccuracy: 94.5,
    predictionsGenerated: 156,
  };
};

// Load recent reports
const loadRecentReports = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 600));

  recentReports.value = [
    {
      id: 1,
      title: 'Q3 Inventory Turnover Analysis',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      status: 'completed',
      insights: 'Turnover rate increased by 12% compared to Q2',
    },
    {
      id: 2,
      title: 'Supply Chain Bottleneck Identification',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      status: 'completed',
      insights: 'Identified 3 critical bottlenecks in the distribution network',
    },
    {
      id: 3,
      title: 'Seasonal Demand Forecast',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      status: 'completed',
      insights: 'Predicted 18% increase in holiday season demand',
    },
  ];
};

// Load recent simulations
const loadRecentSimulations = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 700));

  recentSimulations.value = [
    {
      id: 1,
      title: 'Supply Chain Disruption Scenario',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      status: 'in_progress',
      progress: 65,
      description: 'Simulating impact of 2-week shipping delay from primary suppliers',
    },
    {
      id: 2,
      title: 'Demand Spike Response',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      status: 'completed',
      progress: 100,
      description: 'Analyzed inventory response to 30% sudden demand increase',
    },
    {
      id: 3,
      title: 'New Distribution Center Impact',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      status: 'completed',
      progress: 100,
      description: 'Evaluated logistics improvements from adding East Coast distribution center',
    },
  ];
};

// Load AI recommendations
const loadAiRecommendations = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));

  aiRecommendations.value = [
    {
      id: 1,
      title: 'Increase safety stock for high-demand items',
      confidence: 92,
      impact: 'high',
      description: 'Based on recent stockout patterns, increasing safety stock by 15% for top 20 SKUs would reduce stockouts by an estimated 35%',
    },
    {
      id: 2,
      title: 'Optimize reorder points for seasonal items',
      confidence: 87,
      impact: 'medium',
      description: 'Adjusting reorder points based on seasonal demand patterns could reduce carrying costs by approximately 8%',
    },
    {
      id: 3,
      title: 'Consolidate shipments to western region',
      confidence: 78,
      impact: 'medium',
      description: 'Consolidating shipments to the western region could reduce transportation costs by 12% with minimal impact on delivery times',
    },
  ];
};

// Navigate to route
const navigateTo = (route) => {
  // In a real app, this would use router.push
  console.log(`Navigate to ${route}`);
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Get time ago
const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 60) return t('time.minutes_ago', {count: diffMins});

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return t('time.hours_ago', {count: diffHours});

  const diffDays = Math.floor(diffHours / 24);
  return t('time.days_ago', {count: diffDays});
};

// Get status class
const getStatusClass = (status) => {
  switch (status) {
    case 'completed':
      return 'status-completed';
    case 'in_progress':
      return 'status-in-progress';
    case 'pending':
      return 'status-pending';
    default:
      return '';
  }
};

// Get impact class
const getImpactClass = (impact) => {
  switch (impact) {
    case 'high':
      return 'impact-high';
    case 'medium':
      return 'impact-medium';
    case 'low':
      return 'impact-low';
    default:
      return '';
  }
};

// Get confidence class
const getConfidenceClass = (confidence) => {
  if (confidence >= 90) return 'confidence-high';
  if (confidence >= 70) return 'confidence-medium';
  return 'confidence-low';
};

// Create new simulation
const createNewSimulation = () => {
  // In a real app, this would navigate to a simulation creation page
  console.log('Create new simulation');
};

// Create new report
const createNewReport = () => {
  // In a real app, this would navigate to a report creation page
  console.log('Create new report');
};
</script>

<template>
  <DashboardLayout
      :title="t('analyst.dashboard_title')"
      :activeItem="getActiveItem()"
  >
    <!-- Main content or router view for child routes -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component"/>
      </transition>
    </router-view>

    <!-- Default content when on the main dashboard route -->
    <div v-if="isMainDashboardRoute" class="analyst-dashboard">
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>{{ t('common.loading') }}</p>
      </div>

      <div v-else>
        <!-- Analyst welcome section -->
        <div class="welcome-section">
          <h2 class="welcome-title">{{ t('analyst.welcome', {name: authStore.user?.name}) }}</h2>
          <p class="welcome-subtitle">{{ t('analyst.dashboard_description') }}</p>
        </div>

        <!-- KPIs -->
        <div class="kpi-grid">
          <div v-for="kpi in kpis" :key="kpi.id" class="kpi-card">
            <h3 class="kpi-title">{{ kpi.title }}</h3>
            <div class="kpi-value">{{ kpi.value }}</div>
            <div class="kpi-trend" :class="kpi.trend">
              {{ kpi.change }}
              <span class="trend-icon">
                <i :class="['pi', kpi.trend === 'up' ? 'pi-arrow-up' : kpi.trend === 'down' ? 'pi-arrow-down' : 'pi-arrow-right']"
                   aria-hidden="true"></i>
              </span>
            </div>
          </div>
        </div>

        <!-- Dashboard sections -->
        <div class="dashboard-sections">
          <!-- Main content -->
          <div class="main-content">
            <!-- Recent simulations -->
            <div class="overview-card">
              <div class="card-header">
                <h3 class="card-title">
                  <i class="pi pi-calculator" aria-hidden="true"></i>
                  {{ t('analyst.recent_simulations') }}
                </h3>
                <div class="card-header-actions">
                  <router-link to="/analyst/simulations" class="action-link">
                    <i class="pi pi-plus-circle" aria-hidden="true"></i>
                    {{ t('analyst.new_simulation') }}
                  </router-link>
                  <button @click="toggleRecentSimulations" class="toggle-button">
                    <i class="pi" :class="showRecentSimulations ? 'pi-chevron-up' : 'pi-chevron-down'" aria-hidden="true"></i>
                  </button>
                </div>
              </div>

              <div v-if="recentSimulations.length === 0 && showRecentSimulations" class="empty-state">
                {{ t('analyst.no_recent_simulations') }}
              </div>

              <div v-else-if="showRecentSimulations" class="simulations-list scrollable-content">
                <div v-for="simulation in recentSimulations.slice(0, 3)" :key="simulation.id" class="simulation-item">
                  <div class="simulation-header">
                    <div class="simulation-title">
                      <i class="pi pi-calculator" aria-hidden="true"></i>
                      {{ simulation.title }}
                    </div>
                    <div class="simulation-status" :class="getStatusClass(simulation.status)">
                      <i class="pi"
                         :class="simulation.status === 'completed' ? 'pi-check-circle' : simulation.status === 'in_progress' ? 'pi-spin pi-spinner' : 'pi-clock'"
                         aria-hidden="true"></i>
                      {{ t(`analyst.status.${simulation.status}`) }}
                    </div>
                  </div>

                  <div class="simulation-description">
                    <i class="pi pi-info-circle" aria-hidden="true"></i>
                    {{ simulation.description }}
                  </div>

                  <div v-if="simulation.status === 'in_progress'" class="simulation-progress">
                    <div class="progress-bar-container">
                      <div class="progress-bar" :style="`width: ${simulation.progress}%`"></div>
                    </div>
                    <div class="progress-value">{{ simulation.progress }}%</div>
                  </div>

                  <div class="simulation-meta">
                    <i class="pi pi-calendar" aria-hidden="true"></i>
                    <span>{{ getTimeAgo(simulation.createdAt) }}</span>
                  </div>
                </div>
              </div>

              <router-link v-if="recentSimulations.length > 0 && showRecentSimulations" to="/analyst/simulations" class="view-all-button">
                <i class="pi pi-list" aria-hidden="true"></i>
                {{ t('analyst.view_all_simulations') }}
              </router-link>
            </div>

            <!-- Recent reports -->
            <div class="overview-card">
              <div class="card-header">
                <h3 class="card-title">
                  <i class="pi pi-file-pdf" aria-hidden="true"></i>
                  {{ t('analyst.recent_reports') }}
                </h3>
                <div class="card-header-actions">
                  <router-link to="/analyst/reports" class="action-link">
                    <i class="pi pi-plus-circle" aria-hidden="true"></i>
                    {{ t('analyst.new_report') }}
                  </router-link>
                  <button @click="toggleRecentReports" class="toggle-button">
                    <i class="pi" :class="showRecentReports ? 'pi-chevron-up' : 'pi-chevron-down'" aria-hidden="true"></i>
                  </button>
                </div>
              </div>

              <div v-if="recentReports.length === 0 && showRecentReports" class="empty-state">
                {{ t('analyst.no_recent_reports') }}
              </div>

              <div v-else-if="showRecentReports" class="reports-list scrollable-content">
                <div v-for="report in recentReports.slice(0, 3)" :key="report.id" class="report-item">
                  <div class="report-header">
                    <div class="report-title">
                      <i class="pi pi-file-pdf" aria-hidden="true"></i>
                      {{ report.title }}
                    </div>
                    <div class="report-date">
                      <i class="pi pi-calendar" aria-hidden="true"></i>
                      {{ formatDate(report.createdAt) }}
                    </div>
                  </div>

                  <div class="report-insights">
                    <i class="pi pi-chart-bar" aria-hidden="true"></i>
                    {{ report.insights }}
                  </div>
                </div>
              </div>

              <router-link v-if="recentReports.length > 0 && showRecentReports" to="/analyst/reports" class="view-all-button">
                <i class="pi pi-list" aria-hidden="true"></i>
                {{ t('analyst.view_all_reports') }}
              </router-link>
            </div>

            <!-- Quick actions - moved to last position -->
            <div class="overview-card">
              <div class="card-header">
                <h3 class="card-title">
                  <i class="pi pi-bolt" aria-hidden="true"></i>
                  {{ t('analyst.quick_actions') }}
                </h3>
                <div class="card-header-actions">
                  <button @click="toggleQuickActions" class="toggle-button">
                    <i class="pi" :class="showQuickActions ? 'pi-chevron-up' : 'pi-chevron-down'" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
              <div v-if="showQuickActions" class="actions-grid scrollable-content">
                <router-link to="/analyst/simulations" class="action-button">
                  {{ t('analyst.actions.create_simulation') }}
                </router-link>
                <router-link to="/analyst/reports" class="action-button">
                  {{ t('analyst.actions.generate_report') }}
                </router-link>
                <router-link to="/analyst/ai-insights" class="action-button">
                  {{ t('analyst.actions.analyze_trends') }}
                </router-link>
                <router-link to="/analyst/inventory" class="action-button">
                  {{ t('analyst.actions.view_inventory') }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.loading-spinner {
  border: 4px solid var(--color-border);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-md);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.analyst-dashboard {
  width: 100%;
}

.welcome-section {
  margin-bottom: var(--spacing-xl);
}

.welcome-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
}

.welcome-subtitle {
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.kpi-card {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-normal), background-color var(--transition-normal);
}

.kpi-card:hover {
  box-shadow: var(--shadow-md);
}

.kpi-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.kpi-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.kpi-trend {
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
}

.kpi-trend.up {
  color: var(--color-success);
}

.kpi-trend.down {
  color: var(--color-error);
}

.kpi-trend.neutral {
  color: var(--color-text-tertiary);
}

.trend-icon {
  margin-left: var(--spacing-xs);
}

.dashboard-sections {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  width: 100%;
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-title .pi {
  color: var(--color-primary);
  font-size: 1.2rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border-light);
}

.card-header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.action-link {
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: color 0.2s ease;
}

.scrollable-content {
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
}

.action-link .pi {
  font-size: 1rem;
}

.action-link:hover {
  color: var(--color-primary-dark);
  text-decoration: none;
}

.overview-card {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-lg);
  transition: box-shadow var(--transition-normal), background-color var(--transition-normal);
}

.overview-card:hover {
  box-shadow: var(--shadow-md);
}

.empty-state {
  color: var(--color-text-tertiary);
  font-style: italic;
  padding: var(--spacing-md) 0;
}

.simulations-list, .reports-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.simulation-item, .report-item {
  background-color: var(--color-background);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-xs);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.simulation-item:hover, .report-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.simulation-header, .report-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.simulation-title, .report-title {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.simulation-title .pi, .report-title .pi {
  color: var(--color-primary);
  font-size: 1.1rem;
}

.simulation-status {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.status-completed {
  background-color: var(--color-success-light);
  color: var(--color-success-dark);
}

.status-in-progress {
  background-color: var(--color-info-light);
  color: var(--color-info-dark);
}

.status-pending {
  background-color: var(--color-warning-light);
  color: var(--color-warning-dark);
}

.simulation-description, .report-insights {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  line-height: 1.5;
}

.simulation-description .pi, .report-insights .pi {
  color: var(--color-info);
  font-size: 1rem;
  margin-top: 0.1rem;
}

.simulation-progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  padding-left: 1.5rem;
}

.progress-bar-container {
  flex: 1;
  height: 6px;
  background-color: var(--color-border);
  border-radius: var(--border-radius-full);
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  height: 100%;
  background-color: var(--color-primary);
  border-radius: var(--border-radius-full);
  transition: width 0.3s ease;
}

.progress-value {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-tertiary);
  min-width: 36px;
  text-align: right;
}

.simulation-meta, .report-date {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.simulation-meta .pi, .report-date .pi {
  color: var(--color-text-tertiary);
}

.view-all-button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: var(--spacing-md);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  padding: 0.4rem 0.8rem;
  border-radius: var(--border-radius-md);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.view-all-button .pi {
  font-size: 0.9rem;
}

.view-all-button:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
  text-decoration: none;
}


.toggle-button {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  transition: background-color 0.2s ease;
}

.toggle-button:hover {
  background-color: var(--color-primary-light);
}

.toggle-button .pi {
  font-size: 1rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  background-color: var(--color-background);
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-md);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
  text-align: center;
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
  text-decoration: none;
}

.action-button:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
  text-decoration: none;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
