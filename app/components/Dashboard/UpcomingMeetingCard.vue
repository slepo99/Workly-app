<template>
  <UCard
    :ui="{
      header: 'lg:p-4 flex items-center justify-between',
      body: 'lg:p-4',
      footer: 'lg:p-4',
    }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-calendar" />
        <span class="text-lg font-semibold">{{ t('dashboard.upcomingMeeting.title') }}</span>
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
          class="bg-pink-400/70 hover:bg-pink-500/70 cursor-pointer justify-center w-full mt-4 mb-4"
        >
          {{ t('dashboard.upcomingMeeting.title') }}
        </UButton>
        <UAvatarGroup max="3">
          <UAvatar
            v-for="i in 6"
            :key="i"
            src="https://github.com/benjamincanac.png"
            alt="Benjamin Canac"
          />
        </UAvatarGroup>
      </div>
    </template>
     <template #footer> 
        <div class="rounded-lg bg-elevated p-3 flex flex-col gap-2">
          <UButton class="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer justify-center" variant="ghost" color="neutral">
            {{ t('dashboard.upcomingMeeting.joinCall') }}
          </UButton>
          <UButton class="w-full bg-gray-500 hover:bg-gray-600 cursor-pointer justify-center" variant="ghost" color="neutral">
            {{ t('dashboard.upcomingMeeting.reschedule') }}
          </UButton>
        </div>
       </template>
  </UCard>
</template>

<script setup lang="ts">
import { useI18n } from '#imports';
const { t } = useI18n()
</script>

<style scoped></style>
