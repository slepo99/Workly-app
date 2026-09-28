import type { Login, AuthUser, Register } from "./types";
export function useAuthApi() {
  const { $api } = useNuxtApp();
  enum API {
    LOGIN = "/auth/login",
    GET_ME = "/auth/me",
    LOGOUT = "/auth/logout",
    REGISTER = '/auth/register'
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
  const register = (Data: Register) => {
    return $api<AuthUser>(API.REGISTER, {
      method: 'POST',
      body: Data
    })
  }
  return {
    login,
    getMe,
    logout,
    register
  };
}
