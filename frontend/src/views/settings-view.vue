<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useConfirm} from 'primevue/useconfirm';

import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import ConfirmDialog from 'primevue/confirmdialog';
import Message from 'primevue/message';
import ProgressSpinner from 'primevue/progressspinner';

const {t} = useI18n();
const confirm = useConfirm();

const settings = ref<GlobalSettings[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const filters = ref({
  key: { value: '', matchMode: 'contains' },
  value: { value: '', matchMode: 'contains' },
  updatedAt: { value: null, matchMode: 'dateIs' },
});
const editingRows = ref([]);
const newSettingDialog = ref(false);
const submitted = ref(false);
const newSetting = reactive<{ key: string; value: string | number | boolean }>({
  key: '',
  value: ''
});

const mockSettings: GlobalSettings[] = [
  {
    id: '1',
    key: 'maintenance_mode',
    value: false,
    updatedAt: '2025-04-15T10:30:00Z'
  },
  {
    id: '2',
    key: 'default_language',
    value: 'en',
    updatedAt: '2025-04-10T08:15:00Z'
  },
  {
    id: '3',
    key: 'session_timeout_minutes',
    value: 30,
    updatedAt: '2025-04-12T14:45:00Z'
  },
  {
    id: '4',
    key: 'enable_analytics',
    value: true,
    updatedAt: '2025-04-14T11:20:00Z'
  },
  {
    id: '5',
    key: 'max_file_upload_size_mb',
    value: 10,
    updatedAt: '2025-04-13T09:00:00Z'
  }
];

onMounted(() => {
  setTimeout(() => {
    settings.value = mockSettings;
    loading.value = false;
  }, 500);
});

const formatDate = (d?: string) =>
    d
        ? new Intl.DateTimeFormat('en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }).format(new Date(d))
        : '';

const formatValue = (v: unknown) =>
    v === null || v === undefined ? '' :
        typeof v === 'boolean' ? (v ? 'True' : 'False') :
            typeof v === 'object' ? JSON.stringify(v) : String(v);

const editSetting = (setting) => {
  editingRows.value = [setting];
};

const onRowEditSave = (setting) => {
  const index = settings.value.findIndex(s => s.id === setting.id);
  if (index !== -1) {
    settings.value[index].updatedAt = new Date().toISOString();
  }
  editingRows.value = [];
};

const onRowEditCancel = (setting) => {
  editingRows.value = [];
};

const openNewSettingDialog = () => {
  newSetting.key = '';
  newSetting.value = '';
  submitted.value = false;
  newSettingDialog.value = true;
};

const closeNewSettingDialog = () => {
  newSettingDialog.value = false;
  submitted.value = false;
};

const saveSetting = () => {
  submitted.value = true;

  if (newSetting.key && newSetting.value) {
    settings.value.push({
      id: Date.now().toString(),
      key: newSetting.key,
      value: newSetting.value,
      updatedAt: new Date().toISOString()
    });

    closeNewSettingDialog();
  }
};

const confirmDelete = (setting) => {
  confirm.require({
    message: t('settings.confirm_delete', {key: setting.key}),
    header: t('common.confirm'),
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: t('common.yes'),
    rejectLabel: t('common.no'),
    accept: () => deleteSetting(setting)
  });
};

const deleteSetting = (setting) => {
  settings.value = settings.value.filter(s => s.id !== setting.id);
};
</script>

<template>
  <div class="settings-view">
    <h1>{{ $t('settings.title') }}</h1>
    <p>{{ $t('settings.description') }}</p>

    <div class="settings-container">
      <Card class="settings-card">
        <template #title>
          <div class="card-title">
            <i class="pi pi-cog"></i>
            <span>{{ $t('settings.global_settings') }}</span>
          </div>
        </template>
        <template #content>
          <ProgressSpinner v-if="loading" class="spinner"/>

          <Message v-else-if="error" severity="error">{{ error }}</Message>

          <DataTable
              v-else
              :value="settings"
              :paginator="true"
              :rows="10"
              :rowHover="true"
              responsiveLayout="scroll"
              class="settings-table"
              dataKey="id"
              :filters="filters"
              filterDisplay="row"
              v-model:editingRows="editingRows"
              editMode="row"
              @row-edit-save="onRowEditSave"
          >
            <Column field="key" :header="$t('settings.key')" sortable>
              <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" @input="filterCallback()" class="p-column-filter"
                           :placeholder="$t('common.search')"/>
              </template>
            </Column>

            <Column field="value" :header="$t('settings.value')" sortable>
              <template #body="{ data }">
                <span>{{ formatValue(data.value) }}</span>
              </template>
              <template #editor="{ data, field }">
                <InputText v-model="data[field]"/>
              </template>
            </Column>

            <Column field="updatedAt" :header="$t('settings.updated_at')" sortable>
              <template #body="{ data }">
                <span>{{ formatDate(data.updatedAt) }}</span>
              </template>
            </Column>

            <Column :header="$t('common.actions')" :headerStyle="{ width: '8rem' }" bodyStyle="text-align:center">
              <template #body="{ data, index }">
                <Button
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-text p-button-sm"
                    @click="editSetting(data)"
                    :aria-label="$t('common.edit')"
                />
                <Button
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-text p-button-danger p-button-sm"
                    @click="confirmDelete(data)"
                    :aria-label="$t('common.delete')"
                />
              </template>
              <template #editor="{ data, field }">
                <div class="flex justify-content-center">
                  <Button icon="pi pi-check" @click="onRowEditSave(data)"
                          class="p-button-rounded p-button-text p-button-success p-button-sm mr-2"/>
                  <Button icon="pi pi-times" @click="onRowEditCancel(data)"
                          class="p-button-rounded p-button-text p-button-danger p-button-sm"/>
                </div>
              </template>
            </Column>
          </DataTable>

          <div class="add-setting-container">
            <Button
                icon="pi pi-plus"
                label="Add Setting"
                @click="openNewSettingDialog"
                class="p-button-primary"
            />
          </div>
        </template>
      </Card>
    </div>

    <Dialog
        v-model:visible="newSettingDialog"
        :header="$t('settings.add_new')"
        :modal="true"
        :closable="true"
        :style="{ width: '450px' }"
    >
      <div class="p-fluid">
        <div class="field">
          <label for="key">{{ $t('settings.key') }}</label>
          <InputText id="key" v-model="newSetting.key" :class="{'p-invalid': submitted && !newSetting.key}"/>
          <small v-if="submitted && !newSetting.key" class="p-error">{{ $t('validation.required') }}</small>
        </div>
        <div class="field">
          <label for="value">{{ $t('settings.value') }}</label>
          <InputText id="value" v-model="newSetting.value" :class="{'p-invalid': submitted && !newSetting.value}"/>
          <small v-if="submitted && !newSetting.value" class="p-error">{{ $t('validation.required') }}</small>
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeNewSettingDialog"/>
        <Button label="Save" icon="pi pi-check" class="p-button-primary" @click="saveSetting"/>
      </template>
    </Dialog>

    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<style scoped>
.settings-view {
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

.add-setting-container {
  margin-top: 1rem;
  text-align: right;
}
</style>