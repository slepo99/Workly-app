import { defineStore } from "pinia";
import type { UserModel } from "~/composables/api/useUsersApi/types";
import { USER_GROUPED_TASKS_PAGINATION } from "~/constants/api";
import type { GroupedTasksProjectModel } from "~/composables/api/useTasksApi/types";
interface UserStateModel {
  user: UserModel | null;
  groupedTasks: GroupedTasksProjectModel[];
  page: number;
  total: number;
  totalPages: number;
}
export const useUserStore = defineStore("user", {
  state: (): UserStateModel => {
    return {
      user: null,
      groupedTasks: [],
      page: USER_GROUPED_TASKS_PAGINATION.PAGE,
      total: 0,
      totalPages: 0,
    };
  },

  getters: {},

  actions: {
    async loadUser(userId: string) {
      const { getUserById } = useUsersApi();
      const user = await getUserById(userId);
      this.user = user;
    },

    async loadUserGroupedTasks(
      userId: string,
      page = USER_GROUPED_TASKS_PAGINATION.PAGE,
    ) {
      const { getGroupedTasksByUserId } = useTasksApi();
      const response = await getGroupedTasksByUserId({
        userId,
        page,
        limit: USER_GROUPED_TASKS_PAGINATION.LIMIT,
      });
      this.groupedTasks = response.projects;
      this.page = response.page;
      this.total = response.total;
      this.totalPages = response.totalPages;
    },
  },
});
