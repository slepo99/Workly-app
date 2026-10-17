<template>
  <UCard
    class="bg-elevated flex h-full flex-col h-auto"
    :ui="{
      header: 'flex items-center justify-between lg:p-4 lg:pb-2',
      body: 'lg:p-4 lg:pt-2 flex-1',
      footer: 'flex items-center justify-between lg:p-4',
    }"
  >
    <template #header>
      <span class="text-sm"> {{ task.title }} </span>
      <UBadge :class="getTaskStatusColors(task.status)">{{
        getTaskStatusLabel(task.status)
      }}</UBadge>
    </template>
    <template #default>
      <div class="mt-2 text-sm text-neutral-500 line-clamp-6">
        {{ task.description }}
      </div>
      <div class="flex items-center justify-between mt-4">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-calendar-clock" class="mr-1" />
          <span class="text-sm">{{ formatDate(task.endDate) }}</span>
        </div>
        <UBadge
          v-if="task.status !== TASK_STATUSES.COMPLETED"
          :color="getTaskTermination(task.endDate).color"
          >{{ getTaskTermination(task.endDate).label }}</UBadge
        >
      </div>
    </template>
    <template #footer>
      <UAvatarGroup max="3">
        <UAvatar
          v-for="assignee in task.assignees"
          :key="assignee.id"
          :src="assignee.avatar"
          :alt="assignee.name"
        />
      </UAvatarGroup>
      <UDropdownMenu :items="dropDownMenuItems">
        <UButton
          icon="i-lucide-more-horizontal"
          class="rounded-full hover:bg-accented"
          color="neutral"
          variant="ghost"
        />
      </UDropdownMenu>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { useI18n } from "#imports";
import type { TasksModel } from "~/composables/api/useTasksApi/types";
import { useStatuses } from "~/composables/useStatuses";
import { TASK_STATUSES } from "~/constants/taskStatuses";
const props = defineProps<{
  task: TasksModel;
}>();

const { t } = useI18n();
const { getTaskStatusLabel, getTaskStatusColors, getTaskTermination } =
  useStatuses();

const emit = defineEmits<{
  deleteTask: [taskId: string]
}>()

const dropDownMenuItems = ref<DropdownMenuItem[][]>([
  [
    {
      label: t("dashboard.taskActivity.actions.viewDetails"),
      icon: "i-lucide-eye",

      onClick: () => {
        console.log("View Details clicked");
      },
    },
    {
      label: t("dashboard.taskActivity.actions.editTsk"),
      icon: "i-lucide-edit",

      onClick: () => {
        console.log("Edit Task clicked");
      },
    },
    {
      label: t("dashboard.taskActivity.actions.deleteTask"),
      icon: "i-lucide-trash-2",
      color: "error",

      onClick: () => {
        emit('deleteTask', props.task.id)
      },
    },
  ],
]);
</script>

<style scoped></style>
