<script setup>
import {reactive, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import {useToast} from 'primevue/usetoast';
import FormContainer from '../base/form-container.vue';
import InputSwitch from 'primevue/inputswitch';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';

const { t } = useI18n();
const toast = useToast();

const props = defineProps({
  preferences: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['save', 'cancel']);

// Create a local copy of preferences to edit
const newPreferences = ref({ ...props.preferences });

// Form validation
const errors = reactive({});
const submitted = ref(false);

// Auto-hide options for dropdown
const autoHideOptions = [
  { label: t('notifications.never'), value: '0' },
  { label: `1 ${t('notifications.minute')}`, value: '1' },
  { label: `5 ${t('notifications.minutes')}`, value: '5' },
  { label: `15 ${t('notifications.minutes')}`, value: '15' },
  { label: `30 ${t('notifications.minutes')}`, value: '30' },
  { label: `1 ${t('notifications.hour')}`, value: '60' }
];

// Update local preferences when props change
watch(() => props.preferences, (newValue) => {
  newPreferences.value = { ...newValue };
  submitted.value = false;
  clearErrors();
}, { deep: true });

const validateForm = () => {
  clearErrors();
  submitted.value = true;

  // Add validation rules if needed
  // For example, if autoHideAfter is required:
  // if (!newPreferences.value.autoHideAfter) {
  //   errors.autoHideAfter = t('notifications.auto_hide_required');
  //   return false;
  // }

  return true;
};

const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    delete errors[key];
  });
};

const savePreferences = () => {
  if (validateForm()) {
    emit('save', newPreferences.value);
    toast.add({ severity: 'success', summary: t('notifications.success'), detail: t('notifications.preferences_saved'), life: 3000 });
  }
};

const cancelPreferences = () => {
  newPreferences.value = { ...props.preferences };
  submitted.value = false;
  clearErrors();
  emit('cancel');
};
</script>

<template>
  <FormContainer :title="t('notifications.notification_preferences')" class="shadow-sm">
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <label for="show-inventory" class="text-sm">{{ t('notifications.show_inventory_alerts') }}</label>
        <InputSwitch 
          id="show-inventory"
          v-model="newPreferences.showInventoryAlerts"
          :class="{ 'p-invalid': submitted && errors.showInventoryAlerts }"
        />
      </div>

      <div class="flex justify-between items-center">
        <label for="show-ai" class="text-sm">{{ t('notifications.show_ai_insights') }}</label>
        <InputSwitch 
          id="show-ai"
          v-model="newPreferences.showAiInsights"
          :class="{ 'p-invalid': submitted && errors.showAiInsights }"
        />
      </div>

      <div class="flex justify-between items-center">
        <label for="show-system" class="text-sm">{{ t('notifications.show_system_notifications') }}</label>
        <InputSwitch 
          id="show-system"
          v-model="newPreferences.showSystemNotifications"
          :class="{ 'p-invalid': submitted && errors.showSystemNotifications }"
        />
      </div>

      <div class="flex justify-between items-center">
        <label for="sound-alerts" class="text-sm">{{ t('notifications.enable_sound_alerts') }}</label>
        <InputSwitch 
          id="sound-alerts"
          v-model="newPreferences.enableSoundAlerts"
          :class="{ 'p-invalid': submitted && errors.enableSoundAlerts }"
        />
      </div>

      <div class="flex justify-between items-center">
        <label for="desktop-notifications" class="text-sm">{{ t('notifications.enable_desktop_notifications') }}</label>
        <InputSwitch 
          id="desktop-notifications"
          v-model="newPreferences.enableDesktopNotifications"
          :class="{ 'p-invalid': submitted && errors.enableDesktopNotifications }"
        />
      </div>

      <div class="flex justify-between items-center">
        <label for="auto-hide" class="text-sm">{{ t('notifications.auto_hide_after') }}</label>
        <Dropdown 
          id="auto-hide"
          v-model="newPreferences.autoHideAfter"
          :options="autoHideOptions"
          optionLabel="label"
          optionValue="value"
          class="w-40"
          :class="{ 'p-invalid': submitted && errors.autoHideAfter }"
        />
      </div>

      <small v-if="submitted && errors.autoHideAfter" class="p-error block mt-2">
        {{ errors.autoHideAfter }}
      </small>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button 
          @click="cancelPreferences" 
          label="Cancel"
          text
          class="px-4"
        />
        <Button 
          @click="savePreferences" 
          label="Save"
          severity="primary"
          class="px-4"
        />
      </div>
    </template>
  </FormContainer>
</template>

<style scoped>
/* All styles have been replaced with Tailwind utility classes and PrimeVue components */
</style>
