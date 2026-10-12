<template>
  <UModal v-model:open="isOpen" title="Create task" @after:leave="resetForm">
    <slot name="trigger">
      <!-- <UButton
        label="Edit task"
        icon="i-lucide-edit"
        color="secondary"
        class="min-w-0 cursor-pointer justify-center"
      /> -->
    </slot>

    <template #body>
      <TasksForm
        v-model:task-dates="taskDates"
        :form="form"
        :schema="schema"
        :select-status-items="getTaskStatuses"
        :select-members-items="memberItems"
        :is-saving="isSaving"
        submitLabel="Edit task"
        @create-task="createTask"
        @close-modal="isOpen = false"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useStatuses } from "~/composables/useStatuses";
import { useProjectEditTask } from "~/composables/components/project/useProjectEditTask";
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
} = useProjectEditTask(refProjectMembers, refProject);
</script>
