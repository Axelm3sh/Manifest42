<script setup>
import {useI18n} from 'vue-i18n';
import {useFormatters} from '../../composables/useFormatters';
import BaseCard from '../base/base-card.vue';

const { t } = useI18n();
const { formatCurrency, formatPercent, formatDate } = useFormatters();

const props = defineProps({
  inventoryValueByCategory: {
    type: Array,
    default: () => []
  },
  warehouseUtilization: {
    type: Array,
    default: () => []
  },
  inventoryItems: {
    type: Array,
    default: () => []
  },
  lowStockItems: {
    type: Array,
    default: () => []
  },
  outOfStockItems: {
    type: Array,
    default: () => []
  },
  totalValue: {
    type: Number,
    default: 0
  }
});

// Helper methods
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
  <div class="overview-grid">
    <!-- Inventory Value by Category -->
    <BaseCard :title="t('inventory.value_by_category')" class="overview-card category-value-card">
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
              :style="{ width: `${(category.value / totalValue) * 100}%` }"
            ></div>
          </div>
          <div class="category-value">{{ formatCurrency(category.value) }}</div>
        </div>
      </div>
    </BaseCard>

    <!-- Warehouse Utilization -->
    <BaseCard :title="t('inventory.warehouse_utilization')" class="overview-card warehouse-utilization-card">
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
    <BaseCard :title="t('inventory.recent_activity')" class="overview-card recent-activity-card">
      <div class="activity-list">
        <div 
          v-for="item in inventoryItems.slice(0, 5)" 
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
    <BaseCard :title="t('inventory.stock_level_summary')" class="overview-card stock-summary-card">
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
</template>

<style scoped>
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
  background-color: var(--color-background-muted);
  border-radius: 0.25rem;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background-color: var(--color-primary);
  transition: width 0.5s ease-in-out;
}

.category-value {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
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
  background-color: var(--color-background-muted);
  border-radius: 0.25rem;
  overflow: hidden;
}

.utilization-fill {
  height: 100%;
  transition: width 0.5s ease-in-out;
}

.utilization-normal {
  background-color: var(--color-success);
}

.utilization-medium {
  background-color: var(--color-warning);
}

.utilization-high {
  background-color: var(--color-danger);
}

.utilization-value {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
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
  background-color: var(--color-surface);
}

.activity-product {
  font-weight: 500;
  font-size: 0.875rem;
}

.activity-time {
  font-size: 0.75rem;
}

.activity-recent {
  color: var(--color-success);
}

.activity-today {
  color: var(--color-primary);
}

.activity-old {
  color: var(--color-text-secondary);
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
  color: var(--color-text-secondary);
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
  background-color: var(--color-success);
}

.low-stock {
  background-color: var(--color-warning);
}

.out-of-stock {
  background-color: var(--color-danger);
}
</style>
