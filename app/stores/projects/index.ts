import { defineStore } from "pinia";
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";

interface ProjectsStateModel {
  projects: ProjectModel[];
  isLoading: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export const useProjectsStore = defineStore("projects", {
  state: (): ProjectsStateModel => {
    return {
      projects: [],
      isLoading: false,
      page: 0,
      limit: 0,
      total: 0,
      totalPages: 0,
    };
  },

  getters: {},

  actions: {
    async loadAllProjects() {
      const { getProjects } = useProjectsApi();
      this.isLoading = true;
      try {
        const projects = await getProjects();
        this.projects = projects.projects;
        this.page = projects.page;
        this.limit = projects.limit;
        this.total = projects.total;
        this.totalPages = projects.totalPages;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
