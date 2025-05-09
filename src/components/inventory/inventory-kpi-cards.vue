<script setup>
import {useI18n} from 'vue-i18n';
import {useFormatters} from '../../composables/useFormatters';
import BaseCard from '../base/base-card.vue';

const { t } = useI18n();
const { formatNumber, formatCurrency } = useFormatters();

const props = defineProps({
  kpiData: {
    type: Object,
    required: true,
    default: () => ({
      totalItems: 0,
      totalValue: 0,
      lowStockItems: 0,
      outOfStockItems: 0,
      inventoryTurnover: 0
    })
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div class="kpi-cards">
    <BaseCard class="kpi-card">
      <div v-if="isLoading" class="kpi-loading">
        <div class="loading-spinner"></div>
      </div>
      <div v-else class="kpi-content">
        <div class="kpi-icon total-items-icon"><i class="pi pi-box nav-icon"></i></div>
        <div class="kpi-data">
          <div class="kpi-value">{{ formatNumber(kpiData.totalItems) }}</div>
          <div class="kpi-label">{{ t('inventory.total_items') }}</div>
        </div>
      </div>
    </BaseCard>

    <BaseCard class="kpi-card">
      <div v-if="isLoading" class="kpi-loading">
        <div class="loading-spinner"></div>
      </div>
      <div v-else class="kpi-content">
        <div class="kpi-icon total-value-icon"><i class="pi pi-dollar nav-icon"></i></div>
        <div class="kpi-data">
          <div class="kpi-value">{{ formatCurrency(kpiData.totalValue) }}</div>
          <div class="kpi-label">{{ t('inventory.total_value') }}</div>
        </div>
      </div>
    </BaseCard>

    <BaseCard class="kpi-card">
      <div v-if="isLoading" class="kpi-loading">
        <div class="loading-spinner"></div>
      </div>
      <div v-else class="kpi-content">
        <div class="kpi-icon low-stock-icon"><i class="pi pi-exclamation-triangle nav-icon"></i></div>
        <div class="kpi-data">
          <div class="kpi-value">{{ formatNumber(kpiData.lowStockItems) }}</div>
          <div class="kpi-label">{{ t('inventory.low_stock_items') }}</div>
        </div>
      </div>
    </BaseCard>

    <BaseCard class="kpi-card">
      <div v-if="isLoading" class="kpi-loading">
        <div class="loading-spinner"></div>
      </div>
      <div v-else class="kpi-content">
        <div class="kpi-icon out-of-stock-icon"><i class="pi pi-times nav-icon"></i></div>
        <div class="kpi-data">
          <div class="kpi-value">{{ formatNumber(kpiData.outOfStockItems) }}</div>
          <div class="kpi-label">{{ t('inventory.out_of_stock_items') }}</div>
        </div>
      </div>
    </BaseCard>

    <BaseCard class="kpi-card">
      <div v-if="isLoading" class="kpi-loading">
        <div class="loading-spinner"></div>
      </div>
      <div v-else class="kpi-content">
        <div class="kpi-icon turnover-icon"><i class="pi pi-refresh nav-icon"></i></div>
        <div class="kpi-data">
          <div class="kpi-value">{{ formatNumber(kpiData.inventoryTurnover, 2) }}</div>
          <div class="kpi-label">{{ t('inventory.inventory_turnover') }}</div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped>
.kpi-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  justify-content: center;
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

/*.kpi-icon {
  font-size: 2rem;
}*/

.low-stock-icon {
  color: var(--color-warning);
}

.out-of-stock-icon {
  color: var(--color-danger);
}

.kpi-data {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.kpi-value {
  font-size: 1.5rem;
  font-weight: 600;
}

.kpi-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.kpi-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid var(--color-border);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
