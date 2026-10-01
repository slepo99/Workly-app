import { defineStore } from "pinia";
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";
import { PROJECTS_PAGINATION } from "~/constants/api";
import {
  PROJECT_STATUSES,
  type ProjectStatus,
} from "~/constants/projectStatuses";
interface ProjectsStateModel {
  projects: ProjectModel[];
  isLoading: boolean;
  page: number;
  total: number;
  totalPages: number;
  search: string;
  selectedStatus: ProjectStatus[];
}

export const useProjectsStore = defineStore("projects", {
  state: (): ProjectsStateModel => {
    return {
      projects: [],
      isLoading: false,
      page: PROJECTS_PAGINATION.PAGE,
      total: 0,
      totalPages: 0,
      search: "",
      selectedStatus: [],
    };
  },

  getters: {},

  actions: {
    async loadAllProjects(page = PROJECTS_PAGINATION.PAGE) {
      const { getProjects } = useProjectsApi();

      this.isLoading = true;
      try {
        const projects = await getProjects({
          page: page,
          limit: PROJECTS_PAGINATION.LIMIT,
          statuses: this.selectedStatus,
        });

        this.projects = projects.projects;
        this.page = projects.page;
        this.total = projects.total;
        this.totalPages = projects.totalPages;
      } finally {
        this.isLoading = false;
      }
    },
    async searchProjects(page = PROJECTS_PAGINATION.PAGE) {
      const { getProjects } = useProjectsApi();

      this.isLoading = true;

      try {
        const projects = await getProjects({
          page: page,
          limit: PROJECTS_PAGINATION.LIMIT,
          search: this.search,
          statuses: this.selectedStatus,
        });

        this.projects = projects.projects;
        this.page = projects.page;
        this.total = projects.total;
        this.totalPages = projects.totalPages;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
