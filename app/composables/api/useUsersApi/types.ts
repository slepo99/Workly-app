import type { ROLE } from "~/constants/roles";
export interface UserModel {
  id: string;
  name: string;
  email: string;
  role: ROLE;
  position: string | null;
  avatar: string | null;
  createdAt: string;
}

export interface UsersModelResponse {
 page: number
 limit: number
 total: number
 totalPages: number
 users: UserModel[]
}

export interface UsersStatsModel {
  totalUsers: number
  totalAdmins: number
  totalManagers: number
  totalWorkers: number
}