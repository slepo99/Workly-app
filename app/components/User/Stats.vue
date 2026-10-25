<template>
  <div class="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-6">
    <UISmallStat class="min-w-0 w-full">
      <template #icon>
        <UIcon name="i-lucide-clipboard-list" class="text-xl" />
      </template>
      <template #title>Active tasks</template>
      <template #value> {{ stats.active }}</template>
    </UISmallStat>
    <UISmallStat class="min-w-0 w-full">
      <template #icon>
        <UIcon name="i-lucide-square-check" class="text-xl" />
      </template>
      <template #title>Completed</template>
      <template #value> {{ stats.completed }} </template>
    </UISmallStat>
    <UISmallStat class="min-w-0 w-full">
      <template #icon>
        <UIcon name="i-lucide-clipboard-clock" class="text-xl" />
      </template>
      <template #title>Pending</template>
      <template #value> {{ stats.pending }} </template>
    </UISmallStat>

    <UISmallStat class="min-w-0 w-full">
      <template #icon>
        <UIcon name="i-lucide-folder-kanban" class="text-xl" />
      </template>
      <template #title>Projects</template>
      <template #value> {{ stats.projectsCount }} </template>
    </UISmallStat>
    <UISmallStat class="min-w-0 w-full">
      <template #icon>
        <UIcon name="i-lucide-sticky-notes" class="text-xl" />
      </template>
      <template #title>Tasks</template>
      <template #value> {{ stats.tasksCount }} </template>
    </UISmallStat>
    <UISmallStat class="min-w-0 w-full">
      <template #icon>
        <UIcon name="i-lucide-percent" class="text-xl" />
      </template>
      <template #title>Completion rate</template>
      <template #value> {{ stats.completitionRate }} </template>
    </UISmallStat>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  stats: {
    projectsCount: number;
    active: number;
    completed: number;
    completitionRate: number;
    tasksCount: number;
    pending: number;
  };
}>();
</script>

<style scoped></style>
