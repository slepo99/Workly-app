<template>
  <UPage>
    <UBreadcrumb :items="getBreadcumbs(projectId)" />
    <div v-if="projectStore.project">
      <ProjectDetails :project="projectStore.project"/>
    </div>
  </UPage>
</template>

<script setup lang="ts">
import { useProjectStore } from "~/stores/project";
import { useProject } from "~/composables/pages/useProject";

const route = useRoute();
const projectStore = useProjectStore();

const projectId = route.params.id as string;

const { onFirstLoadProject, getBreadcumbs } = useProject();

await onFirstLoadProject(projectId);


</script>

<style scoped></style>
