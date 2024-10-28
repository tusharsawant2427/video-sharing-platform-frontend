<template>
  <PostForm
    :initialTitle="title"
    :initialPostBody="postBody"
    :alertClass="alertClass"
    :alertMessage="alertMessage"
    :postIdentifier = "identifier"
    submitButtonText="Create Post"
    @submitForm="handleCreatePost"
    @file-upload-success-message="handleFileUploadSuccess"
  />
</template>

<script>
import { ref } from "vue";
import http from "@/http";
import PostForm from "./PostForm.vue";

export default {
  components: {
    PostForm,
  },
  setup() {
    const title = ref("");
    const postBody = ref("");
    const alertClass = ref("alert-default");
    const alertMessage = ref("");
    const identifier = ref(null);
    
    const handleCreatePost = async (formData) => {
      try {
        const response = await http.post("/posts/my-posts/create", formData);
        identifier.value = response.data.identifier;
        alertClass.value = "alert-success";
        alertMessage.value = "Post created successfully! Video Uploading In-Progress";
      } catch (error) {
        handlePostError(error);
      }
    };

    const handlePostError = (error) => {
      alertClass.value = "alert-danger";
      if (error.response && error.response.data) {
        const status = error.response.status;
        alertMessage.value  =
          status === 400 || status === 422
            ? extractErrorMessages(error.response.data.error)
            : "An unexpected error occurred.";
      } else {
        alertMessage.value = error.message || "An unexpected error occurred.";
      }
    };

    
    const handleFileUploadSuccess = () => {
      alertMessage.value = "Video Uploaded Successfully";
      alertClass.value = "alert-success";
    };

    const extractErrorMessages = (errors) => {
      return Object.values(errors).flat().join(", ");
    };

    return {
      title,
      postBody,
      handleCreatePost,
      handlePostError,
      handleFileUploadSuccess,
      alertClass,
      alertMessage,
      identifier
    };
  },
};
</script>
