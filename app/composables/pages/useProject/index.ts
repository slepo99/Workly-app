import { useProjectStore } from "~/stores/project";
import type { BreadcrumbItem } from "@nuxt/ui";
export function useProject() {
  const projectStore = useProjectStore();

  async function onFirstLoadProject(projectId: string) {
    await callOnce(
      `project-${projectId}`,
      async () => {
        await projectStore.loadProjectById(projectId);
      },
      { mode: "navigation" },
    );
  }
  async function onLoadProjectMembers(projectId: string) {
     await callOnce(
      `project-members-${projectId}`,
      async () => {
        await projectStore.loadProjectMembers(projectId);
      },
      { mode: "navigation" },
    );
  }
  async function onLoadProjectTasks(projectId: string) {
     await callOnce(
      `project-tasks-${projectId}`,
      async () => {
        await projectStore.loadProjectTasks(projectId);
      },
      { mode: "navigation" },
    );
  }
  function getBreadcumbs(projectId: string): BreadcrumbItem[] {
    return [
      {
        label: "Projects",
        icon: "i-lucide-folder",
        to: "/projects",
      },
      {
        label: projectStore.project?.name,
        icon: "i-lucide-file-text",
        to: `/projects/${projectId}`,
      },
    ];
  }
  return {
    onFirstLoadProject,
    getBreadcumbs,
    onLoadProjectMembers,
    onLoadProjectTasks
  };
}
