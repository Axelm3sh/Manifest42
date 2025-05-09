<template>
  <div class="faq-container">
    <h1 class="faq-title">{{ t('faq.title') }}</h1>
    
    <div class="faq-description">
      <p>{{ t('faq.description') }}</p>
    </div>

    <!-- Role-specific FAQ sections -->
    <div v-if="isAdmin" class="faq-section">
      <h2>{{ t('faq.admin.title') }}</h2>
      
      <div class="faq-item">
        <h3>{{ t('faq.admin.overview.title') }}</h3>
        <p>{{ t('faq.admin.overview.content') }}</p>
      </div>
      
      <div class="faq-item">
        <h3>{{ t('faq.admin.features.title') }}</h3>
        <ul>
          <li>{{ t('faq.admin.features.item1') }}</li>
          <li>{{ t('faq.admin.features.item2') }}</li>
          <li>{{ t('faq.admin.features.item3') }}</li>
          <li>{{ t('faq.admin.features.item4') }}</li>
        </ul>
      </div>
      
      <div class="faq-item">
        <h3>{{ t('faq.admin.tasks.title') }}</h3>
        <ul>
          <li>{{ t('faq.admin.tasks.item1') }}</li>
          <li>{{ t('faq.admin.tasks.item2') }}</li>
          <li>{{ t('faq.admin.tasks.item3') }}</li>
          <li>{{ t('faq.admin.tasks.item4') }}</li>
          <li>{{ t('faq.admin.tasks.item5') }}</li>
        </ul>
      </div>
      
      <div class="faq-item">
        <h3>{{ t('faq.admin.tips.title') }}</h3>
        <ul>
          <li>{{ t('faq.admin.tips.item1') }}</li>
          <li>{{ t('faq.admin.tips.item2') }}</li>
          <li>{{ t('faq.admin.tips.item3') }}</li>
        </ul>
      </div>
    </div>

    <div v-if="isManager" class="faq-section">
      <h2>{{ t('faq.manager.title') }}</h2>
      
      <div class="faq-item">
        <h3>{{ t('faq.manager.overview.title') }}</h3>
        <p>{{ t('faq.manager.overview.content') }}</p>
      </div>
      
      <div class="faq-item">
        <h3>{{ t('faq.manager.features.title') }}</h3>
        <ul>
          <li>{{ t('faq.manager.features.item1') }}</li>
          <li>{{ t('faq.manager.features.item2') }}</li>
          <li>{{ t('faq.manager.features.item3') }}</li>
          <li>{{ t('faq.manager.features.item4') }}</li>
        </ul>
      </div>
      
      <div class="faq-item">
        <h3>{{ t('faq.manager.tasks.title') }}</h3>
        <ul>
          <li>{{ t('faq.manager.tasks.item1') }}</li>
          <li>{{ t('faq.manager.tasks.item2') }}</li>
          <li>{{ t('faq.manager.tasks.item3') }}</li>
          <li>{{ t('faq.manager.tasks.item4') }}</li>
          <li>{{ t('faq.manager.tasks.item5') }}</li>
        </ul>
      </div>
      
      <div class="faq-item">
        <h3>{{ t('faq.manager.tips.title') }}</h3>
        <ul>
          <li>{{ t('faq.manager.tips.item1') }}</li>
          <li>{{ t('faq.manager.tips.item2') }}</li>
          <li>{{ t('faq.manager.tips.item3') }}</li>
        </ul>
      </div>
    </div>

    <div v-if="isAnalyst" class="faq-section">
      <h2>{{ t('faq.analyst.title') }}</h2>
      
      <div class="faq-item">
        <h3>{{ t('faq.analyst.overview.title') }}</h3>
        <p>{{ t('faq.analyst.overview.content') }}</p>
      </div>
      
      <div class="faq-item">
        <h3>{{ t('faq.analyst.features.title') }}</h3>
        <ul>
          <li>{{ t('faq.analyst.features.item1') }}</li>
          <li>{{ t('faq.analyst.features.item2') }}</li>
          <li>{{ t('faq.analyst.features.item3') }}</li>
          <li>{{ t('faq.analyst.features.item4') }}</li>
        </ul>
      </div>
      
      <div class="faq-item">
        <h3>{{ t('faq.analyst.tasks.title') }}</h3>
        <ul>
          <li>{{ t('faq.analyst.tasks.item1') }}</li>
          <li>{{ t('faq.analyst.tasks.item2') }}</li>
          <li>{{ t('faq.analyst.tasks.item3') }}</li>
          <li>{{ t('faq.analyst.tasks.item4') }}</li>
          <li>{{ t('faq.analyst.tasks.item5') }}</li>
        </ul>
      </div>
      
      <div class="faq-item">
        <h3>{{ t('faq.analyst.tips.title') }}</h3>
        <ul>
          <li>{{ t('faq.analyst.tips.item1') }}</li>
          <li>{{ t('faq.analyst.tips.item2') }}</li>
          <li>{{ t('faq.analyst.tips.item3') }}</li>
          <li>{{ t('faq.analyst.tips.item4') }}</li>
        </ul>
      </div>
    </div>

    <div v-if="isLogistics" class="faq-section">
      <h2>{{ t('faq.logistics.title') }}</h2>
      
      <div class="faq-item">
        <h3>{{ t('faq.logistics.overview.title') }}</h3>
        <p>{{ t('faq.logistics.overview.content') }}</p>
      </div>
      
      <div class="faq-item">
        <h3>{{ t('faq.logistics.features.title') }}</h3>
        <ul>
          <li>{{ t('faq.logistics.features.item1') }}</li>
          <li>{{ t('faq.logistics.features.item2') }}</li>
          <li>{{ t('faq.logistics.features.item3') }}</li>
          <li>{{ t('faq.logistics.features.item4') }}</li>
        </ul>
      </div>
      
      <div class="faq-item">
        <h3>{{ t('faq.logistics.tasks.title') }}</h3>
        <ul>
          <li>{{ t('faq.logistics.tasks.item1') }}</li>
          <li>{{ t('faq.logistics.tasks.item2') }}</li>
          <li>{{ t('faq.logistics.tasks.item3') }}</li>
          <li>{{ t('faq.logistics.tasks.item4') }}</li>
          <li>{{ t('faq.logistics.tasks.item5') }}</li>
        </ul>
      </div>
      
      <div class="faq-item">
        <h3>{{ t('faq.logistics.tips.title') }}</h3>
        <ul>
          <li>{{ t('faq.logistics.tips.item1') }}</li>
          <li>{{ t('faq.logistics.tips.item2') }}</li>
          <li>{{ t('faq.logistics.tips.item3') }}</li>
          <li>{{ t('faq.logistics.tips.item4') }}</li>
        </ul>
      </div>
    </div>

    <!-- Common troubleshooting section for all roles -->
    <div class="faq-section">
      <h2>{{ t('faq.troubleshooting.title') }}</h2>
      
      <div class="faq-item">
        <h3>{{ t('faq.troubleshooting.login.title') }}</h3>
        <ul>
          <li>{{ t('faq.troubleshooting.login.item1') }}</li>
          <li>{{ t('faq.troubleshooting.login.item2') }}</li>
          <li>{{ t('faq.troubleshooting.login.item3') }}</li>
          <li>{{ t('faq.troubleshooting.login.item4') }}</li>
        </ul>
      </div>
      
      <div class="faq-item">
        <h3>{{ t('faq.troubleshooting.dashboard.title') }}</h3>
        <ul>
          <li>{{ t('faq.troubleshooting.dashboard.item1') }}</li>
          <li>{{ t('faq.troubleshooting.dashboard.item2') }}</li>
          <li>{{ t('faq.troubleshooting.dashboard.item3') }}</li>
          <li>{{ t('faq.troubleshooting.dashboard.item4') }}</li>
        </ul>
      </div>
      
      <div class="faq-item">
        <h3>{{ t('faq.troubleshooting.data.title') }}</h3>
        <ul>
          <li>{{ t('faq.troubleshooting.data.item1') }}</li>
          <li>{{ t('faq.troubleshooting.data.item2') }}</li>
          <li>{{ t('faq.troubleshooting.data.item3') }}</li>
          <li>{{ t('faq.troubleshooting.data.item4') }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {useAuthStore} from '../stores/auth';

const { t } = useI18n();
const authStore = useAuthStore();

// Computed properties to check user role
const isAdmin = computed(() => authStore.role === 'admin');
const isManager = computed(() => authStore.role === 'manager');
const isAnalyst = computed(() => authStore.role === 'analyst');
const isLogistics = computed(() => authStore.role === 'logistics');
</script>

<style scoped>
.faq-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.faq-title {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
}

.faq-description {
  margin-bottom: var(--spacing-xl);
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.faq-section {
  margin-bottom: var(--spacing-2xl);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.faq-section h2 {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-lg);
  color: var(--color-primary);
  border-bottom: var(--border-width-thin) solid var(--color-border);
  padding-bottom: var(--spacing-sm);
}

.faq-item {
  margin-bottom: var(--spacing-lg);
}

.faq-item h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.faq-item p {
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
}

.faq-item ul {
  padding-left: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.faq-item li {
  margin-bottom: var(--spacing-sm);
  line-height: 1.6;
}
</style>