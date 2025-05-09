# Notification Components

The Notification module provides components for managing and displaying system notifications, alerts, and user messages throughout the application.

## Components

### notification-center.vue
A comprehensive component that combines a notification bell icon with a notification center. Features include:
- Bell icon with badge showing unread notification count
- Tabbed interface for viewing notifications by type (all, info, success, warning, error)
- Ability to mark notifications as read
- Functionality to dismiss individual or all notifications
- Support for notification actions
- Integration with notification preferences

### notification-preferences.vue
Allows users to configure their notification preferences, including:
- Toggling inventory alerts, AI insights, and system notifications
- Enabling/disabling sound alerts
- Enabling/disabling desktop notifications
- Setting auto-hide duration for notifications

## Usage

The Notification components are used throughout the application to keep users informed about important events, updates, and system messages. The notification system helps ensure users don't miss critical information and can manage their notification flow according to their preferences.

Example integration:
```vue
<template>
  <div class="app-header">
    <div class="header-actions">
      <notification-center />
    </div>
  </div>
</template>

<script setup>
import NotificationCenter from '@/components/notification/notification-center.vue'
</script>
```

## Features
- Different styling for notification types (info, success, warning, error)
- Unread notification count badge
- Ability to filter notifications by type
- Mark all notifications as read with a single click
- Dismiss individual or all notifications
- Support for actionable notifications with custom buttons
- Configurable notification preferences
- Auto-hide functionality for notifications

## Architecture

The notification system is built around a central Pinia store (`useNotificationsStore`) that manages the state and business logic for notifications. This store is used by the notification components and integrated throughout the application.

### Notifications Store
The notifications store (`stores/notifications.ts`) provides:
- State management for notifications and preferences
- Methods for creating, adding, and dismissing notifications
- Functions for marking notifications as read
- Support for notification actions
- Desktop notification integration
- Sound alerts
- Mock notification generation for testing

### Integration
The notification system is integrated into various dashboard views and layouts, allowing for consistent notification handling throughout the application. Components can easily access the notification store to display or create notifications.
