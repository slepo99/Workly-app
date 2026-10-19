<template>
  <UPage>
    <div class="flex items-center justify-end mt-4">
      <UInput
        v-model="usersStore.search"
        icon="i-lucide-search"
        size="lg"
        variant="soft"
        placeholder="Search project..."
        class="w-full sm:w-72"
        :ui="{
          base: 'rounded-full',
        }"
        @update:model-value="searchUsers"
      >
        <template v-if="usersStore.search" #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="i-lucide-circle-x"
            aria-label="Clear input"
            @click="clearSearchInput"
          />
        </template>
      </UInput>
    </div>
    <UsersTable :users="usersStore.users" class="mt-4"/>
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

const { onFirstLoadUsers, updateUsersPage, searchUsers, clearSearchInput } =
  useUsers();
const usersStore = useUsersStore();
await onFirstLoadUsers();
</script>

<style scoped></style>
