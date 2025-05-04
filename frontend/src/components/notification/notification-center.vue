<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Tabs from 'primevue/tabs';
import TabPanel from 'primevue/tabpanel';
import Badge from 'primevue/badge'
import Divider from 'primevue/divider'
import {useNotificationsStore} from '@/stores/notifications'

/* -------------------------------------------------- */
/*  local state                                       */
/* -------------------------------------------------- */
const {t} = useI18n()
const store = useNotificationsStore()

/* dialog visibility */
const open = ref(false)

/* tab handling ----------------------------------------------------------- */
const tabKeys = ['all', 'info', 'success', 'warning', 'error'] as const
const tab = ref<typeof tabKeys[number]>('all')   // currently selected key
const activeIndex = ref(tabKeys.indexOf(tab.value))      // TabView’s numeric index

watch(activeIndex, idx => {
  tab.value = tabKeys[idx]
})          // keep tab in sync
watch(tab, key => {
  activeIndex.value = tabKeys.indexOf(key)
})  // keep index in sync

const unread = computed(() => store.unreadCount)

/* -------------------------------------------------- */
/*  helpers                                           */
/* -------------------------------------------------- */
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
}

const typeMeta = {
  info: {icon: 'pi-info-circle', color: 'text-primary'},
  success: {icon: 'pi-check-circle', color: 'text-green-500'},
  warning: {icon: 'pi-exclamation-triangle', color: 'text-yellow-500'},
  error: {icon: 'pi-times-circle', color: 'text-red-400'}
} as const
</script>

<template>
  <!-- bell button -->
  <Button
      class="relative p-button-text p-ml-2"
      size="large"
      rounded
      @click="open = !open"
  >
    <i class="pi pi-bell text-xl"/>
    <Badge
        v-if="unread"
        :value="unread"
        class="p-overlay-badge p-badge-danger"
        style="pointer-events:none"
    />
  </Button>

  <!-- notification dialog -->
  <Dialog
      v-model:visible="open"
      append-to="self"
      :header="t('notifications.title')"
      modal
      dismissableMask
      class="w-full sm:w-25rem md:w-30rem"
  >
    <!-- header actions -->
    <div class="flex items-center gap-2 mb-2">
      <Button
          v-if="unread"
          @click="store.markAllAsRead"
          size="small"
          label="Mark all as read"
          text
      />
      <Button
          @click="store.updatePreferences({})"
          size="small"
          :label="t('notifications.preferences')"
          text
      />
    </div>

    <!-- tab view -->
    <Tabs v-model:activeIndex="activeIndex" scrollable>
      <TabPanel
          v-for="key in tabKeys"
          :key="key"
          :header="t(`notifications.${key}`)"
      >
        <div class="max-h-60vh overflow-y-auto px-1">
          <template
              v-for="(note, i) in (key==='all' ? store.sortedNotifications : store.notificationsByType[key])"
              :key="note.id"
          >
            <!-- card -->
            <div
                class="p-2 mb-2 border-round surface-card shadow-1 cursor-pointer transition-transform hover:-translate-y-1"
                :class="{ 'surface-hover' : !note.isRead }"
                @click="store.markAsRead(note.id)"
            >
              <div class="flex gap-3">
                <i :class="['pi', typeMeta[note.type].icon, typeMeta[note.type].color,'text-xl flex-shrink-0']"/>
                <div class="flex-auto">
                  <p class="font-medium m-0">{{ note.message }}</p>
                  <small class="text-color-secondary">{{ formatTime(note.createdAt) }}</small>

                  <div v-if="note.actions?.length" class="mt-2 flex gap-2 flex-wrap">
                    <Button
                        v-for="act in note.actions"
                        :key="act.id"
                        :label="act.label"
                        :severity="act.primary ? 'primary' : 'secondary'"
                        size="small"
                        outlined
                        @click.stop="store.executeAction(note, act)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Divider
                v-if="key==='all' && i < store.sortedNotifications.length - 1"
                class="m-0"
            />

          </template>

          <p v-if="(key==='all'? store.sortedNotifications.length : store.notificationsByType[key].length)===0"
             class="text-center text-color-secondary py-4">
            {{ t('notifications.no_notifications') }}
          </p>
        </div>
      </TabPanel>
    </Tabs>

    <template #footer>
      <Button
          label="Clear all"
          severity="danger"
          size="small"
          text
          @click="store.dismissAllNotifications"
      />
    </template>
  </Dialog>
</template>