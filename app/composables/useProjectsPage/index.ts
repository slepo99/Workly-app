import {
  PROJECT_STATUSES,
  type ProjectStatus,
} from "~/constants/projectStatuses";
import { useProjectsStore } from "~/stores/projects";
import { useDebounceFn } from "@vueuse/core";
export function useProjectsPage() {
  const projectsStore = useProjectsStore();

  const filters = [
    { label: "Completed", value: PROJECT_STATUSES.COMPLETED },
    { label: "On hold", value: PROJECT_STATUSES.ON_HOLD },
    { label: "Active", value: PROJECT_STATUSES.ACTIVE },
  ];

  const searchProjects = useDebounceFn(async () => {
    await projectsStore.searchProjects();
  }, 500);

  async function updateProjectsPage(value: number) {
    if (!projectsStore.search) {
      await projectsStore.loadAllProjects(value);
    } else {
      await projectsStore.searchProjects(value);
    }
  }
  async function firstLoadProjects() {
    try {
      await callOnce(
        "projects",
        async () => {
          await projectsStore.loadAllProjects();
        },
        { mode: "navigation" },
      );
    } catch (error) {
      console.error("Failed to load projects:", error);
    }
  }

  async function filterProjectsStatus() {
    if (!projectsStore.search) {
      await projectsStore.loadAllProjects();
    } else {
      await projectsStore.searchProjects();
    }
  }
  return {
    filters,
    searchProjects,
    updateProjectsPage,
    firstLoadProjects,
    filterProjectsStatus
  };
}
