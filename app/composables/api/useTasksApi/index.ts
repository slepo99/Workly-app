import type { TasksResponseModel, TasksModel, TaskCreateModel, TaskUpdateModel } from "./types";

export function useTasksApi() {
  const { $api } = useNuxtApp();

  enum API {
    GET_TASKS = "/tasks",
    GET_PROJECT_TASKS = "/projects",
  }

  const getTasks = () => {
    return $api<TasksResponseModel>(API.GET_TASKS);
  };

  const getProjectTasks = (projectId: string) => {
    return $api<TasksResponseModel>(
      `${API.GET_PROJECT_TASKS}/${projectId}/tasks`,
    );
  };

  const updateTask = (taskId: string, body: TaskUpdateModel) => {
    return $api<TasksModel>(`${API.GET_TASKS}/${taskId}`, {
      method: "PATCH",
      body
    });
  };

  const postTask = (body: TaskCreateModel) => {
    return $api<TasksModel>(API.GET_TASKS, {
      method: "POST",
      body,
    });
  };

  return {
    getTasks,
    getProjectTasks,
    updateTask,
    postTask,
  };
}
