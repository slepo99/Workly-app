import type { UsersModelResponse, UsersStatsModel, UserModel } from "./types";
import type { ProjectModel } from "../useProjectsApi/types";
import type { TasksModel } from "../useTasksApi/types";

import { USERS_PAGINATION } from "~/constants/api";
export function useUsersApi() {
  const { $api } = useNuxtApp();

  enum API {
    GET_USERS = "/users",
    GET_USERS_STATS = '/users/stats',
  }

  const getUsers = ({
    page = USERS_PAGINATION.PAGE,
    limit = USERS_PAGINATION.LIMIT,
    search = "",
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    return $api<UsersModelResponse>(API.GET_USERS, {
      query: {
        page,
        limit,
        search,
      },
    });
  };

  const deleteUser = (userId: string) => {
    return $api(`${API.GET_USERS}/${userId}`, {
      method: "DELETE",
    });
  };

  const getUsersStats = () => {
    return $api<UsersStatsModel>(API.GET_USERS_STATS)
  }

  const getUserById = (userId: string) => {
    return $api<UserModel>(`${API.GET_USERS}/${userId}`)
  }
  
  return {
    getUsers,
    deleteUser,
    getUsersStats,
    getUserById,

  };
}
