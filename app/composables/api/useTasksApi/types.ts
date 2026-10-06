export interface TasksModel {
  assignees: AssigneesModel[];
  createdAt: string;
  description: string;
  id: string;
  projectId: string;
  status: string;
  title: string;
  startDate: string;
  endDate: string;
}
export interface AssigneesModel {
  id: string;
  name: string;
  avatar: string;
}
export interface TasksResponseModel {
  page: number
  limit: number
  total: number
  totalPages: number
  tasks: TasksModel[]
}