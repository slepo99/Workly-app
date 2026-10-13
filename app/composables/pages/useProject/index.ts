import { useProjectStore } from "~/stores/project";
import type { BreadcrumbItem } from "@nuxt/ui";
import type { TaskStatus } from "~/constants/taskStatuses";
export function useProject(projectId: Ref<string>) {
  const projectStore = useProjectStore();
  const toast = useToast();
  const isMmeberUpdating = ref(false);
  const isMemberRemoving = ref(false);
  const isTaskUpdating = ref(false);
  const isTaskEditModalOpen = ref(false);

  async function onFirstLoadProject() {
    await callOnce(
      `project-${projectId.value}`,
      async () => {
        await projectStore.loadProjectById(projectId.value);
      },
      { mode: "navigation" },
    );
  }

  async function onLoadProjectMembers() {
    await callOnce(
      `project-members-${projectId.value}`,
      async () => {
        await projectStore.loadProjectMembers(projectId.value);
      },
      { mode: "navigation" },
    );
  }

  async function onLoadProjectTasks() {
    await callOnce(
      `project-tasks-${projectId.value}`,
      async () => {
        await projectStore.loadProjectTasks(projectId.value);
      },
      { mode: "navigation" },
    );
  }

  async function onUpdateMemberRole(data: {
    projectId: string;
    userId: string;
    role: string;
  }) {
    isMmeberUpdating.value = true;

    try {
      await projectStore.updateProjectMemberRole(
        data.projectId,
        data.userId,
        data.role,
      );
      await projectStore.loadProjectMembers(projectId.value);
    } catch (error) {
      console.error("Error updating member role:", error);
      toast.add({
        title: "Error updating member role",
        color: "warning",
      });
    } finally {
      isMmeberUpdating.value = false;
    }
  }

  async function onRemoveProjectMember(id: string) {
    const { deleteProjectMember } = useProjectMembersApi();

    isMemberRemoving.value = true;

    try {
      await deleteProjectMember(id);
      await projectStore.loadProjectMembers(projectId.value);
    } catch (e: any) {
      console.error("Error romoving member", e);
      toast.add({
        title: "Error romoving member",
        description: e.statusMessage,
        color: "warning",
      });
    } finally {
      isMemberRemoving.value = false;
    }
  }

  async function onUpdateTaskStatus(taskId: string, status: TaskStatus) {
    const { updateTask } = useTasksApi();

    isTaskUpdating.value = true;
    try {
      await updateTask(taskId, { status });
      await projectStore.loadProjectTasks(projectId.value);
    } catch {
      toast.add({
        title: "Error updating task status",
        color: "warning",
      });
    } finally {
      isTaskUpdating.value = false;
    }
  }

  async function onEditTask(taskId: string) {
    projectStore.setTaskId(taskId);
    isTaskEditModalOpen.value = true;
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
    onRemoveProjectMember,
    onUpdateTaskStatus,
    onEditTask,
    isTaskEditModalOpen,
  };
}
