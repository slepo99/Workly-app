<template>
  <UCard
    :ui="{
      header: 'lg:p-4 flex items-center justify-between',
      body: 'lg:p-4',
    }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-clipboard-list" />
        <span class="text-lg font-semibold">{{
          t("dashboard.taskActivity.title")
        }}</span>
      </div>
      <UButton
        icon="i-lucide-arrow-up-right"
        color="neutral"
        variant="ghost"
        size="sm"
      />
    </template>
    <template #default>
      <div class="flex flex-row gap-4 max-sm:flex-col">
        <DashboardTaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          class="w-full"
          @delete-task="onRemoveTask"
        />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { useI18n } from "#imports";
import type { TasksModel } from "~/composables/api/useTasksApi/types";
import { useRecentActivityCard } from "~/composables/components/dashboard/useRecentActivityCard";
const { t } = useI18n();

const props = defineProps<{
  tasks: TasksModel[];
}>();

const { onRemoveTask } = useRecentActivityCard();
</script>

<style scoped></style>
