<script setup>
import {computed, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useNotificationsStore} from '../../stores/notifications';
import NotificationBell from './notification-bell.vue';
import NotificationPreferences from './notification-preferences.vue';
import NotificationList from './notification-list.vue';

const { t } = useI18n();
const notificationsStore = useNotificationsStore();

// Reactive state
const activeTab = ref('all');
const showPreferences = ref(false);

// Computed properties
const unreadCount = computed(() => notificationsStore.unreadCount);
const isOpen = computed(() => notificationsStore.isNotificationCenterOpen);

// Methods
const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const togglePreferences = () => {
  showPreferences.value = !showPreferences.value;
};

const toggleNotificationCenter = () => {
  notificationsStore.toggleNotificationCenter();
};

const markAllAsRead = () => {
  notificationsStore.markAllAsRead();
};

const dismissAllNotifications = () => {
  notificationsStore.dismissAllNotifications();
};
</script>

<template>
  <div class="notification-center-container">
    <!-- Notification Bell Icon -->
    <NotificationBell 
      :unread-count="unreadCount"
      @toggle="toggleNotificationCenter"
    />
    
    <!-- Notification Center Panel -->
    <div 
      v-if="isOpen" 
      class="notification-center"
    >
      <div class="notification-header">
        <h3>{{ t('notifications.title') }}</h3>
        <div class="notification-actions">
          <button 
            v-if="unreadCount > 0"
            @click="markAllAsRead" 
            class="mark-read-button"
          >
            {{ t('notifications.mark_all_read') }}
          </button>
          <button 
            @click="togglePreferences" 
            class="preferences-button"
            :class="{ 'active': showPreferences }"
          >
            {{ t('notifications.preferences') }}
          </button>
          <button 
            @click="toggleNotificationCenter" 
            class="close-button"
            aria-label="Close notification center"
          >
            ×
          </button>
        </div>
      </div>
      
      <!-- Preferences Panel -->
      <NotificationPreferences 
        v-if="showPreferences"
        :preferences="notificationsStore.preferences"
        @save="(newPrefs) => { notificationsStore.updatePreferences(newPrefs); showPreferences = false; }"
        @cancel="showPreferences = false"
      />
      
      <!-- Tabs Navigation and Notification List -->
      <template v-else>
        <div class="tabs-navigation">
          <button 
            @click="setActiveTab('all')" 
            class="tab-button"
            :class="{ 'active': activeTab === 'all' }"
          >
            {{ t('notifications.all') }}
          </button>
          <button 
            @click="setActiveTab('info')" 
            class="tab-button"
            :class="{ 'active': activeTab === 'info' }"
          >
            {{ t('notifications.info') }}
          </button>
          <button 
            @click="setActiveTab('success')" 
            class="tab-button"
            :class="{ 'active': activeTab === 'success' }"
          >
            {{ t('notifications.success') }}
          </button>
          <button 
            @click="setActiveTab('warning')" 
            class="tab-button"
            :class="{ 'active': activeTab === 'warning' }"
          >
            {{ t('notifications.warning') }}
          </button>
          <button 
            @click="setActiveTab('error')" 
            class="tab-button"
            :class="{ 'active': activeTab === 'error' }"
          >
            {{ t('notifications.error') }}
          </button>
        </div>
        
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
      </template>
    </div>
  </div>
</template>

<style scoped>
.notification-center-container {
  position: relative;
}

.notification-center {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 400px;
  max-height: 600px;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 50;
  display: flex;
  flex-direction: column;
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

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.notification-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.notification-actions {
  display: flex;
  gap: 0.5rem;
}

.mark-read-button,
.preferences-button {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s, color 0.2s;
}

.mark-read-button:hover,
.preferences-button:hover {
  background-color: #f3f4f6;
  color: #4b5563;
}

.preferences-button.active {
  background-color: #e5e7eb;
  color: #1f2937;
}

.close-button {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;
}

.close-button:hover {
  color: #4b5563;
}

.tabs-navigation {
  display: flex;
  padding: 0 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.tab-button {
  padding: 0.75rem 0.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.tab-button:hover {
  color: #4b5563;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}
</style>