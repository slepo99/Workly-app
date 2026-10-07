<template>
  <UModal
    v-model:open="isOpen"
    title="Edit project"
    description="Update project information"
    @after:leave="resetForm"
  >
    <UButton
      class="min-w-0 justify-center !bg-transparent !text-primary hover:!bg-primary/10"
      variant="outline"
      icon="i-lucide-edit-2"
    >
      Edit Project
    </UButton>

    <template #body>
      <UForm :state="form" class="flex flex-col gap-4" @submit="saveProject">
        <UFormField label="Project name" name="name" required>
          <UInput
            v-model="form.name"
            placeholder="Project name"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Description" name="description">
          <UTextarea
            v-model="form.description"
            placeholder="Project description"
            autoresize
            class="w-full"
          />
        </UFormField>

        <UFormField label="Status" name="status" required>
          <USelect
            v-model="form.status"
            :items="getProjectStatuses"
            value-key="value"
            label-key="label"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Project image" name="image">
          <div
            v-if="project.image && !isImageRemoved"
            class="relative overflow-hidden rounded-xl"
          >
            <img
              :src="project.image"
              :alt="project.name"
              class="h-40 w-full object-cover"
            />

            <UButton
              type="button"
              icon="i-lucide-trash-2"
              color="error"
              size="sm"
              class="absolute right-2 top-2"
              @click="isImageRemoved = true"
            >
              Remove image
            </UButton>
          </div>
          <UFileUpload
            v-else
            v-model="form.image"
            accept="image/png,image/jpeg,image/webp"
            icon="i-lucide-image"
            label="Drop project image here"
            description="or click to select"
            class="min-h-40 w-full"
          />
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
            Save changes
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";
import { useStatuses } from "~/composables/useStatuses";
import { useProjectEdit } from "~/composables/components/project/useProjectEdit";
const props = defineProps<{
  project: ProjectModel;
}>();

const { getProjectStatuses } = useStatuses();

const { isOpen, isSaving, isImageRemoved, form, resetForm, saveProject } =
  useProjectEdit(props.project);
</script>
