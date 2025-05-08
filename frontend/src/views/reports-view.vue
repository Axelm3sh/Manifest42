<script setup>
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const {t} = useI18n();

// Report state
const isLoading = ref(false);
const reportGenerated = ref(false);

// Filter selections
const selectedReportType = ref(null);
const selectedDateRange = ref(null);
const selectedWarehouse = ref(null);
const selectedCategory = ref(null);

// Filter options
const reportTypes = ref([
  {id: 'inventory', name: 'Inventory Report'},
  {id: 'performance', name: 'Performance Report'},
  {id: 'forecast', name: 'Forecast Report'},
  {id: 'supplier', name: 'Supplier Report'}
]);

const dateRanges = ref([
  {id: 'last7days', name: 'Last 7 Days'},
  {id: 'last30days', name: 'Last 30 Days'},
  {id: 'last90days', name: 'Last 90 Days'},
  {id: 'lastYear', name: 'Last Year'},
  {id: 'custom', name: 'Custom Range'}
]);

const warehouses = ref([
  {id: 'all', name: 'All Warehouses'},
  {id: 'warehouse1', name: 'East Coast Warehouse'},
  {id: 'warehouse2', name: 'West Coast Warehouse'},
  {id: 'warehouse3', name: 'Central Warehouse'}
]);

const categories = ref([
  {id: 'all', name: 'All Categories'},
  {id: 'electronics', name: 'Electronics'},
  {id: 'clothing', name: 'Clothing'},
  {id: 'food', name: 'Food & Beverage'},
  {id: 'home', name: 'Home Goods'}
]);

// Mock data for inventory report
const inventoryData = ref({
  totalItems: 12458,
  totalValue: 1245800,
  lowStockItems: 42,
  inventoryTurnover: 4.7
});

const inventoryItems = ref([
  {
    sku: 'SKU-12345',
    name: 'Wireless Headphones',
    category: 'Electronics',
    warehouse: 'East Coast Warehouse',
    quantity: 120,
    reorderPoint: 50,
    value: 12000,
    lastUpdated: '2023-08-15T14:30:00Z'
  },
  {
    sku: 'SKU-23456',
    name: 'Smart Watch',
    category: 'Electronics',
    warehouse: 'West Coast Warehouse',
    quantity: 85,
    reorderPoint: 30,
    value: 21250,
    lastUpdated: '2023-08-14T09:15:00Z'
  },
  {
    sku: 'SKU-34567',
    name: 'Cotton T-Shirt',
    category: 'Clothing',
    warehouse: 'Central Warehouse',
    quantity: 350,
    reorderPoint: 100,
    value: 7000,
    lastUpdated: '2023-08-16T11:45:00Z'
  },
  {
    sku: 'SKU-45678',
    name: 'Organic Coffee Beans',
    category: 'Food & Beverage',
    warehouse: 'East Coast Warehouse',
    quantity: 25,
    reorderPoint: 30,
    value: 1250,
    lastUpdated: '2023-08-13T16:20:00Z'
  },
  {
    sku: 'SKU-56789',
    name: 'Ceramic Dinner Set',
    category: 'Home Goods',
    warehouse: 'West Coast Warehouse',
    quantity: 45,
    reorderPoint: 20,
    value: 4500,
    lastUpdated: '2023-08-12T10:30:00Z'
  },
  {
    sku: 'SKU-67890',
    name: 'Bluetooth Speaker',
    category: 'Electronics',
    warehouse: 'Central Warehouse',
    quantity: 60,
    reorderPoint: 25,
    value: 9000,
    lastUpdated: '2023-08-11T13:45:00Z'
  },
  {
    sku: 'SKU-78901',
    name: 'Denim Jeans',
    category: 'Clothing',
    warehouse: 'East Coast Warehouse',
    quantity: 180,
    reorderPoint: 50,
    value: 9000,
    lastUpdated: '2023-08-10T15:10:00Z'
  }
]);

// Mock data for performance report
const performanceData = ref({
  orderFulfillment: 96.8,
  inventoryAccuracy: 98.5,
  carryingCost: 78500,
  stockoutRate: 1.2
});

const performanceItems = ref([
  {
    metric: 'Order Fulfillment Rate',
    current: '96.8%',
    previous: '95.6%',
    change: 1.2,
    target: '98%',
    status: 'Good'
  },
  {
    metric: 'Inventory Accuracy',
    current: '98.5%',
    previous: '98.0%',
    change: 0.5,
    target: '99%',
    status: 'Good'
  },
  {
    metric: 'Carrying Cost',
    current: '$78,500',
    previous: '$80,350',
    change: -2.3,
    target: '$75,000',
    status: 'Improving'
  },
  {
    metric: 'Stockout Rate',
    current: '1.2%',
    previous: '2.0%',
    change: -0.8,
    target: '1.0%',
    status: 'Improving'
  },
  {
    metric: 'Inventory Turnover',
    current: '4.7',
    previous: '4.4',
    change: 6.8,
    target: '5.0',
    status: 'Good'
  },
  {
    metric: 'Days of Supply',
    current: '32 days',
    previous: '35 days',
    change: -8.6,
    target: '30 days',
    status: 'Improving'
  },
  {
    metric: 'Perfect Order Rate',
    current: '92.3%',
    previous: '90.1%',
    change: 2.2,
    target: '95%',
    status: 'Improving'
  }
]);

// Generate report
const generateReport = () => {
  if (!selectedReportType.value || !selectedDateRange.value) {
    // In a real app, show a toast message
    console.error('Please select report type and date range');
    return;
  }

  isLoading.value = true;

  // Simulate API call
  setTimeout(() => {
    isLoading.value = false;
    reportGenerated.value = true;
  }, 1500);
};

// Export report
const exportReport = () => {
  // In a real app, this would generate a PDF or Excel file
  console.log('Exporting report:', selectedReportType.value.name);
};

// Format number with commas
const formatNumber = (value, decimals = 0) => {
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Get class for quantity
const getQuantityClass = (quantity, reorderPoint) => {
  if (quantity <= reorderPoint * 0.5) return 'quantity-critical';
  if (quantity <= reorderPoint) return 'quantity-warning';
  return 'quantity-good';
};

// Get class for change
const getChangeClass = (change) => {
  if (change > 0) return 'change-positive';
  if (change < 0) return 'change-negative';
  return '';
};

// Get class for status
const getStatusClass = (status) => {
  switch (status) {
    case 'Good':
      return 'status-good';
    case 'Improving':
      return 'status-improving';
    case 'Warning':
      return 'status-warning';
    case 'Critical':
      return 'status-critical';
    default:
      return '';
  }
};
</script>

<template>
  <div class="reports-view">
    <!-- Report Controls -->
    <div class="report-controls">
      <div class="control-section">
        <h3 class="section-title">
          <i class="pi pi-filter"></i>
          {{ t('reports.report_filters') }}
        </h3>
        <div class="filter-grid">
          <div class="filter-item">
            <label for="report-type">{{ t('reports.report_type') }}</label>
            <Dropdown
                id="report-type"
                v-model="selectedReportType"
                :options="reportTypes"
                optionLabel="name"
                class="w-full"
                :placeholder="t('reports.select_report_type')"
            />
          </div>
          <div class="filter-item">
            <label for="date-range">{{ t('reports.date_range') }}</label>
            <Dropdown
                id="date-range"
                v-model="selectedDateRange"
                :options="dateRanges"
                optionLabel="name"
                class="w-full"
                :placeholder="t('reports.select_date_range')"
            />
          </div>
          <div class="filter-item">
            <label for="warehouse">{{ t('reports.warehouse') }}</label>
            <Dropdown
                id="warehouse"
                v-model="selectedWarehouse"
                :options="warehouses"
                optionLabel="name"
                class="w-full"
                :placeholder="t('reports.select_warehouse')"
            />
          </div>
          <div class="filter-item">
            <label for="category">{{ t('reports.category') }}</label>
            <Dropdown
                id="category"
                v-model="selectedCategory"
                :options="categories"
                optionLabel="name"
                class="w-full"
                :placeholder="t('reports.select_category')"
            />
          </div>
        </div>
        <div class="action-buttons">
          <Button
              :label="t('reports.generate_report')"
              icon="pi pi-refresh"
              @click="generateReport"
              class="p-button-primary"
          />
          <Button
              :label="t('reports.export')"
              icon="pi pi-download"
              @click="exportReport"
              class="p-button-secondary"
              :disabled="!reportGenerated"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>{{ t('common.generating_report') }}</p>
    </div>

    <!-- Report Content -->
    <div v-else-if="reportGenerated" class="report-content">
      <!-- Inventory Report -->
      <div v-if="selectedReportType.id === 'inventory'" class="report-section">
        <h2 class="report-title">
          <i class="pi pi-box"></i>
          {{ t('reports.inventory_report') }}
        </h2>
        <p class="report-description">{{ t('reports.inventory_report_description') }}</p>

        <!-- KPI Cards -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <h3 class="kpi-title">
              <i class="pi pi-list"></i>
              {{ t('inventory.total_items') }}
            </h3>
            <div class="kpi-value">{{ formatNumber(inventoryData.totalItems) }}</div>
            <div class="kpi-trend up">
              +2.5% {{ t('performance.trend_up') }}
              <span class="trend-icon">
                  <i class="pi pi-arrow-up" aria-hidden="true"></i>
                </span>
            </div>
          </div>
          <div class="kpi-card">
            <h3 class="kpi-title">
              <i class="pi pi-dollar"></i>
              {{ t('inventory.total_value') }}
            </h3>
            <div class="kpi-value">${{ formatNumber(inventoryData.totalValue) }}</div>
            <div class="kpi-trend up">
              +3.2% {{ t('performance.trend_up') }}
              <span class="trend-icon">
                  <i class="pi pi-arrow-up" aria-hidden="true"></i>
                </span>
            </div>
          </div>
          <div class="kpi-card">
            <h3 class="kpi-title">
              <i class="pi pi-exclamation-triangle"></i>
              {{ t('inventory.low_stock_items') }}
            </h3>
            <div class="kpi-value">{{ formatNumber(inventoryData.lowStockItems) }}</div>
            <div class="kpi-trend down">
              -5.1% {{ t('performance.trend_down') }}
              <span class="trend-icon">
                  <i class="pi pi-arrow-down" aria-hidden="true"></i>
                </span>
            </div>
          </div>
          <div class="kpi-card">
            <h3 class="kpi-title">
              <i class="pi pi-sync"></i>
              {{ t('inventory.inventory_turnover') }}
            </h3>
            <div class="kpi-value">{{ formatNumber(inventoryData.inventoryTurnover, 2) }}</div>
            <div class="kpi-trend up">
              +0.3 {{ t('performance.trend_up') }}
              <span class="trend-icon">
                  <i class="pi pi-arrow-up" aria-hidden="true"></i>
                </span>
            </div>
          </div>
        </div>

        <!-- Inventory Chart -->
        <div class="chart-section">
          <div class="chart-card">
            <h3 class="chart-title">
              <i class="pi pi-chart-bar"></i>
              {{ t('reports.inventory_by_category') }}
            </h3>
            <div class="chart-container">
              <!-- Mock chart using SVG -->
              <svg width="100%" height="300" class="mock-chart">
                <rect x="50" y="50" width="100" height="200" fill="var(--color-primary)"/>
                <rect x="200" y="100" width="100" height="150" fill="var(--color-primary-light)"/>
                <rect x="350" y="150" width="100" height="100" fill="var(--color-secondary)"/>
                <rect x="500" y="80" width="100" height="170" fill="var(--color-info)"/>
                <rect x="650" y="120" width="100" height="130" fill="var(--color-warning)"/>
                <text x="100" y="270" text-anchor="middle" fill="var(--color-text-secondary)">
                  {{ t('reports.categories.electronics') }}
                </text>
                <text x="250" y="270" text-anchor="middle" fill="var(--color-text-secondary)">
                  {{ t('reports.categories.clothing') }}
                </text>
                <text x="400" y="270" text-anchor="middle" fill="var(--color-text-secondary)">
                  {{ t('reports.categories.food') }}
                </text>
                <text x="550" y="270" text-anchor="middle" fill="var(--color-text-secondary)">
                  {{ t('reports.categories.home') }}
                </text>
                <text x="700" y="270" text-anchor="middle" fill="var(--color-text-secondary)">{{
                    t('common.other')
                  }}
                </text>
              </svg>
            </div>
          </div>
        </div>

        <!-- Inventory Table -->
        <div class="table-section">
          <h3 class="table-title">
            <i class="pi pi-list"></i>
            {{ t('reports.inventory_details') }}
          </h3>
          <DataTable
              :value="inventoryItems"
              :paginator="true"
              :rows="5"
              :rowsPerPageOptions="[5, 10, 20]"
              responsiveLayout="scroll"
              class="inventory-table"
              stripedRows
          >
            <Column field="sku" :header="t('reports.table.sku')" sortable></Column>
            <Column field="name" :header="t('reports.table.name')" sortable></Column>
            <Column field="category" :header="t('reports.table.category')" sortable></Column>
            <Column field="warehouse" :header="t('reports.table.warehouse')" sortable></Column>
            <Column field="quantity" :header="t('reports.table.quantity')" sortable>
              <template #body="slotProps">
                  <span :class="getQuantityClass(slotProps.data.quantity, slotProps.data.reorderPoint)">
                    {{ slotProps.data.quantity }}
                  </span>
              </template>
            </Column>
            <Column field="value" :header="t('reports.table.value')" sortable>
              <template #body="slotProps">
                ${{ formatNumber(slotProps.data.value) }}
              </template>
            </Column>
            <Column field="lastUpdated" :header="t('reports.table.last_updated')" sortable>
              <template #body="slotProps">
                {{ formatDate(slotProps.data.lastUpdated) }}
              </template>
            </Column>
          </DataTable>
        </div>
      </div>

      <!-- Performance Report -->
      <div v-if="selectedReportType.id === 'performance'" class="report-section">
        <h2 class="report-title">
          <i class="pi pi-chart-line"></i>
          {{ t('reports.performance_report') }}
        </h2>
        <p class="report-description">{{ t('reports.performance_report_description') }}</p>

        <!-- KPI Cards -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <h3 class="kpi-title">
              <i class="pi pi-check-square"></i>
              {{ t('performance.order_fulfillment') }}
            </h3>
            <div class="kpi-value">{{ performanceData.orderFulfillment }}%</div>
            <div class="kpi-trend up">
              +1.2% {{ t('performance.trend_up') }}
              <span class="trend-icon">
                  <i class="pi pi-arrow-up" aria-hidden="true"></i>
                </span>
            </div>
          </div>
          <div class="kpi-card">
            <h3 class="kpi-title">
              <i class="pi pi-percentage"></i>
              {{ t('performance.inventory_accuracy') }}
            </h3>
            <div class="kpi-value">{{ performanceData.inventoryAccuracy }}%</div>
            <div class="kpi-trend up">
              +0.5% {{ t('performance.trend_up') }}
              <span class="trend-icon">
                  <i class="pi pi-arrow-up" aria-hidden="true"></i>
                </span>
            </div>
          </div>
          <div class="kpi-card">
            <h3 class="kpi-title">
              <i class="pi pi-wallet"></i>
              {{ t('performance.carrying_cost') }}
            </h3>
            <div class="kpi-value">${{ formatNumber(performanceData.carryingCost) }}</div>
            <div class="kpi-trend down">
              -2.3% {{ t('performance.trend_down') }}
              <span class="trend-icon">
                  <i class="pi pi-arrow-down" aria-hidden="true"></i>
                </span>
            </div>
          </div>
          <div class="kpi-card">
            <h3 class="kpi-title">{{ t('performance.stockout_rate') }}</h3>
            <div class="kpi-value">{{ performanceData.stockoutRate }}%</div>
            <div class="kpi-trend down">
              -0.8% {{ t('performance.trend_down') }}
              <span class="trend-icon">
                  <i class="pi pi-arrow-down" aria-hidden="true"></i>
                </span>
            </div>
          </div>
        </div>

        <!-- Performance Chart -->
        <div class="chart-section">
          <div class="chart-card">
            <h3 class="chart-title">
              <i class="pi pi-chart-line"></i>
              {{ t('reports.performance_trends') }}
            </h3>
            <div class="chart-container">
              <!-- Mock chart using SVG -->
              <svg width="100%" height="300" class="mock-chart">
                <!-- Line chart grid -->
                <line x1="50" y1="50" x2="50" y2="250" stroke="var(--color-border)"/>
                <line x1="50" y1="250" x2="750" y2="250" stroke="var(--color-border)"/>

                <!-- Performance line -->
                <polyline
                    points="50,200 150,180 250,190 350,150 450,140 550,120 650,100 750,90"
                    fill="none"
                    stroke="var(--color-primary)"
                    stroke-width="3"
                />

                <!-- Data points -->
                <circle cx="50" cy="200" r="5" fill="var(--color-primary)"/>
                <circle cx="150" cy="180" r="5" fill="var(--color-primary)"/>
                <circle cx="250" cy="190" r="5" fill="var(--color-primary)"/>
                <circle cx="350" cy="150" r="5" fill="var(--color-primary)"/>
                <circle cx="450" cy="140" r="5" fill="var(--color-primary)"/>
                <circle cx="550" cy="120" r="5" fill="var(--color-primary)"/>
                <circle cx="650" cy="100" r="5" fill="var(--color-primary)"/>
                <circle cx="750" cy="90" r="5" fill="var(--color-primary)"/>

                <!-- X-axis labels -->
                <text x="50" y="270" text-anchor="middle" fill="var(--color-text-secondary)">{{
                    t('reports.months.jan')
                  }}
                </text>
                <text x="150" y="270" text-anchor="middle" fill="var(--color-text-secondary)">{{
                    t('reports.months.feb')
                  }}
                </text>
                <text x="250" y="270" text-anchor="middle" fill="var(--color-text-secondary)">{{
                    t('reports.months.mar')
                  }}
                </text>
                <text x="350" y="270" text-anchor="middle" fill="var(--color-text-secondary)">{{
                    t('reports.months.apr')
                  }}
                </text>
                <text x="450" y="270" text-anchor="middle" fill="var(--color-text-secondary)">{{
                    t('reports.months.may')
                  }}
                </text>
                <text x="550" y="270" text-anchor="middle" fill="var(--color-text-secondary)">{{
                    t('reports.months.jun')
                  }}
                </text>
                <text x="650" y="270" text-anchor="middle" fill="var(--color-text-secondary)">{{
                    t('reports.months.jul')
                  }}
                </text>
                <text x="750" y="270" text-anchor="middle" fill="var(--color-text-secondary)">{{
                    t('reports.months.aug')
                  }}
                </text>
              </svg>
            </div>
          </div>
        </div>

        <!-- Performance Table -->
        <div class="table-section">
          <h3 class="table-title">
            <i class="pi pi-list"></i>
            {{ t('reports.performance_details') }}
          </h3>
          <DataTable
              :value="performanceItems"
              :paginator="true"
              :rows="5"
              :rowsPerPageOptions="[5, 10, 20]"
              responsiveLayout="scroll"
              class="performance-table"
              stripedRows
          >
            <Column field="metric" :header="t('reports.table.metric')" sortable></Column>
            <Column field="current" :header="t('reports.table.current')" sortable></Column>
            <Column field="previous" :header="t('reports.table.previous')" sortable></Column>
            <Column field="change" :header="t('reports.table.change')" sortable>
              <template #body="slotProps">
                  <span :class="getChangeClass(slotProps.data.change)">
                    {{ slotProps.data.change > 0 ? '+' : '' }}{{ slotProps.data.change }}%
                  </span>
              </template>
            </Column>
            <Column field="target" :header="t('reports.table.target')" sortable></Column>
            <Column field="status" :header="t('reports.table.status')" sortable>
              <template #body="slotProps">
                  <span :class="getStatusClass(slotProps.data.status)">
                    {{ slotProps.data.status }}
                  </span>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <i class="pi pi-file-pdf empty-icon"></i>
      <h3>{{ t('reports.no_report_generated') }}</h3>
      <p>{{ t('reports.select_filters') }}</p>
    </div>
  </div>
</template>


<style scoped>
.reports-view {
  width: 100%;
}

/* Report Controls */
.report-controls {
  margin-bottom: var(--spacing-xl);
}

.control-section {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--color-shadow);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title .pi {
  color: var(--color-primary);
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-item label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-md);
}

/* Loading State */
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

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  color: var(--color-text-tertiary);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
  color: var(--color-border);
}

/* Report Content */
.report-section {
  margin-bottom: var(--spacing-xl);
}

.report-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.report-description {
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
}

/* KPI Cards */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.kpi-card {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--color-shadow);
  transition: box-shadow var(--transition-normal), background-color var(--transition-normal);
}

.kpi-card:hover {
  box-shadow: var(--color-shadow);
}

.kpi-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.kpi-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.kpi-trend {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  display: flex;
  align-items: center;
}

.kpi-trend.up {
  color: var(--color-success);
}

.kpi-trend.down {
  color: var(--color-error);
}

.kpi-trend.neutral {
  color: var(--color-text-tertiary);
}

.trend-icon {
  margin-left: var(--spacing-xs);
}

/* Chart Section */
.chart-section {
  margin-bottom: var(--spacing-xl);
}

.chart-card {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--color-shadow);
  transition: box-shadow var(--transition-normal);
}

.chart-card:hover {
  box-shadow: var(--color-shadow);
}

.chart-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chart-title .pi {
  color: var(--color-primary);
}

.chart-container {
  width: 100%;
  overflow: hidden;
}

.mock-chart {
  max-width: 100%;
  height: auto;
}

/* Table Section */
.table-section {
  margin-bottom: var(--spacing-xl);
}

.table-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.table-title .pi {
  color: var(--color-primary);
}

/* Status and Quantity Classes */
.quantity-critical {
  color: var(--color-error);
  font-weight: var(--font-weight-bold);
}

.quantity-warning {
  color: var(--color-warning);
  font-weight: var(--font-weight-bold);
}

.quantity-good {
  color: var(--color-success);
}

.change-positive {
  color: var(--color-success);
  font-weight: var(--font-weight-medium);
}

.change-negative {
  color: var(--color-error);
  font-weight: var(--font-weight-medium);
}

.status-good {
  color: var(--color-success);
  font-weight: var(--font-weight-medium);
}

.status-improving {
  color: var(--color-info);
  font-weight: var(--font-weight-medium);
}

.status-warning {
  color: var(--color-warning);
  font-weight: var(--font-weight-medium);
}

.status-critical {
  color: var(--color-error);
  font-weight: var(--font-weight-medium);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .filter-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>
