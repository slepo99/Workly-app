<template>
  <div class="flex bg-elevated p-3 sm:p-4 lg:p-6 mt-4 rounded-xl gap-2 sm:gap-4 lg:gap-6">
    <img :src="project.image" class="w-60 rounded-xl"/>
    <div>
<span class="text-2xl font-semibold truncate">{{ project.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";
const props = defineProps<{
  project: ProjectModel;
}>();
</script>

<style scoped></style>
