<script setup>
import {computed, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import BaseCard from './base/base-card.vue';

const { t } = useI18n();

// Define props with explicit types and validation
const props = defineProps({
  notifications: {
    type: Array,
    required: true,
    default: () => [],
    validator: (value) => Array.isArray(value)
  },
  maxVisible: {
    type: Number,
    required: false,
    default: 5
  }
});

// Define emits with validation
const emit = defineEmits({
  'dismiss': (id) => typeof id === 'string' || typeof id === 'number',
  'dismiss-all': () => true,
  'notification-clicked': (notification) => notification !== undefined
});

// Reactive state
const showAll = ref(false);

// Computed property for visible notifications
const visibleNotifications = computed(() => {
  if (showAll.value) {
    return props.notifications;
  }
  return props.notifications.slice(0, props.maxVisible);
});

// Computed property to check if we have more notifications than the max visible
const hasMoreNotifications = computed(() => 
  props.notifications.length > props.maxVisible
);

// Computed property for the number of hidden notifications
const hiddenNotificationsCount = computed(() => 
  props.notifications.length - props.maxVisible
);

// Method to toggle showing all notifications
const toggleShowAll = () => {
  showAll.value = !showAll.value;
};

// Method to dismiss a notification
const dismissNotification = (id, event) => {
  // Stop event propagation to prevent notification-clicked from firing
  event.stopPropagation();
  emit('dismiss', id);
};

// Method to dismiss all notifications
const dismissAll = () => {
  emit('dismiss-all');
};

// Method to handle notification click
const handleNotificationClick = (notification) => {
  emit('notification-clicked', notification);
};

// Computed property for notification type classes
const getNotificationTypeClass = (type) => {
  const typeMap = {
    info: 'notification-info',
    success: 'notification-success',
    warning: 'notification-warning',
    error: 'notification-error'
  };

  return typeMap[type] || typeMap.info;
};
</script>

<template>
  <BaseCard 
    :title="t('notifications.title')" 
    class="notification-list-card"
  >
    <template #header>
      <div class="notification-header">
        <h3>{{ t('notifications.title') }}</h3>
        <!-- Use shorthand @click instead of v-on:click -->
        <button 
          v-if="notifications.length > 0"
          @click="dismissAll" 
          class="dismiss-all-button"
        >
          {{ t('notifications.dismiss_all') }}
        </button>
      </div>
    </template>

    <div class="notification-list">
      <!-- Use v-if/v-else for conditional rendering -->
      <template v-if="notifications.length > 0">
        <!-- Use v-for with unique :key -->
        <div 
          v-for="notification in visibleNotifications" 
          :key="notification.id"
          class="notification-item"
          :class="getNotificationTypeClass(notification.type)"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification-content">
            <!-- Use shorthand :class instead of v-bind:class -->
            <div class="notification-icon" :class="getNotificationTypeClass(notification.type)">
              <!-- Use v-if/v-else-if/v-else for conditional rendering -->
              <span v-if="notification.type === 'info'">ℹ️</span>
              <span v-else-if="notification.type === 'success'">✅</span>
              <span v-else-if="notification.type === 'warning'">⚠️</span>
              <span v-else-if="notification.type === 'error'">❌</span>
              <span v-else>📢</span>
            </div>
            <div class="notification-text">
              <div class="notification-title">{{ notification.title }}</div>
              <!-- Use v-if to conditionally render elements -->
              <div v-if="notification.message" class="notification-message">
                {{ notification.message }}
              </div>
              <div class="notification-time">{{ notification.time }}</div>
            </div>
          </div>
          <!-- Use shorthand @click instead of v-on:click -->
          <button 
            @click="dismissNotification(notification.id, $event)" 
            class="dismiss-button"
            :aria-label="t('notifications.dismiss')"
          >
            ×
          </button>
        </div>

        <!-- Use v-if to conditionally render elements -->
        <div v-if="hasMoreNotifications && !showAll" class="show-more-container">
          <button @click="toggleShowAll" class="show-more-button">
            {{ t('notifications.show_more', { count: hiddenNotificationsCount }) }}
          </button>
        </div>

        <!-- Use v-if/v-else for conditional rendering -->
        <div v-if="showAll" class="show-less-container">
          <button @click="toggleShowAll" class="show-less-button">
            {{ t('notifications.show_less') }}
          </button>
        </div>
      </template>

      <!-- Use v-else for conditional rendering -->
      <div v-else class="no-notifications">
        {{ t('notifications.no_notifications') }}
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
.notification-list-card {
  margin-bottom: 2rem;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.dismiss-all-button {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s, color 0.2s;
}

.dismiss-all-button:hover {
  background-color: #f3f4f6;
  color: #4b5563;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 0.375rem;
  background-color: #f9fafb;
  border-left: 4px solid #9ca3af;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f3f4f6;
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
  gap: 0.75rem;
  flex: 1;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  font-size: 1rem;
}

.notification-text {
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

.show-more-container,
.show-less-container {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
}

.show-more-button,
.show-less-button {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.show-more-button:hover,
.show-less-button:hover {
  background-color: #eff6ff;
}

.no-notifications {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
}
</style>
