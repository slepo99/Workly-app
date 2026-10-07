<template>
  <div
    class="card-shadow flex flex-col gap-4 rounded-xl bg-elevated p-3 sm:p-4 lg:gap-6 lg:p-6"
  >
    <div class="flex flex-col gap-4 md:flex-row lg:gap-6">
      <div
        class="flex aspect-video w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted md:aspect-auto md:h-40 md:w-60"
      >
        <img
          v-if="project.image"
          :src="project.image"
          :alt="project.name"
          class="h-full w-full object-cover"
        />

        <div
          v-else
          class="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-neutral-300 text-muted dark:border-neutral-600"
        >
          <UIcon name="i-lucide-image" class="size-8" />
        </div>
      </div>

      <div
        class="flex min-w-0 flex-1 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between xl:gap-6"
      >
        <div class="flex min-w-0 flex-1 flex-col gap-3">
          <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span
              class="min-w-0 max-w-full text-xl font-semibold [overflow-wrap:anywhere] sm:text-2xl"
            >
              {{ project.name }}
            </span>

            <UBadge
              :color="getProjectStatusColor(project.status)"
              size="lg"
              class="shrink-0"
            >
              {{
                projectStatuses.find(
                  (status) => status.value === project.status,
                )?.label
              }}
            </UBadge>
          </div>

          <p
            class="text-base whitespace-normal text-neutral-500 [overflow-wrap:anywhere]"
          >
            {{ project.description }}
          </p>
        </div>

        <div
          class="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap xl:shrink-0"
        >
          <ProjectEdit :project="props.project" />
          <UButton
            label="Add task"
            icon="i-lucide-plus"
            color="secondary"
            class="min-w-0 cursor-pointer justify-center"
          />
        </div>
      </div>
    </div>

    <USeparator />

    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
      <ProjectSmallStat class="min-w-0 w-full">
        <template #icon>
          <UIcon name="i-lucide-calendar" class="text-xl" />
        </template>
        <template #title>Created at</template>
        <template #value>
          {{ formatDateShort(project.createdAt) }}
        </template>
      </ProjectSmallStat>

      <ProjectSmallStat class="min-w-0 w-full">
        <template #icon>
          <UIcon name="i-lucide-clock" class="text-xl" />
        </template>
        <template #title>Updated at</template>
        <template #value>
          {{ formatDateShort(project.updatedAt) }}
        </template>
      </ProjectSmallStat>

      <ProjectSmallStat class="min-w-0 w-full">
        <template #icon>
          <UIcon name="i-lucide-clipboard-check" class="text-2xl" />
        </template>
        <template #title>Total tasks</template>
        <template #value>{{ project.tasksCount }}</template>
      </ProjectSmallStat>

      <ProjectSmallStat class="min-w-0 w-full">
        <template #icon>
          <UIcon name="i-lucide-circle-check" class="text-2xl" />
        </template>
        <template #title>Completed tasks</template>
        <template #value>
          {{
            getPercentageValue(project.tasksCount, project.completionPercent)
          }}
        </template>
      </ProjectSmallStat>

      <ProjectSmallStat class="min-w-0 w-full">
        <template #icon>
          <UIRoundedProgress :percent="project.completionPercent" size="24" />
        </template>
        <template #title>Completion rate</template>
        <template #value>{{ project.completionPercent }}%</template>
      </ProjectSmallStat>

      <ProjectSmallStat class="min-w-0 w-full">
        <template #icon>
          <UIcon name="i-lucide-users" class="text-2xl" />
        </template>
        <template #title>Project members</template>
        <template #value>{{ members.length }}</template>
      </ProjectSmallStat>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";
import type { ProjectMemberModel } from "~/composables/api/useProjectMembersApi/types";
import { useStatuses } from "~/composables/useStatuses";

const props = defineProps<{
  project: ProjectModel;
  members: ProjectMemberModel[];
}>();

const { projectStatuses, getProjectStatusColor } = useStatuses();
</script>

<style scoped></style>
