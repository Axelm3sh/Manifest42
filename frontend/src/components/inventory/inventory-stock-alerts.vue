<script setup>
import {useI18n} from 'vue-i18n';
import {useFormatters} from '../../composables/useFormatters';
import BaseCard from '../base/base-card.vue';
import BaseButton from '../base/base-button.vue';

const { t } = useI18n();
const { formatCurrency, formatDate } = useFormatters();

const props = defineProps({
  lowStockItems: {
    type: Array,
    default: () => []
  },
  outOfStockItems: {
    type: Array,
    default: () => []
  },
  warehouseData: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['restock']);

// Helper methods
const getLastActivityClass = (lastActivity) => {
  const activityDate = new Date(lastActivity);
  const now = new Date();
  const hoursDiff = (now - activityDate) / (1000 * 60 * 60);

  if (hoursDiff < 1) return 'activity-recent';
  if (hoursDiff < 24) return 'activity-today';
  return 'activity-old';
};

const handleRestock = (itemId, urgent = false) => {
  emit('restock', { itemId, urgent });
};
</script>

<template>
  <div class="stock-alerts">
    <!-- Low Stock Items -->
    <BaseCard :title="t('inventory.low_stock_items')" class="alerts-card">
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
              <BaseButton 
                variant="primary"
                size="small"
                @click="handleRestock(item.id, false)"
              >
                {{ t('inventory.restock') }}
              </BaseButton>
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
    <BaseCard :title="t('inventory.out_of_stock_items')" class="alerts-card">
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
              <BaseButton 
                variant="danger"
                size="small"
                @click="handleRestock(item.id, true)"
              >
                {{ t('inventory.restock_urgent') }}
              </BaseButton>
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
</template>

<style scoped>
.stock-alerts {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.alerts-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.alerts-table th {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 2px solid var(--color-border);
  font-weight: 600;
}

.alerts-table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.alert-row:hover {
  background-color: var(--color-hover);
}

.stock-level {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

.stock-level-low {
  background-color: var(--color-warning-bg);
  color: var(--color-warning-text);
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

.no-alerts {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-secondary);
  font-style: italic;
}
</style>
