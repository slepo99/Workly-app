import type { DashboardStatsModel } from "./types";
export function useDashboardApi() {
  const { $api } = useNuxtApp();

  enum API {
    DASHBOARD_STATS = "/dashboard/stats",
  }
  const getDashboardStats = () => {
    return $api<DashboardStatsModel>(API.DASHBOARD_STATS);
  };
  return {
    getDashboardStats,
  };
}
