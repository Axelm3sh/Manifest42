<template>
  <div class="shipping-view">
    <h1>{{ $t('shipping.title') }}</h1>
    <p>{{ $t('shipping.description') }}</p>

    <!-- Loading indicator -->
    <div v-if="state.isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>{{ $t('common.loading') }}</p>
    </div>

    <div v-else>
      <!-- Shipping Operations Tabs -->
      <div class="shipping-tabs">
        <button
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-button"
            :class="{ 'active': state.activeTab === tab.id }"
            @click="setActiveTab(tab.id)"
        >
          <i :class="['pi', tab.icon]" aria-hidden="true"></i>
          {{ tab.label }}
        </button>
      </div>

      <!-- Combined Warehouse Shipping Form -->
      <div v-if="state.activeTab === 'create'" class="shipping-section">
        <div class="section-header">
          <h2>
            <i :class="['pi', state.shipmentType === 'warehouse' ? 'pi-building' : 'pi-user']" aria-hidden="true"></i>
            {{
              state.shipmentType === 'warehouse' ? $t('shipping.warehouse_to_warehouse') : $t('shipping.warehouse_to_customer')
            }}
          </h2>
          <button class="create-button" @click="createNewShipment(state.shipmentType)">
            <i class="pi pi-plus" aria-hidden="true"></i>
            {{ $t('shipping.create_shipment') }}
          </button>
        </div>

        <div class="shipping-form">
          <!-- Shipment Type Selector -->
          <div class="shipment-type-selector">
            <div
                class="type-option"
                :class="{ 'active': state.shipmentType === 'warehouse' }"
                @click="setShipmentType('warehouse')"
            >
              <i class="pi pi-building" aria-hidden="true"></i>
              <span>{{ $t('shipping.warehouse_to_warehouse') }}</span>
            </div>
            <div
                class="type-option"
                :class="{ 'active': state.shipmentType === 'customer' }"
                @click="setShipmentType('customer')"
            >
              <i class="pi pi-user" aria-hidden="true"></i>
              <span>{{ $t('shipping.warehouse_to_customer') }}</span>
            </div>
          </div>

          <!-- Origin Warehouse (Common to both types) -->
          <div class="form-section">
            <h3>
              <i class="pi pi-map-marker" aria-hidden="true"></i>
              {{ $t('shipping.origin_details') }}
            </h3>
            <div class="form-row">
              <div class="form-group">
                <label>
                  <i class="pi pi-building" aria-hidden="true"></i>
                  {{ $t('shipping.origin_warehouse') }}
                </label>
                <select
                    v-model="state[state.shipmentType + 'Shipment'].originWarehouseId"
                    class="enhanced-select"
                >
                  <option v-for="warehouse in state.warehouses" :key="warehouse.id" :value="warehouse.id">
                    {{ warehouse.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Destination Details (Different based on type) -->
          <div class="form-section">
            <h3>
              <i class="pi pi-map" aria-hidden="true"></i>
              {{ $t('shipping.destination_details') }}
            </h3>

            <!-- Warehouse Destination -->
            <div v-if="state.shipmentType === 'warehouse'" class="form-row">
              <div class="form-group">
                <label>
                  <i class="pi pi-building" aria-hidden="true"></i>
                  {{ $t('shipping.destination_warehouse') }}
                </label>
                <select
                    v-model="state.warehouseShipment.destinationWarehouseId"
                    class="enhanced-select"
                >
                  <option v-for="warehouse in state.warehouses" :key="warehouse.id" :value="warehouse.id">
                    {{ warehouse.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>
                  <i class="pi pi-truck" aria-hidden="true"></i>
                  {{ $t('shipping.vehicle_type') }}
                </label>
                <select
                    v-model="state.warehouseShipment.vehicleType"
                    class="enhanced-select"
                >
                  <option v-for="vehicle in state.vehicleTypes" :key="vehicle.id" :value="vehicle.id">
                    {{ vehicle.name }} ({{ $t('shipping.capacity') }}: {{ vehicle.capacity }})
                  </option>
                </select>
              </div>
            </div>

            <!-- Customer Destination -->
            <div v-if="state.shipmentType === 'customer'" class="destination-customer">
              <div class="form-row">
                <div class="form-group">
                  <label>
                    <i class="pi pi-user" aria-hidden="true"></i>
                    {{ $t('shipping.customer') }}
                  </label>
                  <input
                      type="text"
                      v-model="state.customerShipment.customerName"
                      class="enhanced-input"
                      :placeholder="$t('shipping.customer_name_placeholder')"
                  />
                </div>
                <div class="form-group">
                  <label>
                    <i class="pi pi-flag" aria-hidden="true"></i>
                    {{ $t('shipping.priority') }}
                  </label>
                  <div class="priority-selector">
                    <div
                        class="priority-option"
                        :class="{ 'active': state.customerShipment.priority === 'high', 'priority-high': true }"
                        @click="state.customerShipment.priority = 'high'"
                    >
                      <i class="pi pi-arrow-up" aria-hidden="true"></i>
                      {{ $t('shipping.priority_high') }}
                    </div>
                    <div
                        class="priority-option"
                        :class="{ 'active': state.customerShipment.priority === 'medium', 'priority-medium': true }"
                        @click="state.customerShipment.priority = 'medium'"
                    >
                      <i class="pi pi-minus" aria-hidden="true"></i>
                      {{ $t('shipping.priority_medium') }}
                    </div>
                    <div
                        class="priority-option"
                        :class="{ 'active': state.customerShipment.priority === 'low', 'priority-low': true }"
                        @click="state.customerShipment.priority = 'low'"
                    >
                      <i class="pi pi-arrow-down" aria-hidden="true"></i>
                      {{ $t('shipping.priority_low') }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group full-width">
                  <label>
                    <i class="pi pi-map-marker" aria-hidden="true"></i>
                    {{ $t('shipping.delivery_address') }}
                  </label>
                  <input
                      type="text"
                      v-model="state.customerShipment.deliveryAddress"
                      class="enhanced-input"
                      :placeholder="$t('shipping.delivery_address_placeholder')"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Date (Common to both types) -->
          <div class="form-section">
            <h3>
              <i class="pi pi-calendar" aria-hidden="true"></i>
              {{ $t('shipping.shipping_details') }}
            </h3>
            <div class="form-row">
              <div class="form-group">
                <label>
                  <i class="pi pi-calendar" aria-hidden="true"></i>
                  {{ $t('shipping.shipping_date') }}
                </label>
                <input
                    type="date"
                    v-model="state[state.shipmentType + 'Shipment'].shipmentDate"
                    class="enhanced-input"
                />
              </div>
            </div>
          </div>

          <!-- Items Section (Common to both types but with different data sources) -->
          <div class="form-section items-section">
            <div class="section-header-with-action">
              <h3>
                <i class="pi pi-box" aria-hidden="true"></i>
                {{ $t('shipping.items') }}
              </h3>
              <button class="add-item-button" @click="addItem(state.shipmentType)">
                <i class="pi pi-plus" aria-hidden="true"></i>
                {{ $t('shipping.add_item') }}
              </button>
            </div>

            <div class="items-table">
              <div class="table-header">
                <div class="table-cell">{{ $t('shipping.product') }}</div>
                <div class="table-cell">{{ $t('shipping.quantity') }}</div>
                <div class="table-cell">{{ $t('shipping.actions') }}</div>
              </div>

              <div
                  v-for="(item, index) in state[state.shipmentType + 'Shipment'].items"
                  :key="index"
                  class="table-row"
              >
                <div class="table-cell">
                  <select
                      v-model="item.productId"
                      class="enhanced-select"
                  >
                    <option v-for="product in state.products" :key="product.productId" :value="product.productId">
                      {{ product.productName }}
                    </option>
                  </select>
                </div>
                <div class="table-cell">
                  <div class="quantity-control">
                    <button
                        class="quantity-button"
                        @click="decrementQuantity(item)"
                        :disabled="item.quantity <= 1"
                    >
                      <i class="pi pi-minus" aria-hidden="true"></i>
                    </button>
                    <input
                        type="number"
                        v-model="item.quantity"
                        min="1"
                        class="quantity-input"
                    />
                    <button
                        class="quantity-button"
                        @click="incrementQuantity(item)"
                    >
                      <i class="pi pi-plus" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
                <div class="table-cell">
                  <button class="remove-button" @click="removeItem(index, state.shipmentType)">
                    <i class="pi pi-trash" aria-hidden="true"></i>
                  </button>
                </div>
              </div>

              <div v-if="state[state.shipmentType + 'Shipment'].items.length === 0" class="empty-items">
                <i class="pi pi-inbox" aria-hidden="true"></i>
                <p>{{ $t('shipping.no_items_added') }}</p>
                <button class="add-first-item" @click="addItem(state.shipmentType)">
                  <i class="pi pi-plus" aria-hidden="true"></i>
                  {{ $t('shipping.add_first_item') }}
                </button>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="secondary-button" @click="resetForm(state.shipmentType)">
              <i class="pi pi-refresh" aria-hidden="true"></i>
              {{ $t('shipping.reset') }}
            </button>
            <button class="primary-button" @click="saveShipment(state.shipmentType)">
              <i class="pi pi-save" aria-hidden="true"></i>
              {{ $t('shipping.save_shipment') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Scheduled Shipments -->
      <div v-if="state.activeTab === 'scheduled'" class="shipping-section">
        <div class="section-header">
          <h2>{{ $t('shipping.scheduled_shipments') }}</h2>
        </div>

        <div v-if="state.scheduledShipments.length === 0" class="empty-state">
          {{ $t('shipping.no_scheduled_shipments') }}
        </div>

        <div v-else class="shipments-grid">
          <div v-for="shipment in state.scheduledShipments" :key="shipment.shipmentId" class="shipment-card">
            <div class="shipment-card-header">
              <div class="shipment-id">{{ shipment.shipmentId }}</div>
              <div class="shipment-type" :class="shipment.type">
                <i :class="['pi', shipment.type === 'warehouse' ? 'pi-building' : 'pi-user']" aria-hidden="true"></i>
                {{
                  shipment.type === 'warehouse' ? $t('shipping.warehouse_shipment') : $t('shipping.customer_shipment')
                }}
              </div>
            </div>

            <div class="shipment-details">
              <div class="detail-row">
                <div class="detail-label">{{ $t('shipping.origin') }}:</div>
                <div class="detail-value">{{ shipment.origin }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">{{ $t('shipping.destination') }}:</div>
                <div class="detail-value">{{ shipment.destination }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">{{ $t('shipping.date') }}:</div>
                <div class="detail-value">{{ formatDate(shipment.shipmentDate) }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">{{ $t('shipping.items_count') }}:</div>
                <div class="detail-value">{{ shipment.itemsCount }}</div>
              </div>
            </div>

            <div class="shipment-actions">
              <button class="action-button" @click="editShipment(shipment)">
                <i class="pi pi-pencil" aria-hidden="true"></i>
                {{ $t('shipping.edit') }}
              </button>
              <button class="action-button" @click="cancelShipment(shipment)">
                <i class="pi pi-times" aria-hidden="true"></i>
                {{ $t('shipping.cancel') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';
import {onMounted, reactive} from 'vue';

const {t} = useI18n();

// Tabs for different shipping operations
const tabs = [
  {id: 'create', label: t('shipping.create_shipment'), icon: 'pi-plus'},
  {id: 'scheduled', label: t('shipping.scheduled_shipments'), icon: 'pi-calendar-plus'}
];

// State management for shipping view
const state = reactive({
  isLoading: true,
  activeTab: 'create', // Default to create shipment tab
  shipmentType: 'warehouse', // Default shipment type (warehouse or customer)

  // Warehouse to warehouse shipment form
  warehouseShipment: {
    originWarehouseId: '',
    destinationWarehouseId: '',
    shipmentDate: new Date().toISOString().split('T')[0],
    vehicleType: '',
    items: []
  },

  // Warehouse to customer shipment form
  customerShipment: {
    originWarehouseId: '',
    customerName: '',
    deliveryAddress: '',
    shipmentDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    items: []
  },

  // Reference data
  warehouses: [],
  vehicleTypes: [],
  products: [],

  // Scheduled shipments
  scheduledShipments: []
});

// Set active tab
const setActiveTab = (tabId) => {
  state.activeTab = tabId;
};

// Set shipment type
const setShipmentType = (type) => {
  state.shipmentType = type;
};

// Add item to shipment
const addItem = (type) => {
  const shipment = type === 'warehouse' ? state.warehouseShipment : state.customerShipment;
  shipment.items.push({
    productId: '',
    quantity: 1
  });
};

// Remove item from shipment
const removeItem = (index, type) => {
  const shipment = type === 'warehouse' ? state.warehouseShipment : state.customerShipment;
  shipment.items.splice(index, 1);
};

// Increment item quantity
const incrementQuantity = (item) => {
  item.quantity = parseInt(item.quantity) + 1;
};

// Decrement item quantity
const decrementQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity = parseInt(item.quantity) - 1;
  }
};

// Create new shipment
const createNewShipment = (type) => {
  if (type === 'warehouse') {
    state.warehouseShipment = {
      originWarehouseId: '',
      destinationWarehouseId: '',
      shipmentDate: new Date().toISOString().split('T')[0],
      vehicleType: '',
      items: []
    };
  } else {
    state.customerShipment = {
      originWarehouseId: '',
      customerName: '',
      deliveryAddress: '',
      shipmentDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
      items: []
    };
  }

  // Add an initial empty item
  addItem(type);
};

// Reset form
const resetForm = (type) => {
  createNewShipment(type);
};

// Save shipment
const saveShipment = (type) => {
  // In a real app, this would call an API to save the shipment
  console.log(`Save ${type} shipment:`, type === 'warehouse' ? state.warehouseShipment : state.customerShipment);

  // For demo purposes, add to scheduled shipments
  const shipment = type === 'warehouse' ? state.warehouseShipment : state.customerShipment;

  // Find warehouse names
  const originWarehouse = state.warehouses.find(w => w.id === shipment.originWarehouseId);

  // Create a new scheduled shipment
  const newShipment = {
    shipmentId: 'SHP-' + Math.floor(Math.random() * 10000),
    type: type,
    origin: originWarehouse ? originWarehouse.name : t('shipping.unknown_location'),
    destination: type === 'warehouse'
        ? (state.warehouses.find(w => w.id === shipment.destinationWarehouseId)?.name || t('shipping.unknown_location'))
        : shipment.customerName,
    shipmentDate: shipment.shipmentDate,
    itemsCount: shipment.items.length,
    status: 'Pending'
  };

  state.scheduledShipments.push(newShipment);

  // Reset the form
  resetForm(type);

  // Switch to scheduled tab
  state.activeTab = 'scheduled';
};

// Edit shipment
const editShipment = (shipment) => {
  // In a real app, this would load the shipment details into the form
  console.log('Edit shipment:', shipment);

  // For demo purposes, switch to the create tab and set the shipment type
  state.activeTab = 'create';
  state.shipmentType = shipment.type;
};

// Cancel shipment
const cancelShipment = (shipment) => {
  // In a real app, this would call an API to cancel the shipment
  console.log('Cancel shipment:', shipment);

  // For demo purposes, remove from scheduled shipments
  const index = state.scheduledShipments.findIndex(s => s.shipmentId === shipment.shipmentId);
  if (index !== -1) {
    state.scheduledShipments.splice(index, 1);
  }
};

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Load reference data
const loadReferenceData = async () => {
  // Simulate API calls
  await new Promise(resolve => setTimeout(resolve, 800));

  // Mock warehouse data
  state.warehouses = [
    {id: 'WH-001', name: 'Central Distribution Center', location: 'Chicago, IL'},
    {id: 'WH-002', name: 'East Coast Warehouse', location: 'New York, NY'},
    {id: 'WH-003', name: 'West Coast Warehouse', location: 'Los Angeles, CA'},
    {id: 'WH-004', name: 'Southern Distribution Center', location: 'Atlanta, GA'}
  ];

  // Mock vehicle types
  state.vehicleTypes = [
    {id: 'VT-001', name: 'Small Truck', capacity: 1000},
    {id: 'VT-002', name: 'Medium Truck', capacity: 5000},
    {id: 'VT-003', name: 'Large Truck', capacity: 10000},
    {id: 'VT-004', name: 'Cargo Van', capacity: 500}
  ];

  // Mock product data
  state.products = [
    {productId: 'P-001', productName: 'Wireless Headphones', quantityAvailable: 250, unitPrice: 79.99},
    {productId: 'P-002', productName: 'Smart Watches', quantityAvailable: 100, unitPrice: 199.99},
    {productId: 'P-003', productName: 'Bluetooth Speakers', quantityAvailable: 150, unitPrice: 59.99},
    {productId: 'P-004', productName: 'Laptop Computers', quantityAvailable: 50, unitPrice: 899.99},
    {productId: 'P-005', productName: 'Smartphone Cases', quantityAvailable: 500, unitPrice: 19.99}
  ];

  // Mock scheduled shipments
  state.scheduledShipments = [
    {
      shipmentId: 'SHP-1001',
      type: 'warehouse',
      origin: 'Central Distribution Center',
      destination: 'East Coast Warehouse',
      shipmentDate: '2023-06-15',
      itemsCount: 3,
      status: 'Pending'
    },
    {
      shipmentId: 'SHP-1002',
      type: 'customer',
      origin: 'West Coast Warehouse',
      destination: 'Acme Corporation',
      shipmentDate: '2023-06-18',
      itemsCount: 2,
      status: 'Pending'
    }
  ];
};

// Initialize component
onMounted(async () => {
  try {
    await loadReferenceData();

    // Add initial empty items to forms
    addItem('warehouse');
    addItem('customer');
  } catch (error) {
    console.error('Error loading shipping data:', error);
  } finally {
    state.isLoading = false;
  }
});
</script>

<style scoped>
.shipping-view {
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Tabs */
.shipping-tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  border-bottom: var(--border-width-thin) solid var(--color-border);
  padding-bottom: var(--spacing-sm);
}

.tab-button {
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: none;
  border-radius: var(--border-radius-md) var(--border-radius-md) 0 0;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: all 0.2s ease;
}

.tab-button:hover {
  color: var(--color-primary);
  background-color: var(--color-surface-hover);
}

.tab-button.active {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

/* Section header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.section-header h2 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-primary);
}

.section-header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.section-header-with-action h3 {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin: 0;
}

.create-button {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-primary);
  color: var(--color-button-text);
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: background-color var(--transition-fast);
}

.create-button:hover {
  background-color: var(--color-primary-hover);
}

/* Shipping form */
.shipping-form {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  border: var(--border-width-thin) solid var(--color-border);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--color-shadow);
}

/* Shipment Type Selector */
.shipment-type-selector {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: var(--border-width-thin) solid var(--color-border);
}

.type-option {
  flex: 1;
  padding: var(--spacing-md);
  background-color: var(--color-background);
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.type-option i {
  font-size: var(--font-size-2xl);
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);
}

.type-option span {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  text-align: center;
  transition: color var(--transition-fast);
}

.type-option:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary-light);
  transform: translateY(-2px);
  box-shadow: var(--color-shadow);
}

.type-option.active {
  background-color: var(--color-primary-muted);
  border-color: var(--color-primary);
}

.type-option.active i,
.type-option.active span {
  color: var(--color-primary);
}

.form-row {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-group.full-width {
  flex: 1 0 100%;
}

.form-group label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.form-group label i {
  color: var(--color-primary);
  font-size: var(--font-size-md);
}

.enhanced-input,
.enhanced-select {
  padding: var(--spacing-sm);
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  background-color: var(--color-background);
  color: var(--color-text-primary);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.enhanced-input:focus,
.enhanced-select:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 2px var(--color-primary-muted);
}

.enhanced-input::placeholder {
  color: var(--color-text-tertiary);
}

.form-section {
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: var(--color-background);
  border-radius: var(--border-radius-md);
  border: var(--border-width-thin) solid var(--color-border);
}

.form-section h3 {
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.form-section h3 i {
  color: var(--color-primary);
}

/* Priority Selector */
.priority-selector {
  display: flex;
  gap: var(--spacing-xs);
}

.priority-option {
  flex: 1;
  padding: var(--spacing-sm);
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.priority-option i {
  font-size: var(--font-size-sm);
}

.priority-high {
  color: var(--color-error);
}

.priority-high.active {
  background-color: var(--color-error-bg);
  border-color: var(--color-error);
}

.priority-medium {
  color: var(--color-warning);
}

.priority-medium.active {
  background-color: var(--color-warning-bg);
  border-color: var(--color-warning);
}

.priority-low {
  color: var(--color-success);
}

.priority-low.active {
  background-color: var(--color-success-bg);
  border-color: var(--color-success);
}

/* Items section */
.items-section {
  border: var(--border-width-thin) solid var(--color-primary-light);
}

/* Items table */
.items-table {
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  margin-bottom: var(--spacing-md);
  background-color: var(--color-surface);
}

.table-header {
  display: flex;
  background-color: var(--color-primary-muted);
  font-weight: var(--font-weight-semibold);
  border-bottom: var(--border-width-thin) solid var(--color-border);
  color: var(--color-primary-dark);
}

.table-row {
  display: flex;
  border-bottom: var(--border-width-thin) solid var(--color-border);
  transition: background-color var(--transition-fast);
}

.table-row:hover {
  background-color: var(--color-surface-hover);
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  flex: 1;
  padding: var(--spacing-sm);
  display: flex;
  align-items: center;
}

.table-cell:last-child {
  flex: 0 0 100px;
  justify-content: center;
}

.table-cell .enhanced-select {
  width: 100%;
}

/* Quantity Control */
.quantity-control {
  display: flex;
  align-items: center;
  width: 100%;
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.quantity-button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background);
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
  padding: 0;
  transition: background-color var(--transition-fast);
}

.quantity-button:hover:not(:disabled) {
  background-color: var(--color-surface-hover);
  color: var(--color-primary);
}

.quantity-button:disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.quantity-input {
  flex: 1;
  text-align: center;
  border: none;
  padding: var(--spacing-sm);
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
  background-color: var(--color-background);
}

.quantity-input:focus {
  outline: none;
}

.remove-button {
  background: none;
  border: none;
  color: var(--color-error);
  cursor: pointer;
  font-size: var(--font-size-lg);
  transition: transform var(--transition-fast), color var(--transition-fast);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-full);
}

.remove-button:hover {
  color: var(--color-error-dark);
  transform: scale(1.1);
  background-color: var(--color-error-bg);
}

.add-item-button {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-surface);
  border: var(--border-width-thin) solid var(--color-primary-light);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-primary);
  transition: all var(--transition-fast);
}

.add-item-button:hover {
  background-color: var(--color-primary-muted);
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

/* Empty items state */
.empty-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  color: var(--color-text-tertiary);
  text-align: center;
}

.empty-items i {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-md);
  color: var(--color-text-tertiary);
}

.empty-items p {
  margin-bottom: var(--spacing-md);
}

.add-first-item {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-primary-muted);
  border: var(--border-width-thin) solid var(--color-primary);
  border-radius: var(--border-radius-md);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: all var(--transition-fast);
}

.add-first-item:hover {
  background-color: var(--color-primary);
  color: var(--color-button-text);
}

/* Form actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.secondary-button {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-background);
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: all var(--transition-fast);
}

.secondary-button:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
}

.primary-button {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-primary);
  color: var(--color-button-text);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: background-color var(--transition-fast);
}

.primary-button:hover {
  background-color: var(--color-primary-hover);
}

/* Scheduled shipments */
.empty-state {
  color: var(--color-text-tertiary);
  font-style: italic;
  padding: var(--spacing-lg);
  text-align: center;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  border: var(--border-width-thin) solid var(--color-border);
}

.shipments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.shipment-card {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  border: var(--border-width-thin) solid var(--color-border);
  box-shadow: var(--color-shadow);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.shipment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px var(--color-shadow);
}

.shipment-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: var(--border-width-thin) solid var(--color-border);
}

.shipment-id {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.shipment-type {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.shipment-type.warehouse {
  background-color: var(--p-blue-50);
  color: var(--p-blue-700);
}

.shipment-type.customer {
  background-color: var(--p-green-50);
  color: var(--p-green-700);
}

.shipment-details {
  margin-bottom: var(--spacing-md);
}

.detail-row {
  display: flex;
  margin-bottom: var(--spacing-xs);
}

.detail-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  width: 100px;
}

.detail-value {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.shipment-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-sm);
  border-top: var(--border-width-thin) solid var(--color-border);
}

.action-button {
  flex: 1;
  padding: var(--spacing-sm);
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
  gap: var(--spacing-xs);
  transition: all var(--transition-fast);
}

.action-button:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
  transform: translateY(-2px);
}


/* Responsive adjustments */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .shipments-grid {
    grid-template-columns: 1fr;
  }

  .shipping-tabs {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .tab-button {
    width: 100%;
    justify-content: flex-start;
  }

  .shipment-type-selector {
    flex-direction: column;
  }

  .priority-selector {
    flex-direction: column;
  }
}
</style>
