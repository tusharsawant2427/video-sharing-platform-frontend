<template>
  <PostForm
    :initialTitle="title"
    :initialPostBody="postBody"
    :alertClass="alertClass"
    :alertMessage="alertMessage"
    :postIdentifier="identifier"
    submitButtonText="Create Post"
    @submitForm="handleCreatePost"
  />
</template>

<script>
import { computed, ref } from "vue";
import http from "@/http";
import PostForm from "./PostForm.vue";
import { useStore } from "vuex";
const ALERT_DANGER = 'alert-danger';
const ALERT_INFO = 'alert-success';

export default {
  components: {
    PostForm,
  },
  setup() {
    const store = useStore();
    const title = ref("");
    const postBody = ref("");
    const alertClass = computed(() => store.state.alertClass);
    const alertMessage = computed(() => store.state.alertMessage);
    const identifier = ref(null);

    const handleCreatePost = async (formData) => {
      try {
        const response = await http.post("/posts/my-posts/create", formData);
        identifier.value = response.data.identifier;
        store.dispatch("setAlert", {
          alertClass: ALERT_INFO,
          alertMessage:
            "Post created successfully! Video Uploading In-Progress",
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

    return {
      title,
      postBody,
      handleCreatePost,
      handlePostError,
      alertClass,
      alertMessage,
      identifier,
    };
  },
};
</script>
