import type {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectsResponseModel,
} from "./types";
import { PROJECTS_PAGINATION } from "~/constants/api";
import type { ProjectStatus } from "~/constants/projectStatuses";

export function useProjectsApi() {
  const { $api } = useNuxtApp();
  enum API {
    GET_PROJECTS = "/projects",
    CREATE_PROJECT = "/projects",
    UPDATE_PROJECT = "/projects",
    DELETE_PROJECT = "/projects",
  }
  const getProjects = ({
    page = PROJECTS_PAGINATION.PAGE,
    limit = PROJECTS_PAGINATION.LIMIT,
    search = "",
    statuses = [],
  }: {
    page?: number;
    limit?: number;
    search?: string;
    statuses?: ProjectStatus[];
  }) => {
    return $api<ProjectsResponseModel>(API.GET_PROJECTS, {
      query: {
        page,
        limit,
        search,
        status: statuses,
      },
    });
  };

  const createProject = (data: CreateProjectInput) => {
    return $api(API.CREATE_PROJECT, {
      method: "POST",
      body: data,
    });
  };

  const updateProject = (id: string, data: UpdateProjectInput) => {
    return $api(API.UPDATE_PROJECT, {
      method: "PATCH",
      body: data,
    });
  };

  const deleteProject = (id: string) => {
    return $api(API.DELETE_PROJECT, {
      method: "DELETE",
    });
  };

  return {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
