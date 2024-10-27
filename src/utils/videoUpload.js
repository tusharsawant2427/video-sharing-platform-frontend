// src/utils/videoUpload.js
import http from "@/http";

export const uploadVideoFile = async (identifier, videoFile, uploadProgress) => {
    const formData = new FormData();
    formData.append("video_file", videoFile);
  
    try {
      await http.post(`/posts/my-posts/${identifier}/upload-video`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (uploadProgress && uploadProgress.value !== undefined) {
            // Calculate and set upload progress
            uploadProgress.value = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            localStorage.setItem("upload_progress", uploadProgress.value); // Store progress
          }
        },
      });
      return true; // Indicate success
    } finally {
      // Reset progress after upload is complete
      if (uploadProgress) {
        uploadProgress.value = 0;
      }
      localStorage.removeItem("upload_progress"); // Clear progress from storage
    }
  };
  

export const handleFileChange = (event, videoFile, videoFileError) => {
  const files = event.target.files;
  if (files.length > 0) {
    videoFile.value = files[0];
    videoFileError.value = "";
  } else {
    videoFileError.value = "Video File is required";
  }
};
