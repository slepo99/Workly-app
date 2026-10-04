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
            <span>Total: {{ projectsStore.total }}</span>
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

      <FilterButtons
        v-model="projectsStore.selectedStatus"
        :filters="filters"
        @change="filterProjectsStatus"
      />
    </div>

    <div
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8"
    >
    <ProjectsCardNew v-if="projectsStore.page === 1"/>
      <ProjectsCard
        v-for="project in projectsStore.projects"
        :key="project.id"
        :project
      />
    </div>

    <div class="w-full flex items-center justify-center mt-8">
      <UPagination
        v-model:page="projectsStore.page"
        :items-per-page="PROJECTS_PAGINATION.LIMIT"
        :total="projectsStore.total"
        @update:page="updateProjectsPage"
      />
    </div>
  </UPage>
</template>

<script setup lang="ts">
import { useProjectsStore } from "~/stores/projects";
import { PROJECTS_PAGINATION } from "~/constants/api";
import { useProjects } from "~/composables/pages/useProjects";

const projectsStore = useProjectsStore();

const {
  filters,
  searchProjects,
  updateProjectsPage,
  firstLoadProjects,
  filterProjectsStatus,
} = useProjects();

await firstLoadProjects();
</script>

<style scoped></style>
