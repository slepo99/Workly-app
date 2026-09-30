import type { UserModel } from "./types";
export function useUsersApi() {
  const { $api } = useNuxtApp();
  enum API {
    GET_USERS = "/users",
  }

  const getUsers = () => {
    return $api<UserModel[]>(API.GET_USERS);
  };
  return {
    getUsers,
  };
}
