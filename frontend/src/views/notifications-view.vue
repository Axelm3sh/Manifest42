<template>
  <div class="notifications-view">
    <h1>{{ $t('notifications.title') }}</h1>
    <p>{{ $t('notifications.description') }}</p>

    <div class="notification-center-container">
      <NotificationCenterView />
    </div>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';
import NotificationCenterView from '../components/notification/notification-center-view.vue';

const { t } = useI18n();
</script>

<style scoped>
.notifications-view {
  padding: var(--spacing-lg);
}

.notification-center-container {
  margin-top: var(--spacing-xl);
  display: flex;
  justify-content: center;
}
</style>
