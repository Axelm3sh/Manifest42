import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {Approval, ApprovalId, InventoryItemId, ISODateString, RestockRequestId, UserId} from '@/../shared/data-models'
import {useNotificationsStore} from '@/stores/notifications'

/**
 * UI-oriented restock request model.
 * Extends the backend RestockRequest shape and keeps a few extra fields
 * used only by the frontend (reason, urgency).
 */
export interface ApprovalRequest {
    id: RestockRequestId
    itemId: InventoryItemId
    quantityRequested: number
    requestedBy: UserId
    createdAt: ISODateString
    status: 'Pending' | 'Approved' | 'Rejected'
    approvals: Approval[] // approver decisions
    // Front-end only helpers
    reason?: string
    urgency?: 'low' | 'medium' | 'high'
}

const _urgencies = ['low', 'medium', 'high'] as const

function makeFakeApproval(): Approval {
    return {
        id: `APP-${crypto.randomUUID()}` as ApprovalId,
        restockRequestId: 'fake' as RestockRequestId,
        approverId: 'user-1' as UserId,
        role: 'Manager',
        status: Math.random() > 0.5 ? 'Approved' : 'Rejected',
        decisionAt: new Date().toISOString() as ISODateString
    }
}

function makeFakeRequest(seq = 0): ApprovalRequest {
    return {
        id: (`RR-${Date.now()}-${seq}`) as RestockRequestId,
        itemId: (`INV-${Math.floor(Math.random() * 5000)}`) as InventoryItemId,
        quantityRequested: 1 + Math.floor(Math.random() * 100),
        requestedBy: 'user-123' as UserId,
        createdAt: new Date().toISOString() as ISODateString,
        status: 'Pending',
        approvals: [makeFakeApproval()],
        reason: Math.random() > 0.4 ? 'Restocking sample data' : undefined,
        urgency: _urgencies[Math.floor(Math.random() * _urgencies.length)]
    }
}

export const useApprovalsStore = defineStore('approvals', () => {
    const pending = ref<ApprovalRequest[]>([])
    const history = ref<ApprovalRequest[]>([])

    const pendingCount = computed(() => pending.value.length)

    // FUN MOCK DATA
    const _requesters = [
        'Alice', 'Bob', 'Carlos', 'Dana', 'Eva', 'Frank', 'Giulia', 'Hiro',
        'Isabelle', 'Jakub', 'Liam', 'Mona', 'Nina', 'Omar', 'Priya', 'Quentin', 'Rosa', 'Sam', 'Tina', 'Ulrich'
    ]
    const _items = [
        'Laptops', 'Smartphones', 'Keyboards', 'Mice', 'Monitors', 'Desk Chairs',
        'USB Hubs', 'Docking Stations', '3D Printers', 'Coffee Machines', 'Label Makers',
        'Flash Drives', 'Servers', 'Network Switches', 'External HDDs', 'Projectors',
        'Office Plants', 'Standing Desks', 'Conference Phones', 'Tablets', 'Printers', 'VR Headsets'
    ]
    const _reasons = [
        'Restocking after heavy sales', 'Replacement for broken units', 'New team ramp-up',
        'Pilot project needs', 'Refresh cycle', 'Urgent customer delivery',
        'Quarterly upgrade', 'Lost in transit', 'Warranty exchange', 'Special event setup',
        'Seasonal increase', 'Mismatched inventory', 'Returned goods replacement'
    ]

    function _move(id: string, newStatus: 'approved' | 'rejected') {
        const idx = pending.value.findIndex(r => r.id === id)
        if (idx === -1) return
        const req = {...pending.value[idx], status: newStatus}
        pending.value.splice(idx, 1)
        history.value.unshift(req)
    }

    function approve(id: string) {
        _move(id, 'approved')
    }

    function reject(id: string) {
        _move(id, 'rejected')
    }

    function startMockFeed() {
        const notif = useNotificationsStore()
        let baseDelay = 30000 // initial value: 30s
        const minDelay = 2000 // 2s fastest
        const maxDelay = 60000 // 60s slowest
        let currentDelay = baseDelay

        function scheduleNext() {
            setTimeout(() => {
                const req = makeFakeRequest()
                pending.value.unshift(req)
                notif.addNotification({
                    message: `New approval request for ${req.item} (${req.urgency?.toUpperCase()})`,
                    type: req.urgency === 'high' ? 'warning' : 'info',
                    category: 'inventory'
                })

                // Adjust delay: Speed up (halve delay) if queue empty, else slow to max/min
                if (pending.value.length === 0) {
                    currentDelay = Math.max(minDelay, Math.floor(currentDelay * 0.5))
                } else {
                    currentDelay = Math.min(maxDelay, Math.floor(currentDelay * 1.15)) // Slight increase
                }
                scheduleNext()
            }, currentDelay)
        }

        scheduleNext()
    }

    // Seed some mock data for dev
    for (let i = 0; i < 7; i++) {
        pending.value.push(makeFakeRequest(i))
    }

    return {pending, history, pendingCount, approve, reject, startMockFeed}
})