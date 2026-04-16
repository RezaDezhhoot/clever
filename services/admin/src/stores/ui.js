import { defineStore } from "pinia";

const THEME_KEY = "cleverquest.admin.theme";

function getPreferredTheme() {
  const storedTheme = localStorage.getItem(THEME_KEY);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-bs-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

export const useUiStore = defineStore("ui", {
  state: () => ({
    theme: "light",
    sidebarOpen: false
  }),
  getters: {
    isDark: (state) => state.theme === "dark"
  },
  actions: {
    initializeTheme() {
      this.theme = getPreferredTheme();
      applyTheme(this.theme);
    },
    setTheme(theme) {
      this.theme = theme;
      applyTheme(theme);
    },
    toggleTheme() {
      this.setTheme(this.theme === "dark" ? "light" : "dark");
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    closeSidebar() {
      this.sidebarOpen = false;
    }
  }
});