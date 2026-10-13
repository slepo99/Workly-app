import type {
  TaskUpdateModel,
  TasksModel,
} from "~/composables/api/useTasksApi/types";
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";
import type { ProjectMemberModel } from "~/composables/api/useProjectMembersApi/types";
import { useProjectStore } from "~/stores/project";
import { z } from "zod";

export function useProjectEditTask(
  projectMembers: Ref<ProjectMemberModel[]>,
  // project: Ref<ProjectModel>,
  task: Ref<TasksModel | null>,
  isOpen: Ref<boolean>,
) {
  const projectStore = useProjectStore();
  const toast = useToast();

  const isSaving = ref(false);

  const form = reactive<TaskUpdateModel>({
    title: "",
    description: "",
    status: "in_progress",
    assigneeIds: [],
    endDate: "",
    startDate: "",
  });

  const schema = z.object({
    title: z.string().trim().min(1, "Task title is required"),
    description: z.string().optional(),
    status: z.string().min(1, "Status is required"),
    assigneeIds: z.array(z.string().uuid()),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  });

  const memberItems = computed(() =>
    projectMembers.value.map((member) => ({
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

  const taskDates = computed({
    get() {
      return {
        start: form.startDate ?? "",
        end: form.endDate ?? "",
      };
    },

    set(value) {
      form.startDate = value.start;
      form.endDate = value.end;
    },
  });

  function resetForm() {
    const selectedTask = task.value;

    form.title = selectedTask?.title ?? "";
    form.description = selectedTask?.description ?? "";
    form.status = selectedTask?.status ?? "in_progress";
    //todo: remove asignees filter logic to server side
    form.assigneeIds =
      selectedTask?.assignees
        .filter((as) =>
          projectMembers.value.some((member) => member.user.id === as.id),
        )
        .map((as) => as.id) ?? [];
    form.endDate = selectedTask?.endDate ?? "";
    form.startDate = selectedTask?.startDate ?? "";
  }

  async function editTask() {
    const selectedTask = task.value;

    if (!selectedTask || isSaving.value) return;

    const { updateTask } = useTasksApi();

    isSaving.value = true;

    try {
      await updateTask(selectedTask.id, { ...form });
    } catch (error) {
      toast.add({
        title: "Error updating task",
        description: "Failed to update task",
        color: "error",
      });

      console.error("Error updating task:", error);

      return;
    } finally {
      isSaving.value = false;
    }

    isOpen.value = false;

    toast.add({
      title: "Task updated",
      description: "Task has been updated successfully",
      color: "success",
    });

    try {
      await projectStore.loadProjectTasks(selectedTask.projectId);
    } catch (error) {
      toast.add({
        title: "Failed to refresh tasks",
        description: "Task was saved, but the list could not be refreshed",
        color: "error",
      });

      console.error("Failed to refresh tasks:", error);
    }
  }

  return {
    isSaving,
    form,
    schema,
    memberItems,
    resetForm,
    taskDates,
    editTask,
  };
}
