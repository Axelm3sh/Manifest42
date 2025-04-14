<script setup>
import {ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import BaseCard from '../base/base-card.vue';

const { t } = useI18n();

const props = defineProps({
  preferences: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['save', 'cancel']);

// Create a local copy of preferences to edit
const newPreferences = ref({ ...props.preferences });

// Update local preferences when props change
watch(() => props.preferences, (newValue) => {
  newPreferences.value = { ...newValue };
}, { deep: true });

const savePreferences = () => {
  emit('save', newPreferences.value);
};

const cancelPreferences = () => {
  newPreferences.value = { ...props.preferences };
  emit('cancel');
};
</script>

<template>
  <BaseCard class="preferences-panel">
    <template #header>
      <h4>{{ t('notifications.notification_preferences') }}</h4>
    </template>
    
    <div class="preference-group">
      <label for="show-inventory">{{ t('notifications.show_inventory_alerts') }}</label>
      <div class="toggle-switch">
        <input 
          id="show-inventory"
          type="checkbox"
          v-model="newPreferences.showInventoryAlerts"
        />
        <span class="toggle-slider"></span>
      </div>
    </div>
    
    <div class="preference-group">
      <label for="show-ai">{{ t('notifications.show_ai_insights') }}</label>
      <div class="toggle-switch">
        <input 
          id="show-ai"
          type="checkbox"
          v-model="newPreferences.showAiInsights"
        />
        <span class="toggle-slider"></span>
      </div>
    </div>
    
    <div class="preference-group">
      <label for="show-system">{{ t('notifications.show_system_notifications') }}</label>
      <div class="toggle-switch">
        <input 
          id="show-system"
          type="checkbox"
          v-model="newPreferences.showSystemNotifications"
        />
        <span class="toggle-slider"></span>
      </div>
    </div>
    
    <div class="preference-group">
      <label for="sound-alerts">{{ t('notifications.enable_sound_alerts') }}</label>
      <div class="toggle-switch">
        <input 
          id="sound-alerts"
          type="checkbox"
          v-model="newPreferences.enableSoundAlerts"
        />
        <span class="toggle-slider"></span>
      </div>
    </div>
    
    <div class="preference-group">
      <label for="desktop-notifications">{{ t('notifications.enable_desktop_notifications') }}</label>
      <div class="toggle-switch">
        <input 
          id="desktop-notifications"
          type="checkbox"
          v-model="newPreferences.enableDesktopNotifications"
        />
        <span class="toggle-slider"></span>
      </div>
    </div>
    
    <div class="preference-group">
      <label for="auto-hide">{{ t('notifications.auto_hide_after') }}</label>
      <select 
        id="auto-hide"
        v-model="newPreferences.autoHideAfter"
        class="auto-hide-select"
      >
        <option value="0">{{ t('notifications.never') }}</option>
        <option value="1">1 {{ t('notifications.minute') }}</option>
        <option value="5">5 {{ t('notifications.minutes') }}</option>
        <option value="15">15 {{ t('notifications.minutes') }}</option>
        <option value="30">30 {{ t('notifications.minutes') }}</option>
        <option value="60">1 {{ t('notifications.hour') }}</option>
      </select>
    </div>
    
    <template #footer>
      <div class="preference-actions">
        <button @click="savePreferences" class="save-button">
          {{ t('notifications.save') }}
        </button>
        <button @click="cancelPreferences" class="cancel-button">
          {{ t('notifications.cancel') }}
        </button>
      </div>
    </template>
  </BaseCard>
</template>

<style scoped>
.preference-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.preference-group label {
  font-size: 0.875rem;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
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
  border-radius: 20px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #3b82f6;
}

input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.auto-hide-select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.preference-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.save-button,
.cancel-button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.save-button {
  background-color: #3b82f6;
  border: 1px solid #2563eb;
  color: white;
}

.save-button:hover {
  background-color: #2563eb;
}

.cancel-button {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #4b5563;
}

.cancel-button:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}
</style>