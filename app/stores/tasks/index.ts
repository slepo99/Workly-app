import { defineStore } from "pinia";
import type { TasksModel } from "~/composables/api/useTasksApi/types";
import { TASK_STATUSES } from "~/constants/taskStatuses";
interface TasksStateModel {
  tasks: TasksModel[];
  isLoading: boolean;
}
export const useTasksStore = defineStore("tasks", {
  state: (): TasksStateModel => {
    return {
      tasks: [],
      isLoading: false,
    };
  },

  getters: {
    getComplitedTasks(state) {
      return state.tasks.filter(
        (task) => task.status === TASK_STATUSES.COMPLETED,
      );
    },
  },

  actions: {
    async loadAllTasks() {
      const { getTasks } = useTasksApi();
      this.isLoading = true;
      try {
        const tasks = await getTasks();
        this.tasks = tasks.tasks;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
