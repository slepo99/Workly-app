<template>
  <UPage>
    <UBreadcrumb :items="getBreadcumbs(projectId)" />
    <div v-if="projectStore.project">
      <ProjectDetails
        :project="projectStore.project"
        :members="projectStore.projectMembers"
        :tasks="projectStore.projectTasks"
        class="mt-4"
      />
      <ProjectMembersTable
        :members="projectStore.projectMembers"
        :project-id="projectId"
        class="mt-4"
        @update-role="onUpdateMemberRole"
        @remove="triggerMemberRemove"
      />
      <TasksTasklistTable
        :tasks="projectStore.projectTasks"
        class="mt-4"
        @update-status="onUpdateTaskStatus"
        @edit-task="onEditTask"
        @delete="triggerTaskRemove"
      />
      <ProjectEditTask
        v-model:open="isTaskEditModalOpen"
        :project-members="projectStore.projectMembers"
        :task="projectStore.getTaskByTaskId"
      />
      <UModal
        v-model:open="isMmeberRemoveModalOpen"
        title="Remove member"
        description="Are you sure you want to remove project member ?"
        :close="false"
        :dismissible="!isMemberRemoving"
      >
        <template #body="{ close }">
          <div class="flex items-center justify-between">
            <UButton
              label="Cancel"
              color="neutral"
              variant="outline"
              :disabled="isMemberRemoving"
              @click="close"
            />
            <UButton
              :loading="isMemberRemoving"
              label="Remove"
              color="neutral"
              @click="onRemoveProjectMember"
            />
          </div>
        </template>
      </UModal>

      <UModal
        v-model:open="isTaskRemoveModalOpen"
        title="Remove task"
        description="Are you sure you want to remove project task ?"
        :close="false"
        :dismissible="!isTaskRemoving"
      >
        <template #body="{ close }">
          <div class="flex items-center justify-between">
            <UButton
              label="Cancel"
              color="neutral"
              variant="outline"
              :disabled="isTaskRemoving"
              @click="close"
            />
            <UButton
              :loading="isTaskRemoving"
              label="Remove"
              color="neutral"
              @click="onRemoveTask"
            />
          </div>
        </template>
      </UModal>
    </div>
  </UPage>
</template>

<script setup lang="ts">
import { useProjectStore } from "~/stores/project";
import { useProject } from "~/composables/pages/useProject";

const route = useRoute();
const projectStore = useProjectStore();

const projectId = computed(() => route.params.id as string);

const {
  onFirstLoadProject,
  onLoadProjectMembers,
  onLoadProjectTasks,
  getBreadcumbs,
  onUpdateMemberRole,
  onRemoveProjectMember,
  onUpdateTaskStatus,
  onEditTask,
  triggerMemberRemove,
  isTaskEditModalOpen,
  isMmeberRemoveModalOpen,
  isTaskRemoveModalOpen,
  isMemberRemoving,
  onRemoveTask,
  triggerTaskRemove,
  isTaskRemoving,
} = useProject(projectId);

await Promise.all([
  onFirstLoadProject(),
  onLoadProjectMembers(),
  onLoadProjectTasks(),
]);
</script>

<style scoped></style>
