<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useInventoryDataStore} from '../stores/inventoryData';
import {formatCurrency, formatDate, formatDateTime, formatNumber, formatPercent} from '../utils/formatters';
import BaseCard from './base/base-card.vue';

const { t } = useI18n();
const inventoryDataStore = useInventoryDataStore();

// Reactive state
const activeTab = ref('overview');
const showSettings = ref(false);
const refreshIntervalOptions = ref([10, 30, 60, 120]);

// Fetch data on component mount and start real-time updates
onMounted(() => {
  inventoryDataStore.fetchInventoryData();
  inventoryDataStore.fetchWarehouseData();
  inventoryDataStore.startRealTimeUpdates();
});

// Clean up on component unmount
onUnmounted(() => {
  inventoryDataStore.stopRealTimeUpdates();
});

// Computed properties
const inventoryItems = computed(() => inventoryDataStore.sortedInventoryItems);
const warehouseData = computed(() => inventoryDataStore.warehouseData);
const warehouseUtilization = computed(() => inventoryDataStore.warehouseUtilization);
const kpiData = computed(() => inventoryDataStore.kpiData);
const lowStockItems = computed(() => inventoryDataStore.lowStockItems);
const outOfStockItems = computed(() => inventoryDataStore.outOfStockItems);
const inventoryValueByCategory = computed(() => inventoryDataStore.inventoryValueByCategory);
const isLoading = computed(() => inventoryDataStore.isLoading);
const isRealTimeEnabled = computed(() => inventoryDataStore.isRealTimeEnabled);
const refreshInterval = computed(() => inventoryDataStore.refreshInterval);
const lastUpdated = computed(() => {
  if (!inventoryDataStore.lastUpdated) return t('inventory.never_updated');
  return formatDateTime(inventoryDataStore.lastUpdated);
});

// Methods
const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const toggleSettings = () => {
  showSettings.value = !showSettings.value;
};

const toggleRealTimeUpdates = () => {
  if (isRealTimeEnabled.value) {
    inventoryDataStore.stopRealTimeUpdates();
  } else {
    inventoryDataStore.startRealTimeUpdates();
  }
};

const setRefreshInterval = (seconds) => {
  inventoryDataStore.setRefreshInterval(seconds);
};

const refreshData = () => {
  inventoryDataStore.fetchInventoryData();
  inventoryDataStore.fetchWarehouseData();
};

// Helper methods
const getStockLevelClass = (stockLevel, reorderPoint) => {
  if (stockLevel === 0) return 'stock-level-out';
  if (stockLevel < reorderPoint) return 'stock-level-low';
  return 'stock-level-normal';
};

const getUtilizationClass = (utilization) => {
  if (utilization > 90) return 'utilization-high';
  if (utilization > 70) return 'utilization-medium';
  return 'utilization-normal';
};

const getLastActivityClass = (lastActivity) => {
  const activityDate = new Date(lastActivity);
  const now = new Date();
  const hoursDiff = (now - activityDate) / (1000 * 60 * 60);

  if (hoursDiff < 1) return 'activity-recent';
  if (hoursDiff < 24) return 'activity-today';
  return 'activity-old';
};
</script>

<template>
  <div class="inventory-dashboard">
    <div class="dashboard-header">
      <h2>{{ t('inventory.title') }}</h2>
      <div class="dashboard-actions">
        <button 
          @click="toggleSettings" 
          class="settings-button"
          :class="{ 'active': showSettings }"
        >
          {{ t('inventory.settings') }}
        </button>
        <button @click="refreshData" class="refresh-button">
          {{ t('inventory.refresh') }}
        </button>
      </div>
    </div>

    <!-- Settings Panel -->
    <BaseCard v-if="showSettings" class="settings-card">
      <template #header>
        <h3>{{ t('inventory.real_time_settings') }}</h3>
      </template>
      <div class="settings-content">
        <div class="setting-group">
          <label for="real-time-toggle">{{ t('inventory.real_time_updates') }}</label>
          <div class="toggle-switch">
            <input 
              id="real-time-toggle"
              type="checkbox"
              :checked="isRealTimeEnabled"
              @change="toggleRealTimeUpdates"
            />
            <span class="toggle-slider"></span>
          </div>
        </div>

        <div class="setting-group">
          <label>{{ t('inventory.refresh_interval') }}</label>
          <div class="interval-options">
            <button 
              v-for="option in refreshIntervalOptions" 
              :key="option"
              @click="setRefreshInterval(option)"
              class="interval-option"
              :class="{ 'active': refreshInterval === option }"
            >
              {{ option }}s
            </button>
          </div>
        </div>

        <div class="last-updated">
          {{ t('inventory.last_updated') }}: {{ lastUpdated }}
        </div>
      </div>
    </BaseCard>

    <!-- KPI Cards -->
    <div class="kpi-cards">
      <BaseCard class="kpi-card">
        <div class="kpi-content">
          <div class="kpi-icon total-items-icon">📦</div>
          <div class="kpi-data">
            <div class="kpi-value">{{ formatNumber(kpiData.totalItems) }}</div>
            <div class="kpi-label">{{ t('inventory.total_items') }}</div>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="kpi-card">
        <div class="kpi-content">
          <div class="kpi-icon total-value-icon">💰</div>
          <div class="kpi-data">
            <div class="kpi-value">{{ formatCurrency(kpiData.totalValue) }}</div>
            <div class="kpi-label">{{ t('inventory.total_value') }}</div>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="kpi-card">
        <div class="kpi-content">
          <div class="kpi-icon low-stock-icon">⚠️</div>
          <div class="kpi-data">
            <div class="kpi-value">{{ kpiData.lowStockItems }}</div>
            <div class="kpi-label">{{ t('inventory.low_stock_items') }}</div>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="kpi-card">
        <div class="kpi-content">
          <div class="kpi-icon out-of-stock-icon">❌</div>
          <div class="kpi-data">
            <div class="kpi-value">{{ kpiData.outOfStockItems }}</div>
            <div class="kpi-label">{{ t('inventory.out_of_stock_items') }}</div>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="kpi-card">
        <div class="kpi-content">
          <div class="kpi-icon turnover-icon">🔄</div>
          <div class="kpi-data">
            <div class="kpi-value">{{ kpiData.inventoryTurnover }}</div>
            <div class="kpi-label">{{ t('inventory.inventory_turnover') }}</div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Tabs Navigation -->
    <div class="tabs-navigation">
      <button 
        @click="setActiveTab('overview')" 
        class="tab-button"
        :class="{ 'active': activeTab === 'overview' }"
      >
        {{ t('inventory.overview') }}
      </button>
      <button 
        @click="setActiveTab('items')" 
        class="tab-button"
        :class="{ 'active': activeTab === 'items' }"
      >
        {{ t('inventory.items') }}
      </button>
      <button 
        @click="setActiveTab('warehouses')" 
        class="tab-button"
        :class="{ 'active': activeTab === 'warehouses' }"
      >
        {{ t('inventory.warehouses') }}
      </button>
      <button 
        @click="setActiveTab('stock_alerts')" 
        class="tab-button"
        :class="{ 'active': activeTab === 'stock_alerts' }"
      >
        {{ t('inventory.stock_alerts') }}
      </button>
    </div>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="loading-indicator">
      {{ t('common.loading') }}
    </div>

    <!-- Overview Tab -->
    <div v-else-if="activeTab === 'overview'" class="tab-content">
      <div class="overview-grid">
        <!-- Inventory Value by Category -->
        <BaseCard class="overview-card category-value-card">
          <template #header>
            <h3>{{ t('inventory.value_by_category') }}</h3>
          </template>
          <div class="category-chart">
            <div 
              v-for="category in inventoryValueByCategory" 
              :key="category.category"
              class="category-bar"
            >
              <div class="category-name">{{ category.category }}</div>
              <div class="bar-container">
                <div 
                  class="bar-fill"
                  :style="{ width: `${(category.value / kpiData.totalValue) * 100}%` }"
                ></div>
              </div>
              <div class="category-value">{{ formatCurrency(category.value) }}</div>
            </div>
          </div>
        </BaseCard>

        <!-- Warehouse Utilization -->
        <BaseCard class="overview-card warehouse-utilization-card">
          <template #header>
            <h3>{{ t('inventory.warehouse_utilization') }}</h3>
          </template>
          <div class="warehouse-chart">
            <div 
              v-for="warehouse in warehouseUtilization" 
              :key="warehouse.id"
              class="warehouse-utilization"
            >
              <div class="warehouse-name">{{ warehouse.name }}</div>
              <div class="utilization-container">
                <div 
                  class="utilization-fill"
                  :class="getUtilizationClass(warehouse.utilization)"
                  :style="{ width: `${warehouse.utilization}%` }"
                ></div>
              </div>
              <div class="utilization-value">
                {{ formatPercent(warehouse.utilization) }}
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Recent Activity -->
        <BaseCard class="overview-card recent-activity-card">
          <template #header>
            <h3>{{ t('inventory.recent_activity') }}</h3>
          </template>
          <div class="activity-list">
            <div 
              v-for="(item, index) in inventoryItems.slice(0, 5)" 
              :key="item.id"
              class="activity-item"
            >
              <div class="activity-product">{{ item.name }}</div>
              <div 
                class="activity-time"
                :class="getLastActivityClass(item.lastActivity)"
              >
                {{ formatDate(item.lastActivity) }}
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Stock Level Summary -->
        <BaseCard class="overview-card stock-summary-card">
          <template #header>
            <h3>{{ t('inventory.stock_level_summary') }}</h3>
          </template>
          <div class="stock-summary">
            <div class="stock-status">
              <div class="status-label">{{ t('inventory.normal_stock') }}</div>
              <div class="status-value">
                {{ inventoryItems.length - lowStockItems.length - outOfStockItems.length }}
              </div>
            </div>
            <div class="stock-status">
              <div class="status-label">{{ t('inventory.low_stock') }}</div>
              <div class="status-value">{{ lowStockItems.length }}</div>
            </div>
            <div class="stock-status">
              <div class="status-label">{{ t('inventory.out_of_stock') }}</div>
              <div class="status-value">{{ outOfStockItems.length }}</div>
            </div>
          </div>
          <div class="stock-chart">
            <div 
              class="stock-segment normal-stock"
              :style="{ 
                width: `${(inventoryItems.length - lowStockItems.length - outOfStockItems.length) / inventoryItems.length * 100}%` 
              }"
            ></div>
            <div 
              class="stock-segment low-stock"
              :style="{ width: `${lowStockItems.length / inventoryItems.length * 100}%` }"
            ></div>
            <div 
              class="stock-segment out-of-stock"
              :style="{ width: `${outOfStockItems.length / inventoryItems.length * 100}%` }"
            ></div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Items Tab -->
    <div v-else-if="activeTab === 'items'" class="tab-content">
      <BaseCard class="items-card">
        <template #header>
          <h3>{{ t('inventory.all_items') }}</h3>
        </template>
        <table class="items-table">
          <thead>
            <tr>
              <th>{{ t('inventory.product') }}</th>
              <th>{{ t('inventory.category') }}</th>
              <th>{{ t('inventory.stock_level') }}</th>
              <th>{{ t('inventory.reorder_point') }}</th>
              <th>{{ t('inventory.unit_price') }}</th>
              <th>{{ t('inventory.total_value') }}</th>
              <th>{{ t('inventory.warehouse') }}</th>
              <th>{{ t('inventory.last_activity') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="item in inventoryItems" 
              :key="item.id"
              class="item-row"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.category }}</td>
              <td>
                <span 
                  class="stock-level"
                  :class="getStockLevelClass(item.stockLevel, item.reorderPoint)"
                >
                  {{ item.stockLevel }}
                </span>
              </td>
              <td>{{ item.reorderPoint }}</td>
              <td>{{ formatCurrency(item.unitPrice) }}</td>
              <td>{{ formatCurrency(item.stockLevel * item.unitPrice) }}</td>
              <td>{{ warehouseData.find(w => w.id === item.warehouseId)?.name || 'Unknown' }}</td>
              <td>
                <span 
                  class="activity-time"
                  :class="getLastActivityClass(item.lastActivity)"
                >
                  {{ formatDate(item.lastActivity) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </BaseCard>
    </div>

    <!-- Warehouses Tab -->
    <div v-else-if="activeTab === 'warehouses'" class="tab-content">
      <div class="warehouses-grid">
        <BaseCard 
          v-for="warehouse in warehouseData" 
          :key="warehouse.id"
          class="warehouse-card"
        >
          <template #header>
            <h3>{{ warehouse.name }}</h3>
          </template>
          <div class="warehouse-details">
            <div class="warehouse-info">
              <div class="info-item">
                <span class="info-label">{{ t('inventory.location') }}:</span>
                <span class="info-value">{{ warehouse.location }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ t('inventory.total_capacity') }}:</span>
                <span class="info-value">{{ formatNumber(warehouse.totalCapacity) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ t('inventory.current_capacity') }}:</span>
                <span class="info-value">{{ formatNumber(warehouse.currentCapacity) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ t('inventory.utilization_rate') }}:</span>
                <span 
                  class="info-value utilization-rate"
                  :class="getUtilizationClass(warehouse.utilizationRate)"
                >
                  {{ formatPercent(warehouse.utilizationRate) }}
                </span>
              </div>
            </div>
            <div class="utilization-chart">
              <div class="utilization-label">{{ t('inventory.capacity_usage') }}</div>
              <div class="utilization-container">
                <div 
                  class="utilization-fill"
                  :class="getUtilizationClass(warehouse.utilizationRate)"
                  :style="{ width: `${warehouse.utilizationRate}%` }"
                ></div>
              </div>
              <div class="utilization-metrics">
                <span>0</span>
                <span>{{ formatNumber(warehouse.totalCapacity) }}</span>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Stock Alerts Tab -->
    <div v-else-if="activeTab === 'stock_alerts'" class="tab-content">
      <!-- Low Stock Items -->
      <BaseCard class="alerts-card">
        <template #header>
          <h3>{{ t('inventory.low_stock_items') }}</h3>
        </template>
        <table class="alerts-table">
          <thead>
            <tr>
              <th>{{ t('inventory.product') }}</th>
              <th>{{ t('inventory.category') }}</th>
              <th>{{ t('inventory.stock_level') }}</th>
              <th>{{ t('inventory.reorder_point') }}</th>
              <th>{{ t('inventory.unit_price') }}</th>
              <th>{{ t('inventory.warehouse') }}</th>
              <th>{{ t('inventory.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="item in lowStockItems" 
              :key="item.id"
              class="alert-row"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.category }}</td>
              <td>
                <span class="stock-level stock-level-low">
                  {{ item.stockLevel }}
                </span>
              </td>
              <td>{{ item.reorderPoint }}</td>
              <td>{{ formatCurrency(item.unitPrice) }}</td>
              <td>{{ warehouseData.find(w => w.id === item.warehouseId)?.name || 'Unknown' }}</td>
              <td>
                <button class="restock-button">
                  {{ t('inventory.restock') }}
                </button>
              </td>
            </tr>
            <tr v-if="lowStockItems.length === 0">
              <td colspan="7" class="no-alerts">
                {{ t('inventory.no_low_stock_items') }}
              </td>
            </tr>
          </tbody>
        </table>
      </BaseCard>

      <!-- Out of Stock Items -->
      <BaseCard class="alerts-card">
        <template #header>
          <h3>{{ t('inventory.out_of_stock_items') }}</h3>
        </template>
        <table class="alerts-table">
          <thead>
            <tr>
              <th>{{ t('inventory.product') }}</th>
              <th>{{ t('inventory.category') }}</th>
              <th>{{ t('inventory.reorder_point') }}</th>
              <th>{{ t('inventory.unit_price') }}</th>
              <th>{{ t('inventory.warehouse') }}</th>
              <th>{{ t('inventory.last_activity') }}</th>
              <th>{{ t('inventory.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="item in outOfStockItems" 
              :key="item.id"
              class="alert-row"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.reorderPoint }}</td>
              <td>{{ formatCurrency(item.unitPrice) }}</td>
              <td>{{ warehouseData.find(w => w.id === item.warehouseId)?.name || 'Unknown' }}</td>
              <td>
                <span 
                  class="activity-time"
                  :class="getLastActivityClass(item.lastActivity)"
                >
                  {{ formatDate(item.lastActivity) }}
                </span>
              </td>
              <td>
                <button class="restock-button urgent">
                  {{ t('inventory.restock_urgent') }}
                </button>
              </td>
            </tr>
            <tr v-if="outOfStockItems.length === 0">
              <td colspan="7" class="no-alerts">
                {{ t('inventory.no_out_of_stock_items') }}
              </td>
            </tr>
          </tbody>
        </table>
      </BaseCard>
    </div>
  </div>
</template>

<style scoped>
.inventory-dashboard {
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

.settings-card {
  margin-bottom: 1rem;
}

.settings-content {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.setting-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.setting-group label {
  font-weight: 600;
  font-size: 0.875rem;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #3b82f6;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.interval-options {
  display: flex;
  gap: 0.5rem;
}

.interval-option {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #4b5563;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.interval-option.active {
  background-color: #3b82f6;
  border-color: #2563eb;
  color: white;
}

.last-updated {
  font-size: 0.875rem;
  color: #6b7280;
  margin-left: auto;
}

/* KPI Cards */
.kpi-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.kpi-card {
  padding: 1rem;
}

.kpi-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.kpi-icon {
  font-size: 2rem;
}

.kpi-data {
  display: flex;
  flex-direction: column;
}

.kpi-value {
  font-size: 1.5rem;
  font-weight: 600;
}

.kpi-label {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Tabs Navigation */
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

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Overview Tab */
.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.overview-card {
  min-height: 300px;
}

/* Category Value Chart */
.category-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-bar {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.category-name {
  font-weight: 500;
  font-size: 0.875rem;
}

.bar-container {
  height: 1.5rem;
  background-color: #f3f4f6;
  border-radius: 0.25rem;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background-color: #3b82f6;
  transition: width 0.5s ease-in-out;
}

.category-value {
  font-size: 0.875rem;
  color: #4b5563;
  text-align: right;
}

/* Warehouse Utilization Chart */
.warehouse-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.warehouse-utilization {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.warehouse-name {
  font-weight: 500;
  font-size: 0.875rem;
}

.utilization-container {
  height: 1.5rem;
  background-color: #f3f4f6;
  border-radius: 0.25rem;
  overflow: hidden;
}

.utilization-fill {
  height: 100%;
  transition: width 0.5s ease-in-out;
}

.utilization-normal {
  background-color: #10b981;
}

.utilization-medium {
  background-color: #f59e0b;
}

.utilization-high {
  background-color: #ef4444;
}

.utilization-value {
  font-size: 0.875rem;
  color: #4b5563;
  text-align: right;
}

/* Recent Activity */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.25rem;
  background-color: #f9fafb;
}

.activity-product {
  font-weight: 500;
  font-size: 0.875rem;
}

.activity-time {
  font-size: 0.75rem;
}

.activity-recent {
  color: #10b981;
}

.activity-today {
  color: #3b82f6;
}

.activity-old {
  color: #6b7280;
}

/* Stock Summary */
.stock-summary {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.stock-status {
  text-align: center;
}

.status-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.status-value {
  font-size: 1.25rem;
  font-weight: 600;
}

.stock-chart {
  height: 1.5rem;
  display: flex;
  border-radius: 0.25rem;
  overflow: hidden;
}

.stock-segment {
  height: 100%;
  transition: width 0.5s ease-in-out;
}

.normal-stock {
  background-color: #10b981;
}

.low-stock {
  background-color: #f59e0b;
}

.out-of-stock {
  background-color: #ef4444;
}

/* Items Tab */
.items-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.items-table th {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
  font-weight: 600;
}

.items-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.item-row:hover {
  background-color: #f9fafb;
}

.stock-level {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

.stock-level-normal {
  background-color: #dcfce7;
  color: #15803d;
}

.stock-level-low {
  background-color: #fef3c7;
  color: #b45309;
}

.stock-level-out {
  background-color: #fee2e2;
  color: #b91c1c;
}

/* Warehouses Tab */
.warehouses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.warehouse-card {
  min-height: 250px;
}

.warehouse-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.warehouse-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.info-value {
  font-weight: 500;
}

.utilization-rate {
  font-weight: 600;
}

.utilization-chart {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.utilization-label {
  font-size: 0.875rem;
  font-weight: 500;
}

.utilization-metrics {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #6b7280;
}

/* Stock Alerts Tab */
.alerts-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.alerts-table th {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
  font-weight: 600;
}

.alerts-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.alert-row:hover {
  background-color: #f9fafb;
}

.restock-button {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  background-color: #3b82f6;
  border: 1px solid #2563eb;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.restock-button:hover {
  background-color: #2563eb;
}

.restock-button.urgent {
  background-color: #ef4444;
  border-color: #dc2626;
}

.restock-button.urgent:hover {
  background-color: #dc2626;
}

.no-alerts {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
}
</style>
