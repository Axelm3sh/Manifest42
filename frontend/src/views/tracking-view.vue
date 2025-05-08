<script setup>
import {useI18n} from 'vue-i18n';
import {computed, onMounted, reactive} from 'vue';

const { t } = useI18n();

/*
 * Data Structure Comments:
 * 
 * We'll need to track the following state:
 * 
 * 1. List of incoming shipments (RecentShipmentSummary[])
 * 2. List of outgoing shipments (RecentShipmentSummary[])
 * 3. Currently selected shipment (if any)
 * 4. Shipment events for the selected shipment (ShipmentEvent[])
 * 5. Search query and filters
 * 
 * API endpoints needed:
 * - GET /api/shipments/incoming - List incoming shipments
 * - GET /api/shipments/outgoing - List outgoing shipments
 * - GET /api/shipments/:id - Get detailed shipment info
 * - GET /api/shipments/:id/events - Get events for a shipment
 * 
 * Relevant data models from data-models.ts:
 * - ShipmentEvent: For tracking individual shipping events
 * - RecentShipmentSummary: For shipment list items
 * - ShipmentPriority: For priority levels
 * - LogisticsKPI: For metrics like pendingShipments, inTransit, deliveredToday
 */

// State management for tracking view
const state = reactive({
  incomingShipments: [],
  outgoingShipments: [],
  selectedShipmentId: null,
  shipmentDetails: null,
  shipmentEvents: [],
  searchQuery: '',
  filters: {
    status: null,
    priority: null,
    dateRange: null
  },
  isLoading: true
});

// Computed properties
const filteredIncomingShipments = computed(() => {
  return filterShipments(state.incomingShipments);
});

const filteredOutgoingShipments = computed(() => {
  return filterShipments(state.outgoingShipments);
});

const hasSelectedShipment = computed(() => {
  return state.selectedShipmentId !== null;
});

// Methods
const filterShipments = (shipments) => {
  if (!state.searchQuery && !state.filters.status && !state.filters.priority) {
    return shipments;
  }

  return shipments.filter(shipment => {
    // Filter by search query
    const matchesQuery = !state.searchQuery || 
      shipment.shipmentId.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      shipment.locationName.toLowerCase().includes(state.searchQuery.toLowerCase());

    // Filter by status
    const matchesStatus = !state.filters.status || shipment.status === state.filters.status;

    // Filter by priority
    const matchesPriority = !state.filters.priority || shipment.priority === state.filters.priority;

    return matchesQuery && matchesStatus && matchesPriority;
  });
};

const fetchIncomingShipments = async () => {
  // Simulate API call to get incoming shipments
  await new Promise(resolve => setTimeout(resolve, 800));

  // Mock data based on RecentShipmentSummary model
  state.incomingShipments = [
    {
      shipmentId: 'SHP-1001',
      locationName: 'Central Warehouse',
      itemsCount: 15,
      priority: 'high',
      estimatedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
      status: 'Shipped'
    },
    {
      shipmentId: 'SHP-1002',
      locationName: 'East Distribution Center',
      itemsCount: 8,
      priority: 'medium',
      estimatedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
      status: 'Processing'
    }
  ];
};

const fetchOutgoingShipments = async () => {
  // Simulate API call to get outgoing shipments
  await new Promise(resolve => setTimeout(resolve, 600));

  // Mock data based on RecentShipmentSummary model
  state.outgoingShipments = [
    {
      shipmentId: 'SHP-2001',
      locationName: 'Customer: ABC Corp',
      itemsCount: 5,
      priority: 'high',
      estimatedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString(),
      status: 'Shipped'
    },
    {
      shipmentId: 'SHP-2002',
      locationName: 'West Warehouse',
      itemsCount: 12,
      priority: 'low',
      estimatedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
      status: 'Pending'
    }
  ];
};

const selectShipment = async (shipmentId) => {
  state.selectedShipmentId = shipmentId;
  await fetchShipmentDetails(shipmentId);
  await fetchShipmentEvents(shipmentId);
};

const fetchShipmentDetails = async (shipmentId) => {
  // Simulate API call to get shipment details
  await new Promise(resolve => setTimeout(resolve, 500));

  // Find the shipment in either incoming or outgoing lists
  const shipment = [...state.incomingShipments, ...state.outgoingShipments]
    .find(s => s.shipmentId === shipmentId);

  if (shipment) {
    state.shipmentDetails = {
      ...shipment,
      origin: 'Main Distribution Center',
      destination: shipment.locationName,
      carrier: 'Express Logistics',
      trackingNumber: 'TRK-' + Math.floor(Math.random() * 10000),
      notes: 'Handle with care'
    };
  }
};

const fetchShipmentEvents = async (shipmentId) => {
  // Simulate API call to get shipment events
  await new Promise(resolve => setTimeout(resolve, 700));

  // Mock data based on ShipmentEvent model
  state.shipmentEvents = [
    {
      eventId: 'EVT-1',
      shipmentId: shipmentId,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      location: 'Main Distribution Center',
      description: 'Shipment created'
    },
    {
      eventId: 'EVT-2',
      shipmentId: shipmentId,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
      location: 'Main Distribution Center',
      description: 'Shipment processed and ready for pickup'
    },
    {
      eventId: 'EVT-3',
      shipmentId: shipmentId,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      location: 'Regional Sorting Facility',
      description: 'Shipment in transit'
    }
  ];
};

const clearSelectedShipment = () => {
  state.selectedShipmentId = null;
  state.shipmentDetails = null;
  state.shipmentEvents = [];
};

const searchShipments = () => {
  // This will trigger the computed properties to re-evaluate
  console.log('Searching for:', state.searchQuery);
};

const applyFilters = (filters) => {
  state.filters = { ...state.filters, ...filters };
};

const resetFilters = () => {
  state.filters = {
    status: null,
    priority: null,
    dateRange: null
  };
};

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Load data on component mount
onMounted(async () => {
  try {
    await Promise.all([
      fetchIncomingShipments(),
      fetchOutgoingShipments()
    ]);
  } catch (error) {
    console.error('Error loading tracking data:', error);
  } finally {
    state.isLoading = false;
  }
});
</script>

<template>
  <div class="tracking-view">
    <h1>{{ $t('tracking.title') }}</h1>
    <p>{{ $t('tracking.description') }}</p>

    <!-- Loading indicator -->
    <div v-if="state.isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>{{ $t('common.loading') }}</p>
    </div>

    <div v-else>
      <!-- Tracking Search Section -->
      <div class="tracking-search">
        <div class="search-header">
          <h2>{{ $t('tracking.search_title') }}</h2>
        </div>
        <div class="search-form">
          <div class="search-input-container">
            <input 
              type="text" 
              v-model="state.searchQuery" 
              :placeholder="$t('tracking.search_placeholder')" 
              class="search-input"
              @keyup.enter="searchShipments"
            />
            <button class="search-button" @click="searchShipments">
              <i class="pi pi-search" aria-hidden="true"></i>
              {{ $t('tracking.search_button') }}
            </button>
          </div>

          <div class="filter-controls">
            <div class="filter-group">
              <label>{{ $t('tracking.filter_status') }}</label>
              <select v-model="state.filters.status" @change="searchShipments">
                <option value="">{{ $t('tracking.all_statuses') }}</option>
                <option value="Pending">{{ $t('tracking.status.pending') }}</option>
                <option value="Processing">{{ $t('tracking.status.processing') }}</option>
                <option value="Shipped">{{ $t('tracking.status.shipped') }}</option>
                <option value="Delivered">{{ $t('tracking.status.delivered') }}</option>
              </select>
            </div>

            <div class="filter-group">
              <label>{{ $t('tracking.filter_priority') }}</label>
              <select v-model="state.filters.priority" @change="searchShipments">
                <option value="">{{ $t('tracking.all_priorities') }}</option>
                <option value="high">{{ $t('tracking.priority.high') }}</option>
                <option value="medium">{{ $t('tracking.priority.medium') }}</option>
                <option value="low">{{ $t('tracking.priority.low') }}</option>
              </select>
            </div>

            <button class="reset-filters-button" @click="resetFilters">
              {{ $t('tracking.reset_filters') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Main content container -->
      <div class="tracking-content" :class="{ 'with-details': hasSelectedShipment }">
        <!-- Shipments lists container -->
        <div class="shipments-container">
          <!-- Incoming Deliveries Section -->
          <div class="incoming-deliveries">
            <h2>{{ $t('tracking.incoming_deliveries') }}</h2>

            <div v-if="filteredIncomingShipments.length === 0" class="empty-state">
              {{ $t('tracking.no_incoming_shipments') }}
            </div>

            <div v-else class="shipments-list">
              <div 
                v-for="shipment in filteredIncomingShipments" 
                :key="shipment.shipmentId" 
                class="shipment-item"
                :class="{ 'selected': shipment.shipmentId === state.selectedShipmentId }"
                @click="selectShipment(shipment.shipmentId)"
              >
                <div class="shipment-header">
                  <div class="shipment-id">{{ shipment.shipmentId }}</div>
                  <div class="shipment-status" :class="`status-${shipment.status.toLowerCase()}`">
                    {{ $t(`tracking.status.${shipment.status.toLowerCase()}`) }}
                  </div>
                </div>

                <div class="shipment-location">
                  <i class="pi pi-map-marker" aria-hidden="true"></i>
                  {{ shipment.locationName }}
                </div>

                <div class="shipment-details">
                  <div class="shipment-priority" :class="`priority-${shipment.priority}`">
                    {{ $t(`tracking.priority.${shipment.priority}`) }}
                  </div>
                  <div class="shipment-items">
                    {{ $t('tracking.items_count', { count: shipment.itemsCount }) }}
                  </div>
                </div>

                <div class="shipment-delivery">
                  <i class="pi pi-calendar" aria-hidden="true"></i>
                  {{ $t('tracking.estimated_delivery') }}: {{ formatDate(shipment.estimatedDelivery) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Outgoing Deliveries Section -->
          <div class="outgoing-deliveries">
            <h2>{{ $t('tracking.outgoing_deliveries') }}</h2>

            <div v-if="filteredOutgoingShipments.length === 0" class="empty-state">
              {{ $t('tracking.no_outgoing_shipments') }}
            </div>

            <div v-else class="shipments-list">
              <div 
                v-for="shipment in filteredOutgoingShipments" 
                :key="shipment.shipmentId" 
                class="shipment-item"
                :class="{ 'selected': shipment.shipmentId === state.selectedShipmentId }"
                @click="selectShipment(shipment.shipmentId)"
              >
                <div class="shipment-header">
                  <div class="shipment-id">{{ shipment.shipmentId }}</div>
                  <div class="shipment-status" :class="`status-${shipment.status.toLowerCase()}`">
                    {{ $t(`tracking.status.${shipment.status.toLowerCase()}`) }}
                  </div>
                </div>

                <div class="shipment-location">
                  <i class="pi pi-map-marker" aria-hidden="true"></i>
                  {{ shipment.locationName }}
                </div>

                <div class="shipment-details">
                  <div class="shipment-priority" :class="`priority-${shipment.priority}`">
                    {{ $t(`tracking.priority.${shipment.priority}`) }}
                  </div>
                  <div class="shipment-items">
                    {{ $t('tracking.items_count', { count: shipment.itemsCount }) }}
                  </div>
                </div>

                <div class="shipment-delivery">
                  <i class="pi pi-calendar" aria-hidden="true"></i>
                  {{ $t('tracking.estimated_delivery') }}: {{ formatDate(shipment.estimatedDelivery) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Shipment Detail Section -->
        <div v-if="hasSelectedShipment" class="shipment-detail">
          <div class="detail-header">
            <h2>{{ $t('tracking.shipment_details') }}</h2>
            <button class="close-details-button" @click="clearSelectedShipment">
              <i class="pi pi-times" aria-hidden="true"></i>
            </button>
          </div>

          <div v-if="state.shipmentDetails" class="detail-content">
            <div class="detail-section">
              <h3>{{ $t('tracking.shipment_info') }}</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <div class="detail-label">{{ $t('tracking.shipment_id') }}</div>
                  <div class="detail-value">{{ state.shipmentDetails.shipmentId }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">{{ $t('tracking.status') }}</div>
                  <div class="detail-value status" :class="`status-${state.shipmentDetails.status.toLowerCase()}`">
                    {{ $t(`tracking.status.${state.shipmentDetails.status.toLowerCase()}`) }}
                  </div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">{{ $t('tracking.origin') }}</div>
                  <div class="detail-value">{{ state.shipmentDetails.origin }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">{{ $t('tracking.destination') }}</div>
                  <div class="detail-value">{{ state.shipmentDetails.destination }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">{{ $t('tracking.carrier') }}</div>
                  <div class="detail-value">{{ state.shipmentDetails.carrier }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">{{ $t('tracking.tracking_number') }}</div>
                  <div class="detail-value">{{ state.shipmentDetails.trackingNumber }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">{{ $t('tracking.estimated_delivery') }}</div>
                  <div class="detail-value">{{ formatDate(state.shipmentDetails.estimatedDelivery) }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">{{ $t('tracking.items_count') }}</div>
                  <div class="detail-value">{{ state.shipmentDetails.itemsCount }}</div>
                </div>
                <div class="detail-item full-width">
                  <div class="detail-label">{{ $t('tracking.notes') }}</div>
                  <div class="detail-value">{{ state.shipmentDetails.notes }}</div>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3>{{ $t('tracking.shipment_events') }}</h3>
              <div class="events-timeline">
                <div v-for="event in state.shipmentEvents" :key="event.eventId" class="event-item">
                  <div class="event-time">{{ formatDate(event.timestamp) }}</div>
                  <div class="event-content">
                    <div class="event-location">{{ event.location }}</div>
                    <div class="event-description">{{ event.description }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="detail-actions">
              <button class="action-button">
                <i class="pi pi-print" aria-hidden="true"></i>
                {{ $t('tracking.print_details') }}
              </button>
              <button class="action-button">
                <i class="pi pi-flag" aria-hidden="true"></i>
                {{ $t('tracking.report_issue') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tracking-view {
  padding: var(--spacing-lg);
}

/* Loading indicator */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.loading-spinner {
  border: 4px solid var(--color-border);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-md);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Styling for the tracking search section */
.tracking-search {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  border: var(--border-width-thin) solid var(--color-border);
}

.search-header {
  margin-bottom: var(--spacing-md);
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.search-input-container {
  display: flex;
  gap: var(--spacing-sm);
}

.search-input {
  flex: 1;
  padding: var(--spacing-sm);
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-md);
}

.search-button {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: center;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.filter-group label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.filter-group select {
  padding: var(--spacing-sm);
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-background);
}

.reset-filters-button {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-background);
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  cursor: pointer;
  margin-top: auto;
}

/* Main content layout */
.tracking-content {
  display: flex;
  gap: var(--spacing-lg);
}

.tracking-content.with-details {
  grid-template-columns: 1fr 1fr;
}

.shipments-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  flex: 1;
}

/* Styling for the incoming deliveries section */
.incoming-deliveries, .outgoing-deliveries {
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  border: var(--border-width-thin) solid var(--color-border);
}

.incoming-deliveries h2, .outgoing-deliveries h2 {
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.empty-state {
  color: var(--color-text-tertiary);
  font-style: italic;
  padding: var(--spacing-md) 0;
}

.shipments-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.shipment-item {
  background-color: var(--color-background);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  border: var(--border-width-thin) solid var(--color-border);
  cursor: pointer;
  transition: all 0.2s ease;
}

.shipment-item:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.shipment-item.selected {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.shipment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.shipment-id {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.shipment-status {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
}

.status-pending {
  background-color: var(--color-warning-light);
  color: var(--color-warning-dark);
}

.status-processing {
  background-color: var(--color-info-light);
  color: var(--color-info-dark);
}

.status-shipped {
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.status-delivered {
  background-color: var(--color-success-light);
  color: var(--color-success-dark);
}

.shipment-location {
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.shipment-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.shipment-priority {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
}

.priority-high {
  background-color: var(--color-error-light);
  color: var(--color-error-dark);
}

.priority-medium {
  background-color: var(--color-warning-light);
  color: var(--color-warning-dark);
}

.priority-low {
  background-color: var(--color-success-light);
  color: var(--color-success-dark);
}

.shipment-items {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.shipment-delivery {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

/* Styling for the shipment detail section */
.shipment-detail {
  flex: 1;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  border: var(--border-width-thin) solid var(--color-border);
  padding: var(--spacing-md);
  max-width: 500px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.detail-header h2 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.close-details-button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-lg);
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.detail-section {
  margin-bottom: var(--spacing-md);
}

.detail-section h3 {
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.detail-item.full-width {
  grid-column: span 2;
}

.detail-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

.detail-value {
  font-weight: var(--font-weight-medium);
}

.events-timeline {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
}

.event-item {
  display: flex;
  gap: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: var(--border-width-thin) solid var(--color-border);
}

.event-time {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  min-width: 120px;
}

.event-content {
  flex: 1;
}

.event-location {
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-xs);
}

.event-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.detail-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.action-button {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-background);
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.action-button:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .tracking-content {
    flex-direction: column;
  }

  .shipment-detail {
    max-width: none;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-item.full-width {
    grid-column: span 1;
  }

  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
