<template>
  <AppLayout>
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-md-9 col-lg-6 col-xl-5">
        <div class="container mt-5">
          <h2>Edit Post</h2>
          <FormEditPost />
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import FormEditPost from "@/components/usercomponents/FormEditPost.vue";
import "../../assets/css/login.css";
import AppLayout from "../../components/AppLayout.vue";

export default {
  name: "EditPost",
  components: {
    FormEditPost,
    AppLayout,
  },
};
</script>
