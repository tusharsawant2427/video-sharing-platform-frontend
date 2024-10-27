<template>
  <AppLayout>
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-md-9 col-lg-6 col-xl-5">
        <h2>Update Profile</h2>
        <AppProfileUpdateForm />
      </div>
    </div>
  </AppLayout>
</template>

<script>
import "../assets/css/login.css";
import AppProfileUpdateForm from "@/components/AppProfileUpdateForm.vue";
import AppLayout from "../components/AppLayout.vue";

export default {
  name: "CreatePost",
  components: {
    AppProfileUpdateForm,
    AppLayout,
  },
};
</script>
