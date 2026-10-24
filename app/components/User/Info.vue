<template>
  <div
    class="flex card-shadow flex flex-row justify-between gap-4 rounded-xl bg-elevated p-3 sm:p-4 lg:gap-6 lg:p-6"
  >
    <div class="flex items-start gap-4">
      <!-- todo: move to no-image ui component -->

      <img
        v-if="user.avatar"
        :src="user.avatar"
        alt="User avatar"
        class="h-12 w-12 shrink-0 rounded-full object-cover sm:h-18 sm:w-18"
      />
    
      <div
        v-else
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-dashed border-neutral-300 text-muted dark:border-neutral-600 sm:h-22 sm:w-22"
      >
        <UIcon name="i-lucide-user-round" class="h-6 w-6" />
      </div>
      <span class="truncate text-base font-bold sm:text-xl">
        {{ user.name }}</span
      >
    </div>
    <div class="flex items-start gap-4">
      <UButton
        label="Edit user"
        icon="i-lucide-edit-2"
        color="secondary"
        class="min-w-0 cursor-pointer justify-center"
      />
      <UDropdownMenu :items="dropDownMenuItems"> 
        <UButton
          icon="i-lucide-more-horizontal"
          class="rounded-full hover:bg-accented"
          color="secondary"
          variant="ghost"
        />
      </UDropdownMenu>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserModel } from "~/composables/api/useUsersApi/types";
import type { DropdownMenuItem } from "@nuxt/ui";

const props = defineProps<{
  user: UserModel;
}>();

const emit = defineEmits(["deleteUser"]);
const dropDownMenuItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: "Delete user",
      icon: "i-lucide-trash-2",
      color: "error" as const,
      onSelect: () => {
        emit("deleteUser", props.user.id);
      },
    },
  ],
]);
</script>

<style scoped></style>
