import { defineStore } from "pinia";
import type { TasksModel } from "~/composables/api/useTasksApi/types";
interface DashboardStateModel {
  tasks: TasksModel[];
}
export const useDashboardStore = defineStore("dashboard", {
  state: (): DashboardStateModel => {
    return {
      tasks: [],
    };
  },

  getters: {},

  actions: {
    async getAllTasks() {
      const { getTasks } = useTasksApi();
      const tasks = await getTasks();
      this.tasks = tasks;
    },
  },
});
