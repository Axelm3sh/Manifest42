import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {Approval, ApprovalId, InventoryItemId, ISODateString, RestockRequestId, UserId} from '@/../shared/data-models'
import {useNotificationsStore} from '@/stores/notifications'

/* ────────────────────────────────────────────────────────────
 * Constant pools / helpers
 * ────────────────────────────────────────────────────────── */

const _urgencies = ['low', 'medium', 'high'] as const
const _roles = ['Supervisor', 'Lead', 'QA', 'Manager'] as const
const _warehouses = ['WH-EAST', 'WH-WEST', 'WH-NORTH', 'WH-SOUTH'] as const

// Fake names, items & reasons (kept global so generators can use them)
const _requesters = [
    'Alice', 'Bob', 'Carlos', 'Dana', 'Eva', 'Frank', 'Giulia', 'Hiro',
    'Isabelle', 'Jakub', 'Liam', 'Mona', 'Nina', 'Omar', 'Priya', 'Quentin',
    'Rosa', 'Sam', 'Tina', 'Ulrich', "Patrick Star"
]

const _items = [
    'Laptops', 'Smartphones', 'Keyboards', 'Mice', 'Monitors', 'Desk Chairs',
    'USB Hubs', 'Docking Stations', '3D Printers', 'Coffee Machines',
    'Label Makers', 'Flash Drives', 'Servers', 'Network Switches',
    'External HDDs', 'Projectors', 'Office Plants', 'Standing Desks',
    'Conference Phones', 'Tablets', 'Printers', 'VR Headsets', "Magic Conch Shells"
]

const _reasons = [
    'Restocking after heavy sales', 'Replacement for broken units',
    'New team ramp-up', 'Pilot project needs', 'Refresh cycle',
    'Urgent customer delivery', 'Quarterly upgrade', 'Lost in transit',
    'Warranty exchange', 'Special event setup', 'Seasonal increase',
    'Mismatched inventory', 'Returned goods replacement', "Dog ate my homework"
]

function randomOf<T extends readonly unknown[]>(arr: T): T[number] {
    return arr[Math.floor(Math.random() * arr.length)]
}

/* ────────────────────────────────────────────────────────────
 * Types
 * ────────────────────────────────────────────────────────── */

/**
 * UI-oriented restock request model.
 * Extends the backend RestockRequest shape and keeps a few extra
 * fields used only by the frontend (reason, urgency, etc.).
 */
export interface ApprovalRequest {
    id: RestockRequestId
    itemId: InventoryItemId
    quantityRequested: number
    requestedBy: UserId
    createdAt: ISODateString
    status: 'Pending' | 'Approved' | 'Rejected'
    approvals: Approval[]
    // Front-end-only helpers
    reason?: string
    urgency?: (typeof _urgencies)[number]
    warehouseId?: (typeof _warehouses)[number]
}

/* ────────────────────────────────────────────────────────────
 * Fake-data factories
 * ────────────────────────────────────────────────────────── */

function makeFakeApproval(restockId: RestockRequestId): Approval {
    return {
        id: `APP-${crypto.randomUUID()}` as ApprovalId,
        restockRequestId: restockId,
        approverId: `user-${Math.ceil(Math.random() * 300)}` as UserId,
        role: randomOf(_roles),
        status: Math.random() > 0.5 ? 'Approved' : 'Rejected',
        decisionAt: new Date(Date.now() - Math.random() * 3_600_000).toISOString() as ISODateString
    }
}

function makeFakeRequest(seq = 0): ApprovalRequest {
    const id = `RR-${Date.now()}-${seq}` as RestockRequestId
    const item = `INV-${Math.floor(Math.random() * 5000)}` as InventoryItemId

    // 0-2 prior approvals
    const approvalsSeed = Array.from(
        {length: Math.floor(Math.random() * 3)},
        () => makeFakeApproval(id)
    )

    return {
        id,
        itemId: item,
        quantityRequested: 1 + Math.floor(Math.random() * 100),
        requestedBy: randomOf(_requesters).toLowerCase() as UserId,
        createdAt: new Date().toISOString() as ISODateString,
        status: 'Pending',
        approvals: approvalsSeed,
        reason: randomOf(_reasons),
        urgency: randomOf(_urgencies),
        warehouseId: randomOf(_warehouses)
    }
}

/* ────────────────────────────────────────────────────────────
 * Pinia store
 * ────────────────────────────────────────────────────────── */

export const useApprovalsStore = defineStore('approvals', () => {
    const pending = ref<ApprovalRequest[]>([])
    const history = ref<ApprovalRequest[]>([])

    const pendingCount = computed(() => pending.value.length)

    // ------------------------------ mutations ------------------------------
    function _move(id: string, newStatus: 'Approved' | 'Rejected') {
        const idx = pending.value.findIndex(r => r.id === id)
        if (idx === -1) return

        const old = pending.value[idx]

        const managerDecision: Approval = {
            id: `APP-${crypto.randomUUID()}` as ApprovalId,
            restockRequestId: old.id,
            approverId: 'user-1' as UserId,  // TODO: pull from auth store
            role: 'Manager',
            status: newStatus,
            decisionAt: new Date().toISOString() as ISODateString
        }

        const req: ApprovalRequest = {
            ...old,
            status: newStatus,
            approvals: [managerDecision, ...old.approvals] // prepend newest first
        }

        pending.value.splice(idx, 1)
        history.value.push(req) // Push to end instead of unshift to beginning
    }

    function approve(id: string) {
        _move(id, 'Approved')
    }

    function reject(id: string) {
        _move(id, 'Rejected')
    }

    // ------------------------------ mock feed ------------------------------

    function startMockFeed() {
        const notif = useNotificationsStore()
        const minDelay = 2000  // 2 s fastest
        const maxDelay = 60000  // 60 s slowest
        let current = 30000  // initial: 30 s

        function scheduleNext() {
            setTimeout(() => {
                const req = makeFakeRequest()
                pending.value.unshift(req)

                // Sort pending items by urgency (high to low)
                pending.value.sort((a, b) => {
                    const urgencyOrder = { high: 0, medium: 1, low: 2 }
                    return (urgencyOrder[a.urgency || 'low'] || 2) - (urgencyOrder[b.urgency || 'low'] || 2)
                })

                notif.addNotification({
                    message: `New approval request ${req.id} (${req.urgency?.toUpperCase()})`,
                    type: req.urgency === 'high' ? 'warning' : 'info',
                    category: 'inventory'
                })

                // Dynamically adjust delay
                current = pending.value.length === 0
                    ? Math.max(minDelay, Math.floor(current * 0.5))   // speed up
                    : Math.min(maxDelay, Math.floor(current * 1.15))  // slow down

                scheduleNext()
            }, current)
        }

        scheduleNext()
    }

    // init UI so doesn't look empty
    for (let i = 0; i < 7; i++) {
        pending.value.push(makeFakeRequest(i))
    }

    // Sort initial pending items by urgency (high to low)
    pending.value.sort((a, b) => {
        const urgencyOrder = { high: 0, medium: 1, low: 2 }
        return (urgencyOrder[a.urgency || 'low'] || 2) - (urgencyOrder[b.urgency || 'low'] || 2)
    })

    return {
        pending,
        history,
        pendingCount,
        approve,
        reject,
        startMockFeed
    }
})
