# Notification Components

The Notification module provides components for managing and displaying system notifications, alerts, and user messages throughout the application.

## Components

### notification-bell.vue
A bell icon component that indicates the presence of unread notifications. It typically appears in the application header and can display a badge with the count of unread notifications.

### notification-center-view.vue
The main view for the notification center that displays all notifications in a centralized location. It provides functionality to view, filter, and manage notifications.

### notification-list.vue
A component that renders a list of notifications with appropriate styling based on notification type (info, warning, error, success) and read/unread status.

### notification-preferences.vue
Allows users to configure their notification preferences, including which types of notifications they want to receive and through which channels (in-app, email, etc.).

## Usage

The Notification components are used throughout the application to keep users informed about important events, updates, and system messages. The notification system helps ensure users don't miss critical information and can manage their notification flow according to their preferences.

Example integration:
```vue
<template>
  <div class="app-header">
    <div class="header-actions">
      <notification-bell @click="openNotificationCenter" />
    </div>
  </div>
  
  <notification-center-view v-if="showNotificationCenter" />
</template>
```