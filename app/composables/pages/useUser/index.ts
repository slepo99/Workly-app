import { useUserStore } from "~/stores/user";
import type { BreadcrumbItem } from "@nuxt/ui";

export function useUser() {
  const userStore = useUserStore();

  async function onFirstLoadUser(userId: string) {
    await callOnce(
      `user`,
      async () => {
        await Promise.all([
          userStore.loadUser(userId),
          userStore.loadUserProjects(userId),
          userStore.loadUserTasks(userId),
        ]);
      },
      { mode: "navigation" },
    );
  }
  function getBreadcumbs(userId: string): BreadcrumbItem[] {
    return [
      {
        label: "Users",
        icon: "i-lucide-folder",
        to: "/users",
      },
      {
        label: userStore.user?.name,
        icon: "i-lucide-file-text",
        to: `/users/${userId}`,
      },
    ];
  }
  const getUserStats = computed(() => {
    const projectsCount = userStore.userProjects.length;
    const tasksCount = userStore.userTasks.length
    const { active, completed, pending } = userStore.userTasks.reduce(
      (stats, task) => {
        if (task.status === "in_progress") {
          stats.active++;
        }

        if (task.status === "completed") {
          stats.completed++;
        }

         if (task.status === "pending") {
          stats.pending++;
        }

        return stats;
      },
      { active: 0, completed: 0, pending: 0},
    );
    const completitionRate =  Math.round(completed / (tasksCount / 100))
    return {
      projectsCount,
      active,
      completed,
      pending,
      completitionRate,
      tasksCount
    };
  });
  return {
    onFirstLoadUser,
    getBreadcumbs,
    getUserStats
  };
}
