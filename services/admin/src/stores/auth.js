import { defineStore } from "pinia";
import client from "../api/client";

const TOKEN_KEY = "cleverquest.admin.token";
const USER_KEY = "cleverquest.admin.user";

function loadUser() {
  const raw = localStorage.getItem(USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || "",
    user: loadUser(),
    loading: false
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token)
  },
  actions: {
    setSession(payload) {
      this.token = payload.token;
      this.user = payload.user;
      localStorage.setItem(TOKEN_KEY, payload.token);
      localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    },
    clearSession() {
      this.token = "";
      this.user = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
    async login(credentials) {
      this.loading = true;

      try {
        const { data } = await client.post("/auth/login", credentials);
        this.setSession(data);
        return data.user;
      } finally {
        this.loading = false;
      }
    },
    async fetchMe() {
      if (!this.token) {
        return null;
      }

      const { data } = await client.get("/auth/me");
      this.user = data.user;
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data.user;
    },
    logout() {
      this.clearSession();
    }
  }
});
