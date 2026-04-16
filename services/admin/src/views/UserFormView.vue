<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import client from "../api/client";
import { showError, showSuccess } from "../utils/feedback";
import { resolveMediaUrl } from "../utils/media";

const route = useRoute();
const router = useRouter();
const saving = ref(false);
const uploading = ref(false);
const errorMessage = ref("");
const errors = reactive({ name: "", email: "", password: "" });

const isEdit = computed(() => Boolean(route.params.id));
const avatarPreview = computed(() => resolveMediaUrl(form.avatar));

const form = reactive({
  name: "",
  email: "",
  password: "",
  role: "admin",
  emailVerifiedAt: true,
  avatar: "",
  childName: "",
  childBirthdate: ""
});

function clearError(field) { errors[field] = ""; }

function validateForm() {
  let ok = true;
  errors.name = ""; errors.email = ""; errors.password = "";
  if (!form.name.trim()) { errors.name = "Name is required."; ok = false; }
  if (!form.email.trim()) { errors.email = "Email is required."; ok = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = "Enter a valid email."; ok = false; }
  if (!isEdit.value && !form.password.trim()) { errors.password = "Password is required."; ok = false; }
  return ok;
}

function applyServerError(msg) {
  if (/email/i.test(msg)) errors.email = msg;
  if (/password/i.test(msg)) errors.password = msg;
  if (/name/i.test(msg)) errors.name = msg;
}

async function loadUser() {
  if (!isEdit.value) return;
  const { data } = await client.get(`/users/${route.params.id}`);
  const item = data.item;
  form.name = item.name || "";
  form.email = item.email || "";
  form.password = "";
  form.role = item.role || "user";
  form.emailVerifiedAt = Boolean(item.emailVerifiedAt);
  form.avatar = item.avatar || "";
  form.childName = item.child?.name || "";
  form.childBirthdate = item.child?.birthdate ? item.child.birthdate.slice(0, 10) : "";
}

async function uploadFile(event, field) {
  const file = event.target.files?.[0];
  if (!file) return;
  uploading.value = true;
  try {
    const payload = new FormData();
    payload.append("file", file);
    const { data } = await client.post("/uploads", payload, { headers: { "Content-Type": "multipart/form-data" } });
    form[field] = data.path;
    showSuccess("Uploaded.");
  } catch (error) {
    showError(error.response?.data?.message || "Upload failed.");
  } finally {
    uploading.value = false;
  }
}

async function submit() {
  if (!validateForm()) { showError("Fix the highlighted fields."); return; }
  saving.value = true;
  errorMessage.value = "";
  try {
    const payload = { ...form };
    if (!payload.password) delete payload.password;
    if (isEdit.value) await client.put(`/users/${route.params.id}`, payload);
    else await client.post("/users", payload);
    showSuccess(isEdit.value ? "User updated." : "User created.");
    router.push({ name: "users.index" });
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Unable to save.";
    applyServerError(errorMessage.value);
    showError(errorMessage.value);
  } finally {
    saving.value = false;
  }
}

onMounted(loadUser);
</script>

<template>
  <section class="admin-page">
    <!-- Page header -->
    <div class="card border-0 mb-4">
      <div class="card-body p-4">
        <small class="text-uppercase fw-bold" style="font-size:0.68rem;letter-spacing:0.1em;color:var(--cq-primary)">User Editor</small>
        <h2 class="h4 mt-1 mb-1" style="font-family:var(--cq-font-display);font-weight:700">{{ isEdit ? 'Update User' : 'Create User' }}</h2>
        <p class="mb-0" style="color:var(--cq-text-secondary);font-size:0.88rem">Define credentials, role, avatar, and child profile.</p>
      </div>
    </div>

    <div v-if="errorMessage" class="alert alert-danger mb-4 py-2 px-3" style="font-size:0.88rem">
      <i class="fa-solid fa-circle-exclamation me-2"></i>{{ errorMessage }}
    </div>

    <form @submit.prevent="submit">
      <div class="row g-4">
        <!-- Account -->
        <div class="col-12 col-xl-8">
          <div class="card border-0 h-100">
            <div class="card-body p-4">
              <div class="d-flex align-items-center gap-2 mb-4">
                <div style="width:2rem;height:2rem;border-radius:var(--cq-radius-xs);display:flex;align-items:center;justify-content:center;background:var(--cq-primary-soft);color:var(--cq-primary);font-size:0.85rem">
                  <i class="fa-solid fa-user"></i>
                </div>
                <div>
                  <strong style="font-size:0.9rem">Account Details</strong>
                  <small class="d-block" style="color:var(--cq-text-muted);font-size:0.78rem">Credentials & access level</small>
                </div>
              </div>

              <div class="row g-3">
                <div class="col-12 col-md-6">
                  <label class="form-label">Name</label>
                  <input v-model="form.name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }" @input="clearError('name')" />
                  <div v-if="errors.name" class="invalid-feedback d-block">{{ errors.name }}</div>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label">Email</label>
                  <input v-model="form.email" type="email" class="form-control" :class="{ 'is-invalid': errors.email }" required @input="clearError('email')" />
                  <div v-if="errors.email" class="invalid-feedback d-block">{{ errors.email }}</div>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label">Password <span v-if="isEdit" style="color:var(--cq-text-muted);font-weight:400">(leave blank to keep)</span></label>
                  <input v-model="form.password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" :required="!isEdit" @input="clearError('password')" />
                  <div v-if="errors.password" class="invalid-feedback d-block">{{ errors.password }}</div>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label">Role</label>
                  <select v-model="form.role" class="form-select">
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <div class="col-12">
                  <div class="form-check form-switch mt-1">
                    <input id="emailVerifiedAt" v-model="form.emailVerifiedAt" class="form-check-input" type="checkbox" />
                    <label for="emailVerifiedAt" class="form-check-label">Email verified</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right column -->
        <div class="col-12 col-xl-4">
          <!-- Avatar -->
          <div class="card border-0 mb-4">
            <div class="card-body p-4">
              <div class="d-flex align-items-center gap-2 mb-3">
                <div style="width:2rem;height:2rem;border-radius:var(--cq-radius-xs);display:flex;align-items:center;justify-content:center;background:rgba(var(--cq-success-rgb),0.1);color:var(--cq-success);font-size:0.85rem">
                  <i class="fa-solid fa-camera"></i>
                </div>
                <div>
                  <strong style="font-size:0.9rem">Avatar</strong>
                  <small class="d-block" style="color:var(--cq-text-muted);font-size:0.78rem">Profile image</small>
                </div>
              </div>

              <div class="mb-3">
                <input type="file" class="form-control" @change="(e) => uploadFile(e, 'avatar')" />
                <div class="form-text">{{ uploading ? 'Uploading...' : form.avatar || 'No file uploaded.' }}</div>
              </div>

              <div v-if="avatarPreview" class="admin-media-preview text-center">
                <img :src="avatarPreview" alt="Avatar" class="admin-media-preview-image is-avatar" />
              </div>
            </div>
          </div>

          <!-- Child -->
          <div class="card border-0">
            <div class="card-body p-4">
              <div class="d-flex align-items-center gap-2 mb-3">
                <div style="width:2rem;height:2rem;border-radius:var(--cq-radius-xs);display:flex;align-items:center;justify-content:center;background:rgba(var(--cq-warning-rgb),0.1);color:var(--cq-warning);font-size:0.85rem">
                  <i class="fa-solid fa-child"></i>
                </div>
                <div>
                  <strong style="font-size:0.9rem">Child Profile</strong>
                  <small class="d-block" style="color:var(--cq-text-muted);font-size:0.78rem">Optional linked child</small>
                </div>
              </div>

              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Child Name</label>
                  <input v-model="form.childName" type="text" class="form-control" />
                </div>
                <div class="col-12">
                  <label class="form-label">Birthdate</label>
                  <input v-model="form.childBirthdate" type="date" class="form-control" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-4">
        <router-link :to="{ name: 'users.index' }" class="btn btn-outline-secondary">
          <i class="fa-solid fa-arrow-left me-2"></i>Cancel
        </router-link>
        <button class="btn btn-primary" :disabled="saving">
          <i class="fa-solid fa-floppy-disk me-2"></i>{{ saving ? 'Saving...' : 'Save User' }}
        </button>
      </div>
    </form>
  </section>
</template>
