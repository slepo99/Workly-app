<template>
  <div>
    <UPage>
      <div>
        <h1 class="text-2xl font-semibold">Tasks</h1>

        <p class="mt-1 text-sm text-muted">Manage tasks across all projects</p>
      </div>
      <div class="mt-4 flex items-center justify-between">
        <UInput
          v-model="tasksStore.search"
          icon="i-lucide-search"
          size="lg"
          variant="soft"
          placeholder="Search tasks..."
          class="w-full sm:w-72"
          :ui="{
            base: 'rounded-full',
          }"
          @update:model-value="searchTasks"
        >
          <template v-if="tasksStore.search" #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              icon="i-lucide-circle-x"
              aria-label="Clear input"
              @click="clearSearchInput"
            />
          </template>
        </UInput>
        <div class="flex items-center gap-6">
          <USelect
            v-model="tasksStore.statuses"
            v-model:open="isStatusSelectOpen"
            size="lg"
            :items="getTaskStatuses"
            multiple
            placeholder="All statuses"
            value-key="value"
            label-key="label"
            class="w-full"
             @update:open="onStatusSelectOpenChange"
          />
        </div>
      </div>
      <div class="mt-6 flex flex-col gap-4">
        <TasksProjectGroup
          v-for="tasks in tasksStore.groupedTasks"
          :key="tasks.id"
          :grouped-tasks="tasks"
        />
      </div>
    </UPage>
  </div>
</template>

<script setup lang="ts">
import { useTasks } from "~/composables/pages/useTasks";
import { useTasksStore } from "~/stores/tasks";
import { useStatuses } from "~/composables/useStatuses";

const tasksStore = useTasksStore();
const {
  firstLoadGroupedTasks,
  searchTasks,
  clearSearchInput,
  isStatusSelectOpen,
  onStatusSelectOpenChange
} = useTasks();
const { getTaskStatuses } = useStatuses();
await firstLoadGroupedTasks();
</script>

<style scoped></style>
