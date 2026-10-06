import type { UploadFileResponseModel } from "./types";

export function useUploadsApi() {
  const { $api } = useNuxtApp();

  enum API {
    POST_IMAGE = "/uploads/image",
  }

  const uploadFile = (file: File): Promise<UploadFileResponseModel> => {
    const formData = new FormData();

    formData.append("file", file);

    return $api<UploadFileResponseModel>(API.POST_IMAGE, {
      method: "POST",
      body: formData,
    });
  };
  const deleteFile = (path: string ) => {
    return $api(API.POST_IMAGE, {
        method: "DELETE",
        body: path
    })
  };
  return {
    uploadFile,
    deleteFile
  };
}
