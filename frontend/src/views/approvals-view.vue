<script setup lang="ts">
import {computed, nextTick, onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import Popover from 'primevue/popover'
import VirtualScroller from 'primevue/virtualscroller'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Timeline from 'primevue/timeline'
import type {ApprovalRequest} from '@/stores/approvals'
import {useApprovalsStore} from '@/stores/approvals'

const {t} = useI18n()
const store = useApprovalsStore()

const selectedId = ref<string | null>(null)
const historyPanel = ref<InstanceType<typeof Popover> | null>(null)
const historyRow = ref<ApprovalRequest | null>(null)

onMounted(() => {
  store.startMockFeed()
  // Auto-select first row when landing
  if (store.pending.length) selectedId.value = store.pending[0].id
})

// Re-select next item after approval/rejection
function approve() {
  if (!selected.value) return
  store.approve(selected.value.id)
  nextTick(() => (selectedId.value = store.pending[0]?.id ?? null))
}

function reject() {
  if (!selected.value) return
  store.reject(selected.value.id)
  nextTick(() => (selectedId.value = store.pending[0]?.id ?? null))
}

// Helper functions
function showHistory(ev: MouseEvent | KeyboardEvent, row: ApprovalRequest) {
  historyRow.value = row
  historyPanel.value?.toggle(ev)
}

function urgencyColor(u?: string) {
  return {high: 'var(--red-500)', medium: 'var(--orange-400)', low: 'var(--blue-400)'}[u ?? 'low']
}

function quantitySize(qty: number) {
  return `${Math.min(28, 14 + qty)}px`
}

// Maps urgency to PrimeVue severity colour
function urgencySeverity(u: 'high' | 'medium' | 'low') {
  return u === 'high' ? 'danger'
      : u === 'medium' ? 'warning'
          : 'info'
}

// Merge history and pending for infinite scroll
const allRows = computed<ApprovalRequest[]>(() => [
  ...store.history,
  ...store.pending
])

const selected = computed(() =>
    allRows.value.find(r => r.id === selectedId.value) ?? null
)
</script>

<template>
  <h1 class="mb-4">{{ t('approvals.title') }}</h1>

  <div class="approvals-layout">
    <!-- LEFT PANE ──────────────────────────────────────── -->
    <aside class="left-pane">
      <VirtualScroller
          :items="allRows"
          :itemSize="72"
          class="scroller"
          showLoader
      >
        <template #item="{ item }">
          <div
              role="button"
              tabindex="0"
              :class="['request-row', { active: item.id === selectedId }]"
              :data-urgency="item.urgency"
              :data-status="item.status"
              @click="selectedId = item.id"
              @contextmenu.prevent="showHistory($event, item)"
              @keydown.enter="selectedId = item.id"
          >
            <div class="id">{{ item.id }}</div>
            <div class="meta">
              <span class="item">{{ item.itemId }}</span>
              <span class="qty" aria-label="Quantity {{ item.quantityRequested }}">{{ item.quantityRequested }}</span>
              <button
                  type="button"
                  class="history-btn p-button p-button-text p-button-sm"
                  aria-label="{{ t('approvals.history_for', { id: item.id }) }}"
                  @click.stop="showHistory($event, item)"
                  @keydown.enter.stop="showHistory($event, item)"
              >
                <i class="pi pi-history"></i>
              </button>
            </div>
          </div>
        </template>
      </VirtualScroller>

      <!-- QUICK HISTORY POPOVER -->
      <Popover
          ref="historyPanel"
          role="dialog"
          aria-modal="false"
          appendTo="body"
      >
        <div id="history-title" class="mb-2">{{ t('approvals.approval_history') }}</div>
        <Timeline :value="historyRow?.approvals ?? []" class="p-0">
          <template #content="{ item }">
            <Tag :severity="item.status.toLowerCase()" :value="item.role"/>
            <span class="ml-1 text-xs">{{ new Date(item.decisionAt).toLocaleString() }}</span>
          </template>
          <template #opposite/>
          <template #marker="{ item }">
            <i :class="['pi',
                    item.status === 'Approved' ? 'pi-check'
                  : item.status === 'Rejected' ? 'pi-times'
                  : 'pi-clock']"/>
          </template>
        </Timeline>
      </Popover>
    </aside>

    <!-- RIGHT PANE ─────────────────────────────────────── -->
    <section v-if="selected" class="right-pane">
      <h2 class="sr-only">{{ t('approvals.details_for', {id: selected.id}) }}</h2>
      <h3 class="mb-3">{{ t('approvals.details_for', {id: selected.id}) }}</h3>

      <dl class="meta-list">
        <dt>{{ t('approvals.requester') }}</dt>
        <dd>{{ selected.requestedBy }}</dd>
        <dt>{{ t('approvals.item_id') }}</dt>
        <dd>{{ selected.itemId }}</dd>
        <dt>{{ t('approvals.qty') }}</dt>
        <dd>{{ selected.quantityRequested }}</dd>
        <dt>{{ t('approvals.reason') }}</dt>
        <dd>{{ selected.reason }}</dd>
        <dt>{{ t('approvals.urgency') }}</dt>
        <dd>
          <Tag
              :value="t(`approvals.urgency_${selected.urgency}`)"
              :severity="urgencySeverity(selected.urgency)"
          />
        </dd>
      </dl>

      <!-- approval chain -->
      <h4 class="mt-5 mb-3">{{ t('approvals.decisions') }}</h4>
      <Timeline
          :value="selected.approvals"
          layout="vertical"
          align="left"
      >
        <template #content="{ item }">
          <Tag
              :severity="item.status === 'Approved' ? 'success'
                       : item.status === 'Rejected' ? 'danger'
                       : 'warning'"
              :value="item.role"
              class="mr-2"
          />
          <span>{{ t(`approvals.${item.status.toLowerCase()}`) }}</span>
          <span v-if="item.decisionAt" class="ml-2 text-xs text-500">
            {{ new Date(item.decisionAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) }}
          </span>
        </template>
        <template #opposite/>
        <template #marker="{ item }">
          <span
              class="pi"
              :class="item.status === 'Approved' ? 'pi-check-circle text-green-500'
                    : item.status === 'Rejected' ? 'pi-times-circle text-red-400'
                    : 'pi-clock text-500'"
          />
        </template>
      </Timeline>

      <!-- actions -->
      <div class="actions mt-6">
        <Button
            severity="success"
            icon="pi pi-check"
            size="large"
            :label="t('approvals.approve_btn')"
            @click="approve()"
        />
        <Button
            severity="danger"
            icon="pi pi-times"
            size="large"
            :label="t('approvals.reject_btn')"
            class="ml-3"
            @click="reject()"
        />
      </div>
    </section>

    <!-- placeholder when nothing is selected -->
    <section v-else class="right-pane placeholder">
      <span class="text-500">{{ t('approvals.select_request') }}</span>
    </section>
  </div>
</template>

<style scoped>
.meta-list {
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: .5rem;
  row-gap: .25rem;
}

.meta-list dt {
  font-weight: 600;
}

.meta-list dd {
  margin: 0;
}

.p-timeline-event-connector {
  background: var(--color-primary) !important;
  width: 2px;
}

.approvals-layout {
  display: flex;
  height: calc(100vh - 8rem);
}

.left-pane {
  width: 340px;
  border-right: 1px solid var(--color-border);
  overflow: hidden;
}

.scroller {
  height: 100%;
}

.request-row {
  cursor: pointer;
  padding: .75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  transition: background .15s;
  position: relative;
}

.request-row.active,
.request-row:hover {
  background: var(--surface-hover);
}

.request-row::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: currentColor;
}

.request-row[data-urgency='high'] {
  color: var(--color-danger);
}

.request-row[data-urgency='medium'] {
  color: var(--color-warning);
}

.request-row[data-urgency='low'] {
  color: var(--color-info);
}

/* left‐pane list: fade out anything not Pending */
.request-row[data-status="Approved"],
.request-row[data-status="Rejected"] {
  opacity: 0.5;
  background-color: var(--color-shadow-dark);
}

.request-row .meta {
  display: flex;
  align-items: center;
  gap: .5rem;
}

.qty {
  font-size: .75rem;
  background: var(--color-surface-active);
  padding: 0 .4rem;
  border-radius: 4px;
}

.urgency-dot {
  border-radius: 50%;
}

.right-pane {
  flex: 1 1 auto;
  padding: 1.5rem 2rem;
  overflow-y: auto;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.actions :deep(.p-button) {
  min-width: 9rem;
}
</style>