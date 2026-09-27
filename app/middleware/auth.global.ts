import { useAuthStore } from "~/stores/auth"
export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  await authStore.fetchMe()

  const isAuthPage = to.path === "/login" || to.path === "/register"

  if (!authStore.user && !isAuthPage) {
    return navigateTo("/login")
  }

  if (authStore.user && isAuthPage) {
    return navigateTo("/")
  }
})