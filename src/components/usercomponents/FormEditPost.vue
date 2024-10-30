<template>
  <PostForm
    :initialTitle="initialTitle"
    :initialPostBody="initialPostBody"
    :isEditMode="true"
    :postIdentifier="post.identifier"
    :alertClass="alertClass"
    :alertMessage="alertMessage"
    :disabled="disabled"
    submitButtonText="Update Post"
    @submitForm="handleUpdatePost"
    @file-added="handleFilesAdded"
  />
</template>

<script>
import { ref, onMounted, computed } from "vue";
import http from "@/http";
import { useRoute } from "vue-router";
import PostForm from "./PostForm.vue";
import { useStore } from "vuex";

const ALERT_SUCCESS = "alert-success";
const ALERT_DANGER = "alert-danger";

export default {
  components: {
    PostForm,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const postId = route.params.postId;
    const post = ref({ title: null, post_body: null });
    const alertClass = computed(() => store.state.alertClass);
    const alertMessage = computed(() => store.state.alertMessage);
    const initialTitle = ref(null);
    const initialPostBody = ref(null);
    const disabled = ref(true);

    const fetchPost = async () => {
      const response = await http.get(`/posts/my-posts/${postId}/edit`);
      post.value = response.data;
      post.value = response.data;
      initialTitle.value = post.value.title;
      initialPostBody.value = post.value.post_body;
      disabled.value = false;
    };

    const handleUpdatePost = async (formData) => {
      try {
        await http.put(`/posts/my-posts/${postId}/update`, formData);
        store.dispatch("setAlert", {
          alertClass: ALERT_SUCCESS,
          alertMessage: "Post updated successfully",
        });
        store.dispatch("setCanUpload", true);
      } catch (error) {
        handlePostError(error);
      }
    };

    const handlePostError = (error) => {
      const alertClass = ALERT_DANGER;
      let alertMessage = "An unexpected error occurred.";
      if (error.response && error.response.data) {
        const status = error.response.status;
        alertMessage =
          status === 400 || status === 422
            ? extractErrorMessages(error.response.data.error)
            : alertMessage;
      } else {
        alertMessage = error.message || alertMessage;
      }
      store.dispatch("setAlert", { alertClass, alertMessage });
    };

    const extractErrorMessages = (errors) => {
      return Object.values(errors).flat().join(", ");
    };

    onMounted(fetchPost);

    return {
      post,
      handleUpdatePost,
      alertClass,
      alertMessage,
      handlePostError,
      initialTitle,
      initialPostBody,
      disabled,
    };
  },
};
</script>
