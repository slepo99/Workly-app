import type { ProjectModel } from "~/composables/api/useProjectsApi/types";
import type { ProjectMemberModel } from "~/composables/api/useProjectMembersApi/types";
import type { TaskCreateModel } from "~/composables/api/useTasksApi/types";
import { z } from "zod";
import { useProjectStore } from "~/stores/project";
export function useProjectCreateTask(
  projectMembers: Ref<ProjectMemberModel[]>,
  project: Ref<ProjectModel>,
) {
  const projectStore = useProjectStore();
  const toast = useToast();

  const isOpen = ref(false);
  const isSaving = ref(false);
  const form = reactive<TaskCreateModel>({
    title: "",
    description: "",
    status: "in_progress",
    assigneeIds: [],
    endDate: "",
    startDate: "",
    projectId: project.value.id,
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
  function resetForm() {
    form.title = "";
    form.description = "";
    form.status = "in_progress";
    form.assigneeIds = [];
    form.endDate = "";
    form.startDate = "";
  }
  async function createTask() {
    const { postTask } = useTasksApi();
    try {
      isSaving.value = true;
      await postTask(form);
      resetForm();
      isOpen.value = false;
      await projectStore.loadProjectTasks(project.value.id);
      toast.add({
        title: "Task created",
        description: "Task has been created successfully",
        color: "success",
      });
    } catch (error) {
      toast.add({
        title: "Error creating task",
        description: "Failed to create task",
        color: "error",
      });
      console.error("Error creating task:", error);
    } finally {
      isSaving.value = false;
    }
  }
  const taskDates = computed({
    get() {
      return {
        start: form.startDate,
        end: form.endDate,
      };
    },

    set(value) {
      form.startDate = value.start;
      form.endDate = value.end;
    },
  });
  const schema = z.object({
    title: z.string().min(1, "Task title is required"),
    description: z.string().optional(),
    status: z.string().min(1, "Status is required"),
    assigneeIds: z.array(z.string()),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    projectId: z.string(),
  });
  return {
    memberItems,
    form,
    isOpen,
    isSaving,
    resetForm,
    createTask,
    taskDates,
    schema,
  };
}
