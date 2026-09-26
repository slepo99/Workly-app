<template>
       <UCard
       class="bg-elevated"
          :ui="{
            header: 'flex items-center justify-between lg:p-4 lg:pb-2',
            body: 'lg:p-4 lg:pt-2',
            footer: 'flex items-center justify-between lg:p-4',
          }"
        >
          <template #header>
            <span class="text-sm"> Task 1 </span>
            <UBadge :color="badgeColor">{{ t('dashboard.taskActivity.status.complited') }}</UBadge>
          </template>
          <template #default>
            <div class="mt-2 text-sm text-neutral-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              euismod, nunc ut aliquam lacinia, nunc nisl aliquam nisl, eget
              aliquam nunc nisl eget nunc.
            </div>
            <div class="flex items-center justify-between mt-4">
              <div class="flex items-center gap-2 ">
                <UIcon name="i-lucide-calendar" class="mr-1" />
                <span class="text-sm">2024-06-01</span>
              </div>
              <UBadge :color="statusColor">{{ t('dashboard.taskActivity.priority.medium') }}</UBadge>
            </div>
          </template>
          <template #footer>
            <UAvatarGroup max="3">
              <UAvatar
                v-for="i in 6"
                :key="i"
                src="https://github.com/benjamincanac.png"
                alt="Benjamin Canac"
              />
            </UAvatarGroup>
            <UDropdownMenu :items="dropDownMenuItems">
              <UButton
                icon="i-lucide-more-horizontal"
                class="rounded-full hover:bg-accented"
                color="neutral"
                variant="ghost"
              />
            </UDropdownMenu>
          </template>
        </UCard>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { useI18n } from "#imports";
const { t } = useI18n()
const badgeColor = computed(() => {
  if (true) {
    return "success";
  } else if (false) {
    return "warning";
  } else {
    return "neutral";
  }
});
const statusColor = computed(() => {
  if (true) {
    return "warning";
  } else if (false) {
    return "warning";
  } else {
    return "neutral";
  }
});
const dropDownMenuItems = ref<DropdownMenuItem[][]>([
  [
    {
      label: t('dashboard.taskActivity.actions.viewDetails'),
      icon: "i-lucide-eye",
      onClick: () => {
        console.log("View Details clicked");
      },
    },
    {
      label: t('dashboard.taskActivity.actions.editTsk'),
      icon: "i-lucide-edit",
      onClick: () => {
        console.log("Edit Task clicked");
      },
    },
    {
      label: t('dashboard.taskActivity.actions.deleteTask'),
      icon: "i-lucide-trash-2",
      color: "error",
      onClick: () => {
        console.log("Delete Task clicked");
      },
    },
  ],
]);
</script>

<style scoped>

</style>