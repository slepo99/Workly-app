import { useUsersStore } from "~/stores/users";
import { useDebouncedFn } from "~/composables/useDebounce";
import { useUsersApi } from "#imports";
import { useToast } from "#imports";
import { fa } from "zod/v4/locales";

export function useUsers() {
  const usersStore = useUsersStore();
  const toast = useToast();
  const selectedUserId = ref('')
  const isUserRemoveModalOpen = ref(false)
  const isUserRemoving = ref(false)

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
    try {
      await usersStore.loadAllUsers(page);
    } catch(e: any) {
       toast.add({
        title: "Failed to load users",
        description: e.statusMessage,
        color: "error",
      });
    }
  }
  const searchUsers = useDebouncedFn(() => usersStore.loadAllUsers());

  async function clearSearchInput() {
    usersStore.resetSearch();
    await usersStore.loadAllUsers();
  }

  async function onRemoveUser() {
    const { deleteUser } = useUsersApi();
    isUserRemoving.value = true
    try {
      await deleteUser(selectedUserId.value);
      await usersStore.loadAllUsers();
    } catch(e: any) {
      toast.add({
        title: "Failed to delete user",
        description: e.statusMessage,
        color: "error",
      });
    } finally {
      isUserRemoving.value = false
      isUserRemoveModalOpen.value = false
    }
  }

  function triggerUserRemove(userId: string) {
    selectedUserId.value = userId
    isUserRemoveModalOpen.value = true
  }
  return {
    onFirstLoadUsers,
    updateUsersPage,
    searchUsers,
    clearSearchInput,
    onRemoveUser,
    triggerUserRemove,
    isUserRemoveModalOpen,
    isUserRemoving
  };
}
