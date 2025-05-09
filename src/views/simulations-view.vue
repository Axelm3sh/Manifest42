<template>
  <div class="simulations-view">
    <h1>{{ $t('simulations.title') }}</h1>
    <p>{{ $t('simulations.description') }}</p>

    <SimulationControlsView />
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';
import SimulationControlsView from '../components/simulation/simulation-controls-view.vue';

const { t } = useI18n();
</script>

<style scoped>
.simulations-view {
  padding: var(--spacing-lg);
}
</style>
