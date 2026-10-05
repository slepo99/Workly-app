import { defineStore } from "pinia";
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";
import type { ProjectMemberModel } from "~/composables/api/useProjectMembersApi/types";
interface ProjectStateModel {
  project: ProjectModel | null;
  isLoading: boolean; // todo: create isLoading for each requests
  projectMembers: ProjectMemberModel[]
}

export const useProjectStore = defineStore("project", {
  state: (): ProjectStateModel => {
    return {
      project: null,
      isLoading: false,
      projectMembers: []
    };
  },

  getters: {},

  actions: {
    async loadProjectById(id: string) {
      const { getProjectById } = useProjectsApi();
      this.isLoading = true;
      try {
        const project = await getProjectById(id);
        this.project = project;
      } finally {
        this.isLoading = false;
      }
    },
    async loadProjectMembers(projectId: string) {
      const { getProjectMembersById } = useProjectMembersApi();
      this.isLoading = true;

      try {
        const projectMembers = await getProjectMembersById(projectId)
        this.projectMembers = projectMembers
      } finally {
        this.isLoading = false;
      }
    },
  },
});
