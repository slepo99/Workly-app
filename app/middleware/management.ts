import { usePermissions } from "~/composables/usePermissions";
export default defineNuxtRouteMiddleware(() => {
  const { isManagement } = usePermissions();

  if (!isManagement.value) {
    return navigateTo("/");
  }
});