<script setup>
import {useI18n} from 'vue-i18n';
import {useFormatters} from '../../composables/useFormatters';
import BaseCard from '../base/base-card.vue';
import {PhArrowsClockwise, PhCurrencyCircleDollar, PhPackage, PhWarning, PhX} from 'phosphor-vue';

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
  }
});
</script>

<template>
  <div class="kpi-cards">
    <BaseCard class="kpi-card">
      <div class="kpi-content">
        <div class="kpi-icon total-items-icon"><PhPackage weight="regular" /></div>
        <div class="kpi-data">
          <div class="kpi-value">{{ formatNumber(kpiData.totalItems) }}</div>
          <div class="kpi-label">{{ t('inventory.total_items') }}</div>
        </div>
      </div>
    </BaseCard>

    <BaseCard class="kpi-card">
      <div class="kpi-content">
        <div class="kpi-icon total-value-icon"><PhCurrencyCircleDollar weight="regular" /></div>
        <div class="kpi-data">
          <div class="kpi-value">{{ formatCurrency(kpiData.totalValue) }}</div>
          <div class="kpi-label">{{ t('inventory.total_value') }}</div>
        </div>
      </div>
    </BaseCard>

    <BaseCard class="kpi-card">
      <div class="kpi-content">
        <div class="kpi-icon low-stock-icon"><PhWarning weight="regular" /></div>
        <div class="kpi-data">
          <div class="kpi-value">{{ kpiData.lowStockItems }}</div>
          <div class="kpi-label">{{ t('inventory.low_stock_items') }}</div>
        </div>
      </div>
    </BaseCard>

    <BaseCard class="kpi-card">
      <div class="kpi-content">
        <div class="kpi-icon out-of-stock-icon"><PhX weight="regular" /></div>
        <div class="kpi-data">
          <div class="kpi-value">{{ kpiData.outOfStockItems }}</div>
          <div class="kpi-label">{{ t('inventory.out_of_stock_items') }}</div>
        </div>
      </div>
    </BaseCard>

    <BaseCard class="kpi-card">
      <div class="kpi-content">
        <div class="kpi-icon turnover-icon"><PhArrowsClockwise weight="regular" /></div>
        <div class="kpi-data">
          <div class="kpi-value">{{ kpiData.inventoryTurnover }}</div>
          <div class="kpi-label">{{ t('inventory.inventory_turnover') }}</div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped>
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
</style>
