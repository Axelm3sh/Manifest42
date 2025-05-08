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

      <!-- Warehouse to Warehouse Shipping -->
      <div v-if="state.activeTab === 'warehouse'" class="shipping-section">
        <div class="section-header">
          <h2>{{ $t('shipping.warehouse_to_warehouse') }}</h2>
          <button class="create-button" @click="createNewShipment('warehouse')">
            <i class="pi pi-plus" aria-hidden="true"></i>
            {{ $t('shipping.create_shipment') }}
          </button>
        </div>

        <div class="shipping-form">
          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('shipping.origin_warehouse') }}</label>
              <select v-model="state.warehouseShipment.originWarehouseId">
                <option v-for="warehouse in state.warehouses" :key="warehouse.id" :value="warehouse.id">
                  {{ warehouse.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>{{ $t('shipping.destination_warehouse') }}</label>
              <select v-model="state.warehouseShipment.destinationWarehouseId">
                <option v-for="warehouse in state.warehouses" :key="warehouse.id" :value="warehouse.id">
                  {{ warehouse.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('shipping.shipping_date') }}</label>
              <input type="date" v-model="state.warehouseShipment.shipmentDate" />
            </div>

            <div class="form-group">
              <label>{{ $t('shipping.vehicle_type') }}</label>
              <select v-model="state.warehouseShipment.vehicleType">
                <option v-for="vehicle in state.vehicleTypes" :key="vehicle.id" :value="vehicle.id">
                  {{ vehicle.name }} ({{ $t('shipping.capacity') }}: {{ vehicle.capacity }})
                </option>
              </select>
            </div>
          </div>

          <div class="form-section">
            <h3>{{ $t('shipping.items') }}</h3>
            <div class="items-table">
              <div class="table-header">
                <div class="table-cell">{{ $t('shipping.product') }}</div>
                <div class="table-cell">{{ $t('shipping.quantity') }}</div>
                <div class="table-cell">{{ $t('shipping.actions') }}</div>
              </div>

              <div v-for="(item, index) in state.warehouseShipment.items" :key="index" class="table-row">
                <div class="table-cell">
                  <select v-model="item.productId">
                    <option v-for="product in state.products" :key="product.productId" :value="product.productId">
                      {{ product.productName }}
                    </option>
                  </select>
                </div>
                <div class="table-cell">
                  <input type="number" v-model="item.quantity" min="1" />
                </div>
                <div class="table-cell">
                  <button class="remove-button" @click="removeItem(index, 'warehouse')">
                    <i class="pi pi-trash" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>

            <button class="add-item-button" @click="addItem('warehouse')">
              <i class="pi pi-plus" aria-hidden="true"></i>
              {{ $t('shipping.add_item') }}
            </button>
          </div>

          <div class="form-actions">
            <button class="secondary-button" @click="resetForm('warehouse')">
              {{ $t('shipping.reset') }}
            </button>
            <button class="primary-button" @click="saveShipment('warehouse')">
              {{ $t('shipping.save_shipment') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Warehouse to Customer Shipping -->
      <div v-if="state.activeTab === 'customer'" class="shipping-section">
        <div class="section-header">
          <h2>{{ $t('shipping.warehouse_to_customer') }}</h2>
          <button class="create-button" @click="createNewShipment('customer')">
            <i class="pi pi-plus" aria-hidden="true"></i>
            {{ $t('shipping.create_shipment') }}
          </button>
        </div>

        <div class="shipping-form">
          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('shipping.origin_warehouse') }}</label>
              <select v-model="state.customerShipment.originWarehouseId">
                <option v-for="warehouse in state.warehouses" :key="warehouse.id" :value="warehouse.id">
                  {{ warehouse.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>{{ $t('shipping.customer') }}</label>
              <input type="text" v-model="state.customerShipment.customerName" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group full-width">
              <label>{{ $t('shipping.delivery_address') }}</label>
              <input type="text" v-model="state.customerShipment.deliveryAddress" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('shipping.shipping_date') }}</label>
              <input type="date" v-model="state.customerShipment.shipmentDate" />
            </div>

            <div class="form-group">
              <label>{{ $t('shipping.priority') }}</label>
              <select v-model="state.customerShipment.priority">
                <option value="high">{{ $t('shipping.priority_high') }}</option>
                <option value="medium">{{ $t('shipping.priority_medium') }}</option>
                <option value="low">{{ $t('shipping.priority_low') }}</option>
              </select>
            </div>
          </div>

          <div class="form-section">
            <h3>{{ $t('shipping.items') }}</h3>
            <div class="items-table">
              <div class="table-header">
                <div class="table-cell">{{ $t('shipping.product') }}</div>
                <div class="table-cell">{{ $t('shipping.quantity') }}</div>
                <div class="table-cell">{{ $t('shipping.actions') }}</div>
              </div>

              <div v-for="(item, index) in state.customerShipment.items" :key="index" class="table-row">
                <div class="table-cell">
                  <select v-model="item.productId">
                    <option v-for="product in state.products" :key="product.productId" :value="product.productId">
                      {{ product.productName }}
                    </option>
                  </select>
                </div>
                <div class="table-cell">
                  <input type="number" v-model="item.quantity" min="1" />
                </div>
                <div class="table-cell">
                  <button class="remove-button" @click="removeItem(index, 'customer')">
                    <i class="pi pi-trash" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>

            <button class="add-item-button" @click="addItem('customer')">
              <i class="pi pi-plus" aria-hidden="true"></i>
              {{ $t('shipping.add_item') }}
            </button>
          </div>

          <div class="form-actions">
            <button class="secondary-button" @click="resetForm('customer')">
              {{ $t('shipping.reset') }}
            </button>
            <button class="primary-button" @click="saveShipment('customer')">
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
                {{ shipment.type === 'warehouse' ? $t('shipping.warehouse_shipment') : $t('shipping.customer_shipment') }}
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

const { t } = useI18n();

// Tabs for different shipping operations
const tabs = [
  { id: 'warehouse', label: t('shipping.warehouse_to_warehouse'), icon: 'pi-building' },
  { id: 'customer', label: t('shipping.warehouse_to_customer'), icon: 'pi-user' },
  { id: 'scheduled', label: t('shipping.scheduled_shipments'), icon: 'pi-calendar' }
];

// State management for shipping view
const state = reactive({
  isLoading: true,
  activeTab: 'warehouse',

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
    origin: originWarehouse ? originWarehouse.name : 'Unknown',
    destination: type === 'warehouse' 
      ? (state.warehouses.find(w => w.id === shipment.destinationWarehouseId)?.name || 'Unknown')
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

  // For demo purposes, switch to the appropriate tab
  state.activeTab = shipment.type;
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
    { id: 'WH-001', name: 'Central Distribution Center', location: 'Chicago, IL' },
    { id: 'WH-002', name: 'East Coast Warehouse', location: 'New York, NY' },
    { id: 'WH-003', name: 'West Coast Warehouse', location: 'Los Angeles, CA' },
    { id: 'WH-004', name: 'Southern Distribution Center', location: 'Atlanta, GA' }
  ];

  // Mock vehicle types
  state.vehicleTypes = [
    { id: 'VT-001', name: 'Small Truck', capacity: 1000 },
    { id: 'VT-002', name: 'Medium Truck', capacity: 5000 },
    { id: 'VT-003', name: 'Large Truck', capacity: 10000 },
    { id: 'VT-004', name: 'Cargo Van', capacity: 500 }
  ];

  // Mock product data
  state.products = [
    { productId: 'P-001', productName: 'Wireless Headphones', quantityAvailable: 250, unitPrice: 79.99 },
    { productId: 'P-002', productName: 'Smart Watches', quantityAvailable: 100, unitPrice: 199.99 },
    { productId: 'P-003', productName: 'Bluetooth Speakers', quantityAvailable: 150, unitPrice: 59.99 },
    { productId: 'P-004', productName: 'Laptop Computers', quantityAvailable: 50, unitPrice: 899.99 },
    { productId: 'P-005', productName: 'Smartphone Cases', quantityAvailable: 500, unitPrice: 19.99 }
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
}

.create-button {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-primary);
  color: var(--color-text-primary);
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

/* Shipping form */
.shipping-form {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  border: var(--border-width-thin) solid var(--color-border);
  margin-bottom: var(--spacing-lg);
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
}

.form-group input, .form-group select {
  padding: var(--spacing-sm);
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-md);
}

.form-section {
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.form-section h3 {
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
}

/* Items table */
.items-table {
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  margin-bottom: var(--spacing-md);
}

.table-header {
  display: flex;
  background-color: var(--color-background);
  font-weight: var(--font-weight-semibold);
  border-bottom: var(--border-width-thin) solid var(--color-border);
}

.table-row {
  display: flex;
  border-bottom: var(--border-width-thin) solid var(--color-border);
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

.table-cell input, .table-cell select {
  width: 100%;
  padding: var(--spacing-sm);
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-sm);
}

.remove-button {
  background: none;
  border: none;
  color: var(--color-error);
  cursor: pointer;
  font-size: var(--font-size-lg);
}

.add-item-button {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-background);
  border: var(--border-width-thin) solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.add-item-button:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
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
}

.primary-button {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-primary);
  color: var(--color-text);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
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
}

.shipment-type.warehouse {
  background-color: var(--color-info-light);
  color: var(--color-info-dark);
}

.shipment-type.customer {
  background-color: var(--color-success-light);
  color: var(--color-success-dark);
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
}

.action-button:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
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
}
</style>