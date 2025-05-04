<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';
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
  if (confirm(`Delete user "${user.userName}"?`)) {
    users.value = users.value.filter(u => u.userId !== user.userId);
  }
}
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
                  placeholder="Select Role"
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
              label="Add User" 
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
      :header="selectedUser ? selectedUser.userName : ''" 
      :modal="true"
      :closable="true"
      :style="{ width: '500px' }"
    >
      <div v-if="selectedUser" class="user-details">
        <div class="detail-row">
          <div class="detail-label">{{ $t('users.username') }}:</div>
          <div class="detail-value">{{ selectedUser.userName }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">{{ $t('users.role') }}:</div>
          <div class="detail-value">
            <Tag :value="getRoleName(selectedUser.roleId)" :severity="getRoleSeverity(selectedUser.roleId)" />
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-label">{{ $t('users.theme') }}:</div>
          <div class="detail-value">{{ formatTheme(selectedUser.settings.themePreference) }}</div>
        </div>

        <Divider />

        <h3>{{ $t('users.notification_preferences') }}</h3>
        <div class="notification-prefs">
          <div class="detail-row">
            <div class="detail-label">{{ $t('users.in_app') }}:</div>
            <div class="detail-value">
              <i :class="['pi', selectedUser.settings.notificationPreferences.inApp ? 'pi-check-circle text-success' : 'pi-times-circle text-danger']"></i>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">{{ $t('users.email') }}:</div>
            <div class="detail-value">
              <i :class="['pi', selectedUser.settings.notificationPreferences.email ? 'pi-check-circle text-success' : 'pi-times-circle text-danger']"></i>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">{{ $t('users.frequency') }}:</div>
            <div class="detail-value">{{ selectedUser.settings.notificationPreferences.frequency }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">{{ $t('users.inventory_alerts') }}:</div>
            <div class="detail-value">
              <i :class="['pi', selectedUser.settings.notificationPreferences.showInventoryAlerts ? 'pi-check-circle text-success' : 'pi-times-circle text-danger']"></i>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">{{ $t('users.ai_insights') }}:</div>
            <div class="detail-value">
              <i :class="['pi', selectedUser.settings.notificationPreferences.showAiInsights ? 'pi-check-circle text-success' : 'pi-times-circle text-danger']"></i>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">{{ $t('users.system_notifications') }}:</div>
            <div class="detail-value">
              <i :class="['pi', selectedUser.settings.notificationPreferences.showSystemNotifications ? 'pi-check-circle text-success' : 'pi-times-circle text-danger']"></i>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">{{ $t('users.sound_alerts') }}:</div>
            <div class="detail-value">
              <i :class="['pi', selectedUser.settings.notificationPreferences.enableSoundAlerts ? 'pi-check-circle text-success' : 'pi-times-circle text-danger']"></i>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">{{ $t('users.desktop_notifications') }}:</div>
            <div class="detail-value">
              <i :class="['pi', selectedUser.settings.notificationPreferences.enableDesktopNotifications ? 'pi-check-circle text-success' : 'pi-times-circle text-danger']"></i>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">{{ $t('users.auto_hide') }}:</div>
            <div class="detail-value">{{ selectedUser.settings.notificationPreferences.autoHideAfter }} minutes</div>
          </div>
        </div>
      </div>
    </Dialog>

    <!-- Edit User Dialog -->
    <Dialog 
      v-model:visible="editUserDialog" 
      :header="editingUser.userId ? $t('users.edit_user') : $t('users.add_user')" 
      :modal="true"
      :closable="true"
      :style="{ width: '500px' }"
    >
      <div class="p-fluid">
        <div class="field">
          <label for="userName">{{ $t('users.username') }}</label>
          <InputText id="userName" v-model="editingUser.userName" :class="{'p-invalid': submitted && !editingUser.userName}" />
          <small v-if="submitted && !editingUser.userName" class="p-error">{{ $t('validation.required') }}</small>
        </div>

        <div class="field">
          <label for="roleId">{{ $t('users.role') }}</label>
          <Dropdown 
            id="roleId" 
            v-model="editingUser.roleId" 
            :options="roles" 
            optionLabel="roleName" 
            optionValue="roleId" 
            :class="{'p-invalid': submitted && !editingUser.roleId}"
          />
          <small v-if="submitted && !editingUser.roleId" class="p-error">{{ $t('validation.required') }}</small>
        </div>

        <div class="field">
          <label for="themePreference">{{ $t('users.theme') }}</label>
          <Dropdown 
            id="themePreference" 
            v-model="editingUser.settings.themePreference" 
            :options="themeOptions" 
            optionLabel="label" 
            optionValue="value" 
          />
        </div>

        <Divider />

        <h3>{{ $t('users.notification_preferences') }}</h3>

        <div class="field-checkbox">
          <Checkbox 
            id="inApp" 
            v-model="editingUser.settings.notificationPreferences.inApp" 
            :binary="true" 
          />
          <label for="inApp">{{ $t('users.in_app') }}</label>
        </div>

        <div class="field-checkbox">
          <Checkbox 
            id="email" 
            v-model="editingUser.settings.notificationPreferences.email" 
            :binary="true" 
          />
          <label for="email">{{ $t('users.email') }}</label>
        </div>

        <div class="field">
          <label for="frequency">{{ $t('users.frequency') }}</label>
          <Dropdown 
            id="frequency" 
            v-model="editingUser.settings.notificationPreferences.frequency" 
            :options="frequencyOptions" 
            optionLabel="label" 
            optionValue="value" 
          />
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeEditUserDialog" />
        <Button label="Save" icon="pi pi-check" class="p-button-primary" @click="saveUser" />
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

</style>