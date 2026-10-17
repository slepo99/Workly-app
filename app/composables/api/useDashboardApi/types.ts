import type { TasksModel } from "../useTasksApi/types";

export interface DashboardStatsModel {
  totalTasks: number;
  completedTasks: number;
  totalProjects: number;
  totalUsers: number;
}
export interface DashboardTasksModel {
  recentTasks: TasksModel[]
  upcomingDeadlines: TasksModel[]
}