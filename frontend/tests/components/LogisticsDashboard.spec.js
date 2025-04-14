import {beforeEach, describe, expect, it, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import {createI18n} from 'vue-i18n';
import {createPinia, setActivePinia} from 'pinia';
import LogisticsDashboard from '../../src/views/logistics-dashboard.vue';

// Mock the components used in LogisticsDashboard
vi.mock('../../src/components/dashboard-layout.vue', () => ({
  default: {
    name: 'DashboardLayout',
    template: '<div class="mock-dashboard-layout"><slot /></div>',
    props: ['title', 'activeItem']
  }
}));

vi.mock('../../src/components/inventory-dashboard.vue', () => ({
  default: {
    name: 'InventoryDashboard',
    template: '<div class="mock-inventory-dashboard"></div>'
  }
}));

vi.mock('../../src/components/notification-center.vue', () => ({
  default: {
    name: 'NotificationCenter',
    template: '<div class="mock-notification-center"></div>'
  }
}));

// Create a mock i18n instance for testing
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      logistics: {
        dashboard_title: 'Logistics Dashboard',
        welcome: 'Welcome, {name}',
        dashboard_description: 'Logistics dashboard description',
        kpi: {
          pending_shipments: 'Pending Shipments',
          in_transit: 'In Transit',
          delivered_today: 'Delivered Today',
          stockout_risk: 'Stockout Risk'
        },
        tabs: {
          overview: 'Overview',
          shipments: 'Shipments',
          inventory: 'Inventory',
          deliveries: 'Deliveries',
          notifications: 'Notifications'
        },
        recent_shipments: 'Recent Shipments',
        no_recent_shipments: 'No recent shipments',
        new_shipment: 'New Shipment',
        view_all_shipments: 'View All Shipments',
        inventory_alerts: 'Inventory Alerts',
        no_inventory_alerts: 'No inventory alerts',
        view_all_alerts: 'View All Alerts',
        upcoming_deliveries: 'Upcoming Deliveries',
        no_upcoming_deliveries: 'No upcoming deliveries',
        view_all_deliveries: 'View All Deliveries',
        quick_actions: 'Quick Actions',
        actions: {
          create_shipment: 'Create Shipment',
          schedule_delivery: 'Schedule Delivery',
          inventory_count: 'Inventory Count',
          generate_report: 'Generate Report'
        },
        status: {
          delivered: 'Delivered',
          in_transit: 'In Transit',
          pending: 'Pending',
          on_time: 'On Time',
          delayed: 'Delayed'
        },
        priority: {
          high: 'High',
          medium: 'Medium',
          low: 'Low'
        },
        alert_level: {
          critical: 'Critical',
          warning: 'Warning',
          info: 'Info'
        },
        items_count: '{count} items',
        estimated_delivery: 'Estimated Delivery',
        delivered: 'Delivered',
        expected: 'Expected',
        restock: 'Restock',
        adjust_levels: 'Adjust Levels',
        view_details: 'View Details',
        update_status: 'Update Status',
        schedule_delivery: 'Schedule Delivery',
        shipments: 'Shipments',
        no_shipments: 'No shipments',
        no_deliveries: 'No deliveries'
      },
      common: {
        loading: 'Loading...'
      },
      time: {
        minutes_ago: '{count} minutes ago',
        hours_ago: '{count} hours ago',
        days_ago: '{count} days ago',
        in_minutes: 'in {count} minutes',
        in_hours: 'in {count} hours',
        in_days: 'in {count} days'
      }
    }
  }
});

describe('LogisticsDashboard.vue', () => {
  let wrapper;

  beforeEach(() => {
    // Create a fresh pinia instance for each test
    const pinia = createPinia();
    setActivePinia(pinia);

    // Mock the auth store
    vi.mock('../../src/stores/auth', () => ({
      useAuthStore: vi.fn(() => ({
        user: { name: 'Logistics User' },
        role: 'logistics',
        isLoggedIn: true
      }))
    }));

    // Mock the inventory store
    vi.mock('../../src/stores/inventoryData', () => ({
      useInventoryStore: vi.fn(() => ({
        totalItems: 1250
      }))
    }));

    // Mock the notifications store
    vi.mock('../../src/stores/notifications', () => ({
      useNotificationsStore: vi.fn(() => ({
        notifications: []
      }))
    }));

    // Mount the component with the necessary props and plugins
    wrapper = mount(LogisticsDashboard, {
      global: {
        plugins: [i18n, pinia],
        stubs: {
          'router-link': true
        }
      }
    });
  });

  it('renders the logistics dashboard with correct title', () => {
    // Check that the dashboard layout is rendered with the correct title
    const dashboardLayout = wrapper.findComponent({ name: 'DashboardLayout' });
    expect(dashboardLayout.exists()).toBe(true);
    expect(dashboardLayout.props('title')).toBe('Logistics Dashboard');
    expect(dashboardLayout.props('activeItem')).toBe('dashboard');
  });

  it('shows loading state initially', () => {
    // The component starts with isLoading = true
    expect(wrapper.find('.loading-container').exists()).toBe(true);
    expect(wrapper.find('.loading-spinner').exists()).toBe(true);
    expect(wrapper.text()).toContain('Loading...');
  });

  it('displays KPIs when loaded', async () => {
    // Directly modify the component's reactive property
    wrapper.vm.isLoading = false;

    // Wait for the DOM to update
    await wrapper.vm.$nextTick();

    // Check that KPIs are displayed
    const kpiCards = wrapper.findAll('.kpi-card');
    expect(kpiCards.length).toBe(4); // There should be 4 KPI cards

    // Check the content of the KPI cards
    expect(kpiCards[0].text()).toContain('Pending Shipments');
    expect(kpiCards[1].text()).toContain('In Transit');
    expect(kpiCards[2].text()).toContain('Delivered Today');
    expect(kpiCards[3].text()).toContain('Stockout Risk');
  });

  it('changes tab when tab button is clicked', async () => {
    // Directly modify the component's reactive property
    wrapper.vm.isLoading = false;

    // Wait for the DOM to update
    await wrapper.vm.$nextTick();

    // Check that the overview tab is active by default
    expect(wrapper.vm.activeTab).toBe('overview');

    // Find the shipments tab button and click it
    const shipmentsTabButton = wrapper.findAll('.tab-button').find(button => 
      button.text().includes('Shipments')
    );
    await shipmentsTabButton.trigger('click');

    // Check that the active tab has changed
    expect(wrapper.vm.activeTab).toBe('shipments');
  });

  it('displays recent shipments when loaded', async () => {
    // Directly modify the component's reactive properties
    wrapper.vm.isLoading = false;
    wrapper.vm.recentShipments = [
      {
        id: 'SHP-1234',
        destination: 'New York Distribution Center',
        status: 'in_transit',
        estimatedDelivery: new Date().toISOString(),
        items: 12,
        priority: 'high',
      }
    ];

    // Wait for the DOM to update
    await wrapper.vm.$nextTick();

    // Check that recent shipments are displayed in the overview tab
    const shipmentItems = wrapper.findAll('.shipment-item');
    expect(shipmentItems.length).toBe(1);
    expect(shipmentItems[0].text()).toContain('SHP-1234');
    expect(shipmentItems[0].text()).toContain('New York Distribution Center');
    expect(shipmentItems[0].text()).toContain('12 items');

    // Check that the status is displayed correctly
    const statusElement = shipmentItems[0].find('.shipment-status');
    expect(statusElement.exists()).toBe(true);
    expect(statusElement.text()).toContain('In Transit');
    expect(statusElement.classes()).toContain('status-in-progress');
  });

  it('displays inventory alerts when loaded', async () => {
    // Directly modify the component's reactive properties
    wrapper.vm.isLoading = false;
    wrapper.vm.inventoryAlerts = [
      {
        id: 1,
        item: 'Wireless Headphones',
        sku: 'SKU-5678',
        type: 'low_stock',
        level: 'critical',
        details: 'Current stock: 5 units (below safety threshold of 15)',
      }
    ];

    // Wait for the DOM to update
    await wrapper.vm.$nextTick();

    // Check that inventory alerts are displayed in the overview tab
    const alertItems = wrapper.findAll('.alert-item');
    expect(alertItems.length).toBe(1);
    expect(alertItems[0].text()).toContain('Wireless Headphones');
    expect(alertItems[0].text()).toContain('SKU-5678');
    expect(alertItems[0].text()).toContain('Current stock: 5 units');

    // Check that the alert level is displayed correctly
    const levelElement = alertItems[0].find('.alert-level');
    expect(levelElement.exists()).toBe(true);
    expect(levelElement.text()).toContain('Critical');
    expect(alertItems[0].classes()).toContain('alert-critical');
  });

  it('displays upcoming deliveries when loaded', async () => {
    // Directly modify the component's reactive properties
    wrapper.vm.isLoading = false;
    wrapper.vm.upcomingDeliveries = [
      {
        id: 'DEL-7890',
        supplier: 'TechSupplies Inc.',
        expectedArrival: new Date().toISOString(),
        items: 8,
        status: 'on_time',
      }
    ];

    // Wait for the DOM to update
    await wrapper.vm.$nextTick();

    // Check that upcoming deliveries are displayed in the overview tab
    const deliveryItems = wrapper.findAll('.delivery-item');
    expect(deliveryItems.length).toBe(1);
    expect(deliveryItems[0].text()).toContain('DEL-7890');
    expect(deliveryItems[0].text()).toContain('TechSupplies Inc.');
    expect(deliveryItems[0].text()).toContain('8 items');

    // Check that the status is displayed correctly
    const statusElement = deliveryItems[0].find('.delivery-status');
    expect(statusElement.exists()).toBe(true);
    expect(statusElement.text()).toContain('On Time');
    expect(statusElement.classes()).toContain('status-success');
  });

  it('handles inventory action correctly', async () => {
    // Spy on console.log
    const consoleSpy = vi.spyOn(console, 'log');

    // Simulate the loading completion with mock data
    wrapper.vm.isLoading = false;
    wrapper.vm.inventoryAlerts = [
      {
        id: 1,
        item: 'Wireless Headphones',
        sku: 'SKU-5678',
        type: 'low_stock',
        level: 'critical',
        details: 'Current stock: 5 units (below safety threshold of 15)',
      }
    ];

    // Wait for the DOM to update
    await wrapper.vm.$nextTick();

    // Find the restock button and click it
    const restockButton = wrapper.findAll('.alert-action-button').find(button => 
      button.text().includes('Restock')
    );
    await restockButton.trigger('click');

    // Check that the handleInventoryAction method was called
    expect(consoleSpy).toHaveBeenCalledWith('Inventory action restock for item 1');

    // Check that the alert was removed from the list
    expect(wrapper.vm.inventoryAlerts.length).toBe(0);

    // Clean up
    consoleSpy.mockRestore();
  });

  it('handles create new shipment action', async () => {
    // Spy on console.log
    const consoleSpy = vi.spyOn(console, 'log');

    // Simulate the loading completion
    wrapper.vm.isLoading = false;

    // Wait for the DOM to update
    await wrapper.vm.$nextTick();

    // Find the create shipment button and click it
    const createShipmentButton = wrapper.findAll('.action-button').find(button => 
      button.text().includes('Create Shipment')
    );
    await createShipmentButton.trigger('click');

    // Check that the createNewShipment method was called
    expect(consoleSpy).toHaveBeenCalledWith('Create new shipment');

    // Clean up
    consoleSpy.mockRestore();
  });
});
