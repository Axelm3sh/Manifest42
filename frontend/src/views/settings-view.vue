<template>
  <div class="settings-view">
    <h1>{{ $t('settings.title') }}</h1>
    <p>{{ $t('settings.description') }}</p>
    
    <!-- Placeholder content -->
    <!-- In general we want to build an info view of all possible admin settings of the application.
    We should use PrimeVue4 to scaffold a combination list that toggles features in the app.
    It should be data driven using our models related to "settings" ona  global.-->

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
.settings-view {
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