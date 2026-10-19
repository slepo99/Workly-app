import type { UsersModelResponse } from "./types";

export function useUsersApi() {
  const { $api } = useNuxtApp();

  enum API {
    GET_USERS = "/users",
  }

  const getUsers = () => {
    return $api<UsersModelResponse>(API.GET_USERS);
  };

  return {
    getUsers,
  };
}
