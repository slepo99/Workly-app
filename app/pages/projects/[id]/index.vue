<template>
    <div v-if="projectsStore.project">
        {{ projectsStore.project.name }}
    </div>
</template>

<script setup lang="ts">
import { useProjectsStore } from '~/stores/projects'
const route = useRoute()
const projectsStore = useProjectsStore()

const projectId = route.params.id as string

await callOnce(
  `project-${projectId}`,
  async () => {
    await projectsStore.loadProjectById(projectId)
  },
  { mode: "navigation" },
)
</script>

<style scoped>

</style>