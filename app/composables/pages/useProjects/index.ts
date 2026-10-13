import { useProjectsStore } from "~/stores/projects";
import { useDebouncedFn } from "~/composables/useDebounce";

export function useProjects() {
  const isCreateProjectPopup = ref(false);
  const projectsStore = useProjectsStore();

  const searchProjects = useDebouncedFn(() => projectsStore.loadProjects());

  async function updateProjectsPage(value: number) {
    await projectsStore.loadProjects(value);
  }

  async function firstLoadProjects() {
    try {
      await callOnce(
        "projects",
        async () => {
          await projectsStore.loadProjects();
        },
        { mode: "navigation" },
      );
    } catch (error) {
      console.error("Failed to load projects:", error);
    }
  }

  async function filterProjectsStatus() {
    await projectsStore.loadProjects();
  }

  async function clearSearchInput() {
    projectsStore.resetSearch();
    await projectsStore.loadProjects();
  }
  function triggerCreateProject() {
    isCreateProjectPopup.value = true;
  }
  return {
    searchProjects,
    updateProjectsPage,
    firstLoadProjects,
    filterProjectsStatus,
    clearSearchInput,
    triggerCreateProject,
    isCreateProjectPopup,
  };
}
