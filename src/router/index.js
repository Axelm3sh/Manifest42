import {createRouter, createWebHistory} from 'vue-router/dist/vue-router.esm-bundler.js';
import {useAuthStore} from '../stores/auth';

/**
 * Routes configuration
 * Includes role-based access control via meta.requiredRole
 */
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login.vue'),
    meta: { requiresAuth: false }
  },
  // Admin routes
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../views/admin-dashboard.vue'),
    meta: { 
      requiresAuth: true,
      requiredRole: 'admin'
    },
    children: [
      {
        path: 'inventory',
        name: 'AdminInventory',
        component: () => import('../views/inventory-view.vue'),
        meta: { 
          requiresAuth: true,
          requiredRole: 'admin'
        }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('../views/users-view.vue'),
        meta: { 
          requiresAuth: true,
          requiredRole: 'admin'
        }
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('../views/settings-view.vue'),
        meta: { 
          requiresAuth: true,
          requiredRole: 'admin'
        }
      },
      {
        path: 'faq',
        name: 'AdminFAQ',
        component: () => import('../views/faq-view.vue'),
        meta: { 
          requiresAuth: true,
          requiredRole: 'admin'
        }
      }
    ]
  },
  // Manager routes
  {
    path: '/manager',
    name: 'ManagerDashboard',
    component: () => import('../views/manager-dashboard.vue'),
    meta: { 
      requiresAuth: true,
      requiredRole: 'manager'
    },
    children: [
      {
        path: 'inventory',
        name: 'ManagerInventory',
        component: () => import('../views/inventory-view.vue'),
        meta: { 
          requiresAuth: true,
          requiredRole: 'manager'
        }
      },
      {
        path: 'reports',
        name: 'ManagerReports',
        component: () => import('../views/reports-view.vue'),
        meta: { 
          requiresAuth: true,
          requiredRole: 'manager'
        }
      },
      {
        path: 'approvals',
        name: 'ManagerApprovals',
        component: () => import('../views/approvals-view.vue'),
        meta: { 
          requiresAuth: true,
          requiredRole: 'manager'
        }
      },
      {
        path: 'faq',
        name: 'ManagerFAQ',
        component: () => import('../views/faq-view.vue'),
        meta: { 
          requiresAuth: true,
          requiredRole: 'manager'
        }
      }
    ]
  },
  // Analyst routes
  {
    path: '/analyst',
    name: 'AnalystDashboard',
    component: () => import('../views/analyst-dashboard.vue'),
    meta: { 
      requiresAuth: true,
      requiredRole: 'analyst'
    },
    children: [
      {
        path: 'inventory',
        name: 'AnalystInventory',
        component: () => import('../views/inventory-view.vue'),
        meta: { 
          requiresAuth: true,
          requiredRole: 'analyst'
        }
      },
      {
        path: 'analytics',
        name: 'AnalystAnalytics',
        component: () => import('../views/analytics-view.vue'),
        meta: { 
          requiresAuth: true,
          requiredRole: 'analyst'
        }
      },
      {
        path: 'simulations',
        name: 'AnalystSimulations',
        component: () => import('../views/simulations-view.vue'),
        meta: { 
          requiresAuth: true,
          requiredRole: 'analyst'
        }
      },
      {
        path: 'faq',
        name: 'AnalystFAQ',
        component: () => import('../views/faq-view.vue'),
        meta: { 
          requiresAuth: true,
          requiredRole: 'analyst'
        }
      }
    ]
  },
  // Logistics routes
  {
    path: '/logistics',
    name: 'LogisticsDashboard',
    component: () => import('../views/logistics-dashboard.vue'),
    meta: { 
      requiresAuth: true,
      requiredRole: 'logistics'
    },
    children: [
      {
        path: 'inventory',
        name: 'LogisticsInventory',
        component: () => import('../views/inventory-view.vue'),
        meta: { 
          requiresAuth: true,
          requiredRole: 'logistics'
        }
      },
      {
        path: 'shipping',
        name: 'LogisticsShipping',
        component: () => import('../views/shipping-view.vue'),
        meta: { 
          requiresAuth: true,
          requiredRole: 'logistics'
        }
      },
      {
        path: 'tracking',
        name: 'LogisticsTracking',
        component: () => import('../views/tracking-view.vue'),
        meta: { 
          requiresAuth: true,
          requiredRole: 'logistics'
        }
      },
      {
        path: 'faq',
        name: 'LogisticsFAQ',
        component: () => import('../views/faq-view.vue'),
        meta: { 
          requiresAuth: true,
          requiredRole: 'logistics'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/not-found.vue')
  }
];

/**
 * Router instance with HTML5 history mode
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // Always scroll to top when navigating
    return { top: 0 };
  }
});

/**
 * Global navigation guard for authentication and role-based access
 */
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Check if route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (!requiresAuth) {
    // Route doesn't require auth, allow access
    return next();
  }

  // Check if user is logged in
  const isLoggedIn = authStore.isLoggedIn;

  if (!isLoggedIn) {
    // User is not logged in, redirect to login
    return next({ name: 'Login', query: { redirect: to.fullPath } });
  }

  // Check if route has role requirements
  const requiredRole = to.matched.find(record => record.meta.requiredRole)?.meta.requiredRole;

  if (requiredRole && authStore.role !== requiredRole) {
    // User doesn't have required role, redirect to appropriate dashboard

    // Determine which dashboard to redirect to based on user's role
    let redirectRoute;
    switch (authStore.role) {
      case 'admin':
        redirectRoute = { name: 'AdminDashboard' };
        break;
      case 'manager':
        redirectRoute = { name: 'ManagerDashboard' };
        break;
      case 'analyst':
        redirectRoute = { name: 'AnalystDashboard' };
        break;
      case 'logistics':
        redirectRoute = { name: 'LogisticsDashboard' };
        break;
      default:
        // If role is unknown, redirect to login
        redirectRoute = { name: 'Login' };
    }

    return next(redirectRoute);
  }

  // User is authenticated and has required role, allow access
  next();
});

export default router;
