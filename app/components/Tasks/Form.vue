<template>
  <UForm
    :state="form"
    :schema="schema"
    class="flex flex-col gap-4"
    @submit="emit('createTask')"
  >
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
        :items="selectStatusItems"
        value-key="value"
        label-key="label"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Task assignees" name="assigneeIds">
      <USelectMenu
        v-model="form.assigneeIds"
        :items="selectMembersItems"
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
        :disabled="isSaving"
        @click="emit('closeModal')"
      >
        Cancel
      </UButton>

      <UButton
        type="submit"
        icon="i-lucide-save"
        class="w-full justify-center sm:w-auto"
        :loading="isSaving"
        :disabled="isSaving"
      >
        {{ submitLabel }}
      </UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { ZodType } from "zod";
import type { TaskUpdateModel } from "~/composables/api/useTasksApi/types";

withDefaults(
  defineProps<{
    form: TaskUpdateModel;
    schema: ZodType;
    selectStatusItems: {
      label: string;
      value: TaskUpdateModel["status"];
    }[];
    selectMembersItems: {
      label: string;
      value: string;
      avatar?: {
        src: string;
        alt: string;
      };
    }[];
    isSaving: boolean;
    submitLabel?: string;
  }>(),
  {
    submitLabel: "Create task",
  },
);

const taskDates = defineModel<{
  start: string;
  end: string;
}>("taskDates", { required: true });

const emit = defineEmits<{
  createTask: [];
  closeModal: [];
}>();
</script>
