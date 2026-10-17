import { useToast } from "#imports";
import { useDashboardStore } from "~/stores/dashboard";
export function useRecentActivityCard() {
  const isTaskRemoving = ref(false);
  const toast = useToast();
  const dashboardStore = useDashboardStore();
  const isTaskRemoveModalOpen = ref(false);
  const currentTaskId = ref("");
  async function onRemoveTask() {
    const { deleteTask } = useTasksApi();

    isTaskRemoving.value = true;

    try {
      await deleteTask(currentTaskId.value);
      await dashboardStore.loadDashboardTasks();
    } catch (e: any) {
      console.error("Error romoving task", e);
      toast.add({
        title: "Error romoving task",
        description: e.statusMessage,
        color: "warning",
      });
    } finally {
      isTaskRemoving.value = false;
      isTaskRemoveModalOpen.value = false;
    }
  }
  function triggerTaskRemove(taskId: string) {
    currentTaskId.value = taskId;
    isTaskRemoveModalOpen.value = true;
  }
  return {
    onRemoveTask,
    isTaskRemoving,
    isTaskRemoveModalOpen,
    triggerTaskRemove,
  };
}
