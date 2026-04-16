<script setup>
import { onMounted } from "vue";
import AppSidebar from "../components/AppSidebar.vue";
import AppHeader from "../components/AppHeader.vue";
import { useUiStore } from "../stores/ui";
import { useSettingsStore } from "../stores/settings";

const ui = useUiStore();
const settings = useSettingsStore();

onMounted(() => settings.fetchBranding());
</script>

<template>
  <div class="admin-shell">
    <div v-if="ui.sidebarOpen" class="admin-backdrop d-lg-none" @click="ui.closeSidebar()"></div>

    <AppSidebar />

    <main class="admin-main">
      <div class="container-fluid px-3 px-lg-4 py-3 py-lg-4">
        <AppHeader />

        <section class="admin-content mt-4">
          <router-view v-slot="{ Component, route }">
            <transition name="admin-route" mode="out-in" appear>
              <component :is="Component" :key="route.fullPath" />
            </transition>
          </router-view>
        </section>
      </div>
    </main>
  </div>
</template>
