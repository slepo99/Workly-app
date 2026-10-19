import { ROLES } from "~/constants/roles";
import { useAuthStore } from "~/stores/auth";

export function usePermissions() {
  const authStore = useAuthStore();

  const isManagement = computed(() => {
    const role = authStore.user?.role;

    return (
      role === ROLES.SUPERADMIN ||
      role === ROLES.ADMIN ||
      role === ROLES.MANAGER
    );
  });
  const isAdmin = computed(() => {
    const role = authStore.user?.role;
    return role === ROLES.ADMIN || role === ROLES.SUPERADMIN;
  });
  return {
    isManagement,
    isAdmin
  };
}
