<template>
  <UModal v-model:open="isOpen" title="Edit task" @enter="resetForm">
    <slot name="trigger" />

    <template #body>
      <UForm
        :state="form"
        :schema="schema"
        class="flex flex-col gap-4"
        @submit="saveProject"
      >
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
          <UFileUpload
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
import { useNewProjectModal } from "~/composables/components/projects/useNewProjectModal";
import { useStatuses } from "~/composables/useStatuses";

const isOpen = defineModel<boolean>("open", { default: false });

const { resetForm, saveProject, isSaving, form, schema } =
  useNewProjectModal(isOpen);

const { getProjectStatuses } = useStatuses();
</script>

<style scoped></style>
