<script setup lang="ts">
import {computed, ref, Transition, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Badge from 'primevue/badge'
import Divider from 'primevue/divider'
import {useNotificationsStore} from '@/stores/notifications'
import NotificationPreferences from '@/components/notification/notification-preferences.vue'

/* Local State */
const {t} = useI18n()
const store = useNotificationsStore()

/* dialog visibility */
const open = ref(false)
const showPrefs = ref(false)

/* -------------------------------------------------- */
/*  tabs                                              */
/* -------------------------------------------------- */
const tabKeys = ['all', 'info', 'success', 'warning', 'error'] as const
const activeIndex = ref(0)    // TabView uses a numeric index

/* reset to "All" whenever opened */
watch(open, v => {
  if (v) activeIndex.value = 0
})

const unread = computed(() => store.unreadCount)

/* Helpers */
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
        style="pointer-events: none"
    />
  </Button>

  <Dialog
      v-model:visible="open"
      append-to="self"
      :header="t('notifications.title')"
      modal
      dismissableMask
      class="w-full sm:w-25rem md:w-30rem"
      content-style="min-height: 18rem"
  >
    <div class="flex items-center gap-2 mb-2">
      <Button
          v-if="unread"
          @click="store.markAllAsRead"
          size="small"
          :label="t('notifications.mark_all_read')"
          text
      />
      <Button
          @click="showPrefs = !showPrefs"
          size="small"
          :label="t('notifications.preferences')"
          text
      />
    </div>

    <Transition name="fade">
      <NotificationPreferences
          v-if="showPrefs"
          :model-value="showPrefs"
          @update:model-value="showPrefs = $event"
          v-model:preferences="store.preferences"
          @save="store.updatePreferences"
      />
    </Transition>

    <!-- tabs -->
    <TabView
        v-model:activeIndex="activeIndex"
        scrollable
    >
      <TabPanel
          v-for="(key, i) in tabKeys"
          :key="key"
          :header="t(`notifications.${key}`, key)"
      >
        <div
            class="max-h-60vh overflow-y-auto px-1"
            style="min-height: 10rem"
        >
          <!-- list for this tab -->
          <template
              v-for="(note, i) in (
                key === 'all'
                  ? store.sortedNotifications
                  : (store.notificationsByType[key] || [])
              )"
              :key="note.id"
          >
            <div
                class="p-2 mb-2 border-round surface-card shadow-1 cursor-pointer transition-transform hover:-translate-y-1"
                :class="{
                  'surface-hover': !note.isRead,
                  'opacity-50':  note.isRead
                }"
                @click="store.markAsRead(note.id)"
            >
              <div class="flex gap-3">
                <i
                    :class="[
                      'pi',
                      typeMeta[note.type].icon,
                      typeMeta[note.type].color,
                      'text-xl flex-shrink-0'
                    ]"
                />
                <div class="flex-auto">
                  <p class="font-medium m-0">{{ note.message }}</p>
                  <small class="text-color-secondary">
                    {{ formatTime(note.createdAt) }}
                  </small>

                  <div
                      v-if="note.actions?.length"
                      class="mt-2 flex gap-2 flex-wrap"
                      @click.stop
                  >
                    <Button
                        v-for="act in note.actions"
                        :key="act.id"
                        :label="act.label"
                        :severity="act.primary ? 'primary' : 'secondary'"
                        size="small"
                        outlined
                        @click.stop="
                          act.id === 'dismiss'
                            ? store.dismissNotification(note.id)
                            : store.executeAction(note, act)
                        "
                    />
                  </div>
                </div>
              </div>
            </div>

            <Divider
                v-if="key === 'all' && i < store.sortedNotifications.length - 1"
                class="m-0"
            />
          </template>

          <!-- empty state -->
          <p
              v-if="(key === 'all' ? store.sortedNotifications : store.notificationsByType[key]).length === 0"
              class="text-center text-color-secondary py-4"
          >
            {{ t('notifications.no_notifications') }}
          </p>
        </div>
      </TabPanel>
    </TabView>

    <template #footer>
      <Button
          :label="t('notifications.clear_all')"
          severity="danger"
          size="small"
          text
          @click="store.dismissAllNotifications"
      />
    </template>
  </Dialog>
</template>