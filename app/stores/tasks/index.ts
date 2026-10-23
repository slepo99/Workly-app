import { defineStore } from "pinia";
import type { TasksModel, TaskSort, GroupedTasksProjectModel } from "~/composables/api/useTasksApi/types";
import { TASK_STATUSES, type TaskStatus } from "~/constants/taskStatuses";
import { GROUPED_TASKS_PAGINATION } from "~/constants/api";
interface TasksStateModel {
  tasks: TasksModel[];
  isLoading: boolean;
  page: number;
  total: number;
  totalPages: number;
  search: string;
  statuses: TaskStatus[],
  sortBy: TaskSort
  groupedTasks: GroupedTasksProjectModel[]
}

export const useTasksStore = defineStore("tasks", {
  state: (): TasksStateModel => {
    return {
      tasks: [],
      isLoading: false,
      page: GROUPED_TASKS_PAGINATION.PAGE,
      total: 0,
      totalPages: 0,
      search: "",
      statuses: [],
      sortBy: 'updatedAt',
      groupedTasks: []
    };
  },

  getters: {
    
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
    async loadGroupedTasks(page = GROUPED_TASKS_PAGINATION.PAGE) {
      const { getGroupedTasks } = useTasksApi();

      try {
        const response = await getGroupedTasks({
          page,
          limit: GROUPED_TASKS_PAGINATION.LIMIT,
          search: this.search,
          statuses: this.statuses,
          sort: this.sortBy
        });

        this.groupedTasks = response.projects
        this.page = response.page
        this.total = response.total
        this.totalPages = response.totalPages
      } finally {
      }
    },
  },
});
