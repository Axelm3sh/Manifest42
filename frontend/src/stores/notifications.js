import {defineStore} from 'pinia';
import {computed, ref, shallowRef} from 'vue';

/**
 * Store for notification system
 * Manages notifications, preferences, and actions
 */
export const useNotificationsStore = defineStore('notifications', () => {
  // State
  const notifications = shallowRef([]);
  const preferences = ref({
    showInventoryAlerts: true,
    showAiInsights: true,
    showSystemNotifications: true,
    enableSoundAlerts: false,
    enableDesktopNotifications: false,
    autoHideAfter: 5 // minutes, 0 means never
  });
  const unreadCount = ref(0);
  const isNotificationCenterOpen = ref(false);

  // Getters
  const sortedNotifications = computed(() => {
    return [...notifications.value].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  });

  const filteredNotifications = computed(() => {
    return sortedNotifications.value.filter(notification => {
      if (notification.category === 'inventory' && !preferences.value.showInventoryAlerts) {
        return false;
      }
      if (notification.category === 'ai' && !preferences.value.showAiInsights) {
        return false;
      }
      if (notification.category === 'system' && !preferences.value.showSystemNotifications) {
        return false;
      }
      return true;
    });
  });

  const groupedByDate = computed(() => {
    const groups = {};
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    filteredNotifications.value.forEach(notification => {
      const date = new Date(notification.timestamp);
      const dateString = date.toDateString();

      let groupName;
      if (dateString === today) {
        groupName = 'Today';
      } else if (dateString === yesterday) {
        groupName = 'Yesterday';
      } else {
        groupName = date.toLocaleDateString(undefined, { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }

      if (!groups[groupName]) {
        groups[groupName] = [];
      }

      groups[groupName].push(notification);
    });

    return groups;
  });

  const notificationsByType = computed(() => {
    const types = {
      info: [],
      success: [],
      warning: [],
      error: []
    };

    filteredNotifications.value.forEach(notification => {
      if (types[notification.type]) {
        types[notification.type].push(notification);
      } else {
        types.info.push(notification);
      }
    });

    return types;
  });

  // Actions
  function addNotification(notification) {
    const id = `notification-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const timestamp = new Date().toISOString();
    const isRead = false;

    const newNotification = {
      id,
      timestamp,
      isRead,
      ...notification
    };

    notifications.value.unshift(newNotification);
    unreadCount.value++;

    // Auto-hide logic
    if (preferences.value.autoHideAfter > 0) {
      setTimeout(() => {
        dismissNotification(id);
      }, preferences.value.autoHideAfter * 60 * 1000);
    }

    // Desktop notification
    if (preferences.value.enableDesktopNotifications) {
      showDesktopNotification(newNotification);
    }

    // Sound alert
    if (preferences.value.enableSoundAlerts) {
      playNotificationSound(newNotification.type);
    }

    return id;
  }

  function dismissNotification(id) {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index !== -1) {
      if (!notifications.value[index].isRead) {
        unreadCount.value--;
      }
      notifications.value.splice(index, 1);
    }
  }

  function dismissAllNotifications() {
    notifications.value = [];
    unreadCount.value = 0;
  }

  function markAsRead(id) {
    const notification = notifications.value.find(n => n.id === id);
    if (notification && !notification.isRead) {
      notification.isRead = true;
      unreadCount.value--;
    }
  }

  function markAllAsRead() {
    notifications.value.forEach(notification => {
      notification.isRead = true;
    });
    unreadCount.value = 0;
  }

  function updatePreferences(newPreferences) {
    preferences.value = { ...preferences.value, ...newPreferences };
  }

  function toggleNotificationCenter() {
    isNotificationCenterOpen.value = !isNotificationCenterOpen.value;
  }

  function executeAction(notification, action) {
    // In a real app, this would handle different action types
    // For now, we'll just mark the notification as read
    markAsRead(notification.id);

    // Return the action data for the component to handle
    return { notificationId: notification.id, action };
  }

  // Helper functions
  function showDesktopNotification(notification) {
    // Check if browser supports notifications
    if ('Notification' in window) {
      // Check if permission is granted
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: getNotificationIcon(notification.type)
        });
      } 
      // Otherwise, we need to ask the user for permission
      else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(notification.title, {
              body: notification.message,
              icon: getNotificationIcon(notification.type)
            });
          }
        });
      }
    }
  }

  function getNotificationIcon(type) {
    // In a real app, these would be actual icon paths
    const icons = {
      info: '/icons/info.png',
      success: '/icons/success.png',
      warning: '/icons/warning.png',
      error: '/icons/error.png'
    };

    return icons[type] || icons.info;
  }

  function playNotificationSound(type) {
    // In a real app, this would play different sounds based on notification type
    // For now, we'll just log to the console
    console.log(`Playing ${type} notification sound`);
  }

  // Generate mock notifications for testing
  function generateMockNotifications() {
    const mockNotifications = [
      {
        title: 'Low Stock Alert',
        message: 'Laptop stock is below reorder point',
        type: 'warning',
        category: 'inventory',
        actions: [
          { id: 'restock', label: 'Restock Now', primary: true },
          { id: 'dismiss', label: 'Dismiss', primary: false }
        ]
      },
      {
        title: 'AI Prediction Updated',
        message: 'Demand forecast for Smartphones has been updated',
        type: 'info',
        category: 'ai',
        actions: [
          { id: 'view', label: 'View Details', primary: true },
          { id: 'dismiss', label: 'Dismiss', primary: false }
        ]
      },
      {
        title: 'Order Completed',
        message: 'Order #12345 has been successfully processed',
        type: 'success',
        category: 'inventory',
        actions: [
          { id: 'view', label: 'View Order', primary: true }
        ]
      },
      {
        title: 'System Maintenance',
        message: 'System will be down for maintenance on Sunday at 2 AM',
        type: 'info',
        category: 'system',
        actions: []
      },
      {
        title: 'API Error',
        message: 'Failed to connect to inventory service',
        type: 'error',
        category: 'system',
        actions: [
          { id: 'retry', label: 'Retry', primary: true },
          { id: 'settings', label: 'Settings', primary: false }
        ]
      }
    ];

    // Add mock notifications with different timestamps
    mockNotifications.forEach((notification, index) => {
      const daysAgo = index % 3; // 0, 1, or 2 days ago
      const hoursAgo = index * 2; // 0, 2, 4, 6, 8 hours ago

      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - daysAgo);
      timestamp.setHours(timestamp.getHours() - hoursAgo);

      addNotification({
        ...notification,
        timestamp: timestamp.toISOString()
      });
    });
  }

  return {
    // State
    notifications,
    preferences,
    unreadCount,
    isNotificationCenterOpen,

    // Getters
    sortedNotifications,
    filteredNotifications,
    groupedByDate,
    notificationsByType,

    // Actions
    addNotification,
    dismissNotification,
    dismissAllNotifications,
    markAsRead,
    markAllAsRead,
    updatePreferences,
    toggleNotificationCenter,
    executeAction,
    generateMockNotifications
  };
});

// Export an alias for backward compatibility
export const useNotificationStore = useNotificationsStore;
