import { useDashboardStore } from "~/stores/dashboard";

export function useDashboard() {
  const dashboardStore = useDashboardStore();

  async function loadDashboard() {
    try {
      await callOnce(
        "dashboard",
        async () => {
          await Promise.all([
            dashboardStore.loadStats(),
            dashboardStore.loadDashboardTasks(),
            dashboardStore.loadTasks()
          ]);
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
