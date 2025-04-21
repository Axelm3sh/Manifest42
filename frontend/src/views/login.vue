<script setup>
import {computed, onMounted, reactive, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router/dist/vue-router.esm-bundler.js';
import {useAuthStore} from '../stores/auth';
import {useI18n} from 'vue-i18n';
import DotMatrixBackground from "@/components/DotMatrixBackground.vue";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Animation states
const isPageLoaded = ref(false);
const isLoginExpanding = ref(false);

// Form state
const credentials = reactive({
  username: '',
  password: '',
});

const isSubmitting = ref(false);
const errorMessage = ref('');
const showPassword = ref(false);
const formErrors = reactive({
  username: '',
  password: '',
});

// Computed properties for validation
const isFormValid = computed(() => {
  return credentials.username.trim() !== '' && credentials.password !== '';
});

// Validate form fields
const validateForm = () => {
  let isValid = true;

  // Reset errors
  formErrors.username = '';
  formErrors.password = '';

  // Validate username
  if (!credentials.username.trim()) {
    formErrors.username = t('login.error_username_required');
    isValid = false;
  }

  // Validate password
  if (!credentials.password) {
    formErrors.password = t('login.error_password_required');
    isValid = false;
  }

  return isValid;
};

// Initialize animations when component is mounted
onMounted(() => {
  // Trigger fade-in animation after a short delay
  setTimeout(() => {
    isPageLoaded.value = true;
  }, 300);
});

// Handle form submission
const handleSubmit = async () => {
  if (isSubmitting.value) return;

  // Validate form
  if (!validateForm()) {
    errorMessage.value = t('login.error_required_fields');
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    const result = await authStore.login(credentials);

    if (result.success) {
      // Trigger expanding animation before redirect
      isLoginExpanding.value = true;

      // Wait for animation to complete before redirecting
      setTimeout(() => {
        // Redirect to appropriate dashboard based on role
        const redirectPath = route.query.redirect || getDashboardByRole(authStore.role);
        router.push(redirectPath);
      }, 600); // Match the CSS transition duration
    } else {
      errorMessage.value = result.error || t('login.error_invalid_credentials');
      isSubmitting.value = false;
    }
  } catch (error) {
    errorMessage.value = error.message || t('login.error_unknown');
    console.error('Login error:', error);
    isSubmitting.value = false;
  }
};

// Get dashboard route based on user role
const getDashboardByRole = (role) => {
  switch (role) {
    case 'admin': return '/admin';
    case 'manager': return '/manager';
    case 'analyst': return '/analyst';
    case 'logistics': return '/logistics';
    default: return '/analyst'; // Default to analyst dashboard
  }
};

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Quick login buttons for demo purposes
const quickLogin = (role) => {
  credentials.username = role;
  credentials.password = 'password';
  handleSubmit();
};
</script>

<template>
  <div class="login-container" :class="{ 'page-loaded': isPageLoaded, 'login-expanding': isLoginExpanding }">
    <!-- Dot Matrix Background -->
    <DotMatrixBackground />

    <div class="login-card">
      <h1 class="login-title">{{ t('login.title') }}</h1>
      <p class="login-subtitle">{{ t('login.subtitle') }}</p>

      <form @submit.prevent="handleSubmit" class="login-form" novalidate>
        <div class="form-group" :class="{ 'has-error': formErrors.username }">
          <label for="username">{{ t('login.username') }}</label>
          <input
            id="username"
            v-model="credentials.username"
            type="text"
            :placeholder="t('login.username_placeholder')"
            autocomplete="username"
            :aria-invalid="!!formErrors.username"
            aria-required="true"
            @blur="validateForm"
          />
          <div v-if="formErrors.username" class="field-error" role="alert">
            {{ formErrors.username }}
          </div>
        </div>

        <div class="form-group" :class="{ 'has-error': formErrors.password }">
          <label for="password">{{ t('login.password') }}</label>
          <div class="password-input-container">
            <input
              id="password"
              v-model="credentials.password"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="t('login.password_placeholder')"
              autocomplete="current-password"
              :aria-invalid="!!formErrors.password"
              aria-required="true"
              @blur="validateForm"
            />
            <button
              type="button"
              class="password-toggle"
              @click="togglePasswordVisibility"
              :aria-label="showPassword ? t('login.hide_password') : t('login.show_password')"
            >
              {{ showPassword ? t('login.hide') : t('login.show') }}
            </button>
          </div>
          <div v-if="formErrors.password" class="field-error" role="alert">
            {{ formErrors.password }}
          </div>
        </div>

        <div v-if="errorMessage" class="error-message" role="alert">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="login-button"
          :disabled="isSubmitting || !isFormValid"
          aria-live="polite"
        >
          {{ isSubmitting ? t('login.logging_in') : t('login.login') }}
        </button>
      </form>

      <div class="demo-section">
        <h2 class="demo-title">{{ t('login.demo_title') }}</h2>
        <div class="demo-buttons">
          <button
            type="button"
            class="demo-button admin"
            @click="quickLogin('admin')"
            :disabled="isSubmitting"
          >
            {{ t('login.admin_role') }}
          </button>
          <button
            type="button"
            class="demo-button manager"
            @click="quickLogin('manager')"
            :disabled="isSubmitting"
          >
            {{ t('login.manager_role') }}
          </button>
          <button
            type="button"
            class="demo-button analyst"
            @click="quickLogin('analyst')"
            :disabled="isSubmitting"
          >
            {{ t('login.analyst_role') }}
          </button>
          <button
            type="button"
            class="demo-button logistics"
            @click="quickLogin('logistics')"
            :disabled="isSubmitting"
          >
            {{ t('login.logistics_role') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Variables for consistent theming */
:root {
  --color-primary: #4299e1;
  --color-primary-dark: #3182ce;
  --color-secondary: #718096;
  --color-text: #1a202c;
  --color-text-light: #4a5568;
  --color-background: #f5f7fa;
  --color-white: #ffffff;
  --color-border: #e2e8f0;
  --color-error: #c53030;
  --color-error-bg: #fed7d7;
  --color-disabled: #a0aec0;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-glow-light: 0 0 20px rgba(66, 153, 225, 0.5);
  --shadow-glow-dark: 0 0 20px rgba(255, 255, 255, 0.2);

  --border-radius: 4px;
  --spacing-xs: 0.5rem;
  --spacing-sm: 0.75rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 2.5rem;

  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.75rem;

  --transition-fast: 0.2s;
  --transition-normal: 0.3s;
  --transition-slow: 0.6s;
}

/* Layout */
.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: var(--spacing-xl);
  background-color: var(--color-background);
  overflow: hidden;
  /* Animation states */
  opacity: 0;
  transition: opacity var(--transition-normal) ease-in-out;
}

/* Page loaded animation */
.login-container.page-loaded {
  opacity: 1;
}

/* Login expanding animation */
.login-container.login-expanding .login-card {
  transform: scale(1.5);
  opacity: 0;
}

.login-card {
  position: relative;
  width: 100%;
  max-width: 480px;
  padding: var(--spacing-2xl);
  background-color: var(--color-white);
  border-radius: var(--border-radius);
  z-index: 1; /* Above the background */

  /* Enhanced styling */
  box-shadow: var(--shadow-lg), var(--shadow-glow-light);

  /* Animation */
  transform: scale(0.95);
  opacity: 0;
  transition:
    transform var(--transition-normal) ease-out,
    opacity var(--transition-normal) ease-in-out,
    box-shadow var(--transition-normal) ease;
}

/* Apply animation when page is loaded */
.page-loaded .login-card {
  transform: scale(1);
  opacity: 1;
}

/* Theme compatibility */
:root[data-theme="dark"] .login-card {
  background-color: #2d3748; /* Dark background */
  color: #f7fafc; /* Light text */
  box-shadow: var(--shadow-lg), var(--shadow-glow-dark);
}

/* Typography */
.login-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
  text-align: center;
}

.login-subtitle {
  font-size: var(--font-size-md);
  color: var(--color-secondary);
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

/* Form */
.login-form {
  margin-bottom: var(--spacing-xl);
}

.form-group {
  margin-bottom: var(--spacing-lg);
  position: relative;
}

.form-group.has-error input {
  border-color: var(--color-error);
}

.form-group label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-light);
  margin-bottom: var(--spacing-xs);
}

.form-group input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
}

.field-error {
  font-size: var(--font-size-sm);
  color: var(--color-error);
  margin-top: var(--spacing-xs);
}

.password-input-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  cursor: pointer;
}

.error-message {
  padding: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  background-color: var(--color-error-bg);
  color: var(--color-error);
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
}

.login-button {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-primary);
  color: var(--color-white);
  font-weight: 500;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  position: relative;
  z-index: 2;
  overflow: hidden;
  transition:
    background-color var(--transition-fast),
    transform var(--transition-normal),
    box-shadow var(--transition-normal);
}

.login-button:hover {
  background-color: var(--color-primary-dark);
  box-shadow: 0 0 10px rgba(66, 153, 225, 0.5);
}

.login-button:disabled {
  background-color: var(--color-disabled);
  cursor: not-allowed;
  box-shadow: none;
}

/* Button animation when login is expanding */
.login-expanding .login-button {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(66, 153, 225, 0.8);
}

/* Theme compatibility for button */
:root[data-theme="dark"] .login-button:hover {
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

:root[data-theme="dark"] .login-expanding .login-button {
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

/* Demo section */
.demo-section {
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-lg);
}

.demo-title {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: var(--color-text-light);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.demo-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-sm);
}

.demo-button {
  padding: var(--spacing-xs);
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  color: var(--color-white);
  cursor: pointer;
  position: relative;
  z-index: 2;
  transition:
    opacity var(--transition-fast),
    transform var(--transition-normal),
    box-shadow var(--transition-normal);
}

.demo-button:hover {
  opacity: 0.9;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
}

.demo-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

/* Demo button animation when login is expanding */
.login-expanding .demo-button {
  transform: scale(1.05);
  opacity: 0;
  transition-delay: 0.1s;
}

/* Theme compatibility for demo buttons */
:root[data-theme="dark"] .demo-button:hover {
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
}

/* Role-specific colors */
.demo-button.admin {
  background-color: #805ad5;
}

.demo-button.manager {
  background-color: #3182ce;
}

.demo-button.analyst {
  background-color: #38a169;
}

.demo-button.logistics {
  background-color: #dd6b20;
}

/* Responsive */
@media (max-width: 480px) {
  .login-card {
    padding: var(--spacing-lg);
  }

  .demo-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
