<template>
  <UModal v-model:open="isOpen" title="Create task" @after:leave="resetForm">
    <UButton
      label="Create task"
      icon="i-lucide-plus"
      color="secondary"
      class="min-w-0 cursor-pointer justify-center"
    />

    <template #body>
      <UForm :state="form" :schema="schema" class="flex flex-col gap-4" @submit="createTask">
        <UFormField label="Task title" name="title" required>
          <UInput v-model="form.title" placeholder="Task name" class="w-full" />
        </UFormField>

        <UFormField label="Description" name="description">
          <UTextarea
            v-model="form.description"
            placeholder="Task description"
            autoresize
            class="w-full"
          />
        </UFormField>

        <UFormField label="Status" name="status" required>
          <USelect
            v-model="form.status"
            :items="getTaskStatuses"
            value-key="value"
            label-key="label"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Task assignees" name="assigneeIds">
          <USelectMenu
            v-model="form.assigneeIds"
            :items="memberItems"
            multiple
            value-key="value"
            label-key="label"
            placeholder="Select assignees"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Date range" name="dateRange">
          <UIRangeDatePicker v-model="taskDates" />
        </UFormField>

        <div class="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
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
            type="submit"
            icon="i-lucide-save"
            class="w-full justify-center sm:w-auto"
            :loading="isSaving"
          >
            Create task
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useStatuses } from "~/composables/useStatuses";
import { useProjectCreateTask } from "~/composables/components/project/useProjectCreateTask";
import type { ProjectMemberModel } from "~/composables/api/useProjectMembersApi/types";
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";

const props = defineProps<{
  projectMembers: ProjectMemberModel[];
  project: ProjectModel;
}>();

const { getTaskStatuses } = useStatuses();
const refProjectMembers = toRef(props, "projectMembers");
const refProject = toRef(props, "project");
const {
  memberItems,
  form,
  isOpen,
  isSaving,
  resetForm,
  createTask,
  taskDates,
  schema,
} = useProjectCreateTask(refProjectMembers, refProject);
</script>
