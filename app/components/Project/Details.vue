<template>
  <div class=" flex flex-col bg-elevated p-3 sm:p-4 lg:p-6 mt-4 rounded-xl gap-2 sm:gap-4 lg:gap-6">
    <div class="flex gap-2 sm:gap-4 lg:gap-6">
      <img :src="project.image" class="w-50 max-h-40 rounded-xl" />

        <div
          class="flex items-start justify-between w-full gap-4 sm:gap-6 lg:gap-8"
        >
          <div class="flex flex-col gap-2 sm:gap-3 lg:gap-4">
            <div class="flex items-center gap-4">
              <span class="text-2xl font-semibold truncate">{{
                project.name
              }}</span>
              <UBadge
                :color="getProjectStatusColor(project.status)"
                size="lg"
                >{{ project.status }}</UBadge
              >
            </div>
            <p class="text-md text-neutral-500 line-clamp-2 truncate">
              {{ project.description }}
            </p>
            <div class="flex items-center gap-4">
              <div
                class="flex items-center gap-2 rounded-xl border border-default bg-default px-3 py-2"
              >
                <UIcon name="i-lucide-calendar" class="text-xl" />
                <div>
                  <span class="text-sm text-neutral-500 line-clamp-2 truncate"
                    >Created at</span
                  >
                  <span class="text-sm">{{
                    formatDateShort(project.createdAt)
                  }}</span>
                </div>
              </div>

              <div
                class="flex items-center gap-2 rounded-xl border border-default bg-default px-3 py-2"
              >
                <UIcon name="i-lucide-clock" class="text-xl" />
                <div>
                  <span class="text-sm text-neutral-500 line-clamp-2 truncate"
                    >Updated at</span
                  >
                  <span class="text-sm">{{
                    formatDateShort(project.updatedAt)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <UButton
              class="!bg-transparent !text-primary hover:!bg-primary/10 w-full justify-center sm:w-auto"
              variant="outline"
              icon="i-lucide-edit-2"
            >
              Edit Project
            </UButton>
            <UButton
              label="Add task"
              icon="i-lucide-plus"
              color="secondary"
              class="w-full justify-center sm:w-auto cursor-pointer"
            />
          </div>
        </div>
  
    </div>
            <USeparator />
    <div class="flex items-center gap-3">
      <ProjectSmallStat>
        <template #icon>
          <UIcon class="text-2xl" name="i-lucide:clipboard-check" />
        </template>
        <template #title> Total tasks </template>
        <template #value>{{ project.tasksCount }}%</template>
      </ProjectSmallStat>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";
import { PROJECT_STATUSES } from "~/constants/projectStatuses";
// import { formatDateShort } from "~/utils/date";

const props = defineProps<{
  project: ProjectModel;
}>();

function getProjectStatusColor(status: string) {
  if (PROJECT_STATUSES.ACTIVE === status) {
    return "success";
  } else if (PROJECT_STATUSES.COMPLETED === status) {
    return "info";
  } else {
    return "warning";
  }
}
</script>

<style scoped></style>
