<template>
  <div class="approvals-view">
    <h1>{{ $t('approvals.title') }}</h1>
    <p>{{ $t('approvals.description') }}</p>

    <div class="implementation-notice">
      <h3>{{ $t('common.component_not_implemented') }}</h3>
      <p>{{ $t('common.implementation_notice') }}</p>
      <ul>
        <li>{{ $t('approvals.pending_approvals') }}</li>
        <li>{{ $t('approvals.approval_history') }}</li>
        <li>{{ $t('approvals.approval_actions') }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped>
.approvals-view {
  padding: var(--spacing-lg);
}

.implementation-notice {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  border: var(--border-width-thin) solid var(--color-border);
  border-left: 4px solid var(--color-warning);
}

.implementation-notice h3 {
  margin-top: 0;
  color: var(--color-warning-dark);
}

.implementation-notice ul {
  margin-top: var(--spacing-md);
  padding-left: var(--spacing-lg);
}

.implementation-notice li {
  margin-bottom: var(--spacing-sm);
}
</style>
