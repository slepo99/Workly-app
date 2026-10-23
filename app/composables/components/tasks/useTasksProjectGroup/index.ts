
import type { TasksModel } from "~/composables/api/useTasksApi/types";
import { TASK_STATUSES } from "~/constants/taskStatuses";

export function useTasksProjectGroup() {
  const getTasksComletionRate = (tasks: TasksModel[]) => {
    const completedTasks = tasks.filter(
      (task) => task.status === TASK_STATUSES.COMPLETED,
    ).length;
    const percent =
      tasks.length === 0
        ? 0
        : Math.round((completedTasks / tasks.length) * 100);

        return {
            completedTasks,
            percent
        }
  };
  return {
    getTasksComletionRate
  }
}
