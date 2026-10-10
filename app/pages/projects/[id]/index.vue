<template>
  <UPage>
    <UBreadcrumb :items="getBreadcumbs(projectId)" />
    <div v-if="projectStore.project">
      <ProjectDetails
        :project="projectStore.project"
        :members="projectStore.projectMembers"
        :tasks="projectStore.projectTasks"
        class="mt-4"
      />
      <ProjectMembersTable
        :members="projectStore.projectMembers"
        :project-id="projectId"
        class="mt-4"
        @update-role="onUpdateMemberRole"
        @remove="onRemoveProjectMember"
      />
      <DashboardTasklistTable :tasks="projectStore.projectTasks" class="mt-4" />
    </div>
  </UPage>
</template>

<script setup lang="ts">
import { useProjectStore } from "~/stores/project";
import { useProject } from "~/composables/pages/useProject";

const route = useRoute();
const projectStore = useProjectStore();

const projectId = computed(() => route.params.id as string);

const {
  onFirstLoadProject,
  onLoadProjectMembers,
  onLoadProjectTasks,
  getBreadcumbs,
  onUpdateMemberRole,
  onRemoveProjectMember,
} = useProject(projectId);

await Promise.all([
  onFirstLoadProject(),
  onLoadProjectMembers(),
  onLoadProjectTasks(),
]);
</script>

<style scoped></style>
