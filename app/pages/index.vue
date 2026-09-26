<template>
  <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
    <div v-for="i in 4">
      <DashboardStatCard
        :icon="'i-lucide-clipboard-list'"
        :title="'Total Tasks'"
        :value="'120'"
      />
    </div>
  </div>
<div class="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
    <DashboardRecentActivityCard  class="sm:col-span-2"/>
    <DashboardDeadlinesCard />
    <DashboardUpcomingMeetingCard />
</div>
<DashboardTasklistTable class="my-6"/>
</template>

<script lang="ts" setup></script>

<style></style>
