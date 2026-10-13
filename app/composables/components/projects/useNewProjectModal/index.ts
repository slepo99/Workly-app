import type { CreateProjectModel } from "~/composables/api/useProjectsApi/types";
import { PROJECT_STATUSES } from "~/constants/projectStatuses";
import type { ProjectStatus } from "~/constants/projectStatuses";
import { z } from "zod";
import { useProjectsApi } from "#imports";
import { useToast } from "#imports";
import { useProjectsStore } from "~/stores/projects";

export function useNewProjectModal(isOpen: Ref<boolean>) {
  const projectsStore = useProjectsStore();

  const isSaving = ref(false);
  const toast = useToast();

  function resetForm() {
    form.name = "";
    form.description = "";
    form.status = PROJECT_STATUSES.ACTIVE as ProjectStatus;
    form.image = null;
  }

  const form = reactive<{
    name: string;
    description: string;
    status: ProjectStatus;
    image: File | null;
  }>({
    name: "",
    description: "",
    status: PROJECT_STATUSES.ACTIVE as ProjectStatus,
    image: null,
  });

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

  async function saveProject() {
    if (isSaving.value) return;

    const { createProject } = useProjectsApi();
    const { uploadFile, deleteFile } = useUploadsApi();

    let imagePath: string | null = null;
    let imageUrl: string | null = null;

    isSaving.value = true;
    try {
      if (form.image) {
        const uploadedImage = await uploadFile(form.image);

        imageUrl = uploadedImage.url;
        imagePath = uploadedImage.path;
      }
      await createProject({
        name: form.name,
        description: form.description,
        status: form.status,
        image: imageUrl,
      });
    } catch (error) {
      if (imagePath) {
        await deleteFile(imagePath).catch((deleteError) => {
          console.error("Failed to delete uploaded image:", deleteError);
        });
      }

      console.error("Failed to create project:", error);

      toast.add({
        title: "Failed to create project",
        description: "Please try again.",
        color: "error",
      });

      return;
    } finally {
      isSaving.value = false;
    }
    isOpen.value = false;

    toast.add({
      title: "Project created",
      description: "Project has been successfully created.",
      color: "success",
    });

    try {
      await projectsStore.loadProjects();
    } catch (error) {
      console.error("Failed to refresh projects:", error);

      toast.add({
        title: "Failed to refresh projects",
        color: "warning",
      });
    }
  }
  return {
    resetForm,
    saveProject,
    isSaving,
    form,
    schema,
  };
}
