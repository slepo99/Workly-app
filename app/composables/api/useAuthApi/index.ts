import type { Login, AuthUser } from "./types";
export function useAuthApi() {
  const { $api } = useNuxtApp();
  enum API {
    LOGIN = "/auth/login",
    GET_ME = "/auth/me",
    LOGOUT = "/auth/logout"
  }

  const login = (data: Login) => {
    return $api<AuthUser>(API.LOGIN, {
      method: "POST",
      body: data,
    });
  };
  const getMe = () => {
    return $api<AuthUser>(API.GET_ME)
  }
  const logout = () => {
    return $api(API.LOGOUT, {
        method: 'POST'
    })
  }
  return {
    login,
    getMe,
    logout
  };
}
