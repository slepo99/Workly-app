import type { DashboardStatsModel, DashboardTasksModel } from "./types";

export function useDashboardApi() {
  const { $api } = useNuxtApp();

  enum API {
    DASHBOARD_STATS = "/dashboard/stats",
    DASHBOARD_TASKS = '/dashboard/tasks'
  }

  const getDashboardStats = () => {
    return $api<DashboardStatsModel>(API.DASHBOARD_STATS);
  };
  const getDashboardTasks = () => {
    return $api<DashboardTasksModel>(API.DASHBOARD_TASKS)
  }
  return {
    getDashboardStats,
    getDashboardTasks
  };
}
