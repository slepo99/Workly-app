import { defineStore } from "pinia";

import type { UserModel } from "~/composables/api/useUsersApi/types";
import { USERS_PAGINATION } from "~/constants/api";
interface UsersStateModel {
  users: UserModel[];
  isLoading: boolean;
  page: number;
  total: number;
  totalPages: number;
}

export const useUsersStore = defineStore("users", {
  state: (): UsersStateModel => {
    return {
      users: [],
      isLoading: false,
      page: USERS_PAGINATION.PAGE,
      total: 0,
      totalPages: 0
    };
  },

  getters: {},

  actions: {
    async loadAllUsers() {
      const { getUsers } = useUsersApi();
      const response = await getUsers();
      this.users = response.users;
      this.page = response.page
      this.total = response.total
      this.totalPages = response.totalPages
    },
  },
});
