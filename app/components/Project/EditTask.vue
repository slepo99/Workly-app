<template>
  <UModal
    v-model:open="isOpen"
    title="Create task"
    @enter="resetForm"

  >
    <slot name="trigger"> </slot>

    <template #body>
      <TasksForm
        v-model:task-dates="taskDates"
        :form="form"
        :schema="schema"
        :select-status-items="getTaskStatuses"
        :select-members-items="memberItems"
        :is-saving="isSaving"
        submitLabel="Edit task"
        @create-task="editTask"
        @close-modal="isOpen = false"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useStatuses } from "~/composables/useStatuses";
import { useProjectEditTask } from "~/composables/components/project/useProjectEditTask";
import type { ProjectMemberModel } from "~/composables/api/useProjectMembersApi/types";
import type { TasksModel } from "~/composables/api/useTasksApi/types";
const props = defineProps<{
  projectMembers: ProjectMemberModel[];
  task: TasksModel | null;
}>();



const isOpen = defineModel<boolean>("open", { default: false });
const { getTaskStatuses } = useStatuses();
const refTask = toRef(props, "task");
const refProjectMembers = toRef(props, "projectMembers");

const { memberItems, form, isSaving, resetForm, editTask, taskDates, schema } =
  useProjectEditTask(refProjectMembers, refTask, isOpen);
console.log("edit component created");
</script>
