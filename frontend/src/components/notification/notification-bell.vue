<script setup>
import {PhBell} from 'phosphor-vue';

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
    class="notification-bell"
    :class="{ 'has-unread': unreadCount > 0 }"
    aria-label="Toggle notification center"
  >
    <PhBell weight="regular" />
    <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
  </button>
</template>

<style scoped>
.notification-bell {
  position: relative;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.notification-bell:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.notification-bell.has-unread {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.unread-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  min-width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.25rem;
}
</style>
