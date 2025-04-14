<template>
  <div class="users-view">
    <h1>{{ $t('users.title') }}</h1>
    <p>{{ $t('users.description') }}</p>
    
    <!-- Placeholder content -->
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