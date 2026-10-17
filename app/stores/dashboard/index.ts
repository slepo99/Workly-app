import { defineStore } from "pinia";
import { ta } from "zod/v4/locales";
import type { DashboardStatsModel } from "~/composables/api/useDashboardApi/types";
import type { TasksModel } from "~/composables/api/useTasksApi/types";
interface DashboardStateModel {
  stats: DashboardStatsModel;
  isLoading: boolean;
  recentTasks: TasksModel[];
  upcomingDeadlines: TasksModel[];
  tasksList: TasksModel[];
}

export const useDashboardStore = defineStore("dashboard", {
  state: (): DashboardStateModel => {
    return {
      stats: {
        totalTasks: 0,
        completedTasks: 0,
        totalProjects: 0,
        totalUsers: 0,
      },
      isLoading: false,
      recentTasks: [],
      upcomingDeadlines: [],
      tasksList: [],
    };
  },

  getters: {},

  actions: {
    async loadStats() {
      const { getDashboardStats } = useDashboardApi();
      const stats = await getDashboardStats();
      this.stats = stats;
    },
    async loadDashboardTasks() {
      const { getDashboardTasks } = useDashboardApi();
      const tasks = await getDashboardTasks();
      this.recentTasks = tasks.recentTasks;
      this.upcomingDeadlines = tasks.upcomingDeadlines;
    },
    async loadTasks() {
      const { getTasks } = useTasksApi();
      const tasks = await getTasks();
      this.tasksList = tasks.tasks;
    },
  },
});
