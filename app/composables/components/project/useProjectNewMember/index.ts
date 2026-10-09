import { useProjectStore } from "~/stores/project";
export function useProjectNewMember(projectId: Ref<string>) {
  const projectStore = useProjectStore();
  const toast = useToast();

  const isLoading = ref(false);
  const isOpen = ref(false);
  const isSaving = ref(false);
  const selectedUsers = ref<string[]>([]);
 
  async function loadUsers() {
    isLoading.value = true;
    try {
      await projectStore.loadAvailableUsersForProject(projectId.value);
    } catch (e) {
      toast.add({
        title: "Error loading users",
        description: "Failed to load available users for project",
        color: "error",
      });
      console.error("Error loading users:", e);
    } finally {
      isLoading.value = false;
    }
  }


  const getUsersList = computed(() => {
    return projectStore.availableUsers.map((user) => ({
      label: user.name,
      value: user.id,
      email: user.email,
      avatar: {
        src: user.avatar ? user.avatar : "",
        alt: user.name,
        loading: "lazy" as const,
      },
    }));
  });

  async function addMembersToProject() {
    const { addProjectMember } = useProjectMembersApi();
    const data = {
      projectId: projectId.value,
      members: selectedUsers.value.map((userId) => {
        return {
          userId,
          role: "worker",
        };
      }),
    };
    isSaving.value = true;
    try {
      await addProjectMember(data);
      await projectStore.loadProjectMembers(projectId.value);
      toast.add({
        title: "Members added",
        description: "Members have been added successfully",
        color: "success",
      });
      isOpen.value = false;
      selectedUsers.value = [];
    } catch (e) {
      toast.add({
        title: "Error adding members",
        description: "Failed to add members to project",
        color: "error",
      });
      console.error("Error adding members:", e);
    } finally {
      isSaving.value = false;
    }
  }
  return {
    addMembersToProject,
    getUsersList,
    isLoading,
    isOpen,
    loadUsers,
    isSaving,
    selectedUsers,
  };
}
