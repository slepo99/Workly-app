import { defineStore } from "pinia";

import type { UserModel } from "~/composables/api/useUsersApi/types";
import { USERS_PAGINATION } from "~/constants/api";

const usersControllers = new WeakMap<object, AbortController>();
interface UsersStateModel {
  users: UserModel[];
  isLoading: boolean;
  page: number;
  total: number;
  totalPages: number;
  search: string;
}

export const useUsersStore = defineStore("users", {
  state: (): UsersStateModel => {
    return {
      users: [],
      isLoading: false,
      page: USERS_PAGINATION.PAGE,
      total: 0,
      totalPages: 0,
      search: "",
    };
  },

  getters: {},

  actions: {
    resetSearch() {
      this.search = "";
    },
    cancelUsersLoad() {
      const controller = usersControllers.get(this.$state);

      if (!controller) {
        return;
      }

      controller.abort();
      usersControllers.delete(this.$state);
    },
    async loadAllUsers(page = USERS_PAGINATION.PAGE) {
      const { getUsers } = useUsersApi();

      this.cancelUsersLoad();

      const controller = new AbortController();

      usersControllers.set(this.$state, controller);
      try {
        const response = await getUsers({
          page,
          limit: USERS_PAGINATION.LIMIT,
          search: this.search,
        });
        if (
          controller.signal.aborted ||
          usersControllers.get(this.$state) !== controller
        ) {
          return;
        }
        this.users = response.users;
        this.page = response.page;
        this.total = response.total;
        this.totalPages = response.totalPages;
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        throw error;
      } finally {
        if (usersControllers.get(this.$state) === controller) {
          usersControllers.delete(this.$state);
        }
      }
    },
  },
});
