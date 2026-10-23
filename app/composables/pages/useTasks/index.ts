import { useTasksStore } from "~/stores/tasks";
import { useDebouncedFn } from "~/composables/useDebounce";
export function useTasks() {
  const tasksStore = useTasksStore();

  const isStatusSelectOpen = ref(false);

  const searchTasks = useDebouncedFn(() => tasksStore.loadGroupedTasks());

  async function clearSearchInput() {
    tasksStore.resetSearch();
    await tasksStore.loadGroupedTasks();
  }

  async function firstLoadGroupedTasks() {
    try {
      await callOnce(
        "projects",
        async () => {
          await tasksStore.loadGroupedTasks();
        },
        { mode: "navigation" },
      );
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  }

  async function onStatusSelectOpenChange(isOpen: boolean) {
    if (isOpen) return;

    await tasksStore.loadGroupedTasks();
  }

  return {
    firstLoadGroupedTasks,
    searchTasks,
    clearSearchInput,
    isStatusSelectOpen,
    onStatusSelectOpenChange
  };
}
