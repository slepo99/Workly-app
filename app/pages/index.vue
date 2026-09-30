<template>
  <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
    <DashboardStatCard
        :icon="'i-lucide-clipboard-list'"
        :title="t('dashboard.statCard.totalTasks')"
        :value="dashboardStore.tasks.length"
      />
      <DashboardStatCard
        :icon="'i-lucide-clipboard-list'"
        :title="t('dashboard.statCard.totalProjects')"
        :value="dashboardStore.projects.length"
      />
      <DashboardStatCard
        :icon="'i-lucide-clipboard-list'"
        :title="t('dashboard.statCard.totalEmployee')"
        :value="dashboardStore.users.length"
      />
      <DashboardStatCard
        :icon="'i-lucide-clipboard-list'"
        :title="t('dashboard.statCard.tasksComplited')"
        :value="dashboardStore.getComplitedTasks.length"
      />
      
         <!-- <DashboardSkeletonsStatCardSkeleton/> -->
  
  </div>
<div class="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
    <DashboardRecentActivityCard  class="sm:col-span-2"/>
    <DashboardDeadlinesCard />
    <DashboardUpcomingMeetingCard />
    <!-- <DashboardSkeletonsDeadlinesCardSkeleton/>
    <DashboardSkeletonsUpcomingMeetingsCardSkeleton/>
    <DashboardSkeletonsRecentActivityCardSkeleton/> -->
 
</div>
<DashboardTasklistTable class="my-6"/>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { useDashboardStore } from "~/stores/dashboard";
const { t } = useI18n()
const  dashboardStore  = useDashboardStore()

await callOnce("dashboard", async () => {
  await Promise.all([
    dashboardStore.loadAllTasks(),
    dashboardStore.loadAllProjects(),
    dashboardStore.loadAllUsers()
  ])

  console.log(dashboardStore.tasks)
})
</script>

<style></style>
