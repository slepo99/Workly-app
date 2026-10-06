export interface CreateProjectInput {
  name: string;
  description?: string;
  status?: string;
  image: string | null;
}
export interface UpdateProjectInput extends Partial<CreateProjectInput> {}
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
