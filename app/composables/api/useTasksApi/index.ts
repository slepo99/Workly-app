import type { TasksModel } from "./types";
export function useTasksApi() {
  const { $api } = useNuxtApp();
  enum API {
    GET_TASKS = "/tasks",
  }

  const getTasks = () => {
    return $api<TasksModel[]>(API.GET_TASKS);
  };

  return {
    getTasks,
  };
}
