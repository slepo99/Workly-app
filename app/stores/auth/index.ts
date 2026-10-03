import { defineStore } from "pinia";
import type {
  Login,
  AuthUser,
  Register,
} from "~~/app/composables/api/useAuthApi/types";
interface AuthStateModel {
  user: null | AuthUser;
  isLoading: boolean;
  isInitialized: boolean;
  registratedUser: null | AuthUser;
}
export const useAuthStore = defineStore("auth", {
  state: (): AuthStateModel => {
    return {
      user: null,
      isLoading: false,
      isInitialized: false,
      registratedUser: null,
    };
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    isRegistrated: (state) => !!state.registratedUser,
  },

  actions: {
    async login(Data: Login) {
      const { login } = useAuthApi();

      this.isLoading = true;
      try {
        const user = await login(Data);
        this.user = user;
      } finally {
        this.isLoading = false;
      }
    },
    async fetchMe() {
      if (this.isInitialized) return;
      const { getMe } = useAuthApi();
      try {
        this.user = await getMe();
      } catch {
        this.user = null;
      } finally {
        this.isInitialized = true;
      }
    },

    async logout() {
      const { logout } = useAuthApi();
      await logout();
      this.clearAuth();
      if (import.meta.client) {
        const channel = new BroadcastChannel("auth");

        channel.postMessage({
          type: "logout",
        });

        channel.close();
      }
    },
    clearAuth() {
      this.user = null;
      this.isInitialized = true;
    },
    async register(data: Register) {
      const { register } = useAuthApi();
      this.isLoading = true;
      this.registratedUser = null;

      try {
        this.registratedUser = await register(data);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
