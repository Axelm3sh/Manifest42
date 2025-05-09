import {beforeEach, describe, expect, it, vi} from 'vitest';
import {shallowMount} from '@vue/test-utils';
import {createI18n} from 'vue-i18n';
import {createPinia, setActivePinia} from 'pinia';
import AdminDashboard from '../../src/views/admin-dashboard.vue';

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    path: '/admin'
  }))
}));

// Mock the components used in AdminDashboard
vi.mock('../../src/components/dashboard-layout.vue', () => ({
  default: {
    name: 'DashboardLayout',
    template: '<div class="mock-dashboard-layout"><slot /></div>',
    props: ['title', 'activeItem']
  }
}));

// No need to mock inventory components as they are loaded via router-view

vi.mock('../../src/components/ai-insights-dashboard.vue', () => ({
  default: {
    name: 'AiInsightsDashboard',
    template: '<div class="mock-ai-insights-dashboard"></div>'
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
      admin: {
        dashboard_title: 'Admin Dashboard',
        welcome: 'Welcome, {name}',
        dashboard_description: 'Admin dashboard description',
        kpi: {
          users: 'Users',
          pending_approvals: 'Pending Approvals',
          system_alerts: 'System Alerts',
          inventory_items: 'Inventory Items'
        },
        system_status: 'System Status',
        users_online: 'Users Online',
        pending_approvals: 'Pending Approvals',
        system_health: 'System Health',
        last_backup: 'Last Backup',
        health: {
          optimal: 'Optimal',
          warning: 'Warning',
          critical: 'Critical'
        },
        tabs: {
          overview: 'Overview',
          inventory: 'Inventory',
          ai_insights: 'AI Insights',
          notifications: 'Notifications'
        },
        recent_activities: 'Recent Activities',
        quick_actions: 'Quick Actions',
        actions: {
          manage_users: 'Manage Users',
          system_settings: 'System Settings',
          view_logs: 'View Logs',
          backup_system: 'Backup System'
        }
      },
      common: {
        loading: 'Loading...'
      },
      time: {
        just_now: 'Just now',
        minutes_ago: '{count} minutes ago',
        hours_ago: '{count} hours ago',
        days_ago: '{count} days ago'
      }
    }
  }
});

describe('AdminDashboard.vue', () => {
  let wrapper;

  beforeEach(() => {
    // Create a fresh pinia instance for each test
    const pinia = createPinia();
    setActivePinia(pinia);

    // Mock the stores
    vi.mock('../../src/stores/auth', () => ({
      useAuthStore: vi.fn(() => ({
        user: { name: 'Admin User' },
        role: 'admin',
        isLoggedIn: true
      }))
    }));

    vi.mock('../../src/stores/inventoryData', () => ({
      useInventoryStore: vi.fn(() => ({
        totalItems: 1250
      }))
    }));

    vi.mock('../../src/stores/aiInsights', () => ({
      useAiInsightsStore: vi.fn(() => ({
        insights: []
      }))
    }));

    vi.mock('../../src/stores/notifications', () => ({
      useNotificationsStore: vi.fn(() => ({
        notifications: []
      }))
    }));

    // Shallow mount the component with the necessary props and plugins
    wrapper = shallowMount(AdminDashboard, {
      global: {
        plugins: [i18n, pinia],
        stubs: {
          'router-link': true,
          'router-view': true,
          'DashboardLayout': true,
          'InventoryDashboard': true,
          'AiInsightsDashboard': true,
          'NotificationCenter': true
        }
      }
    });
  });

  it('renders the admin dashboard with correct title', () => {
    // Check that the dashboard layout is rendered with the correct title
    const dashboardLayout = wrapper.findComponent({ name: 'DashboardLayout' });
    expect(dashboardLayout.exists()).toBe(true);
    expect(dashboardLayout.props('title')).toBe('Admin Dashboard');
    expect(dashboardLayout.props('activeItem')).toBe('dashboard');
  });

  it('shows loading state initially', () => {
    // The component starts with isLoading = true
    expect(wrapper.vm.isLoading).toBe(true);

    // When using shallowMount, we can't check for the loading container directly
    // because it's inside the component's template, not in the stub
    // Instead, we'll check that the component has the expected structure
    expect(wrapper.vm.systemStatus).toBeDefined();
    expect(wrapper.vm.adminMetrics).toBeDefined();
  });

  it('has the correct structure when mounted', () => {
    // Verify that the component has the expected structure
    expect(wrapper.vm.isLoading).toBe(true);
    expect(wrapper.vm.systemStatus).toBeDefined();
    expect(wrapper.vm.adminMetrics).toBeDefined();
    expect(wrapper.vm.recentActivities).toEqual([]);

    // Verify that the computed kpis property returns the expected data
    expect(wrapper.vm.kpis).toHaveLength(4);
    expect(wrapper.vm.kpis[0].title).toBe('Users');
    expect(wrapper.vm.kpis[1].title).toBe('Pending Approvals');
    expect(wrapper.vm.kpis[2].title).toBe('System Alerts');
    expect(wrapper.vm.kpis[3].title).toBe('Inventory Items');
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
});
