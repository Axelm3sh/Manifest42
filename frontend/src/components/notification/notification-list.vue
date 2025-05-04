<script setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import BaseCard from "@/components/base/base-card.vue";
import Button from 'primevue/button';

const { t } = useI18n();

defineOptions({
  components: { BaseCard, Button }
});

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
    return props.notifications || [];
  } else {
    return props.notificationsByType[props.activeTab] || [];
  }
});

// Methods
const markAsRead = (id) => {
  emit('markAsRead', id);
};

const dismissNotification = (id) => {
  emit('dismiss', id);
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
                  <Button
                    v-for="action in notification.actions"
                    :key="action.id"
                    size="small"
                    :label="action.label"
                    :severity="action.primary ? 'primary' : 'secondary'"
                    @click.stop="executeAction(notification, action)"
                    outlined
                  />
                </div>
              </div>
              <Button
                icon="pi pi-times"
                rounded
                text
                size="small"
                class="p-button-plain dismiss-button"
                :aria-label="t('notifications.dismiss')"
                @click.stop="dismissNotification(notification.id)"
              />
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
                <Button
                  v-for="action in notification.actions"
                  :key="action.id"
                  size="small"
                  :label="action.label"
                  :severity="action.primary ? 'primary' : 'secondary'"
                  @click.stop="executeAction(notification, action)"
                  outlined
                />
              </div>
            </div>
            <Button
              icon="pi pi-times"
              rounded
              text
              size="small"
              class="p-button-plain dismiss-button"
              :aria-label="t('notifications.dismiss')"
              @click.stop="dismissNotification(notification.id)"
            />
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
/* scoped */
.notification-list {
  flex: 1;
  overflow-y: auto;
  padding: .5rem;
}

.notification-group { margin-bottom: 1rem; }

.date-header {                 /* PrimeVue doesn't have a header chip */
  font-size: .75rem;
  font-weight: 600;
  color: var(--text-secondary);
  padding: .5rem;
  background: var(--surface-b);
  border-radius: var(--border-radius);
  margin-bottom: .5rem;
}

/* Replace these selectors */
.base-card.notification-item {
  cursor: pointer;
  transition: transform 0.2s;
  border-left: 4px solid var(--surface-border);
}
.base-card.notification-item:hover {
  transform: translateY(-2px);
}
.base-card.unread {
  background: var(--blue-50);
}
.base-card.notification-info {
  border-left-color: var(--primary-color);
}
.base-card.notification-success {
  border-left-color: var(--green-400);
}
.base-card.notification-warning {
  border-left-color: var(--yellow-400);
}
.base-card.notification-error {
  border-left-color: var(--red-400);
}

/* Keep this */
.dismiss-button:hover .pi {
  color: var(--text-color-secondary);
}

/* Add these missing layout rules */
.notification-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem; /* overridable by noPadding prop */
}
.notification-icon {
  font-size: 1.25rem;
  line-height: 1;
  padding-top: 0.15rem; /* vertical alignment nudge */
}
.notification-body {
  flex: 1; /* allow wrapping nicely */
}
.notification-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}
.notification-message {
  font-size: 0.875rem;
  color: var(--text-secondary);
}
.notification-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
}
.notification-actions {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
}
.clear-all-container {
  display: flex;
  justify-content: center;
  margin-top: 0.75rem;
}
</style>