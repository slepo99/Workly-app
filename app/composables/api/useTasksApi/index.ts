import type {
  TasksResponseModel,
  TasksModel,
  TaskCreateModel,
  TaskUpdateModel,
  GroupedTasksResponseModel,
  GetGroupedTasksParams,
} from "./types";
import { GROUPED_TASKS_PAGINATION } from "~/constants/api";


export function useTasksApi() {
  const { $api } = useNuxtApp();

  enum API {
    GET_TASKS = "/tasks",
    GET_PROJECT_TASKS = "/projects",
    GET_GROUPED_TASKS = "/tasks/grouped",
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
      body,
    });
  };

  const postTask = (body: TaskCreateModel) => {
    return $api<TasksModel>(API.GET_TASKS, {
      method: "POST",
      body,
    });
  };

  const deleteTask = (taskId: string) => {
    return $api(`${API.GET_TASKS}/${taskId}`, {
      method: "DELETE",
    });
  };

  const getGroupedTasks = ({
    page = GROUPED_TASKS_PAGINATION.PAGE,
    limit = GROUPED_TASKS_PAGINATION.LIMIT,
    search = "",
    statuses = [],
    sort = "updatedAt",
    order = "desc",
  }: GetGroupedTasksParams = {}) => {
    return $api<GroupedTasksResponseModel>(API.GET_GROUPED_TASKS, {
      query: {
        page,
        limit,
        search,
        status: statuses,
        sort,
        order,
      },
    });
  };

  return {
    getTasks,
    getProjectTasks,
    updateTask,
    postTask,
    deleteTask,
    getGroupedTasks,
  };
}
