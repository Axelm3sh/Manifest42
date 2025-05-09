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
  nextTick(() => {
    // Find the first pending item in the sorted allRows array
    const firstPendingItem = allRows.value.find(item => item.status === 'Pending')
    selectedId.value = firstPendingItem?.id ?? null
  })
})

// Re-select next item after approval/rejection
function approve() {
  if (!selected.value) return
  store.approve(selected.value.id)
  nextTick(() => {
    // Find the first pending item in the sorted allRows array
    const nextPendingItem = allRows.value.find(item => item.status === 'Pending')
    selectedId.value = nextPendingItem?.id ?? null
  })
}

function reject() {
  if (!selected.value) return
  store.reject(selected.value.id)
  nextTick(() => {
    // Find the first pending item in the sorted allRows array
    const nextPendingItem = allRows.value.find(item => item.status === 'Pending')
    selectedId.value = nextPendingItem?.id ?? null
  })
}

// Helper functions
function showHistory(ev: MouseEvent | KeyboardEvent, row: ApprovalRequest) {
  historyRow.value = row
  historyPanel.value?.toggle(ev)
}

// Maps urgency to PrimeVue severity colour
function urgencySeverity(u: 'high' | 'medium' | 'low') {
  return u === 'high' ? 'danger'
      : u === 'medium' ? 'warning'
          : 'info'
}

// Merge history and pending for infinite scroll, sort by urgency (high to low)
const allRows = computed<ApprovalRequest[]>(() => {
  // Create a copy of the arrays to avoid modifying the original data
  const combined = [...store.history, ...store.pending]

  // Sort by urgency (high > medium > low) and push approved/rejected items to the bottom
  return combined.sort((a, b) => {
    // First, push non-pending items to the bottom
    if (a.status !== 'Pending' && b.status === 'Pending') return 1
    if (a.status === 'Pending' && b.status !== 'Pending') return -1

    // Then sort by urgency for items with the same status
    const urgencyOrder = { high: 0, medium: 1, low: 2 }
    const aUrgency = a.urgency || 'low'
    const bUrgency = b.urgency || 'low'
    return urgencyOrder[aUrgency] - urgencyOrder[bUrgency]
  })
})

const selected = computed(() =>
    allRows.value.find(r => r.id === selectedId.value) ?? null
)
</script>

<template>
  <div class="approvals-view">
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
              <div class="request-info">
                <div class="id-container">
                  <span class="id-label">ID:</span>
                  <span class="id">{{ item.id }}</span>
                </div>
                <div class="item-container">
                  <span class="item-label">Inventory:</span>
                  <span class="item">{{ item.itemId }}</span>
                  <span class="item-quantity">{{ t('approvals.item_quantity', { count: item.quantityRequested }) }}</span>
                </div>
              </div>
              <div class="meta">
                <span v-if="item.status !== 'Pending' && item.approvals.length > 0" class="last-decision">
                  <i :class="['pi', item.status === 'Approved' ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-400']"></i>
                  {{ new Date(item.approvals[0].decisionAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) }}
                </span>
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
          <div v-if="!historyRow?.approvals?.length" class="empty-history">
            <i class="pi pi-info-circle mr-2"></i>
            <span>{{ t('approvals.no_decisions_yet') || 'No decisions have been made yet' }}</span>
          </div>
          <Timeline v-else :value="historyRow?.approvals ?? []" class="p-0">
            <template #content="{ item }">
              <Tag :severity="item.status.toLowerCase()" :value="item.role"/>
              <span class="ml-1 text-xs">{{ new Date(item.decisionAt).toLocaleString() }}</span>
            </template>
            <template #opposite/>
            <template #marker="{ item }">
              <i :class="['pi',
                    item.status === 'Approved' ? 'pi-check-circle text-green-500'
                  : item.status === 'Rejected' ? 'pi-times-circle text-red-400'
                  : 'pi-clock text-blue-500']"/>
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
          <div v-if="selected.status !== 'Pending'" class="historical-notice mb-3">
            {{ t('approvals.already_processed', { status: t(`approvals.${selected.status.toLowerCase()}`) }) }}
          </div>
          <Button
              severity="success"
              icon="pi pi-check"
              size="large"
              :label="t('approvals.approve_btn')"
              @click="approve()"
              :disabled="selected.status !== 'Pending'"
          />
          <Button
              severity="danger"
              icon="pi pi-times"
              size="large"
              :label="t('approvals.reject_btn')"
              class="ml-3"
              @click="reject()"
              :disabled="selected.status !== 'Pending'"
          />
        </div>
      </section>

      <!-- placeholder when nothing is selected -->
      <section v-else class="right-pane placeholder">
        <span class="text-500">{{ t('approvals.select_request') }}</span>
      </section>
    </div>
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
  width: 380px;
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
  color: var(--text-color, var(--color-text)); /* Ensure text is visible */
}

.request-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.id-container, .item-container {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.id-label, .item-label {
  font-size: 0.75rem;
  color: var(--color-text);
  min-width: 4rem;
}

.id {
  font-weight: 600;
  color: var(--text-color);
}

.item {
  color: var(--color-text);
}

.item-quantity {
  font-size: 0.75rem;
  background: var(--surface-hover);
  color: var(--color-text-primary);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  margin-left: 0.5rem;
  display: inline-block;
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
}

.request-row[data-urgency='high']::before {
  background-color: var(--color-danger);
}

.request-row[data-urgency='medium']::before {
  background-color: var(--color-warning);
}

.request-row[data-urgency='low']::before {
  background-color: var(--color-info);
}

/* left‐pane list: fade out anything not Pending */
.request-row[data-status="Approved"],
.request-row[data-status="Rejected"] {
  opacity: 0.7; /* Increased from 0.5 for better visibility */
  background-color: var(--color-shadow-dark);
}

.request-row .meta {
  display: flex;
  align-items: flex-start;
  gap: .5rem;
  padding-top: 0.25rem;
}


.last-decision {
  font-size: .75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
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

.historical-notice {
  background-color: var(--surface-hover);
  border-left: 4px solid var(--color-warning);
  padding: 0.75rem 1rem;
  border-radius: 4px;
  color: var(--color-text-primary);
  font-weight: 500;
}

.empty-history {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--surface-hover);
  border-radius: 4px;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}
</style>
