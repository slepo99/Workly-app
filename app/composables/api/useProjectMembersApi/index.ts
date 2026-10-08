// todo: remove passwordHash from response
import type { ProjectMemberModel, ProjectMemberPostModel } from "./types";
export function useProjectMembersApi() {
  const { $api } = useNuxtApp();
  enum API {
    GET_PROJECT_MEMBERS = "/projects",
    ADD_PROJECT_MEMBER = "/project-members",
  }

  const getProjectMembersById = (projectId: string) => {
    return $api<ProjectMemberModel[]>(
      `${API.GET_PROJECT_MEMBERS}/${projectId}/members`,
    );
  };
  const addProjectMember = (body: ProjectMemberPostModel) => {
    return $api(`${API.ADD_PROJECT_MEMBER}`, {
      method: "POST",
      body,
    });
  };

  return {
    getProjectMembersById,
    addProjectMember,
  };
}