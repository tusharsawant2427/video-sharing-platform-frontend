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
      <div v-if="postBodyError" class="text-danger">{{ postBodyError }}</div>
    </div>

    <DropzoneComponent
      @files-added="handleFilesAdded"
      @file-upload-success="handleFileUploadSuccess"
      :identifier="identifier"
    />
    <div v-if="videoFileError" class="text-danger">{{ videoFileError }}</div>

    <div class="text-center mt-4">
      <div v-if="postError" class="text-danger">{{ postError }}</div>
      <button
        type="submit"
        class="btn btn-primary btn-lg"
        :disabled="isLoading"
        style="padding-left: 2.5rem; padding-right: 2.5rem"
      >
        <span v-if="isLoading">Creating...</span>
        <span v-else>Create Post</span>
      </button>
    </div>
    <div class="alert" :class="alertClass" role="alert">
      {{ alertMessage }}
    </div>
  </form>
</template>

<script>
import { ref } from "vue";
import http from "@/http";
import DropzoneComponent from "@/components/DropzoneComponent.vue";

export default {
  components: {
    DropzoneComponent,
  },
  setup() {
    const title = ref("");
    const postBody = ref("");
    const identifier = ref(null);
    const titleError = ref("");
    const postBodyError = ref("");
    const videoFileError = ref("");
    const postError = ref("");
    const isLoading = ref(false);
    const hasFileAdded = ref(false);
    const alertClass = ref("alert-default");
    const alertMessage = ref("");
    const validateForm = () => {
      titleError.value = "";
      postBodyError.value = "";

      if (title.value.length === 0) {
        titleError.value = "Title is required";
        return false;
      }

      if (postBody.value.length === 0) {
        postBodyError.value = "Post Body is required";
        return false;
      }

      if (!hasFileAdded.value) {
        videoFileError.value = "Please select video";
        return false;
      }

      return true;
    };

    const handleSubmit = async () => {
      isLoading.value = true;

      if (!validateForm()) {
        isLoading.value = false;
        return;
      }

      try {
        const response = await http.post("/posts/my-posts/create", {
          title: title.value,
          post_body: postBody.value,
        });
        identifier.value = response.data.identifier;
        alertMessage.value =
          "Post created successfully! Video uploading is in-progress";
        alertClass.value = "alert-info";
        resetForm();
      } catch (error) {
        isLoading.value = false;
        handlePostError(error);
      }
    };

    const handleFilesAdded = async () => {
      hasFileAdded.value = true;
    };

    const handleFileUploadSuccess = async () => {
      alertMessage.value = "Video Uploaded Successfully";
      alertClass.value = "alert-success";
    };

    const handlePostError = (error) => {
      if (error.response && error.response.data) {
        const status = error.response.status;
        postError.value =
          status === 400 || status === 422
            ? extractErrorMessages(error.response.data.error)
            : "An unexpected error occurred.";
      } else {
        postError.value = error.message || "An unexpected error occurred.";
      }
    };

    const extractErrorMessages = (errors) => {
      return Object.values(errors).flat().join(", ");
    };

    const resetForm = () => {
      title.value = "";
      postBody.value = "";
      isLoading.value = false;
    };

    return {
      title,
      postBody,
      titleError,
      postBodyError,
      postError,
      isLoading,
      identifier,
      handleSubmit,
      handleFilesAdded,
      hasFileAdded,
      videoFileError,
      handleFileUploadSuccess,
      alertClass,
      alertMessage,
    };
  },
};
</script>

<style>
/* Your existing styles */
</style>
