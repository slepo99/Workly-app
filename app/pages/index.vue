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
      <DashboardRecentActivityCard :tasks="dashboardStore.recentTasks" class="sm:col-span-2" />
      <DashboardDeadlinesCard :tasks="dashboardStore.upcomingDeadlines"/>
      <DashboardUpcomingMeetingCard />
      <!-- <DashboardSkeletonsDeadlinesCardSkeleton/>
    <DashboardSkeletonsUpcomingMeetingsCardSkeleton/>
    <DashboardSkeletonsRecentActivityCardSkeleton/> -->
    </div>
    <TasksTasklistTable :tasks="dashboardStore.tasksList" class="my-6" view-mode/>
  </UPage>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { useDashboardStore } from "~/stores/dashboard";
import { useDashboard } from "~/composables/pages/useDashboard";

const { t } = useI18n();
const dashboardStore = useDashboardStore();

const { loadDashboard } = useDashboard();

await loadDashboard();
</script>

<style></style>
