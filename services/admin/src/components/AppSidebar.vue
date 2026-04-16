<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useUiStore } from "../stores/ui";
import { useSettingsStore } from "../stores/settings";
import { resolveMediaUrl } from "../utils/media";

const route = useRoute();
const auth = useAuthStore();
const ui = useUiStore();
const settings = useSettingsStore();
const brandLogo = computed(() => settings.brandLogo);
const brandTitle = computed(() => settings.brandTitle);
const userAvatar = computed(() => resolveMediaUrl(auth.user?.avatar));

const items = [
  {
    label: "Dashboard",
    description: "Overview & analytics",
    route: { name: "dashboard" },
    icon: "fa-solid fa-chart-line",
    match: ["dashboard"]
  },
  {
    label: "Users",
    description: "Accounts & children",
    route: { name: "users.index" },
    icon: "fa-solid fa-users",
    match: ["users."]
  },
  {
    label: "Versions",
    description: "Release channels",
    route: { name: "versions" },
    icon: "fa-solid fa-code-branch",
    match: ["versions"]
  },
  {
    label: "Settings",
    description: "Branding & config",
    route: { name: "settings" },
    icon: "fa-solid fa-sliders",
    match: ["settings"]
  }
];

function isActive(item) {
  const currentName = String(route.name || "");
  return item.match.some((prefix) => currentName.startsWith(prefix));
}
</script>

<template>
  <aside class="admin-sidebar" :class="{ 'is-open': ui.sidebarOpen }">
    <div class="admin-sidebar-inner">
      <!-- Brand -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <router-link :to="{ name: 'dashboard' }" class="admin-brand text-decoration-none" @click="ui.closeSidebar()">
          <span class="admin-brand-logo-wrap">
            <img :src="brandLogo" alt="Clever Quest" />
          </span>
          <span>
            <small>Admin Panel</small>
            <strong>{{ brandTitle }}</strong>
          </span>
        </router-link>

        <button class="btn btn-outline-secondary d-lg-none admin-icon-button" type="button" @click="ui.closeSidebar()" aria-label="Close">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Profile card -->
      <div class="admin-sidebar-profile p-3 mb-4">
        <div class="d-flex align-items-center gap-3">
          <div class="admin-sidebar-avatar">
            <img v-if="userAvatar" :src="userAvatar" alt="" class="cq-avatar-image" />
            <span v-else>{{ auth.user?.name?.[0] || "A" }}</span>
          </div>
          <div class="min-w-0 flex-grow-1">
            <strong class="d-block text-truncate" style="font-size:0.88rem">{{ auth.user?.name || "Administrator" }}</strong>
            <span class="d-block text-truncate" style="font-size:0.78rem;color:var(--cq-text-muted)">{{ auth.user?.email }}</span>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="admin-nav-label">Navigation</div>

      <nav class="nav flex-column gap-1 mb-4">
        <router-link
          v-for="item in items"
          :key="item.label"
          :to="item.route"
          class="admin-nav-link text-decoration-none"
          :class="{ 'is-active': isActive(item) }"
          @click="ui.closeSidebar()"
        >
          <span class="admin-nav-icon"><i :class="item.icon"></i></span>
          <span class="flex-grow-1 min-w-0">
            <strong class="d-block">{{ item.label }}</strong>
            <small>{{ item.description }}</small>
          </span>
          <i v-if="isActive(item)" class="fa-solid fa-chevron-right" style="font-size:0.65rem;color:var(--cq-primary);opacity:0.6"></i>
        </router-link>
      </nav>

      <!-- Footer note -->
      <div class="admin-sidebar-note p-3 mt-auto">
        <div class="d-flex align-items-center gap-2 mb-2">
          <i class="fa-solid fa-sparkles" style="color:var(--cq-primary);font-size:0.85rem"></i>
          <small class="fw-bold" style="color:var(--cq-text-secondary)">Premium Design</small>
        </div>
        <p class="mb-0" style="font-size:0.8rem;color:var(--cq-text-muted)">Glassmorphism UI with dark/light theme support and responsive layout.</p>
      </div>
    </div>
  </aside>
</template>
