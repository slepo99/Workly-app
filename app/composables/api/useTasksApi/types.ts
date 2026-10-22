import type { TaskStatus } from "~/constants/taskStatuses";

export interface TasksModel {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  assignees: AssigneesModel[];
}
export interface AssigneesModel {
  id: string;
  name: string;
  avatar: string | null;
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
export interface TaskUpdateModel extends Partial<TaskCreateModel> {}
