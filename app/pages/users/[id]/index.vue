<template>
  <UPage>
    <UBreadcrumb :items="getBreadcumbs(userId)" />
    <div class="flex flex-col gap-4 mt-4">
      <h1 class="text-2xl font-semibold">User profile</h1>
      <div v-if="userStore.user" class="flex flex-col gap-4">
        <UserInfo :user="userStore.user"/>
        <UserDetails/>
        <UserStats :stats="getUserStats" />
        <TasksTasklistTable :tasks="userStore.userTasks" view-mode/>
      </div>
    </div>
  </UPage>
</template>

<script setup lang="ts">
import { useUser } from "~/composables/pages/useUser";
import { useUserStore } from "~/stores/user";
const route = useRoute();
const userStore = useUserStore();
const userId = computed(() => route.params.id as string);
const { onFirstLoadUser, getBreadcumbs, getUserStats } = useUser();

await onFirstLoadUser(userId.value);
</script>

<style scoped></style>
