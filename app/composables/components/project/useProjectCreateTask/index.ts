
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";
import type { ProjectMemberModel } from "~/composables/api/useProjectMembersApi/types";
import type { TaskCreateModel } from "~/composables/api/useTasksApi/types";
export function useProjectCreateTask(
  projectMembers: ProjectMemberModel[],
  project: ProjectModel,
) {
  const isOpen = ref(false);
  const isSaving = ref(false);
  const form = reactive<TaskCreateModel>({
    title: "",
    description: "",
    status: "in_progress",
    assigneeIds: [],
    endDate: "",
    startDate: "",
    projectId: project.id,
  });

  const memberItems = computed(() =>
    projectMembers.map((member) => ({
      label: member.user.name,
      value: member.user.id,
      avatar: member.user.avatar
        ? {
            src: member.user.avatar,
            alt: member.user.name,
          }
        : undefined,
    })),
  );
  function resetForm() {
    form.title = "";
    form.description = "";

    form.status = "in_progress";
    form.assigneeIds = [];
    form.endDate = "";
    form.startDate = "";
  }
  async function createTask() {

    // soon will be added
  }
  return {
    memberItems,
    form,
    isOpen,
    isSaving,
    resetForm,
    createTask,
  };
}
