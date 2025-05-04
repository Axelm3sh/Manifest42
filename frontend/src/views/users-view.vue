<template>
  <div class="users-view">
    <h1>{{ $t('users.title') }}</h1>
    <p>{{ $t('users.description') }}</p>
    
    <!-- Placeholder content -->
    <!-- In general we want to build an info view of all users of the application.
We should use PrimeVue4 to scaffold a user list and management system. It should be data driven using our models related to `Users`.
Only admins can see this view -->

    <div class="placeholder-content">
      <p>{{ $t('common.placeholder_content') }}</p>
    </div>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped>
.users-view {
  padding: var(--spacing-lg);
}

.placeholder-content {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  border: var(--border-width-thin) solid var(--color-border);
}
</style>