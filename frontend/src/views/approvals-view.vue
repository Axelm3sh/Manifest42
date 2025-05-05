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

onMounted(() => store.startMockFeed())

function urgencyTag(urgency?: string) {
  switch (urgency) {
    case 'high':
      return {severity: 'danger', label: t('approvals.urgency_high')}
    case 'medium':
      return {severity: 'warning', label: t('approvals.urgency_medium')}
    case 'low':
      return {severity: 'info', label: t('approvals.urgency_low')}
    default:
      return {severity: 'secondary', label: '-'}
  }
}
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
             :scrollable="true" scrollHeight="300px" responsiveLayout="scroll">
    <Column field="id" :header="t('common.id')" style="width:10rem"/>
    <Column field="requestedBy" :header="t('approvals.requester')"/>
    <Column field="itemId" :header="t('approvals.item_id')"/>
    <Column field="quantityRequested" :header="t('approvals.qty')" style="width:6rem"/>
    <Column field="reason" :header="t('approvals.reason')" style="width:15rem"/>
    <Column field="urgency" :header="t('approvals.urgency')" style="width:8rem">
      <template #body="{ data }">
        <Tag :severity="urgencyTag(data.urgency).severity" :value="urgencyTag(data.urgency).label"/>
      </template>
    </Column>
    <Column field="createdAt" :header="t('approvals.time')" style="width:7rem">
      <template #body="{ data }">
        {{ new Date(data.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) }}
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
             scrollHeight="250px"
             responsiveLayout="scroll">
    <Column field="id" :header="t('common.id')" style="width:10rem"/>
    <Column field="requestedBy" :header="t('approvals.requester')"/>
    <Column field="itemId" :header="t('approvals.item_id')"/>
    <Column field="quantityRequested" :header="t('approvals.qty')" style="width:6rem"/>
    <Column field="reason" :header="t('approvals.reason')" style="width:15rem"/>
    <Column field="urgency" :header="t('approvals.urgency')" style="width:8rem">
      <template #body="{ data }">
        <Tag :severity="urgencyTag(data.urgency).severity" :value="urgencyTag(data.urgency).label"/>
      </template>
    </Column>
    <Column field="createdAt" :header="t('approvals.time')" style="width:7rem">
      <template #body="{ data }">
        {{ new Date(data.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) }}
      </template>
    </Column>
    <Column field="status" :header="t('approvals.status')" style="width:8rem">
      <template #body="{ data }">
        <Tag :severity="data.status === 'Approved' ? 'success' : data.status === 'Rejected' ? 'danger' : 'warning'"
             :value="t(`approvals.${data.status.toLowerCase()}`)"/>
      </template>
    </Column>
    <Column field="approvals" :header="t('approvals.decisions')" style="width:15rem">
      <template #body="{ data }">
        <ul class="p-0 m-0" style="list-style:none;">
          <li v-for="decision in data.approvals" :key="decision.id">
            <Tag :severity="decision.status === 'Approved' ? 'success' : 'danger'" :value="decision.status"/>
            <span class="ml-1">{{
                decision.role
              }} {{ decision.decisionAt && '(' + new Date(decision.decisionAt).toLocaleTimeString() + ')' }}</span>
          </li>
        </ul>
      </template>
    </Column>
  </DataTable>

  <ConfirmDialog></ConfirmDialog>
</template>

<style scoped>
h3 {
  font-weight: 600;
}

/* Add a little compactness for reason/decision lists */
ul {
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 0.2em;
}
</style>