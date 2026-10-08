<template>
  <UCard
    class="card-shadow group cursor-pointer bg-elevated transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg hover:ring-1 hover:ring-primary/20 dark:hover:shadow-black/30 active:translate-y-0"
    :ui="{
      header: 'flex items-center justify-between lg:p-4 lg:pb-2',
      body: 'lg:p-4 lg:pt-2',
      footer: 'flex items-center justify-between lg:p-4 lg:pt-0',
    }"
    @click="openProject"
  >
    <template #header>
      <div class="aspect-[16/7] w-full overflow-hidden rounded-t-xl">
        <img
          v-if="project.image"
          :src="project.image"
          :alt="project.name"
          class="h-full w-full object-cover"
        />
        <div
          v-else
          class="flex h-full w-full items-center justify-center rounded-t-xl border border-dashed border-neutral-300 text-muted dark:border-neutral-600"
        >
          <UIcon name="i-lucide-image" class="size-8" />
        </div>
      </div>
    </template>
    <template #default>
      <div class="flex items-center justify-between">
        <span class="text-lg font-semibold truncate">{{ project.name }}</span>
        <UBadge :color="getProjectStatusColor(project.status)">{{
          getProjectStatusLabel(project.status)
        }}</UBadge>
      </div>
      <div class="mt-2 text-sm text-neutral-500 line-clamp-2">
        {{ project.description }}
      </div>
      <div class="mt-2 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-clipboard-check" />
          <span class="text-sm dark:text-gray-500 text-gray-400">
            {{ project.tasksCount }}</span
          >
        </div>
        <span class="text-lg font-semibold truncate"
          >{{ project.completionPercent }}%</span
        >
      </div>
      <UProgress
        :model-value="project.completionPercent"
        :max="100"
        :color="getProgressColor(project.completionPercent)"
        class="mt-4"
      />
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";
import { useStatuses } from "~/composables/useStatuses";

const props = defineProps<{
  project: ProjectModel;
}>();

const { getProjectStatusColor, getProjectStatusLabel } = useStatuses();

function openProject() {
  return navigateTo(`/projects/${props.project.id}`);
}
</script>

<style scoped></style>
