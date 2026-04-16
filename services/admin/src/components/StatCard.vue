<script setup>
defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  subtitle: { type: String, default: "" },
  icon: { type: String, default: "fa-solid fa-chart-line" },
  tone: { type: String, default: "primary" }
});
</script>

<template>
  <article class="card border-0 h-100 admin-stat-card" :class="`admin-tone-${tone}`">
    <div class="card-body p-4">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div class="admin-stat-icon">
          <i :class="icon"></i>
        </div>
        <span class="badge rounded-pill" style="background:rgba(var(--cq-primary-rgb),0.08);color:var(--cq-primary);font-size:0.7rem;font-weight:700">
          <i class="fa-solid fa-arrow-trend-up me-1"></i>Active
        </span>
      </div>

      <h3 class="admin-stat-value mb-1">{{ value }}</h3>
      <p class="fw-semibold mb-1" style="font-size:0.82rem;color:var(--cq-text-secondary)">{{ title }}</p>
      <p class="mb-3" style="font-size:0.78rem;color:var(--cq-text-muted)">{{ subtitle }}</p>

      <div class="progress admin-stat-progress" role="progressbar">
        <div class="progress-bar"></div>
      </div>
    </div>
  </article>
</template>
