<script setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import BaseCard from '../base/base-card.vue';

const { t } = useI18n();

const props = defineProps({
  activeTab: {
    type: String,
    default: 'all'
  },
  notifications: {
    type: Array,
    default: () => []
  },
  notificationsByType: {
    type: Object,
    default: () => ({})
  },
  notificationsByDate: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['markAsRead', 'dismiss', 'executeAction', 'clearAll']);

// Computed properties
const filteredNotifications = computed(() => {
  if (props.activeTab === 'all') {
    return props.notifications;
  } else {
    return props.notificationsByType[props.activeTab] || [];
  }
});

// Methods
const markAsRead = (id) => {
  emit('markAsRead', id);
};

const dismissNotification = (id, event) => {
  if (event) {
    event.stopPropagation();
  }
  emit('dismiss', id, event);
};

const executeAction = (notification, action) => {
  emit('executeAction', notification, action);
};

const clearAllNotifications = () => {
  emit('clearAll');
};

// Helper methods
const getNotificationTypeIcon = (type) => {
  const typeMap = {
    info: 'pi-info-circle',
    success: 'pi-check-circle',
    warning: 'pi-exclamation-triangle',
    error: 'pi-times'
  };

  return typeMap[type] || typeMap.info;
};

const getNotificationTypeClass = (type) => {
  const typeMap = {
    info: 'notification-info',
    success: 'notification-success',
    warning: 'notification-warning',
    error: 'notification-error'
  };

  return typeMap[type] || typeMap.info;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>

<template>
  <div class="notification-list">
    <template v-if="filteredNotifications.length > 0">
      <template v-if="activeTab === 'all'">
        <!-- Group by date -->
        <div 
          v-for="(group, date) in notificationsByDate" 
          :key="date"
          class="notification-group"
        >
          <div class="date-header">{{ date }}</div>

          <BaseCard 
            v-for="notification in group" 
            :key="notification.id"
            class="notification-item"
            :class="[
              getNotificationTypeClass(notification.type),
              { 'unread': !notification.isRead }
            ]"
            @click="markAsRead(notification.id)"
            noPadding
          >
            <div class="notification-content">
              <div class="notification-icon">
                <i :class="['pi', getNotificationTypeIcon(notification.type)]" aria-hidden="true"></i>
              </div>
              <div class="notification-body">
                <div class="notification-title">{{ notification.title }}</div>
                <div class="notification-message">{{ notification.message }}</div>
                <div class="notification-time">{{ formatDate(notification.timestamp) }}</div>

                <div v-if="notification.actions && notification.actions.length > 0" class="notification-actions">
                  <button 
                    v-for="action in notification.actions" 
                    :key="action.id"
                    @click.stop="executeAction(notification, action)"
                    class="action-button"
                    :class="{ 'primary': action.primary }"
                  >
                    {{ action.label }}
                  </button>
                </div>
              </div>
              <button 
                @click.stop="dismissNotification(notification.id, $event)" 
                class="dismiss-button"
                aria-label="Dismiss notification"
              >
                <i class="pi pi-times" aria-hidden="true"></i>
              </button>
            </div>
          </BaseCard>
        </div>
      </template>

      <template v-else>
        <!-- Filtered by type -->
        <BaseCard 
          v-for="notification in filteredNotifications" 
          :key="notification.id"
          class="notification-item"
          :class="[
            getNotificationTypeClass(notification.type),
            { 'unread': !notification.isRead }
          ]"
          @click="markAsRead(notification.id)"
          noPadding
        >
          <div class="notification-content">
            <div class="notification-icon">
              <i :class="['pi', getNotificationTypeIcon(notification.type)]" aria-hidden="true"></i>
            </div>
            <div class="notification-body">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-time">{{ formatDate(notification.timestamp) }}</div>

              <div v-if="notification.actions && notification.actions.length > 0" class="notification-actions">
                <button 
                  v-for="action in notification.actions" 
                  :key="action.id"
                  @click.stop="executeAction(notification, action)"
                  class="action-button"
                  :class="{ 'primary': action.primary }"
                >
                  {{ action.label }}
                </button>
              </div>
            </div>
            <button 
              @click.stop="dismissNotification(notification.id, $event)" 
              class="dismiss-button"
              aria-label="Dismiss notification"
            >
              <i class="pi pi-times" aria-hidden="true"></i>
            </button>
          </div>
        </BaseCard>
      </template>

      <div class="clear-all-container">
        <button @click="clearAllNotifications" class="clear-all-button">
          {{ t('notifications.clear_all') }}
        </button>
      </div>
    </template>

    <div v-else class="no-notifications">
      {{ t('notifications.no_notifications') }}
    </div>
  </div>
</template>

<style scoped>
.notification-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.notification-group {
  margin-bottom: 1rem;
}

.date-header {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

.notification-item {
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s;
  border-left: 4px solid #9ca3af;
}

.notification-item:hover {
  transform: translateY(-2px);
}

.notification-item.unread {
  background-color: #eff6ff;
}

.notification-info {
  border-left-color: #3b82f6;
}

.notification-success {
  border-left-color: #10b981;
}

.notification-warning {
  border-left-color: #f59e0b;
}

.notification-error {
  border-left-color: #ef4444;
}

.notification-content {
  display: flex;
  padding: 0.75rem;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  font-size: 1rem;
  margin-right: 0.75rem;
}

.notification-body {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.notification-message {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

.notification-time {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.notification-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #4b5563;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.action-button:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}

.action-button.primary {
  background-color: #3b82f6;
  border: 1px solid #2563eb;
  color: white;
}

.action-button.primary:hover {
  background-color: #2563eb;
}

.dismiss-button {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  margin-left: 0.5rem;
  transition: color 0.2s;
}

.dismiss-button:hover {
  color: #4b5563;
}

.clear-all-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.clear-all-button {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s, color 0.2s;
}

.clear-all-button:hover {
  background-color: #f3f4f6;
  color: #4b5563;
}

.no-notifications {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
}
</style>
