import type { TasksModel } from "~/composables/api/useTasksApi/types";
import { TASK_STATUSES } from "~/constants/taskStatuses";
export function useDetails(tasks: Ref<TasksModel[]>) {
  const getComplitedTasks = computed(() => {
    return tasks.value.filter((task) => task.status === TASK_STATUSES.COMPLETED)
      .length;
  });
  const getTaskCompletionRate = computed(() => {
    if (tasks.value.length === 0) return 0;
    return Math.round((getComplitedTasks.value / tasks.value.length) * 100);
  });
  return {
    getComplitedTasks,
    getTaskCompletionRate
  }
}
