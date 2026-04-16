<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import client from "../api/client";
import { showError, showSuccess } from "../utils/feedback";
import { defaultBrandIcon, resolveMediaUrl } from "../utils/media";
import { useSettingsStore } from "../stores/settings";

const settingsStore = useSettingsStore();

const loading = ref(true);
const saving = ref(false);
const uploading = ref(false);
const errors = reactive({ title: "" });
const form = reactive({ title: "", logo: "", status: true });

const logoPreview = computed(() => resolveMediaUrl(form.logo || defaultBrandIcon));

function clearError(field) { errors[field] = ""; }

function validateForm() {
  errors.title = "";
  if (!form.title.trim()) { errors.title = "Title is required."; return false; }
  return true;
}

async function fetchSettings() {
  loading.value = true;
  try {
    const { data } = await client.get("/settings");
    Object.assign(form, data.values);
  } catch (error) {
    showError(error.response?.data?.message || "Unable to load settings.");
  } finally {
    loading.value = false;
  }
}

async function uploadLogo(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  uploading.value = true;
  try {
    const payload = new FormData();
    payload.append("file", file);
    const { data } = await client.post("/uploads", payload, { headers: { "Content-Type": "multipart/form-data" } });
    form.logo = data.path;
    showSuccess("Logo uploaded.");
  } catch (error) {
    showError(error.response?.data?.message || "Upload failed.");
  } finally {
    uploading.value = false;
  }
}

async function submit() {
  if (!validateForm()) { showError("Fix the highlighted fields."); return; }
  saving.value = true;
  try {
    await client.put("/settings", form);
    settingsStore.updateFromSave(form);
    showSuccess("Settings saved.");
  } catch (error) {
    showError(error.response?.data?.message || "Unable to save.");
  } finally {
    saving.value = false;
  }
}

onMounted(fetchSettings);
</script>

<template>
  <section class="admin-page">
    <!-- Page header -->
    <div class="card border-0 mb-4">
      <div class="card-body p-4">
        <small class="text-uppercase fw-bold" style="font-size:0.68rem;letter-spacing:0.1em;color:var(--cq-primary)">Settings</small>
        <h2 class="h4 mt-1 mb-1" style="font-family:var(--cq-font-display);font-weight:700">Branding & Configuration</h2>
        <p class="mb-0" style="color:var(--cq-text-secondary);font-size:0.88rem">Manage title, logo, and application status.</p>
      </div>
    </div>

    <div class="card border-0">
      <div class="card-body p-4">
        <div v-if="loading" class="text-center py-5" style="color:var(--cq-text-muted)">
          <i class="fa-solid fa-spinner fa-spin me-2"></i>Loading settings...
        </div>

        <form v-else @submit.prevent="submit">
          <div class="row g-4">
            <!-- Branding -->
            <div class="col-12 col-xl-7">
              <div class="card admin-subcard h-100" style="border-radius:var(--cq-radius)">
                <div class="card-body p-4">
                  <div class="d-flex align-items-center gap-2 mb-4">
                    <div style="width:2rem;height:2rem;border-radius:var(--cq-radius-xs);display:flex;align-items:center;justify-content:center;background:var(--cq-primary-soft);color:var(--cq-primary);font-size:0.85rem">
                      <i class="fa-solid fa-tag"></i>
                    </div>
                    <div>
                      <strong style="font-size:0.9rem">Branding</strong>
                      <small class="d-block" style="color:var(--cq-text-muted);font-size:0.78rem">Core product labeling</small>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Application Title</label>
                    <input v-model="form.title" type="text" class="form-control" :class="{ 'is-invalid': errors.title }" required @input="clearError('title')" />
                    <div v-if="errors.title" class="invalid-feedback d-block">{{ errors.title }}</div>
                  </div>

                  <div class="form-check form-switch mt-4">
                    <input id="status" v-model="form.status" class="form-check-input" type="checkbox" />
                    <label for="status" class="form-check-label">Application active</label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Logo -->
            <div class="col-12 col-xl-5">
              <div class="card admin-subcard h-100" style="border-radius:var(--cq-radius)">
                <div class="card-body p-4">
                  <div class="d-flex align-items-center gap-2 mb-4">
                    <div style="width:2rem;height:2rem;border-radius:var(--cq-radius-xs);display:flex;align-items:center;justify-content:center;background:rgba(var(--cq-success-rgb),0.1);color:var(--cq-success);font-size:0.85rem">
                      <i class="fa-solid fa-image"></i>
                    </div>
                    <div>
                      <strong style="font-size:0.9rem">Logo</strong>
                      <small class="d-block" style="color:var(--cq-text-muted);font-size:0.78rem">Brand icon & preview</small>
                    </div>
                  </div>

                  <div class="mb-3">
                    <input type="file" class="form-control" @change="uploadLogo" />
                    <div class="form-text">{{ uploading ? 'Uploading...' : form.logo || 'No logo uploaded.' }}</div>
                  </div>

                  <div class="admin-media-preview text-center">
                    <img :src="logoPreview" alt="Logo" class="admin-media-preview-image" />
                    <small class="d-block mt-2" style="color:var(--cq-text-muted)">Current logo</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-end mt-4">
            <button class="btn btn-primary" :disabled="saving">
              <i class="fa-solid fa-floppy-disk me-2"></i>{{ saving ? 'Saving...' : 'Save Settings' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
