<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useUiStore } from "../stores/ui";
import { showError, showSuccess } from "../utils/feedback";
import { defaultBrandIcon } from "../utils/media";

const router = useRouter();
const auth = useAuthStore();
const ui = useUiStore();
const errorMessage = ref("");
const brandIcon = defaultBrandIcon;
const errors = reactive({ email: "", password: "" });
const form = reactive({
  email: "admin@cleverquest.local",
  password: "1234"
});

function clearError(field) { errors[field] = ""; }

function validateForm() {
  let ok = true;
  errors.email = "";
  errors.password = "";

  if (!form.email.trim()) { errors.email = "Email is required."; ok = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = "Enter a valid email."; ok = false; }
  if (!form.password.trim()) { errors.password = "Password is required."; ok = false; }
  return ok;
}

async function submit() {
  errorMessage.value = "";
  if (!validateForm()) { showError("Fix the highlighted fields."); return; }

  try {
    await auth.login(form);
    showSuccess("Signed in successfully.");
    router.push({ name: "dashboard" });
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Unable to sign in.";
    showError(errorMessage.value);
  }
}
</script>

<template>
  <section class="auth-shell">
    <div class="container py-4 py-lg-5 position-relative" style="z-index:1">
      <!-- Theme toggle -->
      <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-outline-secondary admin-icon-button" type="button" @click="ui.toggleTheme()">
          <i :class="ui.isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
        </button>
      </div>

      <div class="row g-4 g-xl-5 justify-content-center align-items-stretch">
        <!-- Showcase panel -->
        <div class="col-12 col-lg-6 d-none d-lg-flex">
          <div class="auth-showcase card border-0 w-100 p-4 p-xl-5 d-flex flex-column justify-content-between" style="border-radius:var(--cq-radius-xl)">
            <div>
              <div class="d-flex align-items-center gap-3 mb-4">
                <span class="auth-brand-mark">
                  <img :src="brandIcon" alt="Clever Quest" class="auth-brand-logo" />
                </span>
                <div>
                  <small class="text-uppercase fw-bold" style="font-size:0.68rem;letter-spacing:0.1em;color:var(--cq-text-muted)">Admin Panel</small>
                  <h1 class="h4 mb-0" style="font-family:var(--cq-font-display)">Clever Quest</h1>
                </div>
              </div>

              <h2 class="display-6 fw-bold mb-3" style="font-family:var(--cq-font-display);line-height:1.15">
                A modern admin<br />built for clarity.
              </h2>
              <p class="lead mb-4" style="color:var(--cq-text-secondary)">Glassmorphism design, responsive grids, persistent dark mode, and structured data management.</p>

              <div class="row g-3 mb-4">
                <div class="col-6">
                  <div class="auth-feature-card h-100">
                    <i class="fa-solid fa-palette"></i>
                    <strong>Dual Theme</strong>
                    <span>Dark & light modes</span>
                  </div>
                </div>
                <div class="col-6">
                  <div class="auth-feature-card h-100">
                    <i class="fa-solid fa-mobile-screen"></i>
                    <strong>Responsive</strong>
                    <span>Mobile-first layout</span>
                  </div>
                </div>
                <div class="col-6">
                  <div class="auth-feature-card h-100">
                    <i class="fa-solid fa-bolt"></i>
                    <strong>Fast</strong>
                    <span>Vue 3 + Vite</span>
                  </div>
                </div>
                <div class="col-6">
                  <div class="auth-feature-card h-100">
                    <i class="fa-solid fa-shield-halved"></i>
                    <strong>Secure</strong>
                    <span>JWT authentication</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="auth-preview-panel">
              <div class="flex-grow-1">
                <small class="d-block fw-bold mb-1" style="font-size:0.7rem;color:var(--cq-text-muted);text-transform:uppercase;letter-spacing:0.08em">Demo credentials</small>
                <span style="font-size:0.88rem"><strong>admin@cleverquest.local</strong> <span class="auth-separator mx-2">/</span> <strong>1234</strong></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Login form -->
        <div class="col-12 col-lg-6 col-xl-5 d-flex">
          <div class="auth-login-card card border-0 w-100 d-flex flex-column justify-content-center" style="border-radius:var(--cq-radius-xl)">
            <div class="card-body p-4 p-xl-5">
              <!-- Mobile brand -->
              <div class="d-flex align-items-center gap-3 mb-4 d-lg-none">
                <span class="auth-brand-mark">
                  <img :src="brandIcon" alt="Clever Quest" class="auth-brand-logo" />
                </span>
                <div>
                  <small class="text-uppercase fw-bold" style="font-size:0.68rem;color:var(--cq-text-muted)">Admin Panel</small>
                  <strong class="d-block" style="font-family:var(--cq-font-display)">Clever Quest</strong>
                </div>
              </div>

              <div class="mb-4">
                <small class="text-uppercase fw-bold d-block mb-2" style="font-size:0.68rem;letter-spacing:0.1em;color:var(--cq-primary)">Secure Sign In</small>
                <h2 class="h2 mb-1" style="font-family:var(--cq-font-display);font-weight:800">Welcome back</h2>
                <p style="color:var(--cq-text-secondary);font-size:0.9rem">Sign in with your admin credentials to continue.</p>
              </div>

              <div v-if="errorMessage" class="alert alert-danger py-2 px-3" style="font-size:0.88rem">
                <i class="fa-solid fa-circle-exclamation me-2"></i>{{ errorMessage }}
              </div>

              <form @submit.prevent="submit">
                <div class="mb-3">
                  <label class="form-label">Email address</label>
                  <div class="input-group">
                    <span class="input-group-text" style="background:var(--cq-primary-soft);border-color:var(--cq-border);color:var(--cq-primary)">
                      <i class="fa-solid fa-envelope" style="font-size:0.85rem"></i>
                    </span>
                    <input v-model="form.email" type="email" class="form-control" :class="{ 'is-invalid': errors.email }" required @input="clearError('email')" />
                  </div>
                  <div v-if="errors.email" class="invalid-feedback d-block">{{ errors.email }}</div>
                </div>

                <div class="mb-4">
                  <label class="form-label">Password</label>
                  <div class="input-group">
                    <span class="input-group-text" style="background:var(--cq-primary-soft);border-color:var(--cq-border);color:var(--cq-primary)">
                      <i class="fa-solid fa-lock" style="font-size:0.85rem"></i>
                    </span>
                    <input v-model="form.password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" required @input="clearError('password')" />
                  </div>
                  <div v-if="errors.password" class="invalid-feedback d-block">{{ errors.password }}</div>
                </div>

                <button class="btn btn-primary btn-lg w-100" :disabled="auth.loading" style="height:52px">
                  <span v-if="auth.loading"><i class="fa-solid fa-spinner fa-spin me-2"></i>Signing in...</span>
                  <span v-else><i class="fa-solid fa-arrow-right-to-bracket me-2"></i>Sign in</span>
                </button>
              </form>

              <!-- Mobile credentials -->
              <div class="auth-preview-panel mt-4 d-lg-none">
                <small class="d-block fw-bold mb-1" style="font-size:0.7rem;color:var(--cq-text-muted);text-transform:uppercase">Demo</small>
                <span style="font-size:0.85rem"><strong>admin@cleverquest.local</strong> / <strong>1234</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
