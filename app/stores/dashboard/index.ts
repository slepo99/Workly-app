import { defineStore } from "pinia";
import type { TasksModel } from "~/composables/api/useTasksApi/types";
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";
import type { UserModel } from "~/composables/api/useUsersApi/types";
import { TASK_STATUSES } from "~/constants/taskStatuses";
interface DashboardStateModel {
  tasks: TasksModel[];
  projects: ProjectModel[],
  users: UserModel[]
}
export const useDashboardStore = defineStore("dashboard", {
  state: (): DashboardStateModel => {
    return {
      tasks: [],
      projects: [],
      users: []
    };
  },

  getters: {
    getComplitedTasks(state) {
      return state.tasks.filter((task) => task.status === TASK_STATUSES.COMPLETED)
    }
  },

  actions: {
    async loadAllTasks() {
      const { getTasks } = useTasksApi();
      const tasks = await getTasks();
      this.tasks = tasks;
    },
    async loadAllProjects() {
      const { getProjects } = useProjectsApi()
      const projects = await getProjects()
      this.projects = projects
    },
    async loadAllUsers() {
      const { getUsers } = useUsersApi()
      const users = await getUsers()
      this.users = users
    }
  },
});
