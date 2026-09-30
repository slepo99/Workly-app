import { defineStore } from "pinia";
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";

interface ProjectsStateModel {
  projects: ProjectModel[];
  isLoading: boolean;
}
export const useProjectsStore = defineStore("projects", {
  state: (): ProjectsStateModel => {
    return {
      projects: [],
      isLoading: false,
    };
  },

  getters: {},

  actions: {
    async loadAllProjects() {
      const { getProjects } = useProjectsApi();
      this.isLoading = true;
      try {
        const projects = await getProjects();
        this.projects = projects;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
