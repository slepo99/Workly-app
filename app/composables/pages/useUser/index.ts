import { useUserStore } from "~/stores/user";
import type { BreadcrumbItem } from "@nuxt/ui";
export function useUser() {
  const userStore = useUserStore();

  async function onFirstLoadUser(userId: string) {
    await callOnce(
      `user`,
      async () => {
        // await usersStore.loadAllUsers();
        await Promise.all([userStore.loadUser(userId)]);
      },
      { mode: "navigation" },
    );
  }
   function getBreadcumbs(userId: string): BreadcrumbItem[] {
      return [
        {
          label: "Users",
          icon: "i-lucide-folder",
          to: "/users",
        },
        {
          label: userStore.user?.name,
          icon: "i-lucide-file-text",
          to: `/users/${userId}`,
        },
      ];
    }
  return {
    onFirstLoadUser,
    getBreadcumbs
  };
}
