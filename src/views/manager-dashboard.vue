<script setup>
import {computed, onMounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRoute} from 'vue-router/dist/vue-router.esm-bundler.js';
import {useAuthStore} from '../stores/auth';
import {useInventoryStore} from '../stores/inventoryData';
import {useAiInsightsStore} from '../stores/aiInsights';
import {useNotificationsStore} from '../stores/notifications';
import DashboardLayout from '../components/dashboard-layout.vue';

const { t } = useI18n();
const route = useRoute();
const authStore = useAuthStore();
const inventoryStore = useInventoryStore();
const aiInsightsStore = useAiInsightsStore();
const notificationsStore = useNotificationsStore();

// Determine if we're on the main dashboard route (not a child route)
const isMainDashboardRoute = computed(() => {
  return route.path === '/manager';
});

// Get the active sidebar item based on the current route
const getActiveItem = () => {
  const path = route.path;
  if (path === '/manager') return 'dashboard';
  if (path === '/manager/inventory') return 'inventory';
  if (path === '/manager/notifications') return 'notifications';
  if (path === '/manager/reports') return 'reports';
  if (path === '/manager/approvals') return 'approvals';
  if (path === '/manager/faq') return 'faq';
  return 'dashboard';
};

// Dashboard state
const isLoading = ref(true);

// Manager-specific metrics
const managerMetrics = ref({
  pendingApprovals: 0,
  inventoryAlerts: 0,
  teamPerformance: 0,
  costSavings: 0,
});

// KPIs
const kpis = computed(() => [
  {
    id: 'approvals',
    title: t('manager.kpi.pending_approvals'),
    value: managerMetrics.value.pendingApprovals,
    change: '+2%',
    trend: 'up',
  },
  {
    id: 'alerts',
    title: t('manager.kpi.inventory_alerts'),
    value: managerMetrics.value.inventoryAlerts,
    change: '-15%',
    trend: 'down',
  },
  {
    id: 'performance',
    title: t('manager.kpi.team_performance'),
    value: `${managerMetrics.value.teamPerformance}%`,
    change: '+5%',
    trend: 'up',
  },
  {
    id: 'savings',
    title: t('manager.kpi.cost_savings'),
    value: `$${managerMetrics.value.costSavings.toLocaleString()}`,
    change: '+12%',
    trend: 'up',
  },
]);

// Pending approvals
const pendingApprovals = ref([]);

// Team members
const teamMembers = ref([]);

// Load dashboard data
onMounted(async () => {
  try {
    // Simulate API calls
    await Promise.all([
      loadManagerMetrics(),
      loadPendingApprovals(),
      loadTeamMembers(),
    ]);
  } catch (error) {
    console.error('Error loading manager dashboard data:', error);
  } finally {
    isLoading.value = false;
  }
});

// Load manager metrics
const loadManagerMetrics = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));

  managerMetrics.value = {
    pendingApprovals: 12,
    inventoryAlerts: 5,
    teamPerformance: 92,
    costSavings: 24680,
  };
};

// Load pending approvals
const loadPendingApprovals = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 600));

  pendingApprovals.value = [
    {
      id: 1,
      type: 'inventory_adjustment',
      requestedBy: 'Sarah Analyst',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      details: 'Increase safety stock for SKU-12345 by 15%',
      priority: 'high',
    },
    {
      id: 2,
      type: 'price_change',
      requestedBy: 'John Analyst',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      details: 'Adjust pricing for Q4 seasonal items',
      priority: 'medium',
    },
    {
      id: 3,
      type: 'supplier_change',
      requestedBy: 'Mike Logistics',
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      details: 'Switch to alternate supplier for raw materials',
      priority: 'medium',
    },
    {
      id: 4,
      type: 'forecast_adjustment',
      requestedBy: 'AI System',
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      details: 'Update demand forecast based on recent trends',
      priority: 'low',
    },
  ];
};

// Load team members
const loadTeamMembers = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 700));

  teamMembers.value = [
    {
      id: 1,
      name: 'Sarah Analyst',
      role: 'Senior Analyst',
      performance: 95,
      status: 'online',
      tasks: 8,
      completedTasks: 5,
    },
    {
      id: 2,
      name: 'John Analyst',
      role: 'Inventory Analyst',
      performance: 88,
      status: 'online',
      tasks: 12,
      completedTasks: 7,
    },
    {
      id: 3,
      name: 'Mike Logistics',
      role: 'Logistics Coordinator',
      performance: 92,
      status: 'away',
      tasks: 10,
      completedTasks: 8,
    },
    {
      id: 4,
      name: 'Lisa Planner',
      role: 'Supply Chain Planner',
      performance: 94,
      status: 'offline',
      tasks: 6,
      completedTasks: 6,
    },
  ];
};


// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Get time ago
const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return t('time.just_now');
  if (diffMins < 60) return t('time.minutes_ago', { count: diffMins });

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return t('time.hours_ago', { count: diffHours });

  const diffDays = Math.floor(diffHours / 24);
  return t('time.days_ago', { count: diffDays });
};

// Handle approval action
const handleApproval = (id, action) => {
  // In a real app, this would call an API
  console.log(`Approval ${id} ${action}`);

  // Remove the approval from the list
  pendingApprovals.value = pendingApprovals.value.filter(item => item.id !== id);

  // Update metrics
  managerMetrics.value.pendingApprovals -= 1;
};
</script>

<template>
  <DashboardLayout 
    :title="t('manager.dashboard_title')" 
    :activeItem="getActiveItem()"
  >
    <!-- Main content or router view for child routes -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Default content when on the main dashboard route -->
    <div v-if="isMainDashboardRoute" class="manager-dashboard">
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>{{ t('common.loading') }}</p>
      </div>

      <div v-else>
        <!-- Manager welcome section -->
        <div class="welcome-section">
          <h2 class="welcome-title">{{ t('manager.welcome', { name: authStore.user?.name }) }}</h2>
          <p class="welcome-subtitle">{{ t('manager.dashboard_description') }}</p>
        </div>

        <!-- KPIs -->
        <div class="kpi-grid">
          <div v-for="kpi in kpis" :key="kpi.id" class="kpi-card">
            <h3 class="kpi-title">{{ kpi.title }}</h3>
            <div class="kpi-value">{{ kpi.value }}</div>
            <div class="kpi-trend" :class="kpi.trend">
              {{ kpi.change }}
              <span class="trend-icon">
                <i :class="['pi', kpi.trend === 'up' ? 'pi-arrow-up' : kpi.trend === 'down' ? 'pi-arrow-down' : 'pi-arrow-right']" aria-hidden="true"></i>
              </span>
            </div>
          </div>
        </div>

        <!-- Dashboard sections -->
        <div class="dashboard-sections" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--spacing-lg, 1.5rem);">
          <!-- Pending approvals summary -->
          <div class="overview-card">
            <div class="card-header">
              <h3 class="card-title">{{ t('manager.pending_approvals') }}</h3>
            </div>
            <div v-if="pendingApprovals.length === 0" class="empty-state">
              {{ t('manager.no_pending_approvals') }}
            </div>
            <div v-else class="approvals-summary">
              <div v-for="priority in ['high', 'medium', 'low']" :key="priority" class="priority-group">
                <div class="priority-label" :class="`priority-${priority}`">
                  {{ t(`manager.priority.${priority}`) }}
                </div>
                <div class="priority-count">
                  {{ pendingApprovals.filter(a => a.priority === priority).length }}
                </div>
              </div>
            </div>
            <router-link to="/manager/approvals" class="view-all-button">
              {{ t('manager.view_all_approvals') }}
            </router-link>
          </div>

          <!-- Team performance summary -->
          <div class="overview-card team-performance-card">
            <div class="card-header">
              <h3 class="card-title">{{ t('manager.team_performance') }}</h3>
            </div>
            <div class="team-summary">
              <div class="team-metric performance-metric">
                <div class="metric-icon">
                  <i class="pi pi-chart-line" aria-hidden="true"></i>
                </div>
                <div class="metric-label">{{ t('manager.avg_performance') }}</div>
                <div class="metric-value" :class="getPerformanceClass(managerMetrics.teamPerformance)">
                  {{ managerMetrics.teamPerformance }}%
                </div>
                <div class="metric-progress">
                  <div class="progress-bar" :style="{width: `${managerMetrics.teamPerformance}%`}"></div>
                </div>
              </div>
              <div class="team-metric">
                <div class="metric-icon">
                  <i class="pi pi-users" aria-hidden="true"></i>
                </div>
                <div class="metric-label">{{ t('manager.team_members') }}</div>
                <div class="metric-value">{{ teamMembers.length }}</div>
              </div>
              <div class="team-metric">
                <div class="metric-icon">
                  <i class="pi pi-user-plus" aria-hidden="true"></i>
                </div>
                <div class="metric-label">{{ t('manager.online_now') }}</div>
                <div class="metric-value">{{ teamMembers.filter(m => m.status === 'online').length }}</div>
              </div>
            </div>
          </div>

          <!-- Quick actions -->
          <div class="manager-actions">
            <div class="card-header">
              <h3 class="card-title">{{ t('manager.quick_actions') }}</h3>
            </div>
            <div class="actions-grid">
              <router-link to="/manager/inventory" class="action-button">
                {{ t('manager.actions.view_inventory') }}
              </router-link>
              <router-link to="/manager/approvals" class="action-button">
                {{ t('manager.actions.manage_approvals') }}
              </router-link>
              <router-link to="/manager/reports" class="action-button">
                {{ t('manager.actions.view_reports') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script>
// Helper function for performance class
export const getPerformanceClass = (value) => {
  if (value >= 90) return 'performance-excellent';
  if (value >= 75) return 'performance-good';
  if (value >= 60) return 'performance-average';
  return 'performance-poor';
};
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border);
  border-radius: 50%;
  border-top-color: var(--color-primary);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.manager-dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg, 1.5rem);
  width: 100%;
}

.welcome-section {
  margin-bottom: var(--spacing-xl, 1.5rem);
}

.welcome-title {
  font-size: var(--font-size-2xl, 1.5rem);
  font-weight: var(--font-weight-bold, 600);
  margin-bottom: var(--spacing-sm, 0.5rem);
  color: var(--color-text-primary);
}

.welcome-subtitle {
  font-size: var(--font-size-md, 1rem);
  color: var(--color-text-secondary);
  margin: 0;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--spacing-lg, 1rem);
  margin-bottom: var(--spacing-xl, 1.5rem);
}

.kpi-card {
  background-color: var(--color-surface, var(--color-background));
  border-radius: var(--border-radius-lg, 8px);
  padding: var(--spacing-lg, 1.5rem);
  box-shadow: var(--color-shadow);
  transition: box-shadow var(--transition-normal, 0.2s), background-color var(--transition-normal, 0.2s);
}

.kpi-card:hover {
  box-shadow: var(--shadow-md, 0 4px 6px rgba(0, 0, 0, 0.1));
}

.kpi-title {
  font-size: var(--font-size-md, 0.875rem);
  font-weight: var(--font-weight-medium, 500);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm, 0.5rem);
}

.kpi-value {
  font-size: var(--font-size-2xl, 2rem);
  font-weight: var(--font-weight-bold, 600);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm, 0.5rem);
}

.kpi-trend {
  font-size: var(--font-size-sm, 0.875rem);
  font-weight: var(--font-weight-medium, 500);
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
  color: var(--color-text-tertiary, var(--color-text-secondary));
}

.trend-icon {
  margin-left: var(--spacing-xs, 0.25rem);
}


.card-title {
  font-size: var(--font-size-lg, 1.125rem);
  font-weight: var(--font-weight-semibold, 600);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md, 1rem);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md, 1rem);
}

.action-link {
  color: var(--color-primary);
  font-size: var(--font-size-sm, 0.875rem);
  font-weight: var(--font-weight-medium, 500);
  text-decoration: none;
}

.action-link:hover {
  text-decoration: underline;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg, 1.5rem);
}

.overview-card {
  background-color: var(--color-surface, var(--color-background-secondary));
  border-radius: var(--border-radius-lg, 8px);
  padding: var(--spacing-lg, 1.5rem);
  box-shadow: var(--color-shadow);
  margin-bottom: var(--spacing-lg, 1.5rem);
  transition: box-shadow var(--transition-normal, 0.2s), background-color var(--transition-normal, 0.2s);
}

.overview-card:hover {
  box-shadow: var(--shadow-md, 0 4px 6px rgba(0, 0, 0, 0.1));
}

.approvals-summary {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.priority-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: var(--color-background);
  min-width: 80px;
}

.priority-label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.priority-high {
  color: var(--color-error);
}

.priority-medium {
  color: var(--color-warning);
}

.priority-low {
  color: var(--color-success);
}

.priority-count {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.team-summary {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.team-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: var(--color-background);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.team-metric:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.performance-metric {
  border-bottom: 3px solid var(--color-primary);
}

.metric-icon {
  font-size: 1.5rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.metric-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
  text-align: center;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.metric-progress {
  width: 100%;
  height: 6px;
  background-color: var(--color-background-secondary);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.progress-bar {
  height: 100%;
  background-color: var(--color-primary);
  border-radius: 3px;
}

.performance-excellent {
  color: var(--color-success);
}

.performance-good {
  color: var(--color-primary);
}

.performance-average {
  color: var(--color-warning);
}

.performance-poor {
  color: var(--color-error);
}

.view-all-button {
  display: inline-block;
  margin-top: var(--spacing-md, 1rem);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium, 500);
  text-decoration: none;
}

.view-all-button:hover {
  text-decoration: underline;
}

.manager-actions {
  background-color: var(--color-surface, var(--color-background));
  border-radius: var(--border-radius-lg, 8px);
  padding: var(--spacing-lg, 1.5rem);
  box-shadow: var(--color-shadow);
  margin-bottom: var(--spacing-lg, 1.5rem);
  transition: box-shadow var(--transition-normal, 0.2s), background-color var(--transition-normal, 0.2s);
}

.manager-actions:hover {
  box-shadow: var(--shadow-md, 0 4px 6px rgba(0, 0, 0, 0.1));
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--spacing-md, 1rem);
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md, 1rem);
  background-color: var(--color-background);
  border: var(--border-width-thin, 1px) solid var(--color-border);
  border-radius: var(--border-radius-md, 6px);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium, 500);
  text-align: center;
  transition: background-color var(--transition-fast, 0.15s), border-color var(--transition-fast, 0.15s);
  text-decoration: none;
}

.action-button:hover {
  background-color: var(--color-surface-hover, var(--color-bg-hover));
  border-color: var(--color-primary, var(--color-border-hover));
  text-decoration: none;
}

.empty-state {
  color: var(--color-text-tertiary, var(--color-text-secondary));
  font-style: italic;
  padding: var(--spacing-md, 1rem) 0;
}

.approvals-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.approval-item {
  padding: 1.5rem;
  border-radius: 8px;
  background-color: var(--color-background-secondary);
  border-left: 4px solid var(--color-primary);
}

.approval-item.priority-high {
  border-left-color: var(--color-error);
}

.approval-item.priority-medium {
  border-left-color: var(--color-warning);
}

.approval-item.priority-low {
  border-left-color: var(--color-success);
}

.approval-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.approval-type {
  font-weight: 600;
  color: var(--color-text-primary);
}

.approval-priority {
  font-size: 0.875rem;
  font-weight: 500;
}

.approval-details {
  margin-bottom: 1rem;
  color: var(--color-text-tertiary);
}

.approval-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.approval-actions {
  display: flex;
  gap: 0.5rem;
}

.approve-button {
  padding: 0.5rem 1rem;
  background-color: var(--color-success);
  color: var(--color-button-text);
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.reject-button {
  padding: 0.5rem 1rem;
  background-color: var(--color-error);
  color: var(--color-button-text);
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.more-info-button {
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: var(--color-button-text);
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.team-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.team-member {
  padding: 1.5rem;
  border-radius: 8px;
  background-color: var(--color-background-secondary);
  box-shadow: var(--color-shadow);
}

.member-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.member-name-container {
  display: flex;
  align-items: center;
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: var(--color-button-text);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 1rem;
}

.member-info {
  display: flex;
  flex-direction: column;
}

.member-name {
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
}

.member-role {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.member-status {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.status-online {
  background-color: var(--color-success-muted);
  color: var(--color-success-text);
}

.status-away {
  background-color: var(--color-warning-muted);
  color: var(--color-warning-text);
}

.status-offline {
  background-color: var(--color-background-muted);
  color: var(--color-text-tertiary);
}

.member-metrics {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.member-metric {
  text-align: center;
}

.performance-excellent {
  color: var(--color-success);
}

.performance-good {
  color: var(--color-primary);
}

.performance-average {
  color: var(--color-warning);
}

.performance-poor {
  color: var(--color-error);
}

.member-progress {
  margin-bottom: 1rem;
}

.progress-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
}

.progress-bar-container {
  height: 6px;
  background-color: var(--color-border);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: var(--color-primary);
}

.member-actions {
  display: flex;
  gap: 0.5rem;
}

.member-action-button {
  flex: 1;
  padding: 0.5rem;
  background-color: var(--color-background-muted);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-tertiary);
  cursor: pointer;
}

.member-action-button:hover {
  background-color: var(--color-bg-hover);
}
</style>
