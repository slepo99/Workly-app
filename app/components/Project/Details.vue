<template>
  <div
    class="card-shadow flex flex-col bg-elevated p-3 sm:p-4 lg:p-6 mt-4 rounded-xl gap-2 sm:gap-4 lg:gap-6"
  >
    <div class="flex gap-2 sm:gap-4 lg:gap-6">
      <div
        class="flex h-40 w-60 items-center justify-center overflow-hidden rounded-xl bg-muted"
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
        class="flex flex-col items-start justify-between w-full gap-4 sm:gap-6 lg:gap-8 lg:flex-row"
      >
        <div class="flex flex-col gap-2 sm:gap-3 lg:gap-4">
          <div class="flex items-center gap-4">
            <span class="text-2xl font-semibold truncate">{{
              project.name
            }}</span>
            <UBadge :color="getProjectStatusColor(project.status)" size="lg">{{
              project.status
            }}</UBadge>
          </div>
          <p class="text-md text-neutral-500 line-clamp-2 truncate">
            {{ project.description }}
          </p>
          <div class="flex items-center gap-4">
            <ProjectSmallStat>
              <template #icon>
                <UIcon name="i-lucide-calendar" class="text-xl" />
              </template>
              <template #title> Created at </template>
              <template #value>{{
                formatDateShort(project.createdAt)
              }}</template>
            </ProjectSmallStat>

            <ProjectSmallStat>
              <template #icon>
                <UIcon name="i-lucide-clock" class="text-xl" />
              </template>
              <template #title> Updated at </template>
              <template #value>{{
                formatDateShort(project.updatedAt)
              }}</template>
            </ProjectSmallStat>
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
    <div class="flex items-center gap-4">
      <ProjectSmallStat class="w-full">
        <template #icon>
          <UIcon class="text-2xl" name="i-lucide:clipboard-check" />
        </template>
        <template #title> Total tasks </template>
        <template #value>{{ project.tasksCount }}</template>
      </ProjectSmallStat>

      <ProjectSmallStat class="w-full">
        <template #icon>
          <UIcon class="text-2xl" name="i-lucide-circle-check" />
        </template>
        <template #title> Completed tasks </template>
        <template #value>{{
          getPercentageValue(project.tasksCount, project.completionPercent)
        }}</template>
      </ProjectSmallStat>

      <ProjectSmallStat class="w-full">
        <template #icon>
          <UIRoundedProgress :percent="project.completionPercent" size="24" />
        </template>
        <template #title> Completiton rate </template>
        <template #value>{{ project.completionPercent }}%</template>
      </ProjectSmallStat>

      <ProjectSmallStat class="w-full">
        <template #icon>
          <UIcon class="text-2xl" name="i-lucide-users" />
        </template>
        <template #title> Project members </template>
        <template #value>{{ members.length }}</template>
        <template #extra-value>
          <UAvatarGroup max="3">
            <UAvatar
              v-for="member in membersWithAvatar"
              :src="String(member.user.avatar)"
              :alt="member.user.name"
            />
          </UAvatarGroup>
        </template>
      </ProjectSmallStat>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";
import { PROJECT_STATUSES } from "~/constants/projectStatuses";
import type { ProjectMemberModel } from "~/composables/api/useProjectMembersApi/types";
const props = defineProps<{
  project: ProjectModel;
  members: ProjectMemberModel[];
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
const membersWithAvatar = computed(() =>
  props.members.filter((member) => member.user.avatar),
);
</script>

<style scoped></style>
