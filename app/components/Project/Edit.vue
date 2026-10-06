<template>
  <UModal
    v-model:open="isOpen"
    title="Edit project"
    description="Update project information"
    @after:leave="onFormClose"
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
            :items="statusItems"
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
import type { UploadFileResponseModel } from "~/composables/api/useUploadsApi/types";
import {
  PROJECT_STATUSES,
  type ProjectStatus,
} from "~/constants/projectStatuses";
import { useProjectStore } from "~/stores/project";

const props = defineProps<{
  project: ProjectModel;
}>();

const projectStore = useProjectStore();

const isOpen = ref(false);
const isSaving = ref(false);
const isImageRemoved = ref(false);
const statusItems = [
  {
    label: "Active",
    value: PROJECT_STATUSES.ACTIVE,
  },
  {
    label: "On hold",
    value: PROJECT_STATUSES.ON_HOLD,
  },
  {
    label: "Completed",
    value: PROJECT_STATUSES.COMPLETED,
  },
];

const form = reactive<{
  name: string;
  description: string;
  status: ProjectStatus;
  image: File | null;
}>({
  name: props.project.name,
  description: props.project.description,
  status: props.project.status as ProjectStatus,
  image: null,
});

function resetForm() {
  form.name = props.project.name;
  form.description = props.project.description;
  form.status = props.project.status as ProjectStatus;
  form.image = null;
  isImageRemoved.value = false
}

function onFormClose() {
  resetForm();
}

async function saveProject() {
  try {
    isSaving.value = true;
    let imageUrl: string | null = props.project.image

    if (form.image) {
      const { uploadFile } = useUploadsApi();
      const uploadedImage = await uploadFile(form.image);
      imageUrl = uploadedImage.url;
    } else if (isImageRemoved.value) {
      imageUrl = null
    }

    await projectStore.updateProject(props.project.id, {
      name: form.name,
      description: form.description,
      status: form.status,
      image: imageUrl,
    });

    isOpen.value = false;
  } finally {
    isSaving.value = false;
  }
}
</script>
