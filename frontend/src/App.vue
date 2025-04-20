<script setup>
import {onMounted} from 'vue';
import {useRouter} from 'vue-router/dist/vue-router.esm-bundler.js';
import {useAuthStore} from './stores/auth';
import DotMatrixBackground from "@/components/DotMatrixBackground.vue";

const router = useRouter();
const authStore = useAuthStore();

// Check if user is already authenticated on app load
onMounted(async () => {
  const isAuthenticated = await authStore.checkSession();

  if (!isAuthenticated && router.currentRoute.value.meta.requiresAuth) {
    // Redirect to login if not authenticated and route requires auth
    router.push('/login');
  } else if (isAuthenticated && router.currentRoute.value.path === '/login') {
    // Redirect to appropriate dashboard if already authenticated and on login page
    const dashboardRoute = getDashboardByRole(authStore.role);
    router.push(dashboardRoute);
  }
});

// Get dashboard route based on user role
const getDashboardByRole = (role) => {
  switch (role) {
    case 'admin': return '/admin';
    case 'manager': return '/manager';
    case 'analyst': return '/analyst';
    case 'logistics': return '/logistics';
    default: return '/login';
  }
};
</script>

<template>
  <!-- Dot Matrix Background -->
  <DotMatrixBackground />

  <!-- The router-view will render the appropriate component based on the current route -->
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
/* Global styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  font-family: var(--font-family);
  line-height: var(--line-height-normal);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-primary);
  background-color: var(--color-background);
  min-height: 100vh;
  transition: background-color var(--transition-normal), color var(--transition-normal);
}

a {
  color: #4299e1;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

a:focus {
  outline: 2px solid #4299e1;
  outline-offset: 2px;
}

button {
  cursor: pointer;
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
