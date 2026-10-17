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
          t("dashboard.upcomingDeadlines.title")
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
      <div class="flex h-full flex-col justify-between gap-4">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="rounded-lg bg-elevated p-3 flex items-center justify-between gap-4"
        >
          <div class="flex flex-col gap-2">
            <span>{{ task.title }}</span>
            <div class="flex gap-2 items-center">
              <span class="size-2 rounded-full bg-error" />
              <span class="text-sm text-neutral-500 "
                >{{ formatDate(task.endDate) }} </span
              >
            </div>
          </div>
          <UButton
            icon="i-lucide-eye"
            class="rounded-full hover:bg-accented"
            color="neutral"
            variant="ghost"
          />
        </div>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { useI18n } from "#imports";
import type { TasksModel } from "~/composables/api/useTasksApi/types";

const props = defineProps<{
  tasks: TasksModel[];
}>();

const { t } = useI18n();
</script>

<style scoped></style>
