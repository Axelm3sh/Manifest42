<script setup>
import {useI18n} from 'vue-i18n';
import {useFormatters} from '../../composables/useFormatters';
import BaseCard from '../base/base-card.vue';

const { t } = useI18n();
const { formatCurrency, formatDate } = useFormatters();

const props = defineProps({
  inventoryItems: {
    type: Array,
    default: () => []
  },
  warehouseData: {
    type: Array,
    default: () => []
  }
});

// Helper methods
const getStockLevelClass = (stockLevel, reorderPoint) => {
  if (stockLevel === 0) return 'stock-level-out';
  if (stockLevel < reorderPoint) return 'stock-level-low';
  return 'stock-level-normal';
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
  <BaseCard :title="t('inventory.all_items')" class="items-card">
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
          v-memo="[item.name, item.category, item.stockLevel, item.reorderPoint, item.unitPrice, item.warehouseId, item.lastActivity]"
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
</template>

<style scoped>
.items-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.items-table th {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 2px solid var(--color-border);
  font-weight: 600;
}

.items-table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.item-row:hover {
  background-color: var(--color-hover);
}

.stock-level {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

.stock-level-normal {
  background-color: var(--color-success-bg);
  color: var(--color-success-text);
}

.stock-level-low {
  background-color: var(--color-warning-bg);
  color: var(--color-warning-text);
}

.stock-level-out {
  background-color: var(--color-danger-bg);
  color: var(--color-danger-text);
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
</style>
