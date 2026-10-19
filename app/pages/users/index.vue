<template>
  <UPage>
    <UsersTable :users="usersStore.users" />
    <div class="flex items-center justify-center mt-4">
         <UPagination
      :page="usersStore.page"
      :items-per-page="USERS_PAGINATION.LIMIT"
      :total="usersStore.total"
      @update:page="updateUsersPage"
    />
    </div>
  </UPage>
</template>

<script setup lang="ts">
import { useUsers } from "~/composables/pages/useUsers";
import { useUsersStore } from "~/stores/users";
import { USERS_PAGINATION } from "~/constants/api";
definePageMeta({
  middleware: ["management"],
});

const { onFirstLoadUsers, updateUsersPage } = useUsers();
const usersStore = useUsersStore();
await onFirstLoadUsers();
</script>

<style scoped></style>
