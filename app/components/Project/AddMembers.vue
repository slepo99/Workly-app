<template>
  <UModal v-model:open="isOpen" title="Add project members">
    <UButton
      label="Add members"
      icon="i-lucide-plus"
      color="secondary"
      class="min-w-0 cursor-pointer justify-center"
    />

    <template #body>
      <UListbox
        v-model="items"
        :items="getUsersList || []"
        :loading="isLoading"
        :filter-fields="['label', 'email']"
        filter
        multiple
        class="w-full"
      >
        <template #item-label="{ item }">
          <div class="flex items-center justify-between">
            <span>{{ item.label }}</span>

            <span class="text-muted">
              {{ item.email }}
            </span>
          </div>
        </template>
      </UListbox>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useUsersStore } from "~/stores/users";
import { useProjectNewMember } from "~/composables/components/project/useProjectNewMember";
const props = defineProps<{
  projectId: string;
}>();
const usersStore = useUsersStore();

await usersStore.loadAllUsers();

const { getUsersList, isLoading, isOpen } = useProjectNewMember();

const items = ref([]);

watch(
  () => items.value,
  (newVal) => {
    console.log(newVal);
  },
);

</script>
