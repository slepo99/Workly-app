<template>
  <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
    <UISmallStat class="min-w-0 w-full">
      <template #icon>
        <UIcon name="i-lucide-users" class="text-xl" />
      </template>
      <template #title>Total users</template>
      <template #value> {{ stats.totalUsers }}</template>
    </UISmallStat>
    <UISmallStat class="min-w-0 w-full">
      <template #icon>
        <UIcon name="i-lucide-crown" class="text-xl" />
      </template>
      <template #title>Admins</template>
      <template #value> {{ stats.totalAdmins }} </template>
    </UISmallStat>
    <UISmallStat class="min-w-0 w-full">
      <template #icon>
        <UIcon name="i-lucide-user-round-pen" class="text-xl" />
      </template>
      <template #title>Managers</template>
      <template #value> {{ stats.totalManagers }} </template>
    </UISmallStat>
    <UISmallStat class="min-w-0 w-full">
      <template #icon>
        <UIcon name="i-lucide-user" class="text-xl" />
      </template>
      <template #title>Workers</template>
      <template #value> {{ stats.totalWorkers }} </template>
    </UISmallStat>
  </div>
</template>

<script setup lang="ts">
import type { UsersStatsModel } from "~/composables/api/useUsersApi/types";

const props = defineProps<{
  stats: UsersStatsModel;
}>();
</script>

<style scoped></style>
