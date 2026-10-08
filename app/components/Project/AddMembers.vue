<template>
  <UModal v-model:open="isOpen" title="Add project members" @enter="loadUsers">
    <UButton
      label="Add members"
      icon="i-lucide-plus"
      color="secondary"
      class="min-w-0 cursor-pointer justify-center"
    />

    <template #body>
      <UListbox
        v-model="selectedUsers"
        :items="getUsersList || []"
        :loading="isLoading"
        value-key="value"
        :filter-fields="['label', 'email']"
        filter
        multiple
        class="w-full"
      >
        <template #item-label="{ item }">
          <div class="flex items-center justify-start">
            <span>{{ item.label }}</span>
            &nbsp;&mdash;&nbsp;
            <span class="text-muted">
              {{ item.email }}
            </span>
          </div>
        </template>
      </UListbox>
      <div class="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-between mt-4">
        <UButton
          type="button"
          color="neutral"
          variant="outline"
          class="w-full justify-center sm:w-auto"
          @click="isOpen = false"
        >
          Cancel
        </UButton>

        <UButton
          icon="i-lucide-save"
          class="w-full justify-center sm:w-auto"
          :loading="isSaving"
          @click="addMembersToProject"
        >
          Save members
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useProjectNewMember } from "~/composables/components/project/useProjectNewMember";
import { useProjectStore } from "~/stores/project";

const props = defineProps<{
  projectId: string;
}>();
const projectId = toRef(props, "projectId");
const projectStore = useProjectStore();
const { getUsersList, isLoading, isOpen, loadUsers, isSaving, selectedUsers, addMembersToProject } =
  useProjectNewMember(projectId);

const items = ref([]);

watch(
  () => selectedUsers.value,
  (newVal) => {
    console.log(newVal);
  },
);
</script>
