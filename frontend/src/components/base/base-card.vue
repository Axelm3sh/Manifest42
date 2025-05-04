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
  padding: 1rem;
  border-bottom: 1px solid var(--color-surface);
}

.card-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
}

.card-body { padding: 1rem; }

.card-footer {
  padding: 1rem;
  border-top: 1px solid var(--surface-border);
}

/* Make hover / focus shadows optional if you still want them */
.base-card:hover {
  box-shadow: var(--card-shadow);
}
</style>
