<script setup>
import {useI18n} from 'vue-i18n';
import BaseCard from '../base/base-card.vue';
import BaseButton from '../base/base-button.vue';

const { t } = useI18n();

const props = defineProps({
  parameters: {
    type: Object,
    required: true
  },
  isRunning: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:parameter', 'run', 'reset']);

const updateParameter = (key, value) => {
  emit('update:parameter', { key, value });
};

const runSimulation = () => {
  emit('run');
};

const resetToDefaults = () => {
  emit('reset');
};
</script>

<template>
  <BaseCard :title="t('simulation.simulation_parameters')">
    <div class="parameters-grid">
      <div class="parameter-group">
        <label for="demand-variability">{{ t('simulation.demand_variability') }}</label>
        <div class="parameter-control">
          <input 
            id="demand-variability"
            type="range" 
            min="0" 
            max="1" 
            step="0.1"
            :value="parameters.demandVariability"
            @input="updateParameter('demandVariability', parseFloat($event.target.value))"
          />
          <span class="parameter-value">{{ parameters.demandVariability.toFixed(1) }}</span>
        </div>
      </div>

      <div class="parameter-group">
        <label for="lead-time">{{ t('simulation.lead_time') }}</label>
        <div class="parameter-control">
          <input 
            id="lead-time"
            type="range" 
            min="1" 
            max="30" 
            step="1"
            :value="parameters.leadTime"
            @input="updateParameter('leadTime', parseInt($event.target.value))"
          />
          <span class="parameter-value">{{ parameters.leadTime }} {{ t('simulation.days') }}</span>
        </div>
      </div>

      <div class="parameter-group">
        <label for="reorder-point">{{ t('simulation.reorder_point') }}</label>
        <div class="parameter-control">
          <input 
            id="reorder-point"
            type="range" 
            min="5" 
            max="50" 
            step="5"
            :value="parameters.reorderPoint"
            @input="updateParameter('reorderPoint', parseInt($event.target.value))"
          />
          <span class="parameter-value">{{ parameters.reorderPoint }} {{ t('simulation.units') }}</span>
        </div>
      </div>

      <div class="parameter-group">
        <label for="order-quantity">{{ t('simulation.order_quantity') }}</label>
        <div class="parameter-control">
          <input 
            id="order-quantity"
            type="range" 
            min="10" 
            max="200" 
            step="10"
            :value="parameters.orderQuantity"
            @input="updateParameter('orderQuantity', parseInt($event.target.value))"
          />
          <span class="parameter-value">{{ parameters.orderQuantity }} {{ t('simulation.units') }}</span>
        </div>
      </div>

      <div class="parameter-group">
        <label for="initial-stock">{{ t('simulation.initial_stock') }}</label>
        <div class="parameter-control">
          <input 
            id="initial-stock"
            type="range" 
            min="0" 
            max="200" 
            step="10"
            :value="parameters.initialStock"
            @input="updateParameter('initialStock', parseInt($event.target.value))"
          />
          <span class="parameter-value">{{ parameters.initialStock }} {{ t('simulation.units') }}</span>
        </div>
      </div>

      <div class="parameter-group">
        <label for="simulation-duration">{{ t('simulation.simulation_duration') }}</label>
        <div class="parameter-control">
          <input 
            id="simulation-duration"
            type="range" 
            min="30" 
            max="365" 
            step="30"
            :value="parameters.simulationDuration"
            @input="updateParameter('simulationDuration', parseInt($event.target.value))"
          />
          <span class="parameter-value">{{ parameters.simulationDuration }} {{ t('simulation.days') }}</span>
        </div>
      </div>

      <div class="parameter-group checkbox-group">
        <label for="seasonality-enabled">{{ t('simulation.seasonality_enabled') }}</label>
        <div class="parameter-control">
          <input 
            id="seasonality-enabled"
            type="checkbox"
            :checked="parameters.seasonalityEnabled"
            @change="updateParameter('seasonalityEnabled', $event.target.checked)"
          />
        </div>
      </div>

      <div class="parameter-group checkbox-group">
        <label for="external-factors-enabled">{{ t('simulation.external_factors_enabled') }}</label>
        <div class="parameter-control">
          <input 
            id="external-factors-enabled"
            type="checkbox"
            :checked="parameters.externalFactorsEnabled"
            @change="updateParameter('externalFactorsEnabled', $event.target.checked)"
          />
        </div>
      </div>
    </div>

    <div class="parameters-actions">
      <BaseButton 
        variant="primary" 
        @click="runSimulation" 
        :disabled="isRunning"
        class="run-button"
      >
        <i class="pi" :class="isRunning ? 'pi-spinner pi-spin' : 'pi-play'"></i>
        {{ isRunning ? t('simulation.running') : t('simulation.run_simulation') }}
        <div v-if="isRunning" class="progress-bar-container">
          <div class="progress-bar"></div>
        </div>
      </BaseButton>
      <BaseButton 
        variant="default" 
        @click="resetToDefaults"
      >
        <i class="pi pi-refresh"></i>
        {{ t('simulation.reset_to_defaults') }}
      </BaseButton>
    </div>

    <div v-if="error" class="error-message">
      <i class="pi pi-exclamation-triangle"></i>
      <span>{{ error }}</span>
    </div>
  </BaseCard>
</template>

<style scoped>
.parameters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.parameter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.parameter-group label {
  font-weight: 600;
  font-size: 0.875rem;
}

.parameter-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.parameter-value {
  min-width: 4rem;
  text-align: right;
  font-size: 0.875rem;
  color: #4b5563;
}

.checkbox-group .parameter-control {
  justify-content: flex-start;
}

.parameters-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-message .pi {
  font-size: 1rem;
  color: #dc2626;
}

.run-button {
  position: relative;
  overflow: hidden;
}

.progress-bar-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.2);
}

.progress-bar {
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  width: 0%;
  animation: progress-animation 2s ease-in-out forwards;
}

@keyframes progress-animation {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}
</style>
