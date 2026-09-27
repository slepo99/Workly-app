import { defineStore } from "pinia";
import type { Login, AuthUser } from "~~/app/composables/api/useAuthApi/types";
interface AuthStateModel {
  user: null | AuthUser;
  isLoading: boolean;
  isInitialized: boolean;
}
export const useAuthStore = defineStore("auth", {
  state: (): AuthStateModel => {
    return {
      user: null,
      isLoading: false,
      isInitialized: false,
    };
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
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
  },
});
