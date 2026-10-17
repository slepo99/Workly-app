import { defineStore } from "pinia";
import { ta } from "zod/v4/locales";
import type { DashboardStatsModel } from "~/composables/api/useDashboardApi/types";
import type { TasksModel } from "~/composables/api/useTasksApi/types";
interface DashboardStateModel {
  stats: DashboardStatsModel;
  isLoading: boolean;
  recentTasks: TasksModel[];
  upcomingDeadlines: TasksModel[];
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
    };
  },

  getters: {},

  actions: {
    async loadStats() {
      const { getDashboardStats } = useDashboardApi();

      try {
        this.isLoading = true;
        const stats = await getDashboardStats();

        this.stats = stats;
      } finally {
        this.isLoading = false;
      }
    },
    async loadTasks() {
      const { getDashboardTasks } = useDashboardApi();
      const tasks = await getDashboardTasks();
      this.recentTasks = tasks.recentTasks;
      this.upcomingDeadlines = tasks.upcomingDeadlines;
    },
  },
});
