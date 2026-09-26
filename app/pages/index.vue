<template>
  <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
    <DashboardStatCard
        :icon="'i-lucide-clipboard-list'"
        :title="t('dashboard.statCard.totalTasks')"
        :value="'120'"
      />
      <DashboardStatCard
        :icon="'i-lucide-clipboard-list'"
        :title="t('dashboard.statCard.totalProjects')"
        :value="'120'"
      />
      <DashboardStatCard
        :icon="'i-lucide-clipboard-list'"
        :title="t('dashboard.statCard.totalEmployee')"
        :value="'120'"
      />
      <DashboardStatCard
        :icon="'i-lucide-clipboard-list'"
        :title="t('dashboard.statCard.tasksComplited')"
        :value="'120'"
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
const { t } = useI18n()
</script>

<style></style>
