import { defineStore } from "pinia";
import type { DashboardStatsModel } from "~/composables/api/useDashboardApi/types";
interface DashboardStateModel {
  stats: DashboardStatsModel;
  isLoading: boolean
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
      isLoading: false
    };
  },

  getters: {},

  actions: {
    async loadStats() {
      const { getDashboardStats } = useDashboardApi();
      try {
        this.isLoading = true
        const stats = await getDashboardStats();
        this.stats = stats;
      } finally {
        this.isLoading = false
      }
    },
  },
});
