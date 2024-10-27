<template>
  <form @submit.prevent="handleUpdate">
    <div class="form-group">
      <label for="title">Post Title</label>
      <input type="text" class="form-control" id="title" v-model="post.title" />
      <div v-if="titleError" class="text-danger">{{ titleError }}</div>
    </div>
    <div class="form-group">
      <label for="postBody">Post Body</label>
      <textarea
        class="form-control"
        id="postBody"
        rows="3"
        v-model="post.post_body"
      ></textarea>
      <div v-if="postBodyError" class="text-danger">{{ postBodyError }}</div>
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
      <div v-if="errorMessage" class="text-danger">{{ errorMessage }}</div>
      <button
        type="submit"
        class="btn btn-primary btn-lg"
        :disabled="isLoading"
        style="padding-left: 2.5rem; padding-right: 2.5rem"
      >
        <span
          v-if="isLoading"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        <span v-if="uploadProgress > 0">Uploading...</span>
        <span v-else>Update Post</span>
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
import { ref, onMounted } from "vue";
import http from "@/http";
import { useRoute } from "vue-router";
import { uploadVideoFile, handleFileChange } from "@/utils/videoUpload";

export default {
  name: "EditPost",
  setup() {
    const route = useRoute();
    const postId = route.params.postId;
    const post = ref({});
    const errorMessage = ref("");
    const videoFile = ref(null);
    const titleError = ref("");
    const postBodyError = ref("");
    const uploadProgress = ref(0);
    const videoFileError = ref("");
    const isLoading = ref(false);

    const fetchPost = async () => {
      try {
        const response = await http.get(`/posts/my-posts/${postId}/edit`);
        post.value = response.data;
      } catch (error) {
        errorMessage.value = "Error fetching post data.";
      }
    };

    const handleUpdate = async () => {
      errorMessage.value = "";
      titleError.value = "";
      postBodyError.value = "";
      isLoading.value = true;

      if (post.value.title.length === 0) {
        titleError.value = "Title is required";
        isLoading.value = false;
        return;
      }

      if (post.value.post_body.length === 0) {
        postBodyError.value = "Post Body is required";
        isLoading.value = false;
        return;
      }

      if (post.value.title && post.value.post_body) {
        try {
          await http.put(`/posts/my-posts/${postId}/update`, {
            title: post.value.title,
            post_body: post.value.post_body,
          });
          if (videoFile.value) {
            const fileUploadResponse = await uploadVideoFile(
              post.value.identifier,
              videoFile.value,
              uploadProgress
            );
            if (fileUploadResponse) {
              alert("Video Uploaded Successfully.");
            }
          }
          videoFile.value = null;
          uploadProgress.value = 0;
          isLoading.value = false;
        } catch (error) {
          isLoading.value = false;
          handlePostError(error);
        }
      } else {
        errorMessage.value = "All Field Required";
        isLoading.value = false;
        return;
      }
    };

    const handleFileUpload = (event) => {
      handleFileChange(event, videoFile, videoFileError);
    };

    const handlePostError = (error) => {
      if (error.response && error.response.data) {
        const status = error.response.status;
        if (status === 400 || status === 422) {
          errorMessage.value = extractErrorMessages(error.response.data.error);
        } else {
          errorMessage.value = "An unexpected error occurred.";
        }
      } else {
        errorMessage.value = error.message || "An unexpected error occurred.";
      }
    };

    const extractErrorMessages = (errors) => {
      return Object.values(errors).flat().join(", ");
    };

    onMounted(fetchPost);

    return {
      post,
      handleUpdate,
      errorMessage,
      handleFileUpload,
      uploadProgress,
      titleError,
      postBodyError,
      isLoading,
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
label {
  padding: 2px;
}
</style>
