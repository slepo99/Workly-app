<template>
  <UPage>
    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardStatCard
        v-if="!dashboardStore.isLoading"
        :icon="'i-lucide-clipboard-list'"
        :title="t('dashboard.statCard.totalTasks')"
        :value="dashboardStore.stats.totalTasks"
      />
      <DashboardSkeletonsStatCardSkeleton v-else />
      <DashboardStatCard
        :icon="'i-lucide-clipboard-list'"
        :title="t('dashboard.statCard.totalProjects')"
        :value="dashboardStore.stats.totalProjects"
      />
      <DashboardStatCard
        :icon="'i-lucide-clipboard-list'"
        :title="t('dashboard.statCard.totalEmployee')"
        :value="dashboardStore.stats.totalUsers"
      />
      <DashboardStatCard
        :icon="'i-lucide-clipboard-list'"
        :title="t('dashboard.statCard.tasksComplited')"
        :value="dashboardStore.stats.completedTasks"
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
    <!-- <DashboardTasklistTable class="my-6" /> -->
  </UPage>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { useProjectsStore } from "~/stores/projects";
import { useTasksStore } from "~/stores/tasks";
import { useUsersStore } from "~/stores/users";
import { useDashboardStore } from "~/stores/dashboard";
import { useDashboard } from "~/composables/pages/useDashboard";
const { t } = useI18n();
const projectsStore = useProjectsStore();
const tasksStore = useTasksStore();
const usersStore = useUsersStore();
const dashboardStore = useDashboardStore();

const { loadDashboard } = useDashboard()

await loadDashboard()


</script>

<style></style>
