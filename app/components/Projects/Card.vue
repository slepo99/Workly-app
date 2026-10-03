<template>
  <UCard


    class="group cursor-pointer bg-elevated transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg hover:ring-1 hover:ring-primary/20 dark:hover:shadow-black/30 active:translate-y-0"
    :ui="{
      header: 'flex items-center justify-between lg:p-4 lg:pb-2',
      body: 'lg:p-4 lg:pt-2',
      footer: 'flex items-center justify-between lg:p-4 lg:pt-0',
    }"
  >
    <template #header>
      <img
        v-if="project.image"
        :src="project.image"
        :alt="project.name"
        class="h-28 w-full rounded-t-xl"
      />
      <img
        v-else
        src="../../assets/images/no-image.jpg"
        :alt="project.name"
        class="h-28 w-full rounded-t-xl"
      />
    </template>
    <template #default>
      <div class="flex items-center justify-between">
        <span class="text-lg font-semibold truncate">{{ project.name }}</span>
        <UBadge :color="getProjectStatusColor(project.status)">{{
          project.status
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
        :model-value="project.completionPercent + 1"
        :max="100"
        :color="getProgressColor(project.completionPercent)"
        class="mt-4"
      />
    </template>

  </UCard>
</template>

<script setup lang="ts">
import { PROJECT_STATUSES } from "~/constants/projectStatuses";
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";

const props = defineProps<{
  project: ProjectModel
}>()
function getProjectStatusColor(status: string) {
  if (PROJECT_STATUSES.ACTIVE === status) {
    return "success";
  } else if (PROJECT_STATUSES.COMPLETED === status) {
    return "info";
  } else {
    return "warning";
  }
}
function getProgressColor(
  percent: number,
): "error" | "warning" | "info" | "success" {
  if (percent < 20) {
    return "error";
  }

  if (percent < 40) {
    return "warning";
  }

  if (percent < 60) {
    return "info";
  }

  return "success";
}
</script>

<style scoped></style>
