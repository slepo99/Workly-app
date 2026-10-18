import { useUsersStore } from "~/stores/users";
export function useUsers() {
  const usersStore = useUsersStore();
  async function onFirstLoadUsers() {
    await callOnce(
      `users`,
      async () => {
        await usersStore.loadAllUsers();
      },
      { mode: "navigation" },
    );
  }
  return {
    onFirstLoadUsers
  }
}
