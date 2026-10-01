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
            v-model="projectsStore.search"
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
    <UPagination
      v-model:page="projectsStore.page"
      :items-per-page="PROJECTS_PAGINATION.LIMIT"
      :total="projectsStore.total"
      @update:page="updateProjects"
    />
  </UPage>
</template>

<script setup lang="ts">
import { useProjectsStore } from "~/stores/projects";
import { PROJECTS_PAGINATION } from "~/constants/api";
import { useProjectsPage } from "~/composables/useProjectsPage";
const projectsStore = useProjectsStore();
const {
  selectedStatus,
  filters,
  searchProjects,
  updateProjects,
  firstLoadProjects,
} = useProjectsPage();



await firstLoadProjects()
</script>

<style scoped></style>
