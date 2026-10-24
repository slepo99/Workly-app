import { defineStore } from "pinia";
import type { UserModel } from "~/composables/api/useUsersApi/types";
interface UserStateModel {
  user: UserModel | null;
}
export const useUserStore = defineStore("user", {
  state: (): UserStateModel => {
    return {
      user: null,
    };
  },
  getters: {},
  actions: {
    async loadUser(userId: string) {
      const { getUserById } = useUsersApi();
      const user = await getUserById(userId);
      this.user = user;
    },
  },
});
