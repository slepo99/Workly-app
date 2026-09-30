import { defineStore } from "pinia";
import type { TasksModel } from "~/composables/api/useTasksApi/types";
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";
import type { UserModel } from "~/composables/api/useUsersApi/types";
import { TASK_STATUSES } from "~/constants/taskStatuses";
interface DashboardStateModel {

}
export const useDashboardStore = defineStore("dashboard", {
  state: (): DashboardStateModel => {
    return {

    };
  },

  getters: {
   
  },

  actions: {
 
  },
});
