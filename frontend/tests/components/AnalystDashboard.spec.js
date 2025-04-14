import {beforeEach, describe, expect, it, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import {createI18n} from 'vue-i18n';
import {createPinia, setActivePinia} from 'pinia';
import AnalystDashboard from '../../src/views/analyst-dashboard.vue';

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

    // Mount the component with the necessary props and plugins
    wrapper = mount(AnalystDashboard, {
      global: {
        plugins: [i18n, pinia],
        stubs: {
          'router-link': true
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
    expect(kpiCards[0].text()).toContain('Active Simulations');
    expect(kpiCards[1].text()).toContain('Completed Reports');
    expect(kpiCards[2].text()).toContain('Data Accuracy');
    expect(kpiCards[3].text()).toContain('Predictions Generated');
  });

  it('changes tab when tab button is clicked', async () => {
    // Directly modify the component's reactive property
    wrapper.vm.isLoading = false;

    // Wait for the DOM to update
    await wrapper.vm.$nextTick();

    // Check that the overview tab is active by default
    expect(wrapper.vm.activeTab).toBe('overview');

    // Find the simulations tab button and click it
    const simulationsTabButton = wrapper.findAll('.tab-button').find(button => 
      button.text().includes('Simulations')
    );
    await simulationsTabButton.trigger('click');

    // Check that the active tab has changed
    expect(wrapper.vm.activeTab).toBe('simulations');

    // Check that the simulation controls component is displayed
    expect(wrapper.find('.mock-simulation-controls').exists()).toBe(true);
  });

  it('displays recent simulations when loaded', async () => {
    // Directly modify the component's reactive properties
    wrapper.vm.isLoading = false;
    wrapper.vm.recentSimulations = [
      {
        id: 1,
        title: 'Supply Chain Disruption Scenario',
        createdAt: new Date().toISOString(),
        status: 'in_progress',
        progress: 65,
        description: 'Simulating impact of 2-week shipping delay from primary suppliers',
      }
    ];

    // Wait for the DOM to update
    await wrapper.vm.$nextTick();

    // Check that recent simulations are displayed in the overview tab
    const simulationItems = wrapper.findAll('.simulation-item');
    expect(simulationItems.length).toBe(1);
    expect(simulationItems[0].text()).toContain('Supply Chain Disruption Scenario');
    expect(simulationItems[0].text()).toContain('Simulating impact of 2-week shipping delay');

    // Check that the progress bar is displayed for in-progress simulations
    const progressBar = simulationItems[0].find('.progress-bar');
    expect(progressBar.exists()).toBe(true);
    expect(progressBar.attributes('style')).toContain('width: 65%');
  });

  it('displays recent reports when loaded', async () => {
    // Directly modify the component's reactive properties
    wrapper.vm.isLoading = false;
    wrapper.vm.recentReports = [
      {
        id: 1,
        title: 'Q3 Inventory Turnover Analysis',
        createdAt: new Date().toISOString(),
        status: 'completed',
        insights: 'Turnover rate increased by 12% compared to Q2',
      }
    ];

    // Wait for the DOM to update
    await wrapper.vm.$nextTick();

    // Check that recent reports are displayed in the overview tab
    const reportItems = wrapper.findAll('.report-item');
    expect(reportItems.length).toBe(1);
    expect(reportItems[0].text()).toContain('Q3 Inventory Turnover Analysis');
    expect(reportItems[0].text()).toContain('Turnover rate increased by 12% compared to Q2');
  });

  it('displays AI recommendations when loaded', async () => {
    // Directly modify the component's reactive properties
    wrapper.vm.isLoading = false;
    wrapper.vm.aiRecommendations = [
      {
        id: 1,
        title: 'Increase safety stock for high-demand items',
        confidence: 92,
        impact: 'high',
        description: 'Based on recent stockout patterns, increasing safety stock by 15% for top 20 SKUs would reduce stockouts by an estimated 35%',
      }
    ];

    // Wait for the DOM to update
    await wrapper.vm.$nextTick();

    // Check that AI recommendations are displayed in the overview tab
    const recommendationItems = wrapper.findAll('.recommendation-item');
    expect(recommendationItems.length).toBe(1);
    expect(recommendationItems[0].text()).toContain('Increase safety stock for high-demand items');
    expect(recommendationItems[0].text()).toContain('Based on recent stockout patterns');

    // Check that confidence and impact are displayed
    const confidenceElement = recommendationItems[0].find('.confidence');
    expect(confidenceElement.exists()).toBe(true);
    expect(confidenceElement.text()).toContain('92%');

    const impactElement = recommendationItems[0].find('.impact');
    expect(impactElement.exists()).toBe(true);
    expect(impactElement.text()).toContain('High Impact');
  });

  it('handles create new simulation action', async () => {
    // Spy on console.log
    const consoleSpy = vi.spyOn(console, 'log');

    // Directly modify the component's reactive property
    wrapper.vm.isLoading = false;

    // Wait for the DOM to update
    await wrapper.vm.$nextTick();

    // Find the create simulation button and click it
    const createSimulationButton = wrapper.findAll('.action-button').find(button => 
      button.text().includes('Create Simulation')
    );
    await createSimulationButton.trigger('click');

    // Check that the createNewSimulation method was called
    expect(consoleSpy).toHaveBeenCalledWith('Create new simulation');

    // Clean up
    consoleSpy.mockRestore();
  });
});
