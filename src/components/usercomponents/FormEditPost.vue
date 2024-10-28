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
    @file-added="handleFilesAdded"
  />
</template>

<script>
import { ref, onMounted, computed } from "vue";
import http from "@/http";
import { useRoute } from "vue-router";
import PostForm from "./PostForm.vue";
import { useStore } from 'vuex'; 

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

    const handleUpdatePost = async (formData) => {
      try {
        await http.put(`/posts/my-posts/${postId}/update`, formData);
        store.dispatch('setAlert', { alertClass: 'alert-success', alertMessage: 'Post updated successfully' });
      } catch (error) {
        handlePostError(error);
      }
    };

    const handlePostError = (error) => {
      const alertClass = 'alert-danger';
      let alertMessage = "An unexpected error occurred.";
      if (error.response && error.response.data) {
        const status = error.response.status;
        alertMessage = status === 400 || status === 422
          ? extractErrorMessages(error.response.data.error)
          : alertMessage;
      } else {
        alertMessage = error.message || alertMessage;
      }
      store.dispatch('setAlert', { alertClass, alertMessage });
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
      identifier,
      handlePostError,
      initialTitle,
      initialPostBody,
    };
  },
};
</script>
