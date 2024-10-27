<template>
  <AppLayout>
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-md-9 col-lg-6 col-xl-5">
        <div class="container mt-5">
          <h2>Create Post</h2>
          <FormPost />
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import "../assets/css/login.css";
import AppLayout from "../components/AppLayout.vue";
import FormPost from "../components/FormPost.vue";

export default {
  name: "CreatePost",
  components: {
    FormPost,
    AppLayout,
  },
};
</script>
