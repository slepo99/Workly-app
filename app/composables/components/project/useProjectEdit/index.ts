import type { ProjectModel } from "~/composables/api/useProjectsApi/types";
import { type ProjectStatus } from "~/constants/projectStatuses";
import { useProjectStore } from "~/stores/project";

export function useProjectEdit(project: ProjectModel) {
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
    name: project.name,
    description: project.description,
    status: project.status as ProjectStatus,
    image: null,
  });

  function resetForm() {
    form.name = project.name;
    form.description = project.description;
    form.status = project.status as ProjectStatus;
    form.image = null;
    isImageRemoved.value = false;
  }

  async function saveProject() {
    const { updateProject } = useProjectsApi();
    const { uploadFile, deleteFile } = useUploadsApi();

    let uploadedImagePath: string | null = null;

    try {
      isSaving.value = true;

      let imageUrl: string | null = project.image;

      if (form.image) {
        const uploadedImage = await uploadFile(form.image);

        imageUrl = uploadedImage.url;
        uploadedImagePath = uploadedImage.path;
      } else if (isImageRemoved.value) {
        imageUrl = null;
      }

      await updateProject(project.id, {
        name: form.name,
        description: form.description,
        status: form.status,
        image: imageUrl,
      });

      await projectStore.loadProjectById(project.id);

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

  return {
    isOpen,
    isSaving,
    isImageRemoved,
    form,
    resetForm,
    saveProject,
  };
}
