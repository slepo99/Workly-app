import { useDashboardStore } from "~/stores/dashboard";

export function useDashboard() {
  const dashboardStore = useDashboardStore();

  async function loadDashboard() {
    try {
      await callOnce(
        "dashboard",
        async () => {
          await dashboardStore.loadStats();
          //           await Promise.all([
          //   dashboardStore.loadStats(),
          //   dashboardStore.loadTasks(),
          //   dashboardStore.loadProjects(),
          // ])
        },
        { mode: "navigation" },
      );
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    }
  }

  return {
    loadDashboard,
  };
}
