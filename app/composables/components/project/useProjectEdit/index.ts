import type { ProjectModel } from "~/composables/api/useProjectsApi/types";
import {
  type ProjectStatus,
  PROJECT_STATUSES,
} from "~/constants/projectStatuses";
import { useProjectStore } from "~/stores/project";
import { z } from "zod";

export function useProjectEdit(project: Ref<ProjectModel>) {
  const projectStore = useProjectStore();

  const isOpen = ref(false);
  const isSaving = ref(false);
  const isImageRemoved = ref(false);
  const toast = useToast();
  const form = reactive<{
    name: string;
    description: string;
    status: ProjectStatus;
    image: File | null;
  }>({
    name: project.value.name,
    description: project.value.description,
    status: project.value.status as ProjectStatus,
    image: null,
  });

  function resetForm() {
    form.name = project.value.name;
    form.description = project.value.description;
    form.status = project.value.status as ProjectStatus;
    form.image = null;
    isImageRemoved.value = false;
  }

  async function saveProject() {
    const { updateProject } = useProjectsApi();
    const { uploadFile, deleteFile } = useUploadsApi();

    let uploadedImagePath: string | null = null;

    try {
      isSaving.value = true;

      let imageUrl: string | null = project.value.image;

      if (form.image) {
        const uploadedImage = await uploadFile(form.image);

        imageUrl = uploadedImage.url;
        uploadedImagePath = uploadedImage.path;
      } else if (isImageRemoved.value) {
        imageUrl = null;
      }

      await updateProject(project.value.id, {
        name: form.name,
        description: form.description,
        status: form.status,
        image: imageUrl,
      });

      await projectStore.loadProjectById(project.value.id);

      toast.add({
        title: "Project updated",
        description: "Project has been successfully updated.",
        color: "success",
      });
      isOpen.value = false;
    } catch (error) {
      if (uploadedImagePath) {
        try {
          await deleteFile(uploadedImagePath);
        } catch (deleteError) {
          console.error("Failed to delete uploaded image:", deleteError);
        }
      }

      console.error("Failed to update project:", error);

      toast.add({
        title: "Failed to update project",
        description: "Please try again.",
        color: "error",
      });
    } finally {
      isSaving.value = false;
    }
  }
  const projectStatusSchema = z.enum(
    Object.values(PROJECT_STATUSES) as [ProjectStatus, ...ProjectStatus[]],
  );
  const schema = z.object({
    name: z
      .string()
      .min(1, "Project name is required")
      .max(150, "Project name is too long"),

    description: z.string().max(1000, "Description is too long"),

    status: projectStatusSchema,

    image: z.custom<File | null>(
      (value) =>
        value === null ||
        (typeof File !== "undefined" && value instanceof File),
      {
        message: "Invalid image file",
      },
    ),
  });
  return {
    isOpen,
    isSaving,
    isImageRemoved,
    form,
    resetForm,
    saveProject,
    schema,
  };
}
