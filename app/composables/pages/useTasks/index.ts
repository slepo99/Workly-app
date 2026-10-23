import { useTasksStore } from "~/stores/tasks";
export function useTasks() {
  const tasksStore = useTasksStore();
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
  return {
    firstLoadGroupedTasks
  };
}
