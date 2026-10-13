import { defineStore } from "pinia";
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";
import { PROJECTS_PAGINATION } from "~/constants/api";
import type { ProjectStatus } from "~/constants/projectStatuses";

const projectsControllers = new WeakMap<object, AbortController>();

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
    resetSearch() {
      this.search = "";
    },

    cancelProjectsLoad() {
      const controller = projectsControllers.get(this.$state);

      if (!controller) {
        return;
      }

      controller.abort();
      projectsControllers.delete(this.$state);
    },

    async loadProjects(page = PROJECTS_PAGINATION.PAGE) {
      const { getProjects } = useProjectsApi();

      this.cancelProjectsLoad();

      const controller = new AbortController();

      projectsControllers.set(this.$state, controller);
      this.isLoading = true;

      try {
        const projects = await getProjects({
          page,
          limit: PROJECTS_PAGINATION.LIMIT,
          search: this.search,
          statuses: this.selectedStatus,
          signal: controller.signal,
        });

        if (
          controller.signal.aborted ||
          projectsControllers.get(this.$state) !== controller
        ) {
          return;
        }

        this.projects = projects.projects;
        this.page = projects.page;
        this.total = projects.total;
        this.totalPages = projects.totalPages;
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        throw error;
      } finally {
        if (projectsControllers.get(this.$state) === controller) {
          projectsControllers.delete(this.$state);
          this.isLoading = false;
        }
      }
    },
  },
});
