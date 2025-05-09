<script setup>
import {useI18n} from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <div class="not-found">
    <h1>{{ t('not_found.title', 'Page Not Found') }}</h1>
    <p>{{ t('not_found.message', 'Sorry, the page you are looking for does not exist.') }}</p>
    <router-link to="/">{{ t('not_found.return_home', 'Return Home') }}</router-link>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 0 20px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

a {
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
}

a:hover {
  text-decoration: underline;
}
</style>