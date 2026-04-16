<script setup>
import { onMounted, reactive, ref } from "vue";
import client from "../api/client";
import { formatDate } from "../utils/format";
import { confirmDelete, showError, showSuccess } from "../utils/feedback";

const loading = ref(false);
const deletingId = ref(null);
const items = ref([]);
const meta = ref({ page: 1, perPage: 10, total: 0, totalPages: 1 });
const filters = reactive({ search: "" });

async function fetchUsers(page = meta.value.page) {
  loading.value = true;
  try {
    const { data } = await client.get("/users", { params: { page, perPage: meta.value.perPage, search: filters.search } });
    items.value = data.items;
    meta.value = data.meta;
  } catch (error) {
    showError(error.response?.data?.message || "Unable to load users.");
  } finally {
    loading.value = false;
  }
}

async function removeUser(id, name) {
  const confirmed = await confirmDelete({ title: "Delete this user?", text: `${name || "This user"} will be removed permanently.`, confirmButtonText: "Delete user" });
  if (!confirmed) return;

  deletingId.value = id;
  try {
    await client.delete(`/users/${id}`);
    showSuccess("User deleted.");
    await fetchUsers();
  } catch (error) {
    showError(error.response?.data?.message || "Unable to delete user.");
  } finally {
    deletingId.value = null;
  }
}

onMounted(() => fetchUsers(1));
</script>

<template>
  <section class="admin-page">
    <!-- Header -->
    <div class="card border-0 mb-4">
      <div class="card-body p-4 d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-lg-center">
        <div>
          <small class="text-uppercase fw-bold" style="font-size:0.68rem;letter-spacing:0.1em;color:var(--cq-primary)">User Directory</small>
          <h2 class="h4 mt-1 mb-1" style="font-family:var(--cq-font-display);font-weight:700">Accounts & Child Profiles</h2>
          <p class="mb-0" style="color:var(--cq-text-secondary);font-size:0.88rem">{{ meta.total }} total users in the workspace.</p>
        </div>
        <router-link :to="{ name: 'users.create' }" class="btn btn-primary flex-shrink-0">
          <i class="fa-solid fa-user-plus me-2"></i>Create User
        </router-link>
      </div>
    </div>

    <!-- Table card -->
    <div class="card border-0">
      <div class="card-body p-4">
        <!-- Search bar -->
        <form class="row g-3 align-items-end mb-4" @submit.prevent="fetchUsers(1)">
          <div class="col-12 col-lg-5">
            <label class="form-label">Search</label>
            <div class="input-group">
              <span class="input-group-text" style="background:var(--cq-primary-soft);border-color:var(--cq-border);color:var(--cq-primary)">
                <i class="fa-solid fa-magnifying-glass" style="font-size:0.85rem"></i>
              </span>
              <input v-model="filters.search" type="text" class="form-control" placeholder="Search by name or email" />
            </div>
          </div>
          <div class="col-auto">
            <button class="btn btn-outline-secondary" type="submit">Apply</button>
          </div>
          <div class="col">
            <div class="admin-inline-summary">
              <strong>{{ meta.total }}</strong>
              <span>registered users</span>
            </div>
          </div>
        </form>

        <!-- Responsive table -->
        <div class="table-responsive">
          <table class="table align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Child</th>
                <th>Verified</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="6" class="text-center py-5" style="color:var(--cq-text-muted)">
                  <i class="fa-solid fa-spinner fa-spin me-2"></i>Loading...
                </td>
              </tr>
              <tr v-else-if="!items.length">
                <td colspan="6" class="text-center py-5" style="color:var(--cq-text-muted)">No users found.</td>
              </tr>
              <tr v-for="item in items" :key="item.id">
                <td>
                  <div class="d-flex align-items-center gap-3">
                    <div class="admin-avatar-chip">{{ item.name?.[0] || 'U' }}</div>
                    <div>
                      <strong style="font-size:0.88rem">{{ item.name || 'Unnamed' }}</strong>
                      <small class="d-block" style="color:var(--cq-text-muted);font-size:0.78rem">{{ formatDate(item.createdAt) }}</small>
                    </div>
                  </div>
                </td>
                <td style="font-size:0.88rem">{{ item.email }}</td>
                <td>
                  <span class="badge rounded-pill" :style="`background:${item.role === 'admin' ? 'rgba(var(--cq-primary-rgb),0.1)' : 'rgba(var(--cq-success-rgb),0.1)'};color:${item.role === 'admin' ? 'var(--cq-primary)' : 'var(--cq-success)'};font-size:0.72rem`">
                    {{ item.role }}
                  </span>
                </td>
                <td style="font-size:0.88rem;color:var(--cq-text-secondary)">{{ item.child?.name || '—' }}</td>
                <td>
                  <span v-if="item.emailVerifiedAt" style="color:var(--cq-success)"><i class="fa-solid fa-circle-check"></i></span>
                  <span v-else style="color:var(--cq-text-muted)"><i class="fa-regular fa-circle"></i></span>
                </td>
                <td class="text-end">
                  <div class="d-inline-flex gap-2">
                    <router-link :to="{ name: 'users.edit', params: { id: item.id } }" class="btn btn-sm btn-outline-primary" style="font-size:0.8rem">
                      <i class="fa-solid fa-pen-to-square me-1"></i>Edit
                    </router-link>
                    <button class="btn btn-sm btn-outline-danger" type="button" @click="removeUser(item.id, item.name)" :disabled="deletingId === item.id" style="font-size:0.8rem">
                      <i class="fa-solid fa-trash-can me-1"></i>{{ deletingId === item.id ? '...' : 'Delete' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-4 pt-3" style="border-top:1px solid var(--cq-border)">
          <small style="color:var(--cq-text-muted)">Page {{ meta.page }} of {{ meta.totalPages }} · {{ meta.total }} users</small>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-secondary" :disabled="meta.page <= 1 || loading" @click="fetchUsers(meta.page - 1)">
              <i class="fa-solid fa-chevron-left me-1"></i>Prev
            </button>
            <button class="btn btn-sm btn-outline-secondary" :disabled="meta.page >= meta.totalPages || loading" @click="fetchUsers(meta.page + 1)">
              Next<i class="fa-solid fa-chevron-right ms-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
