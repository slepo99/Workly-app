<template>
  <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
    <DashboardStatCard
      v-if="!tasksStore.isLoading"
      :icon="'i-lucide-clipboard-list'"
      :title="t('dashboard.statCard.totalTasks')"
      :value="tasksStore.tasks.length"
    />
    <DashboardSkeletonsStatCardSkeleton v-else />
    <DashboardStatCard
      :icon="'i-lucide-clipboard-list'"
      :title="t('dashboard.statCard.totalProjects')"
      :value="projectsStore.projects.length"
    />
    <DashboardStatCard
      :icon="'i-lucide-clipboard-list'"
      :title="t('dashboard.statCard.totalEmployee')"
      :value="usersStore.users.length"
    />
    <DashboardStatCard
      :icon="'i-lucide-clipboard-list'"
      :title="t('dashboard.statCard.tasksComplited')"
      :value="tasksStore.getComplitedTasks.length"
    />
  </div>
  <div class="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
    <DashboardRecentActivityCard class="sm:col-span-2" />
    <DashboardDeadlinesCard />
    <DashboardUpcomingMeetingCard />
    <!-- <DashboardSkeletonsDeadlinesCardSkeleton/>
    <DashboardSkeletonsUpcomingMeetingsCardSkeleton/>
    <DashboardSkeletonsRecentActivityCardSkeleton/> -->
  </div>
  <DashboardTasklistTable class="my-6" />
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { useProjectsStore } from "~/stores/projects";
import { useTasksStore } from "~/stores/tasks";
import { useUsersStore } from "~/stores/users";

const { t } = useI18n();
const projectsStore = useProjectsStore();
const tasksStore = useTasksStore();
const usersStore = useUsersStore();

await callOnce(
  "dashboard",
  async () => {
    await Promise.all([
      tasksStore.loadAllTasks(),
      projectsStore.loadAllProjects(),
      usersStore.loadAllUsers(),
    ]);
  },
  { mode: "navigation" },
);
</script>

<style></style>
