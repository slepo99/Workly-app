<template>
  <UPage>
    <UBreadcrumb :items="getBreadcumbs(userId)" />
    <div class="flex flex-col gap-4 mt-4">
      <h1 class="text-2xl font-semibold">User profile</h1>
      <div v-if="userStore.user" class="flex flex-col gap-4">
        <UserInfo :user="userStore.user" />
        <UserDetails />
        <!-- <UserStats :stats="getUserStats" /> -->
   <div class="mt-6 flex flex-col gap-4">
        <TasksProjectGroup
          v-for="tasks in userStore.groupedTasks"
          :key="tasks.id"
          :grouped-tasks="tasks"
        />
        <div class="flex items-center justify-center mt-4">
          <UPagination
            :page="userStore.page"
            :items-per-page="USER_GROUPED_TASKS_PAGINATION.LIMIT"
            :total="userStore.total"
            @update:page="(page) => updateUserTasks(page, userId)"
          />
        </div>
      </div>
      </div>
    </div>
  </UPage>
</template>

<script setup lang="ts">
import { useUser } from "~/composables/pages/useUser";
import { useUserStore } from "~/stores/user";
import { USER_GROUPED_TASKS_PAGINATION } from "~/constants/api";
const route = useRoute();
const userStore = useUserStore();
const userId = computed(() => route.params.id as string);
const { onFirstLoadUser, getBreadcumbs, updateUserTasks } = useUser();

await onFirstLoadUser(userId.value);
</script>

<style scoped></style>
