<script setup>
import {computed, onMounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRoute} from 'vue-router';
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
  return route.path === '/admin';
});

// Get the active sidebar item based on the current route
const getActiveItem = () => {
  const path = route.path;
  if (path === '/admin') return 'dashboard';
  if (path === '/admin/inventory') return 'inventory';
  if (path === '/admin/users') return 'users';
  if (path === '/admin/settings') return 'settings';
  return 'dashboard';
};

// Dashboard state
const isLoading = ref(true);
const systemStatus = ref({
  usersOnline: 0,
  pendingApprovals: 0,
  systemHealth: 'optimal',
  lastBackup: new Date().toISOString(),
});

// Admin-specific metrics
const adminMetrics = ref({
  totalUsers: 0,
  activeUsers: 0,
  pendingApprovals: 0,
  systemAlerts: 0,
});

// KPIs
const kpis = computed(() => [
  {
    id: 'users',
    title: t('admin.kpi.users'),
    value: adminMetrics.value.totalUsers,
    change: '+5%',
    trend: 'up',
  },
  {
    id: 'approvals',
    title: t('admin.kpi.pending_approvals'),
    value: adminMetrics.value.pendingApprovals,
    change: '-10%',
    trend: 'down',
  },
  {
    id: 'alerts',
    title: t('admin.kpi.system_alerts'),
    value: adminMetrics.value.systemAlerts,
    change: '0%',
    trend: 'neutral',
  },
  {
    id: 'inventory',
    title: t('admin.kpi.inventory_items'),
    value: inventoryStore.totalItems,
    change: '+3%',
    trend: 'up',
  },
]);

// Recent activities
const recentActivities = ref([]);

// Load dashboard data
onMounted(async () => {
  try {
    // Simulate API calls
    await Promise.all([
      loadAdminMetrics(),
      loadSystemStatus(),
      loadRecentActivities(),
    ]);
  } catch (error) {
    console.error('Error loading admin dashboard data:', error);
  } finally {
    isLoading.value = false;
  }
});

// Load admin metrics
const loadAdminMetrics = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));

  adminMetrics.value = {
    totalUsers: 156,
    activeUsers: 42,
    pendingApprovals: 7,
    systemAlerts: 2,
  };
};

// Load system status
const loadSystemStatus = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 600));

  systemStatus.value = {
    usersOnline: 42,
    pendingApprovals: 7,
    systemHealth: 'optimal',
    lastBackup: new Date().toISOString(),
  };
};

// Load recent activities
const loadRecentActivities = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 700));

  recentActivities.value = [
    {
      id: 1,
      user: 'John Manager',
      action: 'approved inventory adjustment',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      details: 'Approved 15% increase in safety stock levels',
    },
    {
      id: 2,
      user: 'Sarah Analyst',
      action: 'created new simulation',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      details: 'Q4 demand forecast with 3 scenarios',
    },
    {
      id: 3,
      user: 'Mike Logistics',
      action: 'updated shipping routes',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      details: 'Added 2 new distribution centers',
    },
    {
      id: 4,
      user: 'Admin',
      action: 'system backup',
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      details: 'Automated daily backup completed successfully',
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
</script>

<template>
  <DashboardLayout 
    :title="t('admin.dashboard_title')" 
    :activeItem="getActiveItem()"
  >
    <!-- Main content or router view for child routes -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Default content when on the main dashboard route -->
    <div v-if="isMainDashboardRoute" class="admin-dashboard">
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>{{ t('common.loading') }}</p>
      </div>

      <div v-else>
        <!-- Admin welcome section -->
        <div class="welcome-section">
          <h2 class="welcome-title">{{ t('admin.welcome', { name: authStore.user?.name }) }}</h2>
          <p class="welcome-subtitle">{{ t('admin.dashboard_description') }}</p>
        </div>

        <!-- KPIs -->
        <div class="kpi-grid">
          <div v-for="kpi in kpis" :key="kpi.id" class="kpi-card">
            <h3 class="kpi-title">{{ kpi.title }}</h3>
            <div class="kpi-value">{{ kpi.value }}</div>
            <div class="kpi-trend" :class="kpi.trend">
              {{ kpi.change }}
              <span class="trend-icon">
                {{ kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→' }}
              </span>
            </div>
          </div>
        </div>

        <!-- System status -->
        <div class="system-status-card">
          <h3 class="card-title">{{ t('admin.system_status') }}</h3>
          <div class="status-grid">
            <div class="status-item">
              <div class="status-label">{{ t('admin.users_online') }}</div>
              <div class="status-value">{{ systemStatus.usersOnline }}</div>
            </div>
            <div class="status-item">
              <div class="status-label">{{ t('admin.pending_approvals') }}</div>
              <div class="status-value">{{ systemStatus.pendingApprovals }}</div>
            </div>
            <div class="status-item">
              <div class="status-label">{{ t('admin.system_health') }}</div>
              <div class="status-value" :class="`health-${systemStatus.systemHealth}`">
                {{ t(`admin.health.${systemStatus.systemHealth}`) }}
              </div>
            </div>
            <div class="status-item">
              <div class="status-label">{{ t('admin.last_backup') }}</div>
              <div class="status-value">{{ formatDate(systemStatus.lastBackup) }}</div>
            </div>
          </div>
        </div>

        <!-- Dashboard sections -->
        <div class="dashboard-sections">
          <!-- Quick actions -->
          <div class="admin-actions">
            <h3 class="card-title">{{ t('admin.quick_actions') }}</h3>
            <div class="actions-grid">
              <router-link to="/admin/users" class="action-button">
                {{ t('admin.actions.manage_users') }}
              </router-link>
              <router-link to="/admin/settings" class="action-button">
                {{ t('admin.actions.system_settings') }}
              </router-link>
              <router-link to="/admin/inventory" class="action-button">
                {{ t('admin.actions.manage_inventory') }}
              </router-link>
            </div>
          </div>

          <!-- Recent activities -->
          <div class="overview-card">
            <h3 class="card-title">{{ t('admin.recent_activities') }}</h3>
            <div v-if="recentActivities.length === 0" class="empty-state">
              {{ t('admin.no_recent_activities') }}
            </div>
            <div v-else class="activities-list">
              <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                <div class="activity-header">
                  <span class="activity-user">{{ activity.user }}</span>
                  <span class="activity-time">{{ getTimeAgo(activity.timestamp) }}</span>
                </div>
                <div class="activity-action">{{ activity.action }}</div>
                <div class="activity-details">{{ activity.details }}</div>
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.admin-dashboard {
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

.system-status-card {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-lg);
  transition: box-shadow var(--transition-normal), background-color var(--transition-normal);
}

.system-status-card:hover {
  box-shadow: var(--shadow-md);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.status-item {
  display: flex;
  flex-direction: column;
}

.status-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.status-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.health-optimal {
  color: var(--color-success);
}

.health-warning {
  color: var(--color-warning);
}

.health-critical {
  color: var(--color-error);
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

.activities-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.activity-item {
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  background-color: var(--color-background);
  border-left: 3px solid var(--color-primary);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.activity-user {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.activity-time {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.activity-action {
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-xs);
}

.activity-details {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

.dashboard-sections {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.admin-actions {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-lg);
  transition: box-shadow var(--transition-normal), background-color var(--transition-normal);
}

.admin-actions:hover {
  box-shadow: var(--shadow-md);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--spacing-md);
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

@media (max-width: 768px) {
  .kpi-grid {
    grid-template-columns: 1fr 1fr;
  }

  .status-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
