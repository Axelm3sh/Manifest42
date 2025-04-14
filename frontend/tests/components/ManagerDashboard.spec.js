import {beforeEach, describe, expect, it, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import {createI18n} from 'vue-i18n';
import {createPinia, setActivePinia} from 'pinia';
import ManagerDashboard from '../../src/views/manager-dashboard.vue';

// Mock vue-router
vi.mock('vue-router/dist/vue-router.esm-bundler.js', () => ({
  useRoute: vi.fn(() => ({
    path: '/manager'
  }))
}));

// Mock the components used in ManagerDashboard
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
      manager: {
        dashboard_title: 'Manager Dashboard',
        welcome: 'Welcome, {name}',
        dashboard_description: 'Manager dashboard description',
        kpi: {
          pending_approvals: 'Pending Approvals',
          inventory_alerts: 'Inventory Alerts',
          team_performance: 'Team Performance',
          cost_savings: 'Cost Savings'
        },
        pending_approvals: 'Pending Approvals',
        no_pending_approvals: 'No pending approvals',
        team_performance: 'Team Performance',
        avg_performance: 'Average Performance',
        team_members: 'Team Members',
        online_now: 'Online Now',
        quick_actions: 'Quick Actions',
        view_all_approvals: 'View All Approvals',
        view_team_details: 'View Team Details',
        tabs: {
          overview: 'Overview',
          approvals: 'Approvals',
          team: 'Team',
          inventory: 'Inventory',
          ai_insights: 'AI Insights'
        },
        actions: {
          create_report: 'Create Report',
          schedule_meeting: 'Schedule Meeting',
          adjust_parameters: 'Adjust Parameters',
          review_forecasts: 'Review Forecasts'
        },
        priority: {
          high: 'High',
          medium: 'Medium',
          low: 'Low'
        },
        approve: 'Approve',
        reject: 'Reject',
        request_info: 'Request Info',
        performance: 'Performance',
        tasks: 'Tasks',
        task_completion: 'Task Completion',
        assign_task: 'Assign Task',
        message: 'Message',
        status: {
          online: 'Online',
          away: 'Away',
          offline: 'Offline'
        },
        approval_types: {
          inventory_adjustment: 'Inventory Adjustment',
          price_change: 'Price Change',
          supplier_change: 'Supplier Change',
          forecast_adjustment: 'Forecast Adjustment'
        },
        requested_by: 'Requested by'
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

describe('ManagerDashboard.vue', () => {
  let wrapper;

  beforeEach(() => {
    // Create a fresh pinia instance for each test
    const pinia = createPinia();
    setActivePinia(pinia);

    // Mock the auth store
    vi.mock('../../src/stores/auth', () => ({
      useAuthStore: vi.fn(() => ({
        user: { name: 'Manager User' },
        role: 'manager',
        isLoggedIn: true
      }))
    }));

    // Mock the inventory store
    vi.mock('../../src/stores/inventoryData', () => ({
      useInventoryStore: vi.fn(() => ({
        totalItems: 1250
      }))
    }));

    // Mock the AI insights store
    vi.mock('../../src/stores/aiInsights', () => ({
      useAiInsightsStore: vi.fn(() => ({
        insights: []
      }))
    }));

    // Mock the notifications store
    vi.mock('../../src/stores/notifications', () => ({
      useNotificationsStore: vi.fn(() => ({
        notifications: []
      }))
    }));

    // Mount the component with the necessary props and plugins
    wrapper = mount(ManagerDashboard, {
      global: {
        plugins: [i18n, pinia],
        stubs: {
          'router-link': true,
          'router-view': true
        }
      }
    });
  });

  it('renders the manager dashboard with correct title', () => {
    // Check that the dashboard layout is rendered with the correct title
    const dashboardLayout = wrapper.findComponent({ name: 'DashboardLayout' });
    expect(dashboardLayout.exists()).toBe(true);
    expect(dashboardLayout.props('title')).toBe('Manager Dashboard');
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
    expect(kpiCards[0].text()).toContain('Pending Approvals');
    expect(kpiCards[1].text()).toContain('Inventory Alerts');
    expect(kpiCards[2].text()).toContain('Team Performance');
    expect(kpiCards[3].text()).toContain('Cost Savings');
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

  it('displays pending approvals when loaded', async () => {
    // Directly modify the component's reactive properties
    wrapper.vm.isLoading = false;
    wrapper.vm.pendingApprovals = [
      {
        id: 1,
        type: 'inventory_adjustment',
        requestedBy: 'Sarah Analyst',
        timestamp: new Date().toISOString(),
        details: 'Increase safety stock for SKU-12345 by 15%',
        priority: 'high',
      }
    ];

    // Wait for the DOM to update
    await wrapper.vm.$nextTick();

    // Check that pending approvals are displayed in the summary
    const approvalsSummary = wrapper.find('.approvals-summary');
    expect(approvalsSummary.exists()).toBe(true);
  });

  it('has a handleApproval method that updates approvals and metrics', async () => {
    // Directly modify the component's reactive properties
    wrapper.vm.isLoading = false;
    wrapper.vm.pendingApprovals = [
      {
        id: 1,
        type: 'inventory_adjustment',
        requestedBy: 'Sarah Analyst',
        timestamp: new Date().toISOString(),
        details: 'Increase safety stock for SKU-12345 by 15%',
        priority: 'high',
      }
    ];
    wrapper.vm.managerMetrics = {
      pendingApprovals: 1,
      inventoryAlerts: 5,
      teamPerformance: 92,
      costSavings: 24680,
    };

    // Wait for the DOM to update
    await wrapper.vm.$nextTick();

    // Call the handleApproval method directly
    wrapper.vm.handleApproval(1, 'approve');

    // Check that the approval was removed from the list
    expect(wrapper.vm.pendingApprovals.length).toBe(0);

    // Check that the metrics were updated
    expect(wrapper.vm.managerMetrics.pendingApprovals).toBe(0);
  });

  it('displays team performance summary when loaded', async () => {
    // Directly modify the component's reactive properties
    wrapper.vm.isLoading = false;
    wrapper.vm.teamMembers = [
      {
        id: 1,
        name: 'Sarah Analyst',
        role: 'Senior Analyst',
        performance: 95,
        status: 'online',
        tasks: 8,
        completedTasks: 5,
      }
    ];
    wrapper.vm.managerMetrics = {
      pendingApprovals: 1,
      inventoryAlerts: 5,
      teamPerformance: 92,
      costSavings: 24680,
    };

    // Wait for the DOM to update
    await wrapper.vm.$nextTick();

    // Check that team performance summary is displayed
    const teamSummary = wrapper.find('.team-summary');
    expect(teamSummary.exists()).toBe(true);
    expect(teamSummary.text()).toContain('92%'); // Team performance from managerMetrics
  });
});
