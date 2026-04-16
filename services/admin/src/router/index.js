import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import AdminLayout from "../layouts/AdminLayout.vue";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import UsersListView from "../views/UsersListView.vue";
import UserFormView from "../views/UserFormView.vue";
import SettingsView from "../views/SettingsView.vue";
import VersionsView from "../views/VersionsView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { guestOnly: true }
    },
    {
      path: "/",
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          redirect: { name: "dashboard" }
        },
        {
          path: "dashboard",
          name: "dashboard",
          component: DashboardView,
          meta: { title: "Dashboard", subtitle: "Track users, releases, and application health from one control center." }
        },
        {
          path: "users",
          name: "users.index",
          component: UsersListView,
          meta: { title: "Users", subtitle: "Manage administrators, app users, and linked child profiles." }
        },
        {
          path: "users/create",
          name: "users.create",
          component: UserFormView,
          meta: { title: "Create User", subtitle: "Add a new user profile with role, verification, avatar, and child details." }
        },
        {
          path: "users/:id/edit",
          name: "users.edit",
          component: UserFormView,
          meta: { title: "Edit User", subtitle: "Update account data, credentials, and linked child information." }
        },
        {
          path: "settings",
          name: "settings",
          component: SettingsView,
          meta: { title: "Settings", subtitle: "Control the product title, logo, and public application status." }
        },
        {
          path: "versions",
          name: "versions",
          component: VersionsView,
          meta: { title: "Version Control", subtitle: "Manage release channels and force-update policies for each platform." }
        }
      ]
    }
  ]
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (auth.token && !auth.user) {
    try {
      await auth.fetchMe();
    } catch {
      auth.clearSession();
    }
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: "login" };
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: "dashboard" };
  }

  return true;
});

router.afterEach((to) => {
  const title = to.meta.title ? `${to.meta.title} | Clever Quest Admin` : "Clever Quest Admin";
  document.title = title;
});

export default router;

