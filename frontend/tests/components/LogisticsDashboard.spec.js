import {beforeEach, describe, expect, it, vi} from 'vitest';
import {shallowMount} from '@vue/test-utils';
import {createI18n} from 'vue-i18n';
import {createPinia, setActivePinia} from 'pinia';
import LogisticsDashboard from '../../src/views/logistics-dashboard.vue';

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    path: '/logistics'
  }))
}));

// Mock the components used in LogisticsDashboard
vi.mock('../../src/components/dashboard-layout.vue', () => ({
  default: {
    name: 'DashboardLayout',
    template: '<div class="mock-dashboard-layout"><slot /></div>',
    props: ['title', 'activeItem']
  }
}));

// No need to mock inventory components as they are loaded via router-view

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

    // Shallow mount the component with the necessary props and plugins
    wrapper = shallowMount(LogisticsDashboard, {
      global: {
        plugins: [i18n, pinia],
        stubs: {
          'router-link': true,
          'router-view': true,
          'DashboardLayout': true,
          'InventoryDashboard': true,
          'NotificationCenter': true
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
    expect(wrapper.vm.isLoading).toBe(true);

    // When using shallowMount, we can't check for the loading container directly
    // because it's inside the component's template, not in the stub
    // Instead, we'll check that the component has the expected structure
    expect(wrapper.vm.logisticsMetrics).toBeDefined();
    expect(wrapper.vm.kpis).toBeDefined();
  });

  it('has the correct structure when mounted', () => {
    // Verify that the component has the expected structure
    expect(wrapper.vm.isLoading).toBe(true);
    expect(wrapper.vm.logisticsMetrics).toBeDefined();
    expect(wrapper.vm.recentShipments).toEqual([]);
    expect(wrapper.vm.inventoryAlerts).toEqual([]);
    expect(wrapper.vm.upcomingDeliveries).toEqual([]);

    // Verify that the computed kpis property returns the expected data
    expect(wrapper.vm.kpis).toHaveLength(4);
    expect(wrapper.vm.kpis[0].title).toBe('Pending Shipments');
    expect(wrapper.vm.kpis[1].title).toBe('In Transit');
    expect(wrapper.vm.kpis[2].title).toBe('Delivered Today');
    expect(wrapper.vm.kpis[3].title).toBe('Stockout Risk');
  });

  it('has a getActiveItem function that returns the correct active item based on route', () => {
    // Get the getActiveItem function from the component
    const getActiveItem = wrapper.vm.getActiveItem;

    // Check that the function returns the expected value for the current route
    expect(getActiveItem()).toBe('dashboard');
  });

  it('has an isMainDashboardRoute computed property that returns true for main route', () => {
    // Check that isMainDashboardRoute is true for the main dashboard route
    expect(wrapper.vm.isMainDashboardRoute).toBe(true);
  });

  it('has a formatDate method that formats dates correctly', () => {
    // Get the formatDate method from the component
    const formatDate = wrapper.vm.formatDate;

    // Create a test date
    const testDate = new Date('2023-01-01T12:00:00Z').toISOString();

    // Format the date
    const formattedDate = formatDate(testDate);

    // Check that the date is formatted correctly
    expect(formattedDate).toContain('2023');
    expect(formattedDate).toMatch(/Jan|January|1/); // Month representation
    expect(formattedDate).toMatch(/1|01/); // Day representation
  });

  it('has a getTimeAgo method that calculates time differences correctly', () => {
    // Get the getTimeAgo method from the component
    const getTimeAgo = wrapper.vm.getTimeAgo;

    // Create test dates
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();

    // Calculate time differences
    const fiveMinutesAgoText = getTimeAgo(fiveMinutesAgo);
    const twoHoursAgoText = getTimeAgo(twoHoursAgo);
    const threeDaysAgoText = getTimeAgo(threeDaysAgo);

    // Check that the time differences are calculated correctly
    expect(fiveMinutesAgoText).toContain('minutes ago');
    expect(twoHoursAgoText).toContain('hours ago');
    expect(threeDaysAgoText).toContain('days ago');
  });

  it('has a getTimeUntil method that calculates future time differences correctly', () => {
    // Get the getTimeUntil method from the component
    const getTimeUntil = wrapper.vm.getTimeUntil;

    // Create test dates
    const now = new Date();
    const inFiveMinutes = new Date(now.getTime() + 5 * 60 * 1000).toISOString();
    const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();
    const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();

    // Calculate time differences
    const inFiveMinutesText = getTimeUntil(inFiveMinutes);
    const inTwoHoursText = getTimeUntil(inTwoHours);
    const inThreeDaysText = getTimeUntil(inThreeDays);

    // Check that the time differences are calculated correctly
    expect(inFiveMinutesText).toContain('in');
    expect(inFiveMinutesText).toContain('minutes');
    expect(inTwoHoursText).toContain('in');
    expect(inTwoHoursText).toContain('hours');
    expect(inThreeDaysText).toContain('in');
    expect(inThreeDaysText).toContain('days');
  });

  it('has a getStatusClass method that returns the correct class for different statuses', () => {
    // Get the getStatusClass method from the component
    const getStatusClass = wrapper.vm.getStatusClass;

    // Check that the method returns the expected classes for different statuses
    expect(getStatusClass('delivered')).toBe('status-success');
    expect(getStatusClass('on_time')).toBe('status-success');
    expect(getStatusClass('in_transit')).toBe('status-in-progress');
    expect(getStatusClass('pending')).toBe('status-pending');
    expect(getStatusClass('delayed')).toBe('status-warning');
    expect(getStatusClass('unknown')).toBe('');
  });

  it('has a getAlertLevelClass method that returns the correct class for different alert levels', () => {
    // Get the getAlertLevelClass method from the component
    const getAlertLevelClass = wrapper.vm.getAlertLevelClass;

    // Check that the method returns the expected classes for different alert levels
    expect(getAlertLevelClass('critical')).toBe('alert-critical');
    expect(getAlertLevelClass('warning')).toBe('alert-warning');
    expect(getAlertLevelClass('info')).toBe('alert-info');
    expect(getAlertLevelClass('unknown')).toBe('');
  });

  it('has a handleInventoryAction method that removes alerts and logs actions', async () => {
    // Spy on console.log
    const consoleSpy = vi.spyOn(console, 'log');

    // Set up test data
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

    // Call the handleInventoryAction method directly
    wrapper.vm.handleInventoryAction(1, 'restock');

    // Check that the method logged the correct message
    expect(consoleSpy).toHaveBeenCalledWith('Inventory action restock for item 1');

    // Check that the alert was removed from the list
    expect(wrapper.vm.inventoryAlerts.length).toBe(0);

    // Clean up
    consoleSpy.mockRestore();
  });

  it('has a createNewShipment method that logs the action', () => {
    // Spy on console.log
    const consoleSpy = vi.spyOn(console, 'log');

    // Call the createNewShipment method directly
    wrapper.vm.createNewShipment();

    // Check that the method logged the correct message
    expect(consoleSpy).toHaveBeenCalledWith('Create new shipment');

    // Clean up
    consoleSpy.mockRestore();
  });

  it('has a navigateTo method that logs the route', () => {
    // Spy on console.log
    const consoleSpy = vi.spyOn(console, 'log');

    // Call the navigateTo method directly
    wrapper.vm.navigateTo('/test-route');

    // Check that the method logged the correct message
    expect(consoleSpy).toHaveBeenCalledWith('Navigate to /test-route');

    // Clean up
    consoleSpy.mockRestore();
  });
});
