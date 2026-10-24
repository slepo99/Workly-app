import { useAuthStore } from "~/stores/auth";
import { useDashboardStore } from "~/stores/dashboard";
import { useProjectStore } from "~/stores/project";
import { useProjectsStore } from "~/stores/projects";
import { useTasksStore } from "~/stores/tasks";
import { useUsersStore } from "~/stores/users";

export function useResetStores() {
  const authStore = useAuthStore();
  const dashboardStore = useDashboardStore();
  const projectStore = useProjectStore();
  const projectsStore = useProjectsStore();
  const tasksStore = useTasksStore();
  const usersStore = useUsersStore();

  function resetAllStores() {
    dashboardStore.$reset();
    projectStore.$reset();
    projectsStore.$reset();
    tasksStore.$reset();
    usersStore.$reset();
    authStore.$reset();
  }

  return {
    resetAllStores,
  };
}