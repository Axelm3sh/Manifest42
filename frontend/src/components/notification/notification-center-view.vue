<script setup>
import {computed, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useNotificationsStore} from '../../stores/notifications';
import NotificationBell from './notification-bell.vue';
import NotificationPreferences from './notification-preferences.vue';
import NotificationList from './notification-list.vue';
import FormContainer from '../base/form-container.vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';
import OverlayPanel from 'primevue/overlaypanel';

const { t } = useI18n();
const notificationsStore = useNotificationsStore();

// Reactive state
const activeTab = ref('all');
const showPreferences = ref(false);
const notificationPanel = ref(null);

// Computed properties
const unreadCount = computed(() => notificationsStore.unreadCount);
const isOpen = computed(() => notificationsStore.isNotificationCenterOpen);

// Tab items for PrimeVue TabView
const tabItems = [
  { label: t('notifications.all'), value: 'all' },
  { label: t('notifications.info'), value: 'info' },
  { label: t('notifications.success'), value: 'success' },
  { label: t('notifications.warning'), value: 'warning' },
  { label: t('notifications.error'), value: 'error' }
];

// Methods
const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const togglePreferences = () => {
  showPreferences.value = !showPreferences.value;
};

const toggleNotificationCenter = (event) => {
  if (isOpen.value) {
    notificationsStore.toggleNotificationCenter();
  } else {
    notificationPanel.value.toggle(event);
  }
};

const markAllAsRead = () => {
  notificationsStore.markAllAsRead();
};

const dismissAllNotifications = () => {
  notificationsStore.dismissAllNotifications();
};
</script>

<template>
  <div class="relative">
    <!-- Notification Bell Icon -->
    <NotificationBell 
      :unread-count="unreadCount"
      @toggle="toggleNotificationCenter($event)"
    />

    <!-- Notification Center Panel using OverlayPanel -->
    <OverlayPanel 
      ref="notificationPanel" 
      :showCloseIcon="false"
      class="w-full max-w-md"
      :breakpoints="{'960px': '75vw', '640px': '90vw'}"
      :style="{ zIndex: 1000 }"
    >
      <FormContainer class="shadow-none border-0">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold m-0">{{ t('notifications.title') }}</h3>
            <div class="flex gap-2">
              <Button 
                v-if="unreadCount > 0"
                @click="markAllAsRead" 
                label="Mark All Read"
                text
                size="small"
                class="text-sm text-gray-500 hover:text-gray-700"
              />
              <Button 
                @click="togglePreferences" 
                :label="t('notifications.preferences')"
                text
                size="small"
                :class="{ 'bg-gray-200': showPreferences }"
                class="text-sm text-gray-500 hover:text-gray-700"
              />
              <Button 
                @click="toggleNotificationCenter" 
                icon="pi pi-times"
                text
                rounded
                aria-label="Close notification center"
                class="text-gray-500 hover:text-gray-700"
              />
            </div>
          </div>
        </template>

        <!-- Preferences Panel -->
        <NotificationPreferences 
          v-if="showPreferences"
          :preferences="notificationsStore.preferences"
          @save="(newPrefs) => { notificationsStore.updatePreferences(newPrefs); showPreferences = false; }"
          @cancel="showPreferences = false"
        />

        <!-- Tabs Navigation and Notification List -->
        <template v-else>
          <TabView @tab-change="(e) => setActiveTab(tabItems[e.index].value)">
            <TabPanel v-for="tab in tabItems" :key="tab.value" :header="tab.label">
              <NotificationList 
                :active-tab="activeTab"
                :notifications="notificationsStore.filteredNotifications"
                :notifications-by-type="notificationsStore.notificationsByType"
                :notifications-by-date="notificationsStore.groupedByDate"
                @mark-as-read="notificationsStore.markAsRead"
                @dismiss="notificationsStore.dismissNotification"
                @execute-action="notificationsStore.executeAction"
                @clear-all="dismissAllNotifications"
              />
            </TabPanel>
          </TabView>
        </template>
      </FormContainer>
    </OverlayPanel>
  </div>
</template>

<style scoped>
/* All styles have been replaced with Tailwind utility classes and PrimeVue components */

/* Custom styles for OverlayPanel animation */
:deep(.p-overlaypanel) {
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
