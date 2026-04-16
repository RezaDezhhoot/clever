<script setup>
import { computed, onMounted, ref } from "vue";
import client from "../api/client";
import StatCard from "../components/StatCard.vue";
import { formatDate, formatPlatformLabel } from "../utils/format";
import { defaultBrandIcon, resolveMediaUrl } from "../utils/media";

const loading = ref(true);
const errorMessage = ref("");
const dashboard = ref({
  counters: { users: 0, children: 0, verifiedUsers: 0, adminUsers: 0, forcedUpdates: 0, releaseChannels: 0 },
  health: { childCoverage: 0, verificationRate: 0, applicationStatus: false, title: "Clever Quest", logo: "" },
  recentUsers: [],
  versions: []
});

const summaryCards = computed(() => [
  { title: "Total Users", value: dashboard.value.counters.users, subtitle: "All registered accounts", icon: "fa-solid fa-users", tone: "primary" },
  { title: "Children", value: dashboard.value.counters.children, subtitle: "Linked child profiles", icon: "fa-solid fa-child-reaching", tone: "success" },
  { title: "Verified", value: dashboard.value.counters.verifiedUsers, subtitle: "Email-confirmed accounts", icon: "fa-solid fa-user-check", tone: "warning" },
  { title: "Releases", value: dashboard.value.counters.releaseChannels, subtitle: "Platform channels", icon: "fa-solid fa-code-branch", tone: "danger" }
]);

const releaseReadiness = computed(() => {
  const total = dashboard.value.counters.releaseChannels;
  if (!total) return 0;
  return Math.round(((total - dashboard.value.counters.forcedUpdates) / total) * 100);
});

const brandPreview = computed(() => resolveMediaUrl(dashboard.value.health.logo || defaultBrandIcon));

const heroBadges = computed(() => [
  { icon: "fa-solid fa-bolt", label: dashboard.value.health.applicationStatus ? "App live" : "App paused" },
  { icon: "fa-solid fa-user-check", label: `${dashboard.value.health.verificationRate}% verified` },
  { icon: "fa-solid fa-rocket", label: `${releaseReadiness.value}% release ready` }
]);

async function fetchStats() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const { data } = await client.get("/dashboard/stats");
    dashboard.value = data;
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Unable to load dashboard.";
  } finally {
    loading.value = false;
  }
}

onMounted(fetchStats);
</script>

<template>
  <section class="admin-page">
    <!-- Hero -->
    <div class="card border-0 admin-hero-card mb-4">
      <div class="card-body p-4 p-xl-5 position-relative" style="z-index:1">
        <div class="row g-4 align-items-center">
          <div class="col-12 col-xl-7">
            <div class="d-flex flex-wrap gap-2 mb-3">
              <span v-for="b in heroBadges" :key="b.label" class="badge rounded-pill admin-pill">
                <i :class="b.icon + ' me-1'"></i>{{ b.label }}
              </span>
            </div>

            <h2 class="mb-3" style="font-family:var(--cq-font-display);font-weight:800;font-size:clamp(1.5rem,3vw,2rem);line-height:1.2">
              Platform operations at a glance
            </h2>
            <p class="mb-4" style="color:var(--cq-text-secondary);max-width:50ch">
              Monitor users, release channels, branding, and health metrics — all from one dashboard.
            </p>

            <div class="d-flex flex-wrap gap-2">
              <router-link :to="{ name: 'users.index' }" class="btn btn-primary">
                <i class="fa-solid fa-users me-2"></i>Manage Users
              </router-link>
              <router-link :to="{ name: 'versions' }" class="btn btn-outline-secondary">
                <i class="fa-solid fa-code-branch me-2"></i>Releases
              </router-link>
            </div>
          </div>

          <div class="col-12 col-xl-5">
            <div class="admin-brand-glance card border-0 rounded-4">
              <div class="card-body p-4">
                <div class="d-flex align-items-center gap-3 mb-3">
                  <img :src="brandPreview" alt="" class="admin-brand-glance-image" />
                  <div>
                    <small class="text-uppercase fw-bold d-block" style="font-size:0.68rem;color:var(--cq-text-muted);letter-spacing:0.08em">Branding</small>
                    <strong style="font-size:1rem">{{ dashboard.health.title }}</strong>
                  </div>
                  <span class="badge rounded-pill ms-auto" :class="dashboard.health.applicationStatus ? 'text-bg-success' : 'text-bg-danger'" style="font-size:0.72rem">
                    {{ dashboard.health.applicationStatus ? 'Live' : 'Paused' }}
                  </span>
                </div>

                <div class="row g-2 text-center">
                  <div class="col-6">
                    <div class="admin-mini-stat">
                      <strong>{{ dashboard.counters.adminUsers }}</strong>
                      <span>Admins</span>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="admin-mini-stat">
                      <strong>{{ dashboard.counters.forcedUpdates }}</strong>
                      <span>Forced</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="errorMessage" class="alert alert-danger mb-4">
      <i class="fa-solid fa-circle-exclamation me-2"></i>{{ errorMessage }}
    </div>

    <!-- Stats row -->
    <div class="row g-3 mb-4">
      <div v-for="card in summaryCards" :key="card.title" class="col-6 col-xl-3">
        <StatCard
          :title="card.title"
          :value="loading ? '...' : card.value"
          :subtitle="card.subtitle"
          :icon="card.icon"
          :tone="card.tone"
        />
      </div>
    </div>

    <!-- Content grid -->
    <div class="row g-4">
      <!-- Left column -->
      <div class="col-xl-7">
        <!-- Recent users -->
        <div class="card border-0 mb-4">
          <div class="card-body p-4">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h3 class="h5 mb-0" style="font-family:var(--cq-font-display);font-weight:700">Recent Users</h3>
                <small style="color:var(--cq-text-muted)">Newest accounts & child profiles</small>
              </div>
              <router-link :to="{ name: 'users.index' }" class="btn btn-sm btn-outline-primary">View all</router-link>
            </div>

            <div v-if="loading" class="text-center py-4" style="color:var(--cq-text-muted)">
              <i class="fa-solid fa-spinner fa-spin me-2"></i>Loading...
            </div>
            <div v-else-if="!dashboard.recentUsers.length" class="text-center py-4" style="color:var(--cq-text-muted)">No users yet.</div>
            <div v-else class="d-flex flex-column gap-2">
              <div v-for="user in dashboard.recentUsers" :key="user.id" class="d-flex align-items-center gap-3 p-3 rounded-3" style="background:var(--cq-primary-soft);border:1px solid rgba(var(--cq-primary-rgb),0.06)">
                <div class="admin-avatar" style="width:2.25rem;height:2.25rem;font-size:0.78rem">{{ user.name?.[0] || 'U' }}</div>
                <div class="flex-grow-1 min-w-0">
                  <div class="d-flex align-items-center gap-2 mb-0">
                    <strong class="text-truncate" style="font-size:0.88rem">{{ user.name || 'Unnamed' }}</strong>
                    <span class="badge text-bg-light" style="font-size:0.68rem">{{ user.role }}</span>
                  </div>
                  <small class="text-truncate d-block" style="color:var(--cq-text-muted);font-size:0.78rem">{{ user.email }} · {{ user.child?.name || 'No child' }}</small>
                </div>
                <small class="flex-shrink-0" style="color:var(--cq-text-muted);font-size:0.75rem">{{ formatDate(user.createdAt) }}</small>
              </div>
            </div>
          </div>
        </div>

        <!-- System health -->
        <div class="card border-0">
          <div class="card-body p-4">
            <h3 class="h5 mb-1" style="font-family:var(--cq-font-display);font-weight:700">System Health</h3>
            <small class="d-block mb-4" style="color:var(--cq-text-muted)">Key operational ratios</small>

            <div class="admin-progress-stack">
              <div>
                <div class="d-flex justify-content-between mb-2">
                  <span style="font-size:0.88rem">Email verification</span>
                  <strong style="font-size:0.88rem">{{ dashboard.health.verificationRate }}%</strong>
                </div>
                <div class="progress"><div class="progress-bar" style="background:var(--cq-gradient-brand)" :style="{ width: `${dashboard.health.verificationRate}%` }"></div></div>
              </div>
              <div>
                <div class="d-flex justify-content-between mb-2">
                  <span style="font-size:0.88rem">Child coverage</span>
                  <strong style="font-size:0.88rem">{{ dashboard.health.childCoverage }}%</strong>
                </div>
                <div class="progress"><div class="progress-bar bg-success" :style="{ width: `${dashboard.health.childCoverage}%` }"></div></div>
              </div>
              <div>
                <div class="d-flex justify-content-between mb-2">
                  <span style="font-size:0.88rem">Release readiness</span>
                  <strong style="font-size:0.88rem">{{ releaseReadiness }}%</strong>
                </div>
                <div class="progress"><div class="progress-bar bg-warning" :style="{ width: `${releaseReadiness}%` }"></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right column -->
      <div class="col-xl-5">
        <!-- Release channels -->
        <div class="card border-0 mb-4">
          <div class="card-body p-4">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h3 class="h5 mb-0" style="font-family:var(--cq-font-display);font-weight:700">Release Channels</h3>
                <small style="color:var(--cq-text-muted)">Version policy by platform</small>
              </div>
              <router-link :to="{ name: 'versions' }" class="btn btn-sm btn-outline-primary">Manage</router-link>
            </div>

            <div v-if="loading" class="text-center py-4" style="color:var(--cq-text-muted)">
              <i class="fa-solid fa-spinner fa-spin me-2"></i>Loading...
            </div>
            <div v-else class="d-flex flex-column gap-2">
              <div v-for="ver in dashboard.versions" :key="ver.platform" class="d-flex justify-content-between align-items-center p-3 rounded-3" style="border:1px solid var(--cq-border)">
                <div>
                  <strong class="d-block text-capitalize" style="font-size:0.9rem">{{ formatPlatformLabel(ver.platform) }}</strong>
                  <small style="color:var(--cq-text-muted)">v{{ ver.version }}</small>
                </div>
                <div class="text-end">
                  <span class="badge rounded-pill" :class="ver.force ? 'text-bg-danger' : 'text-bg-success'" style="font-size:0.72rem">
                    {{ ver.force ? 'Forced' : 'Soft' }}
                  </span>
                  <small class="d-block mt-1" style="color:var(--cq-text-muted);font-size:0.72rem">{{ formatDate(ver.updatedAt) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="card border-0">
          <div class="card-body p-4">
            <h3 class="h5 mb-1" style="font-family:var(--cq-font-display);font-weight:700">Quick Actions</h3>
            <small class="d-block mb-3" style="color:var(--cq-text-muted)">Jump into main workflows</small>

            <div class="d-grid gap-2">
              <router-link :to="{ name: 'users.create' }" class="admin-action-link text-decoration-none">
                <strong><i class="fa-solid fa-user-plus me-2" style="color:var(--cq-primary)"></i>Create User</strong>
                <span>New account with avatar, role & child profile</span>
              </router-link>
              <router-link :to="{ name: 'settings' }" class="admin-action-link text-decoration-none">
                <strong><i class="fa-solid fa-palette me-2" style="color:var(--cq-primary)"></i>Branding</strong>
                <span>Update title, logo & app status</span>
              </router-link>
              <router-link :to="{ name: 'versions' }" class="admin-action-link text-decoration-none">
                <strong><i class="fa-solid fa-code-branch me-2" style="color:var(--cq-primary)"></i>Release Policy</strong>
                <span>Manage platform versions & force updates</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
