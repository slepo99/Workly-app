<template>
  <div>
    <UPage>
      <div>
        <h1 class="text-2xl font-semibold">Tasks</h1>

        <p class="mt-1 text-sm text-muted">
          Manage tasks across all projects
        </p>
      </div>
      <div class="mt-6 flex flex-col gap-4">
        <TasksProjectGroup v-for="tasks in tasksStore.groupedTasks" :key="tasks.id" :grouped-tasks="tasks"/>
      </div>
    </UPage>
  </div>
</template>

<script setup lang="ts">
import { useTasks } from "~/composables/pages/useTasks";
import { useTasksStore } from "~/stores/tasks";
const tasksStore = useTasksStore();
const { firstLoadGroupedTasks } = useTasks();
await firstLoadGroupedTasks();
</script>

<style scoped></style>
