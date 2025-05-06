<script setup>
import {computed, ref} from 'vue';
import {useRouter} from 'vue-router/dist/vue-router.esm-bundler.js';
import {useAuthStore} from '../stores/auth';
import {useNotificationsStore} from '../stores/notifications';
import {useI18n} from 'vue-i18n';
import LanguageSwitcher from './language-switcher.vue';
import ThemeToggle from './theme-toggle.vue';
import NotificationCenter from './notification/notification-center.vue';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

// Props
const props = defineProps({
  /**
   * Title of the current dashboard
   */
  title: {
    type: String,
    required: true
  },
  /**
   * Current active sidebar item
   */
  activeItem: {
    type: String,
    default: 'dashboard'
  }
});

// User information
const user = computed(() => authStore.user || {});
const role = computed(() => authStore.role);

// Sidebar state
const isSidebarOpen = ref(true);

// Notification store
const notificationsStore = useNotificationsStore();
// Initialize with some mock notifications for testing
if (notificationsStore.notifications.length === 0) {
  notificationsStore.generateMockNotifications();
}

// Toggle sidebar
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Logout user
const handleLogout = async () => {
  authStore.logout();
  router.push('/login');
};

// Navigation items based on user role
const navigationItems = computed(() => {
  const base = getDashboardRoute();
  const items = [
    {
      id: 'dashboard',
      label: t('navigation.dashboard'),
      icon: 'pi-th-large',            // was PhSquaresFour
      route: base,
    },
    {
      id: 'inventory',
      label: t('navigation.inventory'),
      icon: 'pi-clipboard',           // was PhClipboardText
      route: `${base}/inventory`,
    }
  ];

  if (authStore.isAdmin) {
    items.push(
        {
          id: 'users',
          label: t('navigation.users'),
          icon: 'pi-users',            // was PhUsers
          route: '/admin/users',
        },
        {
          id: 'settings',
          label: t('navigation.settings'),
          icon: 'pi-cog',              // was PhGear
          route: '/admin/settings',
        }
    );
  }

  if (authStore.isManager) {
    items.push(
        {
          id: 'reports',
          label: t('navigation.reports'),
          icon: 'pi-chart-bar',        // was PhChartBar
          route: '/manager/reports',
        },
        {
          id: 'approvals',
          label: t('navigation.approvals'),
          icon: 'pi-check',            // was PhCheck
          route: '/manager/approvals',
        }
    );
  }

  if (authStore.isAnalyst) {
    items.push(
        {
          id: 'analytics',
          label: t('navigation.analytics'),
          icon: 'pi-chart-line',       // was PhChartLine
          route: '/analyst/analytics',
        },
        {
          id: 'simulations',
          label: t('navigation.simulations'),
          icon: 'pi-calculator',       // instead of PhMathOperations
          route: '/analyst/simulations',
        }
    );
  }

  if (authStore.isLogistics) {
    items.push(
        {
          id: 'shipping',
          label: t('navigation.shipping'),
          icon: 'pi-truck',            // was PhTruck
          route: '/logistics/shipping',
        },
        {
          id: 'tracking',
          label: t('navigation.tracking'),
          icon: 'pi-map-marker',       // instead of PhMapPin
          route: '/logistics/tracking',
        }
    );
  }

  return items;
});


// Get dashboard route based on user role
const getDashboardRoute = () => {
  switch (role.value) {
    case 'admin': return '/admin';
    case 'manager': return '/manager';
    case 'analyst': return '/analyst';
    case 'logistics': return '/logistics';
    default: return '/analyst';
  }
};
</script>

<template>
  <div class="dashboard-layout" :class="{ 'sidebar-collapsed': !isSidebarOpen }">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'collapsed': !isSidebarOpen }">
      <!--Sidebar header -->
      <div class="sidebar-header">
        <h2 class="app-logo">{{ t('app.name') }}</h2>

        <!-- collapse / expand button -->
        <button
            class="sidebar-toggle"
            @click="toggleSidebar"
            :aria-label="
            isSidebarOpen
              ? t('navigation.collapse_sidebar')
              : t('navigation.expand_sidebar')
          "
        >
          <i class="pi pi-chevron-left nav-icon toggle-icon":class="{ rotated: !isSidebarOpen }"></i>
        </button>
      </div>

      <div class="user-info">
        <div class="user-avatar">
          {{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}
        </div>
        <div class="user-details" v-if="isSidebarOpen">
          <p class="user-name">{{ user.name || t('navigation.unknown_user') }}</p>
          <p class="user-role">{{ t(`roles.${role}`) }}</p>
        </div>
      </div>

      <nav class="sidebar-nav">
        <ul>
          <li v-for="item in navigationItems" :key="item.id">
            <router-link
              :to="item.route"
              :class="{ 'active': activeItem === item.id }"
              :title="!isSidebarOpen ? item.label : undefined"
            >
              <i :class="['pi', item.icon, 'nav-icon']"></i>
              <span class="nav-label" v-if="isSidebarOpen">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </nav>

    </aside>

    <!-- Main content -->
    <div class="main-content">
      <!-- Header -->
      <header class="dashboard-header">
        <h1 class="page-title">{{ props.title }}</h1>

        <div class="header-actions">
          <NotificationCenter />
          <ThemeToggle />
          <LanguageSwitcher />
          <button class="logout-button header-logout" @click="handleLogout" :title="t('navigation.logout')">
            <i class="pi pi-sign-out nav-icon"></i>
            <span class="logout-text">{{ t('navigation.logout') }}</span>
          </button>
        </div>
      </header>

      <!-- Content area -->
      <main class="content-area">
        <slot></slot>
      </main>

      <!-- Footer -->
      <footer class="dashboard-footer">
        <p>{{ t('app.footer_text') }}</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-background);
  transition: background-color var(--transition-normal);
  align-items: stretch; /* Ensure sidebar and main content stretch to the same height */
}

/* Sidebar styles */
.sidebar {
  width: 260px;
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
  transition: width var(--transition-normal),
              background-color var(--transition-normal),
              color var(--transition-normal);
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg) var(--spacing-md);
  border-bottom: var(--border-width-thin) solid var(--color-border);
}

.app-logo {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
  padding: var(--spacing-xs);
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-icon {
  transition: transform var(--transition-normal);
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.user-info {
  display: flex;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-md);
  border-bottom: var(--border-width-thin) solid var(--color-border);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-full);
  background-color: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

.user-details {
  margin-left: var(--spacing-sm);
  overflow: hidden;
}

.user-name {
  font-weight: var(--font-weight-medium);
  margin: 0 0 var(--spacing-xs);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md) 0;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin-bottom: var(--spacing-xs);
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--color-text-primary);
  text-decoration: none;
  transition: background-color var(--transition-fast);
}

.sidebar-nav a:hover {
  background-color: var(--color-surface-hover);
}

.sidebar-nav a.active {
  background-color: var(--color-surface-hover);
  border-left: var(--border-width-thick) solid var(--color-primary);
}

.nav-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-sm);
}

/* no margin when collapsed */
.sidebar-collapsed .nav-icon {
  margin-right: 0;
}

.logout-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  text-align: left;
}

.logout-button:hover {
  background-color: var(--color-surface-hover);
}

/* Main content styles */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 768px; /* Add minimum width to prevent squishing */
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-xl);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  z-index: 10;
  transition: background-color var(--transition-normal),
              box-shadow var(--transition-normal);
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  margin: 0;
  color: var(--color-text-primary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

/* Header logout button styling */
.header-logout {
  padding: var(--spacing-sm);
  background: none;
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color var(--transition-fast),
              color var(--transition-fast),
              transform var(--transition-fast);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  overflow: hidden;
  position: relative;
}

.header-logout:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-primary);
  transform: scale(1.05);
}

/* Logout text styling */
.logout-text {
  max-width: 0;
  opacity: 0;
  white-space: nowrap;
  overflow: hidden;
  transition: max-width var(--transition-normal),
              opacity var(--transition-normal),
              margin-left var(--transition-normal);
}

.header-logout:hover .logout-text {
  max-width: 100px;
  opacity: 1;
  margin-left: var(--spacing-sm);
}

.content-area {
  flex: 1;
  padding: var(--spacing-xl);
  overflow-y: auto;
  background-color: var(--color-background);
  transition: background-color var(--transition-normal);
}

.dashboard-footer {
  padding: var(--spacing-md) var(--spacing-xl);
  background-color: var(--color-surface);
  border-top: var(--border-width-thin) solid var(--color-border);
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  transition: background-color var(--transition-normal),
              border-color var(--transition-normal),
              color var(--transition-normal);
}
/* icon size shared across sidebar */
.nav-icon,
.toggle-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;          /* PrimeIcons glyph size */
  margin-right: var(--spacing-sm);
}

/* keep the rotation effect */
.toggle-icon { transition: transform var(--transition-normal); }
.toggle-icon.rotated { transform: rotate(180deg); }

</style>
