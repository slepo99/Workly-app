import { useProjectStore } from "~/stores/project";
import type { BreadcrumbItem } from "@nuxt/ui";
export function useProject() {
  const projectStore = useProjectStore();
  const toast = useToast();
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
  async function onUpdateMemberRole(data: {
    projectId: string;
    userId: string;
    role: string;
  }) {
    try {
      await projectStore.updateProjectMemberRole(
        data.projectId,
        data.userId,
        data.role,
      );
    } catch (error) {
      console.error("Error updating member role:", error);
      toast.add({
        title: "Error updating member role",
        color: "warning",
      });
    }
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
    onLoadProjectTasks,
    onUpdateMemberRole,
  };
}
