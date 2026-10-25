import { defineStore } from "pinia";
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";
import type { TasksModel } from "~/composables/api/useTasksApi/types";
import type { UserModel } from "~/composables/api/useUsersApi/types";
interface UserStateModel {
  user: UserModel | null;
  userProjects: ProjectModel[];
  userTasks: TasksModel[];
}
export const useUserStore = defineStore("user", {
  state: (): UserStateModel => {
    return {
      user: null,
      userProjects: [],
      userTasks: [],
    };
  },
  getters: {

  },
  actions: {
    async loadUser(userId: string) {
      const { getUserById } = useUsersApi();
      const user = await getUserById(userId);
      this.user = user;
    },
    async loadUserProjects(userId: string) {
      const { getUserProjects } = useUsersApi();
      const projects = await getUserProjects(userId);
      this.userProjects = projects;
    },
    async loadUserTasks(userId: string) {
      const { getUserTasks } = useUsersApi();
      const tasks = await getUserTasks(userId);
      this.userTasks = tasks;
    },
  },
});
