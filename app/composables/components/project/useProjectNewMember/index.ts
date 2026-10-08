import { useUsersStore } from "~/stores/users";
export function useProjectNewMember() {
  const usersStore = useUsersStore();
const isLoading = ref(false);
const isOpen = ref(false);
  async function addMemberToProject(projectId: string, userId: string) {
    const { addProjectMember } = useProjectMembersApi();
  }
  // const getUsersList = computed(() => {
  //   return usersStore.users.map((user) => ({
  //     label: user.name,
  //     value: user.id,
  //     email: user.email,
  //     avatar: user.avatar
  //       ? {
  //           src: user.avatar,
  //           loading: "lazy" as const,
  //         }
  //       : undefined,
  //   }));
  // });

    const getUsersList = computed(() => {
    return usersStore.users.map((user) => ({
      label: user.name,
      value: user.id,
      email: user.email,
      avatar: {
        src: user.avatar ? user.avatar : '',
        alt: user.name,
        loading: "lazy" as const,
      }
    }));
  });
  return {
    addMemberToProject,
    getUsersList,
    isLoading,
    isOpen,
  };
}
