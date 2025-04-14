import {defineStore} from 'pinia';
import {computed, ref} from 'vue';

/**
 * Store for real-time inventory data
 * Manages inventory levels, warehouse data, and real-time updates
 */
export const useInventoryDataStore = defineStore('inventoryData', () => {
  // State
  const inventoryItems = ref([]);
  const warehouseData = ref([]);
  const kpiData = ref({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    inventoryTurnover: 0,
    averageStockLevel: 0
  });
  const refreshInterval = ref(30); // seconds
  const isRealTimeEnabled = ref(true);
  const isLoading = ref(false);
  const error = ref(null);
  const lastUpdated = ref(null);
  let pollingInterval = null;

  // Getters
  const totalItems = computed(() => kpiData.value.totalItems);

  const sortedInventoryItems = computed(() => {
    return [...inventoryItems.value].sort((a, b) => a.name.localeCompare(b.name));
  });

  const lowStockItems = computed(() => {
    return inventoryItems.value.filter(item => 
      item.stockLevel < item.reorderPoint && item.stockLevel > 0
    );
  });

  const outOfStockItems = computed(() => {
    return inventoryItems.value.filter(item => item.stockLevel === 0);
  });

  const warehouseUtilization = computed(() => {
    if (!warehouseData.value.length) return [];

    return warehouseData.value.map(warehouse => ({
      id: warehouse.id,
      name: warehouse.name,
      utilization: (warehouse.currentCapacity / warehouse.totalCapacity) * 100,
      currentCapacity: warehouse.currentCapacity,
      totalCapacity: warehouse.totalCapacity
    }));
  });

  const inventoryValueByCategory = computed(() => {
    const categories = {};

    inventoryItems.value.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = 0;
      }
      categories[item.category] += item.stockLevel * item.unitPrice;
    });

    return Object.entries(categories).map(([category, value]) => ({
      category,
      value
    }));
  });

  // Actions
  function fetchInventoryData() {
    isLoading.value = true;
    error.value = null;

    // In a real app, this would be an API call
    setTimeout(() => {
      try {
        // Simulate API response
        inventoryItems.value = generateMockInventoryItems();
        updateKPIs();
        lastUpdated.value = new Date().toISOString();
        isLoading.value = false;
      } catch (err) {
        error.value = err.message || 'Failed to fetch inventory data';
        isLoading.value = false;
      }
    }, 1000);
  }

  function fetchWarehouseData() {
    isLoading.value = true;
    error.value = null;

    // In a real app, this would be an API call
    setTimeout(() => {
      try {
        // Simulate API response
        warehouseData.value = generateMockWarehouseData();
        lastUpdated.value = new Date().toISOString();
        isLoading.value = false;
      } catch (err) {
        error.value = err.message || 'Failed to fetch warehouse data';
        isLoading.value = false;
      }
    }, 1000);
  }

  function startRealTimeUpdates() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    isRealTimeEnabled.value = true;

    // In a real app, this would use WebSockets instead of polling
    pollingInterval = setInterval(() => {
      if (isRealTimeEnabled.value && !isLoading.value) {
        updateInventoryInRealTime();
      }
    }, refreshInterval.value * 1000);
  }

  function stopRealTimeUpdates() {
    isRealTimeEnabled.value = false;

    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  }

  function setRefreshInterval(seconds) {
    refreshInterval.value = seconds;

    if (isRealTimeEnabled.value) {
      startRealTimeUpdates(); // Restart with new interval
    }
  }

  function updateInventoryInRealTime() {
    // In a real app, this would fetch updates via WebSocket
    // Here we'll simulate random changes to inventory levels

    if (inventoryItems.value.length === 0) {
      fetchInventoryData();
      return;
    }

    // Update a random subset of items
    const numItemsToUpdate = Math.floor(Math.random() * 3) + 1;
    const itemsToUpdate = new Set();

    while (itemsToUpdate.size < numItemsToUpdate && itemsToUpdate.size < inventoryItems.value.length) {
      const randomIndex = Math.floor(Math.random() * inventoryItems.value.length);
      itemsToUpdate.add(randomIndex);
    }

    itemsToUpdate.forEach(index => {
      const item = inventoryItems.value[index];
      const change = Math.floor(Math.random() * 5) - 2; // -2 to +2

      // Ensure stock level doesn't go below 0
      item.stockLevel = Math.max(0, item.stockLevel + change);

      // Update last activity
      item.lastActivity = new Date().toISOString();
    });

    // Update KPIs based on new data
    updateKPIs();
    lastUpdated.value = new Date().toISOString();
  }

  function updateKPIs() {
    if (inventoryItems.value.length === 0) return;

    const totalItems = inventoryItems.value.reduce((sum, item) => sum + item.stockLevel, 0);
    const totalValue = inventoryItems.value.reduce((sum, item) => sum + (item.stockLevel * item.unitPrice), 0);

    kpiData.value = {
      totalItems,
      totalValue,
      lowStockItems: lowStockItems.value.length,
      outOfStockItems: outOfStockItems.value.length,
      inventoryTurnover: calculateInventoryTurnover(),
      averageStockLevel: totalItems / inventoryItems.value.length
    };
  }

  function calculateInventoryTurnover() {
    // In a real app, this would use actual sales data
    // Here we'll simulate a random value between 2 and 8
    return (Math.random() * 6 + 2).toFixed(2);
  }

  // Helper function to generate mock data
  function generateMockInventoryItems() {
    const categories = ['Electronics', 'Clothing', 'Home Goods', 'Sporting Goods', 'Office Supplies'];
    const products = [
      { name: 'Laptop', category: 'Electronics', unitPrice: 899.99 },
      { name: 'Smartphone', category: 'Electronics', unitPrice: 699.99 },
      { name: 'Tablet', category: 'Electronics', unitPrice: 349.99 },
      { name: 'Monitor', category: 'Electronics', unitPrice: 249.99 },
      { name: 'T-shirt', category: 'Clothing', unitPrice: 19.99 },
      { name: 'Jeans', category: 'Clothing', unitPrice: 49.99 },
      { name: 'Sweater', category: 'Clothing', unitPrice: 39.99 },
      { name: 'Sofa', category: 'Home Goods', unitPrice: 899.99 },
      { name: 'Coffee Table', category: 'Home Goods', unitPrice: 199.99 },
      { name: 'Bed Frame', category: 'Home Goods', unitPrice: 299.99 },
      { name: 'Basketball', category: 'Sporting Goods', unitPrice: 29.99 },
      { name: 'Tennis Racket', category: 'Sporting Goods', unitPrice: 89.99 },
      { name: 'Yoga Mat', category: 'Sporting Goods', unitPrice: 24.99 },
      { name: 'Desk Chair', category: 'Office Supplies', unitPrice: 149.99 },
      { name: 'Printer', category: 'Office Supplies', unitPrice: 199.99 },
      { name: 'Notebook', category: 'Office Supplies', unitPrice: 4.99 }
    ];

    return products.map((product, index) => {
      const stockLevel = Math.floor(Math.random() * 100);
      const reorderPoint = Math.floor(Math.random() * 20) + 10;

      return {
        id: `item-${index + 1}`,
        name: product.name,
        category: product.category,
        stockLevel,
        reorderPoint,
        unitPrice: product.unitPrice,
        warehouseId: `wh-${Math.floor(Math.random() * 3) + 1}`,
        lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      };
    });
  }

  function generateMockWarehouseData() {
    const warehouses = [
      { id: 'wh-1', name: 'North Warehouse' },
      { id: 'wh-2', name: 'South Warehouse' },
      { id: 'wh-3', name: 'East Warehouse' }
    ];

    return warehouses.map(warehouse => {
      const totalCapacity = Math.floor(Math.random() * 5000) + 5000;
      const currentCapacity = Math.floor(Math.random() * totalCapacity);

      return {
        id: warehouse.id,
        name: warehouse.name,
        location: `Location ${warehouse.id.split('-')[1]}`,
        totalCapacity,
        currentCapacity,
        utilizationRate: (currentCapacity / totalCapacity) * 100
      };
    });
  }

  // Cleanup function
  function $dispose() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  }

  return {
    // State
    inventoryItems,
    warehouseData,
    kpiData,
    refreshInterval,
    isRealTimeEnabled,
    isLoading,
    error,
    lastUpdated,

    // Getters
    totalItems,
    sortedInventoryItems,
    lowStockItems,
    outOfStockItems,
    warehouseUtilization,
    inventoryValueByCategory,

    // Actions
    fetchInventoryData,
    fetchWarehouseData,
    startRealTimeUpdates,
    stopRealTimeUpdates,
    setRefreshInterval,
    updateInventoryInRealTime,

    // Cleanup
    $dispose
  };
});

// Export an alias for backward compatibility
export const useInventoryStore = useInventoryDataStore;
