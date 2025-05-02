<script setup>
import {computed, onMounted, ref, shallowRef} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRoute} from 'vue-router';
import {useAuthStore} from '../stores/auth';
import {useInventoryStore} from '../stores/inventoryData';
import {useNotificationsStore} from '../stores/notifications';
import DashboardLayout from '../components/dashboard-layout.vue';
import FormContainer from '../components/base/form-container.vue';
import DataList from '../components/data-list.vue';
import ModalDialog from '../components/base/modal-dialog.vue';

const { t } = useI18n();
const route = useRoute();
const authStore = useAuthStore();
const inventoryStore = useInventoryStore();
const notificationsStore = useNotificationsStore();

// Determine if we're on the main dashboard route (not a child route)
const isMainDashboardRoute = computed(() => {
  return route.path === '/logistics';
});

// Get the active sidebar item based on the current route
const getActiveItem = () => {
  const path = route.path;
  if (path === '/logistics') return 'dashboard';
  if (path === '/logistics/inventory') return 'inventory';
  if (path === '/logistics/shipments') return 'shipments';
  if (path === '/logistics/deliveries') return 'deliveries';
  if (path === '/logistics/notifications') return 'notifications';
  return 'dashboard';
};

// Dashboard state
const isLoading = ref(true);

// Logistics-specific metrics
const logisticsMetrics = ref({
  pendingShipments: 0,
  inTransit: 0,
  deliveredToday: 0,
  stockoutRisk: 0,
});

// KPIs
const kpis = computed(() => [
  {
    id: 'pending',
    title: t('logistics.kpi.pending_shipments'),
    value: logisticsMetrics.value.pendingShipments,
    change: '+3',
    trend: 'up',
  },
  {
    id: 'transit',
    title: t('logistics.kpi.in_transit'),
    value: logisticsMetrics.value.inTransit,
    change: '-2',
    trend: 'down',
  },
  {
    id: 'delivered',
    title: t('logistics.kpi.delivered_today'),
    value: logisticsMetrics.value.deliveredToday,
    change: '+5',
    trend: 'up',
  },
  {
    id: 'stockout',
    title: t('logistics.kpi.stockout_risk'),
    value: logisticsMetrics.value.stockoutRisk,
    change: '-2',
    trend: 'down',
  },
]);

// Recent shipments
const recentShipments = shallowRef([]);

// Inventory alerts
const inventoryAlerts = shallowRef([]);

// Upcoming deliveries
const upcomingDeliveries = shallowRef([]);

// Load dashboard data
onMounted(async () => {
  try {
    // Simulate API calls
    await Promise.all([
      loadLogisticsMetrics(),
      loadRecentShipments(),
      loadInventoryAlerts(),
      loadUpcomingDeliveries(),
    ]);
  } catch (error) {
    console.error('Error loading logistics dashboard data:', error);
  } finally {
    isLoading.value = false;
  }
});

// Load logistics metrics
const loadLogisticsMetrics = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));

  logisticsMetrics.value = {
    pendingShipments: 18,
    inTransit: 42,
    deliveredToday: 23,
    stockoutRisk: 5,
  };
};

// Load recent shipments
const loadRecentShipments = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 600));

  recentShipments.value = [
    {
      id: 'SHP-1234',
      destination: 'New York Distribution Center',
      status: 'in_transit',
      estimatedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
      items: 12,
      priority: 'high',
    },
    {
      id: 'SHP-1235',
      destination: 'Chicago Warehouse',
      status: 'pending',
      estimatedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(),
      items: 8,
      priority: 'medium',
    },
    {
      id: 'SHP-1236',
      destination: 'Los Angeles Retail Store',
      status: 'delivered',
      deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      items: 15,
      priority: 'high',
    },
  ];
};

// Load inventory alerts
const loadInventoryAlerts = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 700));

  inventoryAlerts.value = [
    {
      id: 1,
      item: 'Wireless Headphones',
      sku: 'SKU-5678',
      type: 'low_stock',
      level: 'critical',
      details: 'Current stock: 5 units (below safety threshold of 15)',
    },
    {
      id: 2,
      item: 'Smart Watches',
      sku: 'SKU-9012',
      type: 'stockout_risk',
      level: 'warning',
      details: 'Projected stockout in 5 days based on current demand',
    },
    {
      id: 3,
      item: 'Bluetooth Speakers',
      sku: 'SKU-3456',
      type: 'excess_inventory',
      level: 'info',
      details: 'Current stock exceeds optimal levels by 35%',
    },
  ];
};

// Load upcoming deliveries
const loadUpcomingDeliveries = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));

  upcomingDeliveries.value = [
    {
      id: 'DEL-7890',
      supplier: 'TechSupplies Inc.',
      expectedArrival: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString(),
      items: 8,
      status: 'on_time',
    },
    {
      id: 'DEL-7891',
      supplier: 'ElectroGoods Ltd.',
      expectedArrival: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
      items: 12,
      status: 'delayed',
    },
    {
      id: 'DEL-7892',
      supplier: 'GadgetWorld Co.',
      expectedArrival: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
      items: 5,
      status: 'on_time',
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

  if (diffMins < 60) return t('time.minutes_ago', { count: diffMins });

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return t('time.hours_ago', { count: diffHours });

  const diffDays = Math.floor(diffHours / 24);
  return t('time.days_ago', { count: diffDays });
};

// Get time until
const getTimeUntil = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date - now;
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 60) return t('time.in_minutes', { count: diffMins });

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return t('time.in_hours', { count: diffHours });

  const diffDays = Math.floor(diffHours / 24);
  return t('time.in_days', { count: diffDays });
};

// Get status class
const getStatusClass = (status) => {
  switch (status) {
    case 'delivered':
    case 'on_time': return 'status-success';
    case 'in_transit': return 'status-in-progress';
    case 'pending': return 'status-pending';
    case 'delayed': return 'status-warning';
    default: return '';
  }
};

// Get alert level class
const getAlertLevelClass = (level) => {
  switch (level) {
    case 'critical': return 'alert-critical';
    case 'warning': return 'alert-warning';
    case 'info': return 'alert-info';
    default: return '';
  }
};

// Create new shipment
const createNewShipment = () => {
  // In a real app, this would navigate to a shipment creation page
  console.log('Create new shipment');
};

// Handle inventory action
const handleInventoryAction = (id, action) => {
  // In a real app, this would call an API
  console.log(`Inventory action ${action} for item ${id}`);

  // Remove the alert from the list
  inventoryAlerts.value = inventoryAlerts.value.filter(alert => alert.id !== id);
};

// Modal dialog state
const showNewShipmentModal = ref(false);
const showInventoryActionModal = ref(false);
const selectedInventoryAlert = ref(null);

// Open inventory action modal
const openInventoryActionModal = (alertData) => {
  // Find the original alert object using the SKU from the transformed data
  const originalAlert = inventoryAlerts.value.find(alert => alert.sku === alertData.SKU);
  if (originalAlert) {
    selectedInventoryAlert.value = originalAlert;
    showInventoryActionModal.value = true;
  }
};

// Handle inventory action from modal
const confirmInventoryAction = (action) => {
  if (selectedInventoryAlert.value) {
    handleInventoryAction(selectedInventoryAlert.value.id, action);
    showInventoryActionModal.value = false;
  }
};
</script>

<template>
  <DashboardLayout 
    :title="t('logistics.dashboard_title')" 
    :activeItem="getActiveItem()"
  >
    <!-- Main content or router view for child routes -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Default content when on the main dashboard route -->
    <div v-if="isMainDashboardRoute" class="logistics-dashboard">
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>{{ t('common.loading') }}</p>
      </div>

      <div v-else>
        <!-- Logistics welcome section -->
        <div class="welcome-section">
          <h2 class="welcome-title">{{ t('logistics.welcome', { name: authStore.user?.name }) }}</h2>
          <p class="welcome-subtitle">{{ t('logistics.dashboard_description') }}</p>
        </div>

        <!-- KPIs -->
        <div class="kpi-grid">
          <FormContainer v-for="kpi in kpis" :key="kpi.id" class="kpi-card">
            <template #header>
              <h3 class="kpi-title">{{ kpi.title }}</h3>
            </template>
            <div class="kpi-value">{{ kpi.value }}</div>
            <div class="kpi-trend" :class="kpi.trend">
              {{ kpi.change }}
              <span class="trend-icon">
                {{ kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→' }}
              </span>
            </div>
          </FormContainer>
        </div>

        <!-- Dashboard sections -->
        <div class="dashboard-sections">
          <!-- Quick actions -->
          <FormContainer :title="t('logistics.quick_actions')" class="logistics-actions">
            <div class="actions-grid">
              <router-link to="/logistics/shipments" class="action-button" @click.prevent="showNewShipmentModal = true">
                {{ t('logistics.actions.create_shipment') }}
              </router-link>
              <router-link to="/logistics/deliveries" class="action-button">
                {{ t('logistics.actions.schedule_delivery') }}
              </router-link>
              <router-link to="/logistics/inventory" class="action-button">
                {{ t('logistics.actions.inventory_count') }}
              </router-link>
              <router-link to="/logistics/reports" class="action-button">
                {{ t('logistics.actions.generate_report') }}
              </router-link>
            </div>
          </FormContainer>

          <!-- Recent shipments -->
          <FormContainer :title="t('logistics.recent_shipments')" class="overview-card">
            <template #header-actions>
              <button @click="showNewShipmentModal = true" class="action-link">
                {{ t('logistics.new_shipment') }}
              </button>
            </template>

            <DataList 
              :items="recentShipments.map(shipment => ({
                ID: shipment.id,
                Destination: shipment.destination,
                Status: t(`logistics.status.${shipment.status}`),
                Items: shipment.items,
                Priority: t(`logistics.priority.${shipment.priority}`),
                Delivery: shipment.status === 'delivered' 
                  ? `${t('logistics.delivered')}: ${getTimeAgo(shipment.deliveredAt)}`
                  : `${t('logistics.estimated_delivery')}: ${formatDate(shipment.estimatedDelivery)}`
              }))"
              @item-selected="navigateTo('/logistics/shipments')"
            />

            <template #footer v-if="recentShipments.length > 0">
              <router-link to="/logistics/shipments" class="view-all-button">
                {{ t('logistics.view_all_shipments') }}
              </router-link>
            </template>
          </FormContainer>

          <!-- Inventory alerts -->
          <FormContainer :title="t('logistics.inventory_alerts')" class="overview-card">
            <DataList 
              :items="inventoryAlerts.map(alert => ({
                Item: alert.item,
                SKU: alert.sku,
                Level: t(`logistics.alert_level.${alert.level}`),
                Details: alert.details
              }))"
              @item-selected="openInventoryActionModal($event)"
            />

            <template #footer v-if="inventoryAlerts.length > 0">
              <router-link to="/logistics/inventory" class="view-all-button">
                {{ t('logistics.view_all_alerts') }}
              </router-link>
            </template>
          </FormContainer>
        </div>
      </div>
    </div>
  </DashboardLayout>

  <!-- Modal Dialogs -->
  <!-- New Shipment Modal -->
  <ModalDialog 
    v-model:visible="showNewShipmentModal"
    :title="t('logistics.new_shipment')"
    :modal="true"
    :closable="true"
    width="500px"
  >
    <div class="p-4">
      <p>{{ t('logistics.new_shipment_description') }}</p>
      <!-- In a real app, this would be a form with inputs for shipment details -->
      <div class="mt-4">
        <p>{{ t('logistics.shipment_form_placeholder') }}</p>
      </div>
    </div>
    <template #footer>
      <button 
        class="px-4 py-2 bg-gray-200 text-gray-800 rounded mr-2"
        @click="showNewShipmentModal = false"
      >
        {{ t('common.cancel') }}
      </button>
      <button 
        class="px-4 py-2 bg-primary-500 text-white rounded"
        @click="createNewShipment(); showNewShipmentModal = false"
      >
        {{ t('common.create') }}
      </button>
    </template>
  </ModalDialog>

  <!-- Inventory Action Modal -->
  <ModalDialog 
    v-model:visible="showInventoryActionModal"
    :title="t('logistics.inventory_action')"
    :modal="true"
    :closable="true"
    width="500px"
  >
    <div class="p-4" v-if="selectedInventoryAlert">
      <h4 class="text-lg font-medium mb-2">{{ selectedInventoryAlert.item }}</h4>
      <p class="text-sm text-gray-600 mb-2">{{ selectedInventoryAlert.sku }}</p>
      <p class="mb-4">{{ selectedInventoryAlert.details }}</p>
      <p>{{ t('logistics.inventory_action_description') }}</p>
    </div>
    <template #footer>
      <button 
        class="px-4 py-2 bg-gray-200 text-gray-800 rounded mr-2"
        @click="showInventoryActionModal = false"
      >
        {{ t('common.cancel') }}
      </button>
      <button 
        class="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
        @click="confirmInventoryAction('adjust')"
      >
        {{ t('logistics.adjust_levels') }}
      </button>
      <button 
        class="px-4 py-2 bg-primary-500 text-white rounded"
        @click="confirmInventoryAction('restock')"
      >
        {{ t('logistics.restock') }}
      </button>
    </template>
  </ModalDialog>
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

.logistics-dashboard {
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.action-link {
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
}

.action-link:hover {
  text-decoration: underline;
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

.shipments-list, .alerts-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.shipment-item, .alert-item {
  background-color: var(--color-background);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-xs);
}

.shipment-header, .alert-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.shipment-id {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.shipment-status, .alert-level {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
}

.status-success {
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

.status-warning {
  background-color: var(--color-warning-light);
  color: var(--color-warning-dark);
}

.shipment-destination, .alert-title {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.alert-sku {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.shipment-details, .alert-details {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-sm);
}

.shipment-delivery {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.shipment-priority {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
}

.priority-high {
  background-color: var(--color-error-light);
  color: var(--color-error-dark);
}

.priority-medium {
  background-color: var(--color-warning-light);
  color: var(--color-warning-dark);
}

.priority-low {
  background-color: var(--color-success-light);
  color: var(--color-success-dark);
}

.alert-critical {
  border-left: 3px solid var(--color-error);
}

.alert-warning {
  border-left: 3px solid var(--color-warning);
}

.alert-info {
  border-left: 3px solid var(--color-info);
}

.alert-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.alert-action-button {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-background);
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.alert-action-button:hover {
  background-color: var(--color-surface-hover);
}

.view-all-button {
  display: inline-block;
  margin-top: var(--spacing-md);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
}

.view-all-button:hover {
  text-decoration: underline;
}

.logistics-actions {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-lg);
  transition: box-shadow var(--transition-normal), background-color var(--transition-normal);
}

.logistics-actions:hover {
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

.shipments-header, .deliveries-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.primary-button {
  padding: 0.75rem 1.5rem;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.shipments-grid, .deliveries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.shipment-card, .delivery-card {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.shipment-card-header, .delivery-card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.shipment-card-id, .delivery-card-id {
  font-weight: 600;
  color: #1a202c;
}

.shipment-card-status, .delivery-card-status {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.shipment-card-destination, .delivery-card-supplier {
  font-weight: 500;
  color: #1a202c;
  margin-bottom: 0.75rem;
}

.shipment-card-details, .delivery-card-details {
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 1rem;
}

.shipment-card-delivery {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 1rem;
}

.shipment-card-actions, .delivery-card-actions {
  display: flex;
  gap: 0.5rem;
}

.shipment-action-button, .delivery-action-button {
  flex: 1;
  padding: 0.5rem;
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  cursor: pointer;
}

.shipment-action-button:hover, .delivery-action-button:hover {
  background-color: #edf2f7;
}

@media (max-width: 768px) {
  .kpi-grid {
    grid-template-columns: 1fr 1fr;
  }

  .dashboard-sections {
    grid-template-columns: 1fr;
  }

  .overview-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-tabs {
    overflow-x: auto;
    white-space: nowrap;
  }

  .tab-button {
    padding: 0.75rem 1rem;
  }

  .shipments-grid, .deliveries-grid {
    grid-template-columns: 1fr;
  }
}
</style>
