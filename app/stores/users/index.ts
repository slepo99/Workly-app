import { defineStore } from "pinia";

import type { UserModel } from "~/composables/api/useUsersApi/types";

interface UsersStateModel {
  users: UserModel[];
  isLoading: boolean;
}

export const useUsersStore = defineStore("users", {
  state: (): UsersStateModel => {
    return {
      users: [],
      isLoading: false,
    };
  },

  getters: {},

  actions: {
    async loadAllUsers() {
      const { getUsers } = useUsersApi();
      const users = await getUsers();
      this.users = users;
    },
  },
});
