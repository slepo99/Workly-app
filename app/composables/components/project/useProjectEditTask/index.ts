import type { TaskUpdateModel } from "~/composables/api/useTasksApi/types";
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";
import type { ProjectMemberModel } from "~/composables/api/useProjectMembersApi/types";
import { useProjectStore } from "~/stores/project";
import { z } from "zod";

export function useProjectEditTask(
  projectMembers: Ref<ProjectMemberModel[]>,
  project: Ref<ProjectModel>,
) {
  const projectStore = useProjectStore();
  const toast = useToast();

  const isOpen = ref(false);
  const isSaving = ref(false);

  const form = reactive<TaskUpdateModel>({
    title: "",
    description: "",
    status: "in_progress",
    assigneeIds: [],
    endDate: "",
    startDate: "",
    projectId: project.value.id,
  });

  const schema = z.object({
    title: z.string().trim().min(1, "Task title is required"),
    description: z.string().optional(),
    status: z.string().min(1, "Status is required"),
    assigneeIds: z.array(z.string().uuid()),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    projectId: z.string().uuid().optional(),
  });
  return {
    isOpen, 
    isSaving,
    form,
    schema
  }
}
