import type { CreateProjectInput, UpdateProjectInput, ProjectModel } from './types'
export function useProjectsApi() {
  const { $api } = useNuxtApp()
  enum API {
    GET_PROJECTS = '/projects',
    CREATE_PROJECT = '/projects',
    UPDATE_PROJECT = '/projects',
    DELETE_PROJECT = '/projects',
  }
  const getProjects = () => {
    return $api<ProjectModel[]>(API.GET_PROJECTS)
  }

  const createProject = (data: CreateProjectInput) => {
    return $api(API.CREATE_PROJECT, {
      method: 'POST',
      body: data,
    })
  }

  const updateProject = (id: string, data: UpdateProjectInput) => {
    return $api(API.UPDATE_PROJECT, {
      method: 'PATCH',
      body: data,
    })
  }

  const deleteProject = (id: string) => {
    return $api(API.DELETE_PROJECT, {
      method: 'DELETE',
    })
  }

  return {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
  }
}