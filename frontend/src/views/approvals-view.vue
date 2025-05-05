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
import {Timeline} from "primevue";

const {t} = useI18n()
const store = useApprovalsStore()
const confirm = useConfirm()

onMounted(() => store.startMockFeed())

/** Normalize any casing → mapped PrimeVue tag config */
function statusTag(raw: string) {
  const s = raw.toLowerCase()
  switch (s) {
    case 'approved':
      return {severity: 'success', label: t('approvals.approved')}
    case 'rejected':
      return {severity: 'danger', label: t('approvals.rejected')}
    default:
      return {severity: 'warning', label: t(`approvals.${s}`)}
  }
}

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

  <!-- Pending table – scroll on desktop, stack on mobile -->
  <DataTable :value="store.pending"
             dataKey="id"
             class="mb-6 approvals-table"
             :scrollable="true"
             scrollHeight="300px"
             responsiveLayout="stack">
    <Column field="id" :header="t('common.id')" style="width:10rem"/>
    <Column field="requestedBy" :header="t('approvals.requester')"/>
    <Column field="itemId" :header="t('approvals.item_id')"/>
    <Column field="quantityRequested" :header="t('approvals.qty')" style="width:6rem"/>
    <Column field="reason"
            :header="t('approvals.reason')"
            style="width:25%"/>
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
        <Button
            size="small"
            severity="danger"
            icon="pi pi-times"
            class="ml-2"
            @click="confirm.require({
            message: t('approvals.confirm_reject'),
            accept: () => store.reject(data.id),
            acceptLabel: t('common.yes'),
            rejectLabel: t('common.no'),
            acceptClass: 'p-button-danger', // Red for reject
            rejectClass: 'p-button-secondary' // Grey (or 'p-button-success' for green, but here secondary is clearer)
          })"
        />
      </template>
    </Column>
  </DataTable>

  <!-- HISTORY -->
  <h3 class="mb-3">{{ t('approvals.approval_history') }}</h3>
  <DataTable :value="store.history"
             dataKey="id"
             class="approvals-table"
             :scrollable="true"
             scrollHeight="250px"
             responsiveLayout="stack">
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
        <Tag
            :severity="statusTag(data.status).severity"
            :value="statusTag(data.status).label"
        />
      </template>
    </Column>
    <!-- …inside the HISTORY DataTable … -->
    <Column field="approvals" :header="t('approvals.decisions')" style="width:15rem">
      <template #body="{ data }">
        <Timeline :value="data.approvals" class="p-0">
          <template #content="{ item: d }">
            <div class="d-flex align-items-center">
              <Tag
                  :severity="statusTag(d.status).severity"
                  :value="statusTag(d.status).label"
              />
              <span class="ml-1">{{ d.role }}</span>
              <span v-if="d.decisionAt" class="ml-1 text-500 text-xs">
                {{ new Date(d.decisionAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) }}
              </span>
            </div>
          </template>
          <template #opposite></template>
          <template #marker="{ item: d, index }">
            <span :class="`p-timeline-event-marker-${statusTag(d.status).severity}`">
              <i class="pi pi-clock"></i>
            </span>
            <Tag
                v-if="index === 0"
                :value="t('approvals.latest')"
                severity="info"
                class="ml-2 p-tag-sm"
            />
          </template>
        </Timeline>
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

/* ----------  mobile tweaks  ---------- */
@media (max-width: 768px) {
  .approvals-table :deep(.p-datatable-scrollable-body) {
    /* let the body decide its own height on phones */
    max-height: 70vh;
  }

  /* each stacked row becomes a card‑like block with a light border */
  .approvals-table :deep(.p-datatable-tt) {
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-sm);
    margin-bottom: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-surface);
  }

  /* column headers inside stacked cards – bold & tiny */
  .approvals-table :deep(.p-column-title) {
    font-weight: 600;
    font-size: var(--font-size-xs);
    margin-right: 0.5rem;
    color: var(--color-text-secondary);
  }

  /* action buttons wrap nicely */
  .approvals-table :deep(td:last-child) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
}
</style>