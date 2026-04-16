<script setup>
import { onMounted, ref } from "vue";
import client from "../api/client";
import { showError, showSuccess } from "../utils/feedback";

const items = ref([]);
const loading = ref(true);
const saving = ref(false);
const errors = ref({});

function clearError(platform) { errors.value = { ...errors.value, [platform]: "" }; }

function validateForm() {
  const next = {};
  for (const item of items.value) {
    if (!String(item.version || "").trim()) next[item.platform] = "Version is required.";
  }
  errors.value = next;
  return Object.keys(next).length === 0;
}

async function fetchVersions() {
  loading.value = true;
  try {
    const { data } = await client.get("/versions");
    items.value = data.items;
  } catch (error) {
    showError(error.response?.data?.message || "Unable to load versions.");
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!validateForm()) { showError("Fix the highlighted fields."); return; }
  saving.value = true;
  try {
    const { data } = await client.put("/versions", { items: items.value });
    items.value = data.items;
    showSuccess("Versions saved.");
  } catch (error) {
    showError(error.response?.data?.message || "Unable to save.");
  } finally {
    saving.value = false;
  }
}

onMounted(fetchVersions);

const platformIcons = {
  android: "fa-brands fa-android",
  ios: "fa-brands fa-apple",
  web: "fa-solid fa-globe",
  windows: "fa-brands fa-windows",
  macos: "fa-brands fa-apple",
  linux: "fa-brands fa-linux"
};

function getPlatformIcon(platform) {
  const key = platform.toLowerCase().replace(/[_\s]/g, "");
  return platformIcons[key] || "fa-solid fa-cube";
}
</script>

<template>
  <section class="admin-page">
    <!-- Page header -->
    <div class="card border-0 mb-4">
      <div class="card-body p-4">
        <small class="text-uppercase fw-bold" style="font-size:0.68rem;letter-spacing:0.1em;color:var(--cq-primary)">Release Governance</small>
        <h2 class="h4 mt-1 mb-1" style="font-family:var(--cq-font-display);font-weight:700">Version Channels</h2>
        <p class="mb-0" style="color:var(--cq-text-secondary);font-size:0.88rem">Manage platform versions and update policies.</p>
      </div>
    </div>

    <div class="card border-0">
      <div class="card-body p-4">
        <div v-if="loading" class="text-center py-5" style="color:var(--cq-text-muted)">
          <i class="fa-solid fa-spinner fa-spin me-2"></i>Loading versions...
        </div>

        <form v-else @submit.prevent="submit">
          <div class="d-flex flex-column gap-3">
            <div v-for="item in items" :key="item.platform" class="card admin-subcard" style="border-radius:var(--cq-radius)">
              <div class="card-body p-4">
                <div class="row g-3 align-items-center">
                  <!-- Platform info -->
                  <div class="col-12 col-lg-3">
                    <div class="d-flex align-items-center gap-3">
                      <div style="width:2.5rem;height:2.5rem;border-radius:var(--cq-radius-xs);display:flex;align-items:center;justify-content:center;background:var(--cq-primary-soft);color:var(--cq-primary);font-size:1rem">
                        <i :class="getPlatformIcon(item.platform)"></i>
                      </div>
                      <div>
                        <strong class="d-block text-capitalize" style="font-size:0.92rem">{{ item.platform.replace('_', ' ') }}</strong>
                        <small style="color:var(--cq-text-muted);font-size:0.78rem">Version policy</small>
                      </div>
                    </div>
                  </div>

                  <!-- Version input -->
                  <div class="col-12 col-lg-5">
                    <label class="form-label">Version</label>
                    <input v-model="item.version" type="text" class="form-control" :class="{ 'is-invalid': errors[item.platform] }" required @input="clearError(item.platform)" />
                    <div v-if="errors[item.platform]" class="invalid-feedback d-block">{{ errors[item.platform] }}</div>
                  </div>

                  <!-- Force toggle -->
                  <div class="col-12 col-lg-4">
                    <div class="d-flex align-items-center gap-3 justify-content-lg-end h-100">
                      <div class="form-check form-switch">
                        <input :id="`force-${item.platform}`" v-model="item.force" class="form-check-input" type="checkbox" />
                        <label :for="`force-${item.platform}`" class="form-check-label">Force update</label>
                      </div>
                      <span class="badge rounded-pill" :class="item.force ? 'text-bg-danger' : 'text-bg-success'" style="font-size:0.72rem">
                        {{ item.force ? 'Forced' : 'Soft' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-end mt-4">
            <button class="btn btn-primary" :disabled="saving">
              <i class="fa-solid fa-floppy-disk me-2"></i>{{ saving ? 'Saving...' : 'Save Versions' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
