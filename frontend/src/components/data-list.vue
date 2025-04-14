<script setup>
import {computed, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import BaseCard from './base/base-card.vue';

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
const sortKey = ref(props.initialSortKey);
const sortOrder = ref(1); // 1 for ascending, -1 for descending

// Watch for changes in filter text and emit events
watch(filterText, (newValue) => {
  emit('filter-changed', newValue);
});

// Computed property for filtered and sorted items
const filteredAndSortedItems = computed(() => {
  // First filter the items
  const filtered = props.items.filter((item) => {
    if (!filterText.value) return true;

    // Check if any property contains the filter text
    return Object.values(item).some((value) => 
      String(value).toLowerCase().includes(filterText.value.toLowerCase())
    );
  });

  // Then sort the filtered items
  if (sortKey.value) {
    return [...filtered].sort((a, b) => {
      const aValue = a[sortKey.value];
      const bValue = b[sortKey.value];

      // Handle different types of values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder.value * aValue.localeCompare(bValue);
      } else {
        return sortOrder.value * (aValue > bValue ? 1 : aValue < bValue ? -1 : 0);
      }
    });
  }

  return filtered;
});

// Method to toggle sort order
const toggleSort = (key) => {
  if (sortKey.value === key) {
    // If already sorting by this key, toggle the order
    sortOrder.value = -sortOrder.value;
  } else {
    // Otherwise, sort by this key in ascending order
    sortKey.value = key;
    sortOrder.value = 1;
  }
};

// Method to handle item selection
const selectItem = (item) => {
  emit('item-selected', item);
};

// Method to clear the filter
const clearFilter = () => {
  filterText.value = '';
};

// Computed property for column headers
const columnHeaders = computed(() => {
  if (props.items.length === 0) return [];

  // Get the keys from the first item
  return Object.keys(props.items[0]);
});

// Computed property for sort indicator
const getSortIndicator = (key) => {
  if (sortKey.value !== key) return '';
  return sortOrder.value === 1 ? '↑' : '↓';
};
</script>

<template>
  <BaseCard class="data-list-card">
    <template #header>
      <div class="data-list-header">
        <div class="filter-container">
          <label :for="'filter-input'" class="filter-label">{{ t('data_list.filter') }}:</label>
          <div class="filter-input-container">
            <input
              :id="'filter-input'"
              v-model="filterText"
              type="text"
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
        <div class="results-count">
          {{ t('data_list.showing_results', { count: filteredAndSortedItems.length, total: items.length }) }}
        </div>
      </div>
    </template>

    <div class="data-list-container">
      <table class="data-list-table">
        <thead>
          <tr>
            <th 
              v-for="header in columnHeaders" 
              :key="header"
              :class="{ sortable: sortable, active: sortKey === header }"
              @click="sortable ? toggleSort(header) : null"
            >
              {{ header }}
              <span v-if="sortable && sortKey === header" class="sort-indicator">
                {{ getSortIndicator(header) }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(item, index) in filteredAndSortedItems" 
            :key="index"
            @click="selectItem(item)"
            class="data-list-row"
            :class="{ 'data-list-row-even': index % 2 === 0 }"
          >
            <td v-for="header in columnHeaders" :key="header">
              {{ item[header] }}
            </td>
          </tr>
          <tr v-if="filteredAndSortedItems.length === 0" class="no-results-row">
            <td :colspan="columnHeaders.length" class="no-results-cell">
              {{ t('data_list.no_results') }}
            </td>
          </tr>
        </tbody>
      </table>
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

.filter-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

.data-list-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.data-list-table th {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
  font-weight: 600;
}

.data-list-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.data-list-table th.sortable:hover {
  background-color: #f3f4f6;
}

.data-list-table th.active {
  color: #4f46e5;
}

.sort-indicator {
  margin-left: 0.25rem;
}

.data-list-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.data-list-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.data-list-row:hover {
  background-color: #f3f4f6;
}

.data-list-row-even {
  background-color: #f9fafb;
}

.no-results-row {
  cursor: default;
}

.no-results-cell {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
}
</style>
