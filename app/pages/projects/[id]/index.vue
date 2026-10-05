<template>
  <UPage>
    <UBreadcrumb :items="getBreadcumbs(projectId)" />
    <div v-if="projectStore.project">
      <ProjectDetails :project="projectStore.project" :members="projectStore.projectMembers" class="mt-4"/>
      <ProjectMembersTable :members="projectStore.projectMembers" class="mt-4"/>
    </div>
  </UPage>
</template>

<script setup lang="ts">
import { useProjectStore } from "~/stores/project";
import { useProject } from "~/composables/pages/useProject";

const route = useRoute();
const projectStore = useProjectStore();

const projectId = route.params.id as string;

const { onFirstLoadProject, onLoadProjectMembers, getBreadcumbs } =
  useProject();

await onFirstLoadProject(projectId);
await onLoadProjectMembers(projectId)
</script>

<style scoped></style>
