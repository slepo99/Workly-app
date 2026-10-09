import type { UserModel } from "~/composables/api/useUsersApi/types";

export interface ProjectMemberModel {
  role: string;
  user: UserModel;
  projectId: string;
  id: string;
}
export interface ProjectMemberPostModel {
  projectId: string;
  members: {
    userId: string;
    role: string;
  }[];
}
export interface AllProjectMembersResponseModel {
    id: string;
    userId: string;
    projectId: string;
    role: string;
    createdAt: string;
}