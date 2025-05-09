<template>
  <div class="inventory-view">
    <InventoryDashboardView />
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';
import InventoryDashboardView from '../components/inventory/inventory-dashboard-view.vue';

const { t } = useI18n();
</script>

<style scoped>
.inventory-view {
  padding: var(--spacing-lg);
}
</style>
