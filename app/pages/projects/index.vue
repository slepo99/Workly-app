<template>
  <UPage>
    <div class="flex flex-col gap-6">
      <div
        class="flex flex-col-reverse gap-5 sm:flex-row sm:items-start sm:justify-between"
      >
        <div>
          <h1 class="text-2xl font-semibold">Projects</h1>

          <p class="mt-1 text-sm text-muted">Manage and track your projects</p>

          <div class="mt-3 flex gap-4 text-sm text-muted">
            <span>Total: 4</span>
            <span>Active: 2</span>
          </div>
        </div>

        <div
          class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
        >
          <UInput
            v-model="search"
            icon="i-lucide-search"
            size="lg"
            variant="soft"
            placeholder="Search project..."
            class="w-full sm:w-72"
            :ui="{
              base: 'rounded-full',
            }"
            @update:model-value="searchProjects"
          />

          <USeparator orientation="vertical" class="hidden h-10 sm:block" />

          <UButton
            label="New project"
            icon="i-lucide-plus"
            color="secondary"
            class="w-full justify-center sm:w-auto"
          />
        </div>
      </div>

      <FilterButtons v-model="selectedStatus" :filters="filters" />
    </div>
  </UPage>
</template>

<script setup lang="ts">
import {
  PROJECT_STATUSES,
  type ProjectStatus,
} from "~/constants/projectStatuses";
const selectedStatus = ref<ProjectStatus[]>([]);
const search = ref("");

const filters = [
  { label: "Done", value: PROJECT_STATUSES.COMPLETED },
  { label: "Pending", value: PROJECT_STATUSES.ON_HOLD },
  { label: "Active", value: PROJECT_STATUSES.ACTIVE },
];
function searchProjects(value: string) {
  console.log(value);
}


</script>

<style scoped></style>
