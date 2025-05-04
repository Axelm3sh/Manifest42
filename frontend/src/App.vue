<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<script setup>
import {onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {useAuthStore} from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

onMounted(async () => {
  if (!(await auth.checkSession()) && router.currentRoute.value.meta.requiresAuth) {
    router.push('/login');
  } else if (auth.isAuthenticated && router.currentRoute.value.path === '/login') {
    router.push(getDashboardByRole(auth.role));
  }
});

const getDashboardByRole = (role) =>
    ({ admin:'/admin', manager:'/manager', analyst:'/analyst', logistics:'/logistics' }[role] || '/login');
</script>

