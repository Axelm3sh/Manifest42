<script setup>
import {useI18n} from 'vue-i18n';
import BaseCard from '../base/base-card.vue';
import BaseButton from '../base/base-button.vue';

const { t } = useI18n();

const props = defineProps({
  isRealTimeEnabled: {
    type: Boolean,
    default: false
  },
  refreshInterval: {
    type: Number,
    default: 60
  },
  refreshIntervalOptions: {
    type: Array,
    default: () => [10, 30, 60, 120]
  },
  lastUpdated: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['toggle-real-time', 'set-refresh-interval']);

const toggleRealTimeUpdates = () => {
  emit('toggle-real-time');
};

const setRefreshInterval = (seconds) => {
  emit('set-refresh-interval', seconds);
};
</script>

<template>
  <BaseCard :title="t('inventory.real_time_settings')" class="settings-card">
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
          <BaseButton 
            v-for="option in refreshIntervalOptions" 
            :key="option"
            @click="setRefreshInterval(option)"
            :variant="refreshInterval === option ? 'primary' : 'default'"
            size="small"
          >
            {{ option }}s
          </BaseButton>
        </div>
      </div>

      <div class="last-updated">
        {{ t('inventory.last_updated') }}: {{ lastUpdated }}
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
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

.last-updated {
  font-size: 0.875rem;
  color: #6b7280;
  margin-left: auto;
}
</style>