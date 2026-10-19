import type { UsersModelResponse } from "./types";
import { USERS_PAGINATION } from "~/constants/api";
export function useUsersApi() {
  const { $api } = useNuxtApp();

  enum API {
    GET_USERS = "/users",
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
  return {
    getUsers,
    deleteUser
  };
}
