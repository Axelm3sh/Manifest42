<script setup>
import {computed, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import BaseCard from './base/base-card.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const { t } = useI18n();

// Define props with explicit types and validation
const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
    validator: (value) => Array.isArray(value)
  },
  filterKey: {
    type: String,
    required: false,
    default: ''
  },
  sortable: {
    type: Boolean,
    required: false,
    default: true
  },
  initialSortKey: {
    type: String,
    required: false,
    default: ''
  }
});

// Define emits with validation
const emit = defineEmits({
  'item-selected': (item) => item !== undefined,
  'filter-changed': (filterValue) => typeof filterValue === 'string'
});

// Reactive state using refs
const filterText = ref(props.filterKey);
const filters = ref({});
const sortField = ref(props.initialSortKey);
const sortOrder = ref(1); // 1 for ascending, -1 for descending
const globalFilterFields = ref([]);

// Watch for changes in filter text and emit events
watch(filterText, (newValue) => {
  emit('filter-changed', newValue);
  filters.value.global = { value: newValue, matchMode: 'contains' };
});

// Initialize global filter fields based on first item
watch(() => props.items, (newItems) => {
  if (newItems.length > 0) {
    globalFilterFields.value = Object.keys(newItems[0]);
  }
}, { immediate: true });

// Method to handle item selection
const onRowSelect = (event) => {
  emit('item-selected', event.data);
};

// Method to clear the filter
const clearFilter = () => {
  filterText.value = '';
  filters.value = {};
};

// Computed property for column headers
const columnHeaders = computed(() => {
  if (props.items.length === 0) return [];

  // Get the keys from the first item
  return Object.keys(props.items[0]);
});

// Computed property for DataTable styling
const dataTablePT = computed(() => ({
  root: { class: 'data-list-table' },
  header: { class: 'data-list-header' },
  table: { class: 'w-full border-collapse text-sm' },
  thead: { class: '' },
  headerRow: { class: '' },
  headerCell: { 
    class: 'text-left p-3 border-b-2 border-gray-200 font-semibold' 
  },
  tbody: { class: '' },
  row: { 
    class: 'cursor-pointer transition-colors hover:bg-gray-100' 
  },
  roweven: { class: 'bg-gray-50' },
  rowodd: { class: '' },
  column: { class: 'p-3 border-b border-gray-200' },
  emptyMessage: { 
    class: 'text-center p-8 text-gray-500 italic' 
  }
}));

// Computed property for filtered items count
const filteredItemsCount = computed(() => {
  if (!filterText.value) return props.items.length;

  return props.items.filter(item => 
    Object.values(item).some(value => 
      String(value).toLowerCase().includes(filterText.value.toLowerCase())
    )
  ).length;
});

// Export methods
const exportCSV = () => {
  if (props.items.length === 0) return;

  // Get headers from the first item
  const headers = Object.keys(props.items[0]);

  // Create CSV content
  let csvContent = headers.join(',') + '\n';

  // Add data rows
  props.items.forEach(item => {
    const row = headers.map(header => {
      // Handle values that might contain commas or quotes
      const value = item[header] !== null && item[header] !== undefined ? item[header] : '';
      const valueStr = String(value);
      return valueStr.includes(',') || valueStr.includes('"') 
        ? `"${valueStr.replace(/"/g, '""')}"` 
        : valueStr;
    });
    csvContent += row.join(',') + '\n';
  });

  // Create and download the file
  downloadFile(csvContent, 'data-export.csv', 'text/csv');
};

const exportExcel = () => {
  if (props.items.length === 0) return;

  // Get headers from the first item
  const headers = Object.keys(props.items[0]);

  // Create Excel XML content
  let excelContent = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>';
  excelContent += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ';
  excelContent += 'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">';
  excelContent += '<Worksheet ss:Name="Sheet1"><Table>';

  // Add header row
  excelContent += '<Row>';
  headers.forEach(header => {
    excelContent += `<Cell><Data ss:Type="String">${header}</Data></Cell>`;
  });
  excelContent += '</Row>';

  // Add data rows
  props.items.forEach(item => {
    excelContent += '<Row>';
    headers.forEach(header => {
      const value = item[header] !== null && item[header] !== undefined ? item[header] : '';
      const valueStr = String(value).replace(/&/g, '&amp;')
                                   .replace(/</g, '&lt;')
                                   .replace(/>/g, '&gt;');
      excelContent += `<Cell><Data ss:Type="String">${valueStr}</Data></Cell>`;
    });
    excelContent += '</Row>';
  });

  excelContent += '</Table></Worksheet></Workbook>';

  // Create and download the file
  downloadFile(excelContent, 'data-export.xls', 'application/vnd.ms-excel');
};

// Helper function to download files
const downloadFile = (content, fileName, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};
</script>

<template>
  <BaseCard class="data-list-card">
    <template #header>
      <div class="data-list-header">
        <div class="filter-export-container">
          <div class="filter-container">
            <label :for="'filter-input'" class="filter-label">{{ t('data_list.filter') }}:</label>
            <div class="filter-input-container">
              <InputText
                :id="'filter-input'"
                v-model="filterText"
                class="filter-input"
                :placeholder="t('data_list.filter_placeholder')"
              />
              <button 
                v-if="filterText" 
                @click="clearFilter" 
                class="clear-filter-button"
                :aria-label="t('data_list.clear_filter')"
              >
                ×
              </button>
            </div>
          </div>
          <div class="export-container">
            <Button 
              icon="pi pi-file" 
              class="export-button p-button-outlined p-button-sm" 
              @click="exportCSV" 
              :disabled="items.length === 0"
              :aria-label="t('data_list.export_csv')"
              :title="t('data_list.export_csv')"
            >
              CSV
            </Button>
            <Button 
              icon="pi pi-file-excel" 
              class="export-button p-button-outlined p-button-sm" 
              @click="exportExcel" 
              :disabled="items.length === 0"
              :aria-label="t('data_list.export_excel')"
              :title="t('data_list.export_excel')"
            >
              Excel
            </Button>
          </div>
        </div>
        <div class="results-count">
          {{ t('data_list.showing_results', { count: filteredItemsCount, total: items.length }) }}
        </div>
      </div>
    </template>

    <div class="data-list-container">
      <DataTable
        :value="items"
        :filters="filters"
        :global-filter-fields="globalFilterFields"
        :sortable="sortable"
        :sort-field="sortField"
        :sort-order="sortOrder"
        :pt="dataTablePT"
        @row-click="onRowSelect"
        :empty-message="t('data_list.no_results')"
        class="p-datatable-sm"
        responsive-layout="scroll"
        striped-rows
      >
        <Column 
          v-for="header in columnHeaders" 
          :key="header"
          :field="header"
          :header="header"
          :sortable="sortable"
        />
      </DataTable>
    </div>
  </BaseCard>
</template>

<style scoped>
.data-list-card {
  margin-bottom: 2rem;
}

.data-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-export-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.filter-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.export-container {
  display: flex;
  gap: 0.5rem;
}

.export-button {
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.filter-label {
  font-weight: 600;
}

.filter-input-container {
  position: relative;
}

.filter-input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  width: 200px;
  padding-right: 2rem;
}

.filter-input:focus {
  outline: 2px solid #646cff;
  outline-offset: 2px;
  border-color: transparent;
}

.clear-filter-button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  line-height: 1;
}

.results-count {
  font-size: 0.875rem;
  color: #6b7280;
}

.data-list-container {
  overflow-x: auto;
}

/* PrimeVue DataTable customizations */
:deep(.p-datatable) {
  font-size: 0.875rem;
}

:deep(.p-datatable .p-datatable-header) {
  background: transparent;
  border: none;
  padding: 0;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: transparent;
  color: inherit;
  border-width: 0 0 2px 0;
  border-color: #e5e7eb;
  padding: 0.75rem;
  font-weight: 600;
}

:deep(.p-datatable .p-datatable-thead > tr > th.p-sortable-column:hover) {
  background-color: #f3f4f6;
}

:deep(.p-datatable .p-datatable-thead > tr > th.p-highlight) {
  color: #4f46e5;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f3f4f6;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  border-width: 0 0 1px 0;
  border-color: #e5e7eb;
  padding: 0.75rem;
}

:deep(.p-datatable .p-datatable-tbody > tr:nth-child(even)) {
  background-color: #f9fafb;
}

:deep(.p-datatable .p-datatable-tbody > tr.p-datatable-emptymessage > td) {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
}

/* Responsive design enhancements for mobile views */
@media (max-width: 640px) {
  .data-list-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-export-container {
    width: 100%;
    justify-content: space-between;
  }

  .filter-container {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .filter-input-container {
    width: 100%;
  }

  .filter-input {
    width: 100%;
  }

  .export-container {
    margin-top: 0.5rem;
  }

  .results-count {
    margin-top: 0.5rem;
    align-self: flex-end;
  }

  ::deep(.p-datatable-wrapper) {
    overflow-x: auto;
  }

  ::deep(.p-datatable .p-datatable-thead > tr > th),
  ::deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 0.5rem;
    font-size: 0.75rem;
  }

  .export-button {
    min-width: 60px;
    font-size: 0.75rem;
  }
}
</style>
