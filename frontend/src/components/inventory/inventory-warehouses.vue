<script setup>
import {useI18n} from 'vue-i18n';
import {useFormatters} from '../../composables/useFormatters';
import BaseCard from '../base/base-card.vue';

const { t } = useI18n();
const { formatNumber, formatPercent } = useFormatters();

const props = defineProps({
  warehouseData: {
    type: Array,
    default: () => []
  }
});

// Helper methods
const getUtilizationClass = (utilization) => {
  if (utilization > 90) return 'utilization-high';
  if (utilization > 70) return 'utilization-medium';
  return 'utilization-normal';
};
</script>

<template>
  <div class="warehouses-grid">
    <BaseCard 
      v-for="warehouse in warehouseData" 
      :key="warehouse.id"
      :title="warehouse.name"
      class="warehouse-card"
    >
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
</template>

<style scoped>
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
  color: var(--color-text-secondary);
}

.info-value {
  font-weight: 500;
}

.utilization-rate {
  font-weight: 600;
}

.utilization-normal {
  color: var(--color-success);
}

.utilization-medium {
  color: var(--color-warning);
}

.utilization-high {
  color: var(--color-danger);
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

.utilization-metrics {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}
</style>
