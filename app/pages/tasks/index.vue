<template>
  <div>{{ tasksStore.groupedTasks }}</div>
</template>

<script setup lang="ts">
import { useTasks } from "~/composables/pages/useTasks";
import { useTasksStore } from "~/stores/tasks";
const tasksStore = useTasksStore()
const { firstLoadGroupedTasks } = useTasks();
await firstLoadGroupedTasks()
</script>

<style scoped></style>
