
import { useProjectsStore } from "~/stores/projects";
import { useDebounceFn } from "@vueuse/core";

export function useProjects() {
  const projectsStore = useProjectsStore();


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
    searchProjects,
    updateProjectsPage,
    firstLoadProjects,
    filterProjectsStatus
  };
}
