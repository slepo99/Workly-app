import { useToast } from "#imports";
import { useDashboardStore } from "~/stores/dashboard";
export function useRecentActivityCard() {
  const isTaskRemoving = ref(false);
  const toast = useToast();
  const dashboardStore = useDashboardStore();
  async function onRemoveTask(taskId: string) {
    const { deleteTask } = useTasksApi();

    isTaskRemoving.value = true;

    try {
      await deleteTask(taskId);
      await dashboardStore.loadTasks();
    } catch (e: any) {
      console.error("Error romoving task", e);
      toast.add({
        title: "Error romoving task",
        description: e.statusMessage,
        color: "warning",
      });
    } finally {
      isTaskRemoving.value = false;
    }
  }
  return {
    onRemoveTask,
  };
}
