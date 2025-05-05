<script setup lang="ts">
import {computed, onMounted, reactive, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import Badge from 'primevue/badge';
import Dialog from 'primevue/dialog';
import Message from 'primevue/message';
import ProgressSpinner from 'primevue/progressspinner';
import Divider from 'primevue/divider';
import Avatar from 'primevue/avatar';

// Type-only imports to fix circular or runtime issues
import type {UserSettings} from '@/shared/data-models';

const { t } = useI18n();

interface User {
  userId: string;
  userName: string;
  roleId: string;
  settings: UserSettings;
}

interface Role {
  roleId: string;
  roleName: string;
}

const users = ref<User[]>([]);
const roles = ref<Role[]>([
  { roleId: 'admin', roleName: 'Admin' },
  { roleId: 'user', roleName: 'User' },
  { roleId: 'guest', roleName: 'Guest' }
]);
const loading = ref(true);
const error = ref<string | null>(null);
const filters = ref({
  userName: { value: '', matchMode: 'contains' },
  roleId: { value: null, matchMode: 'equals' },
});
const userDetailsDialog = ref(false);
const selectedUser = ref<User | null>(null);
const editUserDialog = ref(false);
const editingUser = reactive<User>({
  userId: '',
  userName: '',
  roleId: '',
  settings: {
    notificationPreferences: {
      inApp: false,
      email: false,
      frequency: 'immediate',
      showInventoryAlerts: false,
      showAiInsights: false,
      showSystemNotifications: false,
      enableSoundAlerts: false,
      enableDesktopNotifications: false,
      autoHideAfter: 0
    },
    inventoryRefreshIntervalSec: 30,
    themePreference: 'system'
  }
});
const submitted = ref(false);

const mockUsers: User[] = [
  {
    userId: '1',
    userName: 'alice',
    roleId: 'admin',
    settings: {
      notificationPreferences: {
        inApp: true,
        email: true,
        frequency: 'daily',
        showInventoryAlerts: true,
        showAiInsights: true,
        showSystemNotifications: true,
        enableSoundAlerts: true,
        enableDesktopNotifications: true,
        autoHideAfter: 2
      },
      inventoryRefreshIntervalSec: 30,
      themePreference: 'dark'
    }
  },
  {
    userId: '2',
    userName: 'bob',
    roleId: 'user',
    settings: {
      notificationPreferences: {
        inApp: false,
        email: true,
        frequency: 'immediate',
        showInventoryAlerts: false,
        showAiInsights: false,
        showSystemNotifications: false,
        enableSoundAlerts: false,
        enableDesktopNotifications: false,
        autoHideAfter: 5
      },
      inventoryRefreshIntervalSec: 60,
      themePreference: 'light'
    }
  }
];

onMounted(() => {
  setTimeout(() => {
    users.value = mockUsers;
    loading.value = false;
  }, 500);
});

function getRoleName(roleId: string): string {
  return roles.value.find(r => r.roleId === roleId)?.roleName || roleId;
}

function getRoleSeverity(roleId: string): string {
  switch (roleId) {
    case 'admin': return 'danger';
    case 'user': return 'info';
    default: return 'secondary';
  }
}

function formatTheme(theme: string | undefined): string {
  if (!theme) return '';
  return theme.charAt(0).toUpperCase() + theme.slice(1);
}

function viewUserDetails(user: User) {
  selectedUser.value = user;
  userDetailsDialog.value = true;
}

function editUser(user: User) {
  Object.assign(editingUser, user);
  editUserDialog.value = true;
  submitted.value = false;
}

function openNewUserDialog() {
  Object.assign(editingUser, {
    userId: '',
    userName: '',
    roleId: '',
    settings: {
      notificationPreferences: {
        inApp: false,
        email: false,
        frequency: 'immediate',
        showInventoryAlerts: false,
        showAiInsights: false,
        showSystemNotifications: false,
        enableSoundAlerts: false,
        enableDesktopNotifications: false,
        autoHideAfter: 0
      },
      inventoryRefreshIntervalSec: 30,
      themePreference: 'system'
    }
  });
  editUserDialog.value = true;
  submitted.value = false;
}

function confirmDelete(user: User) {
  if (confirm(t('users.delete_confirmation', { username: user.userName }))) {
    users.value = users.value.filter(u => u.userId !== user.userId);
  }
}

function cancelEdit() {
  editUserDialog.value = false;
  // (optional) reset the temporary object if you wish
  // Object.assign(editingUser, { …initial values… });
}

function submitUser() {
  submitted.value = true;

  if (!editingUser.userName || !editingUser.roleId) {
    return;
  }

  if (editingUser.userId) {
    // Update existing user
    const index = users.value.findIndex(u => u.userId === editingUser.userId);
    if (index !== -1) {
      users.value[index] = {...editingUser};
    }
  } else {
    // Create new user
    const newUser = {
      ...editingUser,
      userId: (users.value.length + 1).toString()
    };
    users.value.push(newUser);
  }

  editUserDialog.value = false;
  submitted.value = false;
}

const notificationTags = computed(() => {
  if (!selectedUser.value) return [];
  const p = selectedUser.value.settings.notificationPreferences;
  const tags: Array<{ label: string; icon: string; severity: string }> = [];

  const add = (cond: boolean, label: string, icon: string, severity: string) => {
    if (cond) tags.push({ label, icon: `pi pi-${icon}`, severity });
  };

  add(p.inApp,                   'In-App',             'bell',         'secondary');
  add(p.email,                   'Email',              'envelope',     'secondary');
  add(p.enableSoundAlerts,       'Sound',              'volume-up',    'secondary');
  add(p.enableDesktopNotifications, 'Desktop',         'desktop',      'secondary');
  add(p.showInventoryAlerts,     'Inventory Alerts',   'box',          'secondary');
  add(p.showAiInsights,          'AI Insights',        'chart-line',   'secondary');
  add(p.showSystemNotifications, 'System',             'cog',          'secondary');

  return tags;
});
</script>

<template>
  <div class="users-view">
    <h1>{{ $t('users.title') }}</h1>
    <p>{{ $t('users.description') }}</p>

    <div class="users-container">
      <!-- Users Card -->
      <Card class="users-card">
        <template #title>
          <div class="card-title">
            <i class="pi pi-users"></i>
            <span>{{ $t('users.manage_users') }}</span>
          </div>
        </template>
        <template #content>
          <!-- Loading state -->
          <ProgressSpinner v-if="loading" class="spinner" />

          <!-- Error state -->
          <Message v-else-if="error" severity="error">{{ error }}</Message>

          <!-- Users DataTable -->
          <DataTable
            v-else
            :value="users"
            :paginator="true"
            :rows="10"
            :rowHover="true"
            responsiveLayout="scroll"
            class="users-table"
            dataKey="userId"
            :filters="filters"
            filterDisplay="row"
          >
            <!-- Username column -->
            <Column field="userName" :header="$t('users.username')" sortable>
              <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" :placeholder="$t('common.search')" />
              </template>
              <template #body="{ data }">
                <div class="user-cell">
                  <div class="user-avatar">
                    {{ data.userName.charAt(0).toUpperCase() }}
                  </div>
                  <span>{{ data.userName }}</span>
                </div>
              </template>
            </Column>

            <!-- Role column -->
            <Column field="roleId" :header="$t('users.role')" sortable>
              <template #body="{ data }">
                <Tag :value="getRoleName(data.roleId)" :severity="getRoleSeverity(data.roleId)" />
              </template>
              <template #filter="{ filterModel, filterCallback }">
                <Dropdown
                  v-model="filterModel.value"
                  @change="filterCallback()"
                  :options="roles"
                  optionLabel="roleName"
                  optionValue="roleId"
                  :placeholder="$t('users.select_role')"
                  class="p-column-filter"
                />
              </template>
            </Column>

            <!-- Theme Preference column -->
            <Column field="settings.themePreference" :header="$t('users.theme')" sortable>
              <template #body="{ data }">
                <span>{{ formatTheme(data.settings.themePreference) }}</span>
              </template>
            </Column>

            <!-- Notification Settings column -->
            <Column :header="$t('users.notifications')">
              <template #body="{ data }">
                <div class="notification-badges">
                  <Badge v-if="data.settings.notificationPreferences.inApp" value="In-App" severity="info" />
                  <Badge v-if="data.settings.notificationPreferences.email" value="Email" severity="success" />
                  <Badge v-if="data.settings.notificationPreferences.enableSoundAlerts" value="Sound" severity="warning" />
                </div>
              </template>
            </Column>

            <!-- Actions column -->
            <Column :header="$t('common.actions')" :headerStyle="{ width: '10rem' }" bodyStyle="text-align:center">
              <template #body="{ data }">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-text p-button-sm"
                  @click="editUser(data)"
                  :aria-label="$t('common.edit')"
                />
                <Button
                  icon="pi pi-eye"
                  class="p-button-rounded p-button-text p-button-info p-button-sm"
                  @click="viewUserDetails(data)"
                  :aria-label="$t('common.view')"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-text p-button-danger p-button-sm"
                  @click="confirmDelete(data)"
                  :aria-label="$t('common.delete')"
                />
              </template>
            </Column>
          </DataTable>

          <!-- Add new user button -->
          <div class="add-user-container">
            <Button
              icon="pi pi-plus"
              :label="$t('users.add_user_button')"
              @click="openNewUserDialog"
              class="p-button-primary"
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- User Details Dialog -->
    <Dialog
        v-model:visible="userDetailsDialog"
        :header="$t('users.user_details')"
        :modal="true"
        :closable="true"
        :style="{ width: '480px' }"
    >
      <template v-if="selectedUser">
        <div class="user-summary flex align-items-center justify-content-center mb-3">
          <Avatar
              :label="selectedUser.userName.charAt(0).toUpperCase()"
              shape="circle"
              size="large"
              class="mr-2"
          />
          <h2 class="m-0 mr-2">{{ selectedUser.userName }}</h2>
          <Tag
              :value="getRoleName(selectedUser.roleId)"
              :severity="getRoleSeverity(selectedUser.roleId)"
          />
        </div>

        <Divider class="mb-3"/>

        <div class="simple-details">
          <p>
            <i class="pi pi-palette mr-1"/>
            {{ $t('users.theme') }}:
            <strong>{{ formatTheme(selectedUser.settings.themePreference) }}</strong>
          </p>
          <p>
            <i class="pi pi-refresh mr-1"/>
            {{ $t('users.inventory_refresh') }}:
            <strong>{{ selectedUser.settings.inventoryRefreshIntervalSec }} s</strong>
          </p>
        </div>

        <Divider class="mb-2"/>

        <h3 class="text-secondary mb-2">{{ $t('users.notifications') }}</h3>

        <div v-if="notificationTags.length" class="notification-tags">
          <Tag
              v-for="tag in notificationTags"
              :key="tag.label"
              :icon="tag.icon"
              :value="tag.label"
              :severity="tag.severity"
              rounded
              class="mr-2 mb-2"
          />
        </div>
        <Message
            v-else
            severity="info"
            :closable="false"
            class="mt-2"
        >
          {{ $t('users.no_notifications_enabled') }}
        </Message>
      </template>
    </Dialog>

    <!-- Edit / Create User dialog -->
    <Dialog
      v-model:visible="editUserDialog"
      :header="editingUser.userId ? $t('users.edit_user') : $t('users.new_user')"
      :style="{ width: '600px' }"
      modal
    >
      <div class="edit-form">
        <div class="field flex align-items-center gap-2">
          <label for="username" class="font-medium w-7rem">
            {{ $t('users.username') }}:
          </label>
          <InputText id="username" v-model="editingUser.userName" class="flex-auto" />
        </div>

        <div class="field flex align-items-center gap-2">
          <label for="role" class="font-medium w-7rem">
            {{ $t('users.role') }}:
          </label>
          <Dropdown
            id="role"
            v-model="editingUser.roleId"
            :options="roles"
            optionLabel="roleName"
            optionValue="roleId"
            class="flex-auto"
          />
        </div>

        <!-- Any additional rows follow the same
             “field flex … gap-2” pattern -->
      </div>

      <!-- ── footer ─────────────────────────────────────── -->
      <template #footer>
        <Button
          :label="$t('common.cancel')"
          class="p-button-secondary"
          @click="cancelEdit"
        />
        <Button
          :label="$t('common.save')"
          icon="pi pi-check"
          class="p-button-primary"
          @click="submitUser"
        />
      </template>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>


<style scoped>
.users-view {
  padding: 2rem;
}
.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.spinner {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.add-user-container {
  margin-top: 1rem;
  text-align: right;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--color-border);
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

/* Notification badges: only basic layout, as Badge component already styled by Lara */
.notification-badges {
  display: flex;
  gap: 0.3rem;
}

/* No need for complex dialog or DataTable styling, Lara already covers paddings, modal look, etc. */

/* Extra breathing room between rows if needed */
.edit-form .field {
  margin-bottom: 0.75rem;
}

.user-summary h2 {
  font-size: 1.4rem;
  font-weight: 500;
}
.simple-details p {
  margin: 0 0 0.5rem;
}
.notification-tags {
  display: flex;
  flex-wrap: wrap;
}
</style>