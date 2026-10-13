import type { ProjectStatus } from "~/constants/projectStatuses";
export interface CreateProjectModel {
  name: string;
  description?: string;
  status?: ProjectStatus;
  image: string | null;
}
export interface UpdateProjectModel extends Partial<CreateProjectModel> {}
export interface ProjectsResponseModel {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  projects: ProjectModel[];
}
export interface ProjectModel {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  completionPercent: number;
  tasksCount: number;
  image: string;
  updatedAt: string;
}
