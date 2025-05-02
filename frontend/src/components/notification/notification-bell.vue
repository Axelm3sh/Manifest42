<script setup>
import Badge from 'primevue/badge';

defineProps({
  unreadCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['toggle']);

const toggleNotificationCenter = () => {
  emit('toggle');
};
</script>

<template>
  <button 
    @click="toggleNotificationCenter" 
    class="relative bg-transparent border-0 text-2xl cursor-pointer p-2 rounded-full transition-colors hover:bg-gray-100 focus:outline-none"
    :class="{ 'animate-pulse': unreadCount > 0 }"
    aria-label="Toggle notification center"
  >
    <i class="pi pi-bell"></i>
    <Badge v-if="unreadCount > 0" :value="unreadCount" class="absolute -top-1 -right-1"></Badge>
  </button>
</template>

<style scoped>
/* Animation is now handled by Tailwind's animate-pulse class */
</style>
