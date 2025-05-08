<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useInventoryDataStore} from '../../stores/inventoryData';
import {useFormatters} from '../../composables/useFormatters';
import BaseTabs from '../base/base-tabs.vue';
import BaseButton from '../base/base-button.vue';
import InventorySettings from './inventory-settings.vue';
import InventoryKpiCards from './inventory-kpi-cards.vue';
import InventoryOverview from './inventory-overview.vue';
import InventoryItemsTable from './inventory-items-table.vue';
import InventoryWarehouses from './inventory-warehouses.vue';
import InventoryStockAlerts from './inventory-stock-alerts.vue';

const {t} = useI18n();
const {formatDateTime} = useFormatters();
const inventoryDataStore = useInventoryDataStore();

// Reactive state
const activeTab = ref('overview');
const showSettings = ref(false);
const refreshIntervalOptions = ref([1, 5, 10, 30, 60, 120]);

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
const interpolatedInventoryItems = computed(() =>
    inventoryDataStore.sortedInventoryItems.map(item => ({
      ...item,
      /* fall back for the very first frame */
      stockLevel: item.displayStockLevel ?? item.stockLevel
    }))
);
const warehouseData = computed(() => inventoryDataStore.warehouseData);
const warehouseUtilization = computed(() => inventoryDataStore.warehouseUtilization);
const kpiData = computed(() => inventoryDataStore.interpolatedKpiData);
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

// Tab configuration
const tabs = computed(() => [
  {id: 'overview', label: t('inventory.overview'), icon: 'pi-chart-pie'},
  {id: 'items', label: t('inventory.items'), icon: 'pi-list'},
  {id: 'warehouses', label: t('inventory.warehouses'), icon: 'pi-building'},
  {
    id: 'stock_alerts', 
    label: t('inventory.stock_alerts'), 
    icon: 'pi-exclamation-triangle',
    badge: outOfStockItems.value.length > 0 ? outOfStockItems.value.length.toString() : null
  }
]);

// Methods
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

const handleRestock = ({itemId, urgent}) => {
  // In a real app, this would call an API to restock the item
  console.log(`Restocking item ${itemId}, urgent: ${urgent}`);
  // For now, just show an alert
  alert(t('inventory.restock_initiated', {itemId, urgent: urgent ? t('inventory.yes') : t('inventory.no')}));
};
</script>

<template>
  <div class="inventory-dashboard">
    <div class="dashboard-header">
      <h2><i class="pi pi-box"></i> {{ t('inventory.title') }}</h2>
      <div class="dashboard-actions">
        <BaseButton
            @click="toggleSettings"
            :active="showSettings"
        >
          <i class="pi pi-cog"></i> {{ t('inventory.settings') }}
        </BaseButton>
        <BaseButton
            variant="primary"
            @click="refreshData"
        >
          <i class="pi pi-refresh"></i> {{ t('inventory.refresh') }}
        </BaseButton>
      </div>
    </div>

    <!-- Settings Panel -->
    <InventorySettings
        v-if="showSettings"
        :isRealTimeEnabled="isRealTimeEnabled"
        :refreshInterval="refreshInterval"
        :refreshIntervalOptions="refreshIntervalOptions"
        :lastUpdated="lastUpdated"
        @toggle-real-time="toggleRealTimeUpdates"
        @set-refresh-interval="setRefreshInterval"
    />

    <!-- KPI Cards -->
    <InventoryKpiCards :kpiData="kpiData" :isLoading="isLoading"/>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="loading-indicator">
      <i class="pi pi-spin pi-spinner"></i>
      {{ t('common.loading') }}
    </div>
    <div v-else>
      <!-- Tabs Navigation -->
      <BaseTabs
          v-model="activeTab"
          :tabs="tabs"
      >
        <!-- Overview Tab -->
        <template #overview>
          <InventoryOverview
              :inventoryValueByCategory="inventoryValueByCategory"
              :warehouseUtilization="warehouseUtilization"
              :inventoryItems="interpolatedInventoryItems"
              :lowStockItems="lowStockItems"
              :outOfStockItems="outOfStockItems"
              :totalValue="kpiData.totalValue"
          />
        </template>

        <!-- Items Tab -->
        <template #items>
          <InventoryItemsTable
              :inventoryItems="interpolatedInventoryItems"
              :warehouseData="warehouseData"
          />
        </template>

        <!-- Warehouses Tab -->
        <template #warehouses>
          <InventoryWarehouses
              :warehouseData="warehouseData"
          />
        </template>

        <!-- Stock Alerts Tab -->
        <template #stock_alerts>
          <InventoryStockAlerts
              :lowStockItems="lowStockItems"
              :outOfStockItems="outOfStockItems"
              :warehouseData="warehouseData"
              @restock="handleRestock"
          />
        </template>
      </BaseTabs>
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dashboard-header h2 .pi {
  color: var(--color-primary);
}

.dashboard-actions {
  display: flex;
  gap: 0.5rem;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem;
  color: var(--color-text-secondary);
  font-style: italic;
}

.loading-indicator .pi {
  font-size: 1.5rem;
  color: var(--color-primary);
}
</style>
