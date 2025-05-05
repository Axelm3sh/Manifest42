<script setup lang="ts">
import {onMounted} from 'vue'
import {useI18n} from 'vue-i18n'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import ConfirmDialog from 'primevue/confirmdialog'
import {useConfirm} from 'primevue/useconfirm'
import {useApprovalsStore} from '@/stores/approvals'

const {t} = useI18n()
const store = useApprovalsStore()
const confirm = useConfirm()

onMounted(() => store.startMockFeed())      // live demo stream

</script>

<template>
  <h1 class="mb-2">{{ t('approvals.title') }}</h1>
  <p class="mb-4">{{ t('approvals.description') }}</p>

  <!-- PENDING LIST -->
  <h3 class="mb-3">
    {{ t('approvals.pending_approvals') }}
    <Tag severity="warning" :value="store.pendingCount" class="ml-2"/>
  </h3>

  <DataTable :value="store.pending" dataKey="id" class="mb-6"
             :scrollable="true" scrollHeight="240px" responsiveLayout="scroll">
    <Column field="id" :header="t('common.id')" style="width:10rem"/>
    <Column field="requester" :header="t('approvals.requester')"/>
    <Column field="item" :header="t('approvals.item')"/>
    <Column field="qty" :header="t('approvals.qty')" style="width:6rem"/>
    <Column field="requestedAt" :header="t('approvals.time')" style="width:7rem">
      <template #body="{ data }">
        {{ new Date(data.requestedAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) }}
      </template>
    </Column>
    <Column :header="t('approvals.actions')" style="width:11rem">
      <template #body="{ data }">
        <Button size="small" severity="success" icon="pi pi-check"
                @click="store.approve(data.id)"/>
        <Button size="small" severity="danger" icon="pi pi-times" class="ml-2"
                @click="confirm.require({
                     message: t('approvals.confirm_reject'),
                     accept: () => store.reject(data.id)
                 })"/>
      </template>
    </Column>
  </DataTable>

  <!-- HISTORY -->
  <h3 class="mb-3">{{ t('approvals.approval_history') }}</h3>
  <DataTable :value="store.history"
             dataKey="id"
             :scrollable="true"
             scrollHeight="200px"
             responsiveLayout="scroll">
    <Column field="id" :header="t('common.id')" style="width:10rem"/>
    <Column field="requester" :header="t('approvals.requester')"/>
    <Column field="item" :header="t('approvals.item')"/>
    <Column field="qty" :header="t('approvals.qty')" style="width:6rem"/>
    <Column field="requestedAt" :header="t('approvals.time')" style="width:7rem">
      <template #body="{ data }">
        {{ new Date(data.requestedAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) }}
      </template>
    </Column>
    <Column field="status" :header="t('approvals.status')" style="width:8rem">
      <template #body="{ data }">
        <Tag :severity="data.status === 'approved' ? 'success' : 'danger'"
             :value="t(`approvals.${data.status}`)"/>
      </template>
    </Column>
  </DataTable>

  <ConfirmDialog></ConfirmDialog>
</template>

<style scoped>
/* Lara handles most spacing – tweak headers for compactness */
h3 {
  font-weight: 600;
}
</style>