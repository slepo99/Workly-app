import type { TaskStatus } from "~/constants/taskStatuses";
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";

export interface AssigneesModel {
  id: string;
  name: string;
  avatar: string | null;
}

export interface TasksModel {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignees: AssigneesModel[];
}

export interface TasksResponseModel {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  tasks: TasksModel[];
}

export interface TaskCreateModel {
  title: string;
  description: string;
  status: TaskStatus;
  startDate: string;
  endDate: string;
  projectId: string;
  assigneeIds: string[];
}

export interface TaskUpdateModel
  extends Partial<TaskCreateModel> {}

export interface GroupedTasksProjectModel
  extends Pick<
    ProjectModel,
    | "id"
    | "name"
    | "description"
    | "status"
    | "image"
    | "createdAt"
    | "updatedAt"
  > {
  tasks: TasksModel[];
}

export interface GroupedTasksResponseModel {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  projects: GroupedTasksProjectModel[];
}


export type TaskSort =
  | "updatedAt"
  | "createdAt"
  | "startDate"
  | "endDate"
  | "title"
  | "status";

export type TaskSortOrder = "asc" | "desc";

export interface GetGroupedTasksParams {
  page?: number;
  limit?: number;
  search?: string;
  statuses?: TaskStatus[];
  sort?: TaskSort;
  order?: TaskSortOrder;
}
