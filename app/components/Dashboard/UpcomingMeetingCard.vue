<template>
  <UCard
    :ui="{
      header: 'flex items-center justify-between',
      body: 'lg:p-4',
    }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-calendar" />
        <span class="text-lg font-semibold">Upcoming Meetings</span>
      </div>
      <UButton
        icon="i-lucide-arrow-up-right"
        color="neutral"
        variant="ghost"
        size="sm"
      />
    </template>
    <template #default>
      <div class="rounded-lg bg-elevated p-3">
        <div class="flex gap-2 items-center">
          <span class="size-2 rounded-full bg-success"></span>
          <span class="text-md">Team Weekly Sync</span>
        </div>
        <div class="flex gap-2 items-center mt-2">
          <UIcon name="i-lucide-calendar" class="mr-1" />
          <span class="text-sm text-neutral-500"
            >Thu, Sep 5, 10:00 - 11:00 AM</span
          >
        </div>
        <UButton
          variant="ghost"
          color="neutral"
          class="bg-pink-400/70 hover:bg-pink-500/70 cursor-pointer justify-center w-full mt-4"
        >
          Upcoming Meetings
        </UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts"></script>

<style scoped></style>
