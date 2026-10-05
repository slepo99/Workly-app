// todo: remove passwordHash from response
import type { ProjectMemberModel } from "./types";
export function useProjectMembersApi() {
  const { $api } = useNuxtApp();
  enum API {
    GET_PROJECT_MEMBERS = "/projects",
  }

  const getProjectMembersById = (projectId: string) => {
    return $api<ProjectMemberModel[]>(
      `${API.GET_PROJECT_MEMBERS}/${projectId}/members`,
    );
  };

  return {
    getProjectMembersById,
  };
}
