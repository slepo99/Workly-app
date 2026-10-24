import { useTasksStore } from "~/stores/tasks";
import { useDebouncedFn } from "~/composables/useDebounce";
import { TASK_SORT_FIELDS } from "~/constants/taskSort";
import type { TaskSort } from "~/composables/api/useTasksApi/types";

interface TaskSortOption {
  label: string;
  value: TaskSort;
}

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
  async function onSortSelectChange() {
    await tasksStore.loadGroupedTasks();
  }
  const tasksSortOptions: TaskSortOption[] = [
    {
      label: "End date",
      value: TASK_SORT_FIELDS.END_DATE,
    },
    {
      label: "Status",
      value: TASK_SORT_FIELDS.STATUS,
    },
    {
      label: "Title",
      value: TASK_SORT_FIELDS.TITLE,
    },
  ];
  async function updateTasksPage(page: number) {
    await tasksStore.loadGroupedTasks(page);
  }
  return {
    firstLoadGroupedTasks,
    searchTasks,
    clearSearchInput,
    isStatusSelectOpen,
    onStatusSelectOpenChange,
    tasksSortOptions,
    onSortSelectChange,
    updateTasksPage,
  };
}
