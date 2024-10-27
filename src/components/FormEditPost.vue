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
    <DropzoneComponent
      @files-added="handleFilesAdded"
      @file-upload-success="handleFileUploadSuccess"
      id="videoDropZone"
      :identifier="identifier"
      :isEdit="true"
    />

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
    <div class="alert" :class="alertClass" role="alert">
      {{ alertMessage }}
    </div>
  </form>
</template>

<script>
import { ref, onMounted } from "vue";
import http from "@/http";
import { useRoute } from "vue-router";
import DropzoneComponent from "@/components/DropzoneComponent.vue";

export default {
  name: "EditPost",
  components: {
    DropzoneComponent,
  },
  setup() {
    const route = useRoute();
    const postId = route.params.postId;
    const post = ref({});
    const identifier = ref(null);
    const errorMessage = ref("");
    const titleError = ref("");
    const postBodyError = ref("");
    const uploadProgress = ref(0);
    const hasFileAdded = ref(false);
    const isLoading = ref(false);
    const alertClass = ref("alert-default");
    const alertMessage = ref("");
    const fetchPost = async () => {
      try {
        const response = await http.get(`/posts/my-posts/${postId}/edit`);
        post.value = response.data;
        identifier.value = post.value.identifier;
      } catch (error) {
        errorMessage.value = "Error fetching post data.";
      }
    };

    const validateForm = (post) => {
      titleError.value = "";
      postBodyError.value = "";
      if (post.value.title.length <= 0) {
        titleError.value = "Title is required";
        return false;
      }

      if (post.value.post_body.length <= 0) {
        postBodyError.value = "Post Body is required";
        return false;
      }
      return true;
    };

    const handleUpdate = async () => {
      errorMessage.value = "";
      titleError.value = "";
      postBodyError.value = "";
      isLoading.value = true;

      try {
        if (!validateForm(post)) {
          isLoading.value = false;
          return;
        }
        await http.put(`/posts/my-posts/${postId}/update`, {
          title: post.value.title,
          post_body: post.value.post_body,
        });
        alert("Post updated successfully.");
        isLoading.value = false;
      } catch (error) {
        isLoading.value = false;
        handlePostError(error);
      }
    };

    const handleFilesAdded = async () => {
      hasFileAdded.value = true;
      identifier.value = "";
      identifier.value = post.value.identifier;
    };

    const handleFileUploadSuccess = async () => {
      alertMessage.value = "Video Uploaded Successfully";
      alertClass.value = "alert-success";
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
      handleFilesAdded,
      uploadProgress,
      titleError,
      postBodyError,
      isLoading,
      hasFileAdded,
      identifier,
      handleFileUploadSuccess,
      alertClass,
      alertMessage,
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
