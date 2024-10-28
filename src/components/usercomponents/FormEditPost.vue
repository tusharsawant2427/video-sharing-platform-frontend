<template>
  <PostForm
    :initialTitle="initialTitle"
    :initialPostBody="initialPostBody"
    :isEditMode="true"
    :postIdentifier="post.identifier"
    :alertClass="alertClass"
    :alertMessage="alertMessage"
    submitButtonText="Update Post"
    @submitForm="handleUpdatePost"
    @file-upload-success-message="handleFileUploadSuccess"
    @file-added="handleFilesAdded"
  />
</template>

<script>
import { ref, onMounted } from "vue";
import http from "@/http";
import { useRoute } from "vue-router";
import PostForm from "./PostForm.vue";

export default {
  components: {
    PostForm,
  },
  setup() {
    const route = useRoute();
    const postId = route.params.postId;
    const post = ref({ title: null, post_body: null });
    const alertClass = ref("alert-default");
    const alertMessage = ref("");
    const identifier = ref(postId);
    const initialTitle = ref(null);
    const initialPostBody = ref(null);
    const fetchPost = async () => {
      const response = await http.get(`/posts/my-posts/${postId}/edit`);
      post.value = response.data;
      post.value = response.data;
      initialTitle.value = post.value.title;
      initialPostBody.value = post.value.post_body;
    };

    const handleFilesAdded = () => {
      console.log("file added");
    };

    const handleUpdatePost = async (formData) => {
      try {
        await http.put(`/posts/my-posts/${postId}/update`, formData);
        alertClass.value = "alert-success";
        alertMessage.value = "Post updated successfully";
      } catch (error) {
        handlePostError(error);
      }
    };

    const handlePostError = (error) => {
      alertClass.value = "alert-danger";
      if (error.response && error.response.data) {
        const status = error.response.status;
        alertMessage.value =
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

    onMounted(fetchPost);

    return {
      post,
      handleUpdatePost,
      handleFileUploadSuccess,
      alertClass,
      alertMessage,
      identifier,
      handlePostError,
      initialTitle,
      initialPostBody,
      handleFilesAdded,
    };
  },
};
</script>
