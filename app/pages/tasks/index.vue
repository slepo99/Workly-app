<template>
  <div>
    <UPage>
      <div>
        <h1 class="text-2xl font-semibold">Tasks</h1>

        <p class="mt-1 text-sm text-muted">Manage tasks across all projects</p>
      </div>
      <div
        class="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
      >
        <UInput
          v-model="tasksStore.search"
          icon="i-lucide-search"
          size="lg"
          variant="soft"
          placeholder="Search tasks..."
          class="w-full lg:w-72 lg:shrink-0"
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

        <div
          class="grid w-full grid-cols-2 gap-2 lg:flex lg:w-auto lg:items-center lg:gap-4"
        >
          <USelect
            v-model="tasksStore.statuses"
            v-model:open="isStatusSelectOpen"
            size="lg"
            :items="getTaskStatuses"
            multiple
            placeholder="All statuses"
            value-key="value"
            label-key="label"
            color="neutral"
            class="min-w-0 lg:w-52"
            :ui="{
              base: 'focus-visible:outline-none focus-visible:ring-accented',
            }"
            @update:open="onStatusSelectOpenChange"
          />

          <USelect
            v-model="tasksStore.sortBy"
            size="lg"
            :items="tasksSortOptions"
            value-key="value"
            label-key="label"
            color="neutral"
            class="min-w-0 lg:w-56"
            :ui="{
              base: 'ps-23! md:ps-21! focus-visible:outline-none focus-visible:ring-accented',
            }"
            @update:open="onSortSelectChange"
          >
            <template #leading>
              <div class="flex items-center gap-1">
                <UIcon name="i-lucide-arrow-down-up" />

                <span class="whitespace-nowrap text-muted"> Sort by: </span>
              </div>
            </template>
          </USelect>
        </div>
      </div>
      <div class="mt-6 flex flex-col gap-4">
        <TasksProjectGroup
          v-for="tasks in tasksStore.groupedTasks"
          :key="tasks.id"
          :grouped-tasks="tasks"
        />
        <div class="flex items-center justify-center mt-4">
          <UPagination
            :page="tasksStore.page"
            :items-per-page="GROUPED_TASKS_PAGINATION.LIMIT"
            :total="tasksStore.total"
            @update:page="updateTasksPage"
          />
        </div>
      </div>
    </UPage>
  </div>
</template>

<script setup lang="ts">
//todo: move sorting from server to client side
import { useTasks } from "~/composables/pages/useTasks";
import { useTasksStore } from "~/stores/tasks";
import { useStatuses } from "~/composables/useStatuses";
import { GROUPED_TASKS_PAGINATION } from "~/constants/api";
const tasksStore = useTasksStore();
const {
  firstLoadGroupedTasks,
  searchTasks,
  clearSearchInput,
  isStatusSelectOpen,
  onStatusSelectOpenChange,
  tasksSortOptions,
  onSortSelectChange,
  updateTasksPage
} = useTasks();
const { getTaskStatuses } = useStatuses();
await firstLoadGroupedTasks();
</script>

<style scoped></style>
