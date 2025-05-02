<script setup>
import {computed, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import FormContainer from '../base/form-container.vue';
import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import ModalDialog from '../base/modal-dialog.vue';

const { t } = useI18n();

const props = defineProps({
  activeTab: {
    type: String,
    default: 'all'
  },
  notifications: {
    type: Array,
    default: () => []
  },
  notificationsByType: {
    type: Object,
    default: () => ({})
  },
  notificationsByDate: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['markAsRead', 'dismiss', 'executeAction', 'clearAll']);

// Reactive state
const showActionModal = ref(false);
const selectedNotification = ref(null);
const selectedAction = ref(null);

// Computed properties
const filteredNotifications = computed(() => {
  if (props.activeTab === 'all') {
    return props.notifications;
  } else {
    return props.notificationsByType[props.activeTab] || [];
  }
});

// Methods
const markAsRead = (id) => {
  emit('markAsRead', id);
};

const dismissNotification = (id, event) => {
  if (event) {
    event.stopPropagation();
  }
  emit('dismiss', id, event);
};

const openActionModal = (notification, action) => {
  selectedNotification.value = notification;
  selectedAction.value = action;
  showActionModal.value = true;
};

const confirmAction = () => {
  if (selectedNotification.value && selectedAction.value) {
    emit('executeAction', selectedNotification.value, selectedAction.value);
  }
  showActionModal.value = false;
};

const cancelAction = () => {
  showActionModal.value = false;
};

const clearAllNotifications = () => {
  emit('clearAll');
};

// Helper methods
const getNotificationTypeIcon = (type) => {
  const typeMap = {
    info: 'pi pi-info-circle',
    success: 'pi pi-check-circle',
    warning: 'pi pi-exclamation-triangle',
    error: 'pi pi-times-circle'
  };

  return typeMap[type] || typeMap.info;
};

const getNotificationTypeClass = (type) => {
  const typeMap = {
    info: 'border-l-4 border-blue-500',
    success: 'border-l-4 border-green-500',
    warning: 'border-l-4 border-yellow-500',
    error: 'border-l-4 border-red-500'
  };

  return typeMap[type] || typeMap.info;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>

<template>
  <div class="flex flex-col flex-1 overflow-y-auto p-2">
    <template v-if="filteredNotifications.length > 0">
      <template v-if="activeTab === 'all'">
        <!-- Group by date using Accordion -->
        <Accordion class="mb-4">
          <AccordionTab v-for="(group, date) in notificationsByDate" :key="date" :header="date">
            <div v-for="notification in group" :key="notification.id" class="mb-2">
              <FormContainer 
                :class="[
                  getNotificationTypeClass(notification.type),
                  { 'bg-blue-50': !notification.isRead }
                ]"
                class="cursor-pointer transform transition-transform hover:-translate-y-1"
                noPadding
                @click="markAsRead(notification.id)"
              >
                <div class="flex p-3">
                  <div class="flex items-center justify-center w-6 h-6 mr-3">
                    <i :class="getNotificationTypeIcon(notification.type)" class="text-base"></i>
                  </div>
                  <div class="flex-1">
                    <div class="font-semibold mb-1">{{ notification.title }}</div>
                    <div class="text-sm text-gray-600 mb-1">{{ notification.message }}</div>
                    <div class="text-xs text-gray-500 mb-2">{{ formatDate(notification.timestamp) }}</div>

                    <div v-if="notification.actions && notification.actions.length > 0" class="flex gap-2">
                      <Button 
                        v-for="action in notification.actions" 
                        :key="action.id"
                        @click.stop="openActionModal(notification, action)"
                        :severity="action.primary ? 'primary' : 'secondary'"
                        size="small"
                        :label="action.label"
                      />
                    </div>
                  </div>
                  <Button 
                    @click.stop="dismissNotification(notification.id, $event)" 
                    icon="pi pi-times"
                    text
                    rounded
                    aria-label="Dismiss notification"
                    class="text-gray-500 hover:text-gray-700"
                  />
                </div>
              </FormContainer>
            </div>
          </AccordionTab>
        </Accordion>
      </template>

      <template v-else>
        <!-- Filtered by type -->
        <div v-for="notification in filteredNotifications" :key="notification.id" class="mb-2">
          <FormContainer 
            :class="[
              getNotificationTypeClass(notification.type),
              { 'bg-blue-50': !notification.isRead }
            ]"
            class="cursor-pointer transform transition-transform hover:-translate-y-1"
            noPadding
            @click="markAsRead(notification.id)"
          >
            <div class="flex p-3">
              <div class="flex items-center justify-center w-6 h-6 mr-3">
                <i :class="getNotificationTypeIcon(notification.type)" class="text-base"></i>
              </div>
              <div class="flex-1">
                <div class="font-semibold mb-1">{{ notification.title }}</div>
                <div class="text-sm text-gray-600 mb-1">{{ notification.message }}</div>
                <div class="text-xs text-gray-500 mb-2">{{ formatDate(notification.timestamp) }}</div>

                <div v-if="notification.actions && notification.actions.length > 0" class="flex gap-2">
                  <Button 
                    v-for="action in notification.actions" 
                    :key="action.id"
                    @click.stop="openActionModal(notification, action)"
                    :severity="action.primary ? 'primary' : 'secondary'"
                    size="small"
                    :label="action.label"
                  />
                </div>
              </div>
              <Button 
                @click.stop="dismissNotification(notification.id, $event)" 
                icon="pi pi-times"
                text
                rounded
                aria-label="Dismiss notification"
                class="text-gray-500 hover:text-gray-700"
              />
            </div>
          </FormContainer>
        </div>
      </template>

      <div class="flex justify-center mt-4">
        <Button 
          @click="clearAllNotifications" 
          label="Clear All"
          text
          class="text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
        />
      </div>
    </template>

    <div v-else class="text-center py-8 text-gray-500 italic">
      {{ t('notifications.no_notifications') }}
    </div>

    <!-- Modal for notification actions -->
    <ModalDialog 
      v-model:visible="showActionModal"
      :header="selectedAction?.label || 'Confirm Action'"
      :modal="true"
      :closable="true"
      :dismissableMask="true"
    >
      <template #default>
        <p class="mb-4">Are you sure you want to {{ selectedAction?.label.toLowerCase() }}?</p>
      </template>
      <template #footer>
        <Button label="Cancel" @click="cancelAction" text class="mr-2" />
        <Button label="Confirm" @click="confirmAction" severity="primary" />
      </template>
    </ModalDialog>
  </div>
</template>

<style scoped>
/* All styles have been replaced with Tailwind utility classes */
</style>
