import {beforeEach, describe, expect, it, vi} from 'vitest';
import {shallowMount} from '@vue/test-utils';
import {createI18n} from 'vue-i18n';
import {createPinia, setActivePinia} from 'pinia';
import AnalystDashboard from '../../src/views/analyst-dashboard.vue';

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    path: '/analyst'
  }))
}));

// Mock the components used in AnalystDashboard
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

vi.mock('../../src/components/simulation-controls.vue', () => ({
  default: {
    name: 'SimulationControls',
    template: '<div class="mock-simulation-controls"></div>'
  }
}));

// Create a mock i18n instance for testing
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      analyst: {
        dashboard_title: 'Analyst Dashboard',
        welcome: 'Welcome, {name}',
        dashboard_description: 'Analyst dashboard description',
        kpi: {
          active_simulations: 'Active Simulations',
          completed_reports: 'Completed Reports',
          data_accuracy: 'Data Accuracy',
          predictions_generated: 'Predictions Generated'
        },
        tabs: {
          overview: 'Overview',
          simulations: 'Simulations',
          reports: 'Reports',
          ai_insights: 'AI Insights',
          inventory: 'Inventory'
        },
        recent_simulations: 'Recent Simulations',
        no_recent_simulations: 'No recent simulations',
        new_simulation: 'New Simulation',
        view_all_simulations: 'View All Simulations',
        recent_reports: 'Recent Reports',
        no_recent_reports: 'No recent reports',
        new_report: 'New Report',
        view_all_reports: 'View All Reports',
        ai_recommendations: 'AI Recommendations',
        no_ai_recommendations: 'No AI recommendations',
        view_all_recommendations: 'View All Recommendations',
        quick_actions: 'Quick Actions',
        actions: {
          create_simulation: 'Create Simulation',
          generate_report: 'Generate Report',
          analyze_trends: 'Analyze Trends',
          export_data: 'Export Data'
        },
        status: {
          completed: 'Completed',
          in_progress: 'In Progress',
          pending: 'Pending'
        },
        impact: {
          high: 'High Impact',
          medium: 'Medium Impact',
          low: 'Low Impact'
        },
        view_report: 'View Report',
        export_report: 'Export Report',
        no_reports: 'No reports available'
      },
      common: {
        loading: 'Loading...'
      },
      time: {
        minutes_ago: '{count} minutes ago',
        hours_ago: '{count} hours ago',
        days_ago: '{count} days ago'
      }
    }
  }
});

describe('AnalystDashboard.vue', () => {
  let wrapper;

  beforeEach(() => {
    // Create a fresh pinia instance for each test
    const pinia = createPinia();
    setActivePinia(pinia);

    // Mock the auth store
    vi.mock('../../src/stores/auth', () => ({
      useAuthStore: vi.fn(() => ({
        user: { name: 'Analyst User' },
        role: 'analyst',
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

    // Mock the simulation store
    vi.mock('../../src/stores/simulationControls', () => ({
      useSimulationStore: vi.fn(() => ({
        simulations: []
      }))
    }));

    // Shallow mount the component with the necessary props and plugins
    wrapper = shallowMount(AnalystDashboard, {
      global: {
        plugins: [i18n, pinia],
        stubs: {
          'router-link': true,
          'router-view': true,
          'DashboardLayout': true,
          'InventoryDashboard': true,
          'AiInsightsDashboard': true,
          'SimulationControls': true
        }
      }
    });
  });

  it('renders the analyst dashboard with correct title', () => {
    // Check that the dashboard layout is rendered with the correct title
    const dashboardLayout = wrapper.findComponent({ name: 'DashboardLayout' });
    expect(dashboardLayout.exists()).toBe(true);
    expect(dashboardLayout.props('title')).toBe('Analyst Dashboard');
    expect(dashboardLayout.props('activeItem')).toBe('dashboard');
  });

  it('shows loading state initially', () => {
    // The component starts with isLoading = true
    expect(wrapper.vm.isLoading).toBe(true);

    // When using shallowMount, we can't check for the loading container directly
    // because it's inside the component's template, not in the stub
    // Instead, we'll check that the component has the expected structure
    expect(wrapper.vm.analystMetrics).toBeDefined();
    expect(wrapper.vm.kpis).toBeDefined();
  });

  it('has the correct structure when mounted', () => {
    // Verify that the component has the expected structure
    expect(wrapper.vm.isLoading).toBe(true);
    expect(wrapper.vm.analystMetrics).toBeDefined();
    expect(wrapper.vm.recentSimulations).toEqual([]);
    expect(wrapper.vm.recentReports).toEqual([]);
    expect(wrapper.vm.aiRecommendations).toEqual([]);

    // Verify that the computed kpis property returns the expected data
    expect(wrapper.vm.kpis).toHaveLength(4);
    expect(wrapper.vm.kpis[0].title).toBe('Active Simulations');
    expect(wrapper.vm.kpis[1].title).toBe('Completed Reports');
    expect(wrapper.vm.kpis[2].title).toBe('Data Accuracy');
    expect(wrapper.vm.kpis[3].title).toBe('Predictions Generated');
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

  it('has a getStatusClass method that returns the correct class for different statuses', () => {
    // Get the getStatusClass method from the component
    const getStatusClass = wrapper.vm.getStatusClass;

    // Check that the method returns the expected classes for different statuses
    expect(getStatusClass('completed')).toBe('status-completed');
    expect(getStatusClass('in_progress')).toBe('status-in-progress');
    expect(getStatusClass('pending')).toBe('status-pending');
    expect(getStatusClass('unknown')).toBe('');
  });

  it('has a getImpactClass method that returns the correct class for different impact levels', () => {
    // Get the getImpactClass method from the component
    const getImpactClass = wrapper.vm.getImpactClass;

    // Check that the method returns the expected classes for different impact levels
    expect(getImpactClass('high')).toBe('impact-high');
    expect(getImpactClass('medium')).toBe('impact-medium');
    expect(getImpactClass('low')).toBe('impact-low');
    expect(getImpactClass('unknown')).toBe('');
  });

  it('has a createNewSimulation method that logs the action', () => {
    // Spy on console.log
    const consoleSpy = vi.spyOn(console, 'log');

    // Call the createNewSimulation method directly
    wrapper.vm.createNewSimulation();

    // Check that the method logged the correct message
    expect(consoleSpy).toHaveBeenCalledWith('Create new simulation');

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
