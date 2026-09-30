<template>
  <UPage>
    <FilterButtons v-model="selectedStatus" :filters="filters" />
  </UPage>
</template>

<script setup lang="ts">
import { PROJECT_STATUSES, type ProjectStatus } from '~/constants/projectStatuses'; 
const selectedStatus = ref<ProjectStatus[]>([]);

const filters = [
  { label: "Done", value: PROJECT_STATUSES.COMPLETED },
  { label: "Pending", value: PROJECT_STATUSES.ON_HOLD },
  { label: "Active", value: PROJECT_STATUSES.ACTIVE },
];
</script>

<style scoped></style>
