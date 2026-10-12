<template>
  <UModal v-model:open="isOpen" title="Create task" @after:leave="resetForm">
    <UButton
      label="Create task"
      icon="i-lucide-plus"
      color="secondary"
      class="min-w-0 cursor-pointer justify-center"
    />

    <template #body>
      <TasksForm
        v-model:task-dates="taskDates"
        :form="form"
        :schema="schema"
        :select-status-items="getTaskStatuses"
        :select-members-items="memberItems"
        :is-saving="isSaving"
        @create-task="createTask"
        @close-modal="isOpen = false"
      />
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
