import { useUsersStore } from "~/stores/users";
import { useDebouncedFn } from "~/composables/useDebounce";
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
  async function updateUsersPage(page: number) {
    await usersStore.loadAllUsers(page);
  }
  const searchUsers = useDebouncedFn(() => usersStore.loadAllUsers());
  
  async function clearSearchInput() {
    usersStore.resetSearch()
    await usersStore.loadAllUsers();
  }
  return {
    onFirstLoadUsers,
    updateUsersPage,
    searchUsers,
    clearSearchInput,
  };
}
