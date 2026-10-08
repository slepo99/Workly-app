<template>
  <UPage>
    <UBreadcrumb :items="getBreadcumbs(projectId)" />
    <div v-if="projectStore.project">
      <ProjectDetails
        :project="projectStore.project"
        :members="projectStore.projectMembers"
        @edit-project="editProject"
        class="mt-4"
      />
      <ProjectMembersTable
        :members="projectStore.projectMembers"
        :project-id="projectId"
        class="mt-4"
        @add-member="console.log('Add member')"
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

const projectId = route.params.id as string;

const {
  onFirstLoadProject,
  onLoadProjectMembers,
  onLoadProjectTasks,
  getBreadcumbs,
} = useProject();

await onFirstLoadProject(projectId);
await onLoadProjectMembers(projectId);
await onLoadProjectTasks(projectId);

function editProject() {
  console.log('edit')
}
</script>

<style scoped></style>
