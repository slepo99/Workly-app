// todo: remove passwordHash from response
import type { ProjectMemberModel, ProjectMemberPostModel, AllProjectMembersResponseModel } from "./types";
export function useProjectMembersApi() {
  const { $api } = useNuxtApp();
  enum API {
    GET_PROJECT_MEMBERS = "/projects",
    ADD_PROJECT_MEMBER = "/project-members",
    UPDATE_PROJECT_MEMBER_ROLE = "/project-members/role",
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
  const updateMemberRole = (projectId: string, userId: string, role: string) => {
    return $api<AllProjectMembersResponseModel>(`${API.UPDATE_PROJECT_MEMBER_ROLE}`, {
      method: "PATCH",
      body: {
        projectId,
        userId,
        role
      }
    });
  };
  return {
    getProjectMembersById,
    addProjectMember,
    updateMemberRole
  };
}