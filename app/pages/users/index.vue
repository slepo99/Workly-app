<template>
  <UPage> 
    <UsersTable :users="usersStore.users"/>
  </UPage>
</template>

<script setup lang="ts">
import { useUsers } from "~/composables/pages/useUsers";
import { useUsersStore } from "~/stores/users";

definePageMeta({
  middleware: ["management"],
});

const { onFirstLoadUsers } = useUsers();
const usersStore = useUsersStore()
await onFirstLoadUsers();
</script>

<style scoped></style>
