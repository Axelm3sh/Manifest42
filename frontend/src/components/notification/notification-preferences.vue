<script setup lang="ts">
import {ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import BaseCard from '@/components/base/base-card.vue'
import Checkbox from 'primevue/checkbox' // binary toggle-style switch
import SelectButton from 'primevue/selectbutton'
import Button from 'primevue/button'

/* ------------------------------------------------------------------ */
/* props / emits                                                      */
/* ------------------------------------------------------------------ */
const props = defineProps<{
  modelValue: boolean
  preferences: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:preferences', value: Record<string, any>): void
  (e: 'save', value: Record<string, any>): void
}>()

const { t } = useI18n()

/* ------------------------------------------------------------------ */
/* local editable copy                                                */
/* ------------------------------------------------------------------ */
const localPrefs = ref({ ...props.preferences })
watch(
  () => props.preferences,
  p => (localPrefs.value = { ...p }),
  { deep: true }
)

/* ------------------------------------------------------------------ */
function save() {
  emit('save', localPrefs.value)
  emit('update:preferences', localPrefs.value)
  emit('update:modelValue', false)
}
function cancel() {
  localPrefs.value = { ...props.preferences }
  emit('update:modelValue', false)
}

/* select-button options for auto-hide (minutes) -------------------- */
const autoHideOptions = [
  { label: t('notifications.never'), value: 0 },
  { label: `1 ${t('notifications.minute')}`, value: 1 },
  { label: `5 ${t('notifications.minutes')}`, value: 5 },
  { label: `15 ${t('notifications.minutes')}`, value: 15 },
  { label: `30 ${t('notifications.minutes')}`, value: 30 },
  { label: `1 ${t('notifications.hour')}`, value: 60 }
]
</script>

<template>
  <BaseCard class="space-y-4">
    <template #header>
      <h4 class="m-0">{{ t('notifications.notification_preferences') }}</h4>
    </template>

    <!-- binary switches --------------------------------------------- -->
    <div class="grid gap-3">
      <div class="flex items-center justify-between">
        <label for="inv">{{ t('notifications.show_inventory_alerts') }}</label>
        <Checkbox
          id="inv"
          v-model="localPrefs.showInventoryAlerts"
          binary
        />
      </div>

      <div class="flex items-center justify-between">
        <label for="ai">{{ t('notifications.show_ai_insights') }}</label>
        <Checkbox
          id="ai"
          v-model="localPrefs.showAiInsights"
          binary
        />
      </div>

      <div class="flex items-center justify-between">
        <label for="sys">{{ t('notifications.show_system_notifications') }}</label>
        <Checkbox
          id="sys"
          v-model="localPrefs.showSystemNotifications"
          binary
        />
      </div>

      <div class="flex items-center justify-between">
        <label for="snd">{{ t('notifications.enable_sound_alerts') }}</label>
        <Checkbox
          id="snd"
          v-model="localPrefs.enableSoundAlerts"
          binary
        />
      </div>

      <div class="flex items-center justify-between">
        <label for="desk">{{ t('notifications.enable_desktop_notifications') }}</label>
        <Checkbox
          id="desk"
          v-model="localPrefs.enableDesktopNotifications"
          binary
        />
      </div>
    </div>

    <!-- auto-hide select button ------------------------------------- -->
    <div class="flex items-center justify-between">
      <label>{{ t('notifications.auto_hide_after') }}</label>
      <SelectButton
        v-model="localPrefs.autoHideAfter"
        :options="autoHideOptions"
        option-label="label"
        option-value="value"
        class="w-full sm:w-16rem"
      />
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          size="small"
          :label="t('notifications.save')"
          @click="save"
        />
        <Button
          size="small"
          severity="secondary"
          text
          :label="t('notifications.cancel')"
          @click="cancel"
        />
      </div>
    </template>
  </BaseCard>
</template>

<style scoped>
/* No extra styles—PrimeVue components provide the switch/selection UI */
</style>