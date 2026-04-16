<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useUiStore } from "../stores/ui";
import { useSettingsStore } from "../stores/settings";
import { resolveMediaUrl } from "../utils/media";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const ui = useUiStore();
const settings = useSettingsStore();
const brandLogo = computed(() => settings.brandLogo);
const brandTitle = computed(() => settings.brandTitle);

const title = computed(() => route.meta.title || "Dashboard");
const subtitle = computed(() => route.meta.subtitle || "Manage your platform from one place.");
const todayLabel = computed(() =>
  new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(new Date())
);
const userAvatar = computed(() => resolveMediaUrl(auth.user?.avatar));
const userInitial = computed(() => auth.user?.name?.[0]?.toUpperCase() || "A");

function logout() {
  ui.closeSidebar();
  auth.logout();
  router.push({ name: "login" });
}
</script>

<template>
  <header class="admin-header rounded-4 mb-1 p-3 p-lg-4">
    <div class="d-flex flex-wrap gap-3 align-items-center justify-content-between">
      <!-- Left: hamburger + title -->
      <div class="d-flex align-items-center gap-3 min-w-0">
        <button class="btn btn-outline-secondary d-lg-none admin-icon-button flex-shrink-0" type="button" @click="ui.toggleSidebar()" aria-label="Menu">
          <i class="fa-solid fa-bars"></i>
        </button>

        <div class="min-w-0">
          <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
            <span class="badge rounded-pill admin-badge" style="font-size:0.7rem">
              <img :src="brandLogo" alt="" class="admin-badge-logo" />
              {{ brandTitle }}
            </span>
            <span class="badge rounded-pill admin-badge" style="font-size:0.7rem">
              <i class="fa-regular fa-calendar"></i>
              {{ todayLabel }}
            </span>
          </div>
          <h1 class="h4 mb-0 admin-page-title">{{ title }}</h1>
          <p class="mb-0 admin-page-subtitle" style="font-size:0.85rem">{{ subtitle }}</p>
        </div>
      </div>

      <!-- Right: theme + user -->
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-outline-secondary admin-icon-button" type="button" @click="ui.toggleTheme()" :aria-label="ui.isDark ? 'Light mode' : 'Dark mode'">
          <i :class="ui.isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'" style="font-size:0.9rem"></i>
        </button>

        <div class="admin-user-card">
          <div class="admin-user-avatar" style="width:2.25rem;height:2.25rem;font-size:0.8rem">
            <img v-if="userAvatar" :src="userAvatar" alt="" class="cq-avatar-image" />
            <span v-else>{{ userInitial }}</span>
          </div>
          <div class="admin-user-copy d-none d-md-block">
            <strong>{{ auth.user?.name || "Admin" }}</strong>
            <span>{{ auth.user?.role || "admin" }}</span>
          </div>
          <button class="btn btn-sm btn-primary" type="button" @click="logout" style="padding:0.4rem 0.85rem">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <span class="d-none d-sm-inline ms-2">Logout</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
