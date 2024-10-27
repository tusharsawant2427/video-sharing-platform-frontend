<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="title">Post Title</label>
      <input
        type="text"
        class="form-control"
        id="title"
        name="title"
        placeholder="Post Title"
        v-model="title"
      />
      <div v-if="titleError" class="text-danger">{{ titleError }}</div>
    </div>
    <div class="form-group">
      <label for="postBody">Post Body</label>
      <textarea
        class="form-control"
        id="postBody"
        rows="3"
        v-model="postBody"
      ></textarea>
      <div v-if="postBodyError" class="text-danger">
        {{ postBodyError }}
      </div>
    </div>
    <div class="form-group">
      <label for="videoFile">Video File</label>
      <input
        type="file"
        class="form-control-file"
        id="videoFile"
        @change="handleFileUpload"
        accept="video/*"
      />
      <div v-if="videoFileError" class="text-danger">
        {{ videoFileError }}
      </div>
    </div>

    <div class="text-center mt-4">
      <div v-if="postError" class="text-danger">{{ postError }}</div>
      <button
        type="submit"
        class="btn btn-primary btn-lg"
        :disabled="uploadProgress > 0"
        style="padding-left: 2.5rem; padding-right: 2.5rem"
      >
        <span v-if="uploadProgress > 0">Uploading...</span>
        <span v-else>Create Post</span>
      </button>
    </div>

    <div v-if="uploadProgress > 0" class="progress mt-3">
      <div
        class="progress-bar"
        role="progressbar"
        :style="{ width: uploadProgress + '%' }"
        aria-valuenow="uploadProgress"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        {{ uploadProgress }}%
      </div>
    </div>
  </form>
</template>

<script>
import { ref } from "vue";
import http from "@/http";
import { uploadVideoFile, handleFileChange } from "@/utils/videoUpload";

export default {
  setup() {
    const title = ref("");
    const postBody = ref("");
    const videoFile = ref(null);
    const videoFileError = ref("");
    const titleError = ref("");
    const postBodyError = ref("");
    const postError = ref("");
    const uploadProgress = ref(0);
    const isLoading = ref(false);
    const identifier = ref(null);

    const handleSubmit = async () => {
      titleError.value = "";
      postBodyError.value = "";
      videoFileError.value = "";
      postError.value = "";
      isLoading.value = true;
      if (title.value.length === 0) {
        titleError.value = "Title is required";
        isLoading.value = false;
        return;
      }

      if (postBody.value.length === 0) {
        postBodyError.value = "Post Body is required";
        isLoading.value = false;
        return;
      }

      if (videoFile.value == null) {
        videoFileError.value = "Video File is required";
        isLoading.value = false;
        return;
      }

      if (title.value && postBody.value && videoFile.value) {
        try {
          const response = await http.post("/posts/my-posts/create", {
            title: title.value,
            post_body: postBody.value,
          });
          identifier.value = response.data.identifier;
          const fileUploadResponse = await uploadVideoFile(
            identifier.value,
            videoFile.value,
            uploadProgress
          );
          if (fileUploadResponse) {
            alert("Video Uploaded Successfully.");
          }

          title.value = "";
          postBody.value = "";
          videoFile.value = null;
          isLoading.value = false;
          uploadProgress.value = 0;
        } catch (error) {
          isLoading.value = false;
          handlePostError(error);
        }
      }else{
        isLoading.value = false;
        postError.value = "All Field Required";
      }
    };

    const handlePostError = (error) => {
      if (error.response && error.response.data) {
        const status = error.response.status;
        if (status === 400 || status === 422) {
          postError.value = extractErrorMessages(error.response.data.error);
        } else {
          postError.value = "An unexpected error occurred.";
        }
      } else {
        postError.value = error.message || "An unexpected error occurred.";
      }
    };

    const extractErrorMessages = (errors) => {
      return Object.values(errors).flat().join(", ");
    };

    const handleFileUpload = (event) => {
      handleFileChange(event, videoFile, videoFileError);
    };

    return {
      title,
      postBody,
      titleError,
      postBodyError,
      postError,
      videoFileError,
      uploadProgress,
      handleSubmit,
      handleFileUpload,
      extractErrorMessages,
      isLoading
    };
  },
};
</script>

<style>
.text-danger {
  color: red;
}
.progress {
  height: 20px;
}
.form-group {
  padding: 10px;
}
label{
  padding: 2px;
}
</style>
