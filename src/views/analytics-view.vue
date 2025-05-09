<template>
  <div class="analytics-view">
    <h1>{{ $t('analytics.title') }}</h1>
    <p>{{ $t('analytics.description') }}</p>

    <AiInsightsDashboardView />
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';
import AiInsightsDashboardView from '../components/ai-insights/ai-insights-dashboard-view.vue';

const { t } = useI18n();
</script>

<style scoped>
.analytics-view {
  padding: var(--spacing-lg);
}
</style>
