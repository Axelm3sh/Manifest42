<!-- src/components/base/base-card.vue -->
<script setup lang="ts">
import Card from 'primevue/card';

defineOptions({
  components: {Card}
})

defineProps({
  /** Optional title rendered in the header slot */
  title: {
    type: String,
    default: ''
  },
  /** Remove default padding inside the body/content area */
  noPadding: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <Card :class="[{ 'p-p-0': noPadding }, 'base-card']">
    <!-- HEADER  ------------------------------------------->
    <template #header>
      <div v-if="title || $slots.header"
           class="card-header p-d-flex p-jc-between p-ai-center">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
        <slot name="header" />
      </div>
    </template>

    <!-- CONTENT (default slot) ---------------------------->
    <template #content>
      <div :class="['card-body', { 'p-p-0': noPadding }]">
        <slot />
      </div>
    </template>

    <!-- FOOTER  ------------------------------------------->
    <template #footer v-if="$slots.footer">
      <div class="card-footer">
        <slot name="footer" />
      </div>
    </template>
  </Card>
</template>

<style scoped>
.card-header {
  padding: var(--spacing-md);
  border-bottom: var(--border-width-thin) solid var(--color-border);
}

.card-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.card-body { padding: var(--spacing-md); }

.card-footer {
  padding: var(--spacing-md);
  border-top: var(--border-width-thin) solid var(--color-border);
}
</style>
