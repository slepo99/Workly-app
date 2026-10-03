import { defineStore } from "pinia";
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";

interface ProjectStateModel {
  project: ProjectModel | null
  isLoading: boolean
}

export const useProjectStore = defineStore("project", {
  state: (): ProjectStateModel => {
    return {
      project: null,
      isLoading: false
    };
  },

  getters: {},

  actions: {
    async loadProjectById(id: string) {
      const { getProjectById } = useProjectsApi()
      this.isLoading = true;
      try {
        const project = await getProjectById(id)
        this.project = project
      } finally {
        this.isLoading = false;
      }
    }
  },
});
