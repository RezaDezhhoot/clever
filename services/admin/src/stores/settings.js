import { defineStore } from "pinia";
import client from "../api/client";
import { defaultBrandIcon, resolveMediaUrl } from "../utils/media";

const CACHE_KEY = "cleverquest.admin.branding";

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useSettingsStore = defineStore("settings", {
  state: () => {
    const cached = loadCache();
    return {
      title: cached?.title || "Clever Quest",
      logo: cached?.logo || "",
      status: cached?.status ?? true,
      loaded: false
    };
  },
  getters: {
    brandLogo(state) {
      return resolveMediaUrl(state.logo) || defaultBrandIcon;
    },
    brandTitle(state) {
      return state.title || "Clever Quest";
    }
  },
  actions: {
    async fetchBranding() {
      if (this.loaded) return;
      try {
        const { data } = await client.get("/settings");
        const v = data.values || data;
        this.title = v.title || "Clever Quest";
        this.logo = v.logo || "";
        this.status = v.status ?? true;
        this.loaded = true;
        localStorage.setItem(CACHE_KEY, JSON.stringify({ title: this.title, logo: this.logo, status: this.status }));
      } catch {
        // silently use cached / defaults
      }
    },
    updateFromSave(values) {
      this.title = values.title || "Clever Quest";
      this.logo = values.logo || "";
      this.status = values.status ?? true;
      localStorage.setItem(CACHE_KEY, JSON.stringify({ title: this.title, logo: this.logo, status: this.status }));
    }
  }
});
