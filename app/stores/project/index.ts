import { defineStore } from "pinia";
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";
import type {
  ProjectMemberModel,
  AllProjectMembersResponseModel,
} from "~/composables/api/useProjectMembersApi/types";
import type { UserModel } from "~/composables/api/useUsersApi/types";
import type { TasksModel } from "~/composables/api/useTasksApi/types";
interface ProjectStateModel {
  project: ProjectModel | null;
  isLoading: boolean; // todo: remove isLoading from store and replace to the composable
  projectMembers: ProjectMemberModel[];
  projectTasks: TasksModel[];
  availableUsers: UserModel[];
}

export const useProjectStore = defineStore("project", {
  state: (): ProjectStateModel => {
    return {
      project: null,
      isLoading: false,
      projectMembers: [],
      projectTasks: [],
      availableUsers: [],
    };
  },

  getters: {},

  actions: {
    setProjectMemberNewRole(member: AllProjectMembersResponseModel) {
      const index = this.projectMembers.findIndex(
        (m) => m.user.id === member.userId,
      );
      if (index !== -1 && this.projectMembers[index]) {
        this.projectMembers[index].role = member.role;
      }
    },
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
        const projectMembers = await getProjectMembersById(projectId);
        this.projectMembers = projectMembers;
      } finally {
        this.isLoading = false;
      }
    },
    async loadProjectTasks(projectId: string) {
      const { getProjectTasks } = useTasksApi();
      this.isLoading = true;

      try {
        const tasks = await getProjectTasks(projectId);
        this.projectTasks = tasks.tasks;
      } finally {
        this.isLoading = false;
      }
    },
    async loadAvailableUsersForProject(projectId: string) {
      const { getAvailableUsersForProject } = useProjectsApi();
      this.isLoading = true;

      try {
        const users = await getAvailableUsersForProject(projectId);
        this.availableUsers = users;
      } finally {
        this.isLoading = false;
      }
    },
    async updateProjectMemberRole(projectId: string, userId: string, role: string) {
      const { updateMemberRole } = useProjectMembersApi();
      this.isLoading = true;
      try {
        const member = await updateMemberRole(projectId, userId, role);
        this.setProjectMemberNewRole(member);
      } finally {
        this.isLoading = false;
      }
    }
  },
});
