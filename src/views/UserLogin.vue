<template>
  <AppLayout>
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-md-9 col-lg-6 col-xl-5">
        <img
          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          class="img-fluid"
          alt="Sample image"
        />
      </div>
      <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
        <div
          class="d-flex flex-row align-items-center justify-content-center justify-content-lg-start"
        >
          <p class="lead fw-normal mb-0 me-3 text-centre">Login</p>
        </div>

        <div class="divider d-flex align-items-center my-4">
        </div>
        <FormLogin />
      </div>
    </div>
  </AppLayout>
</template>

<script>
import "../assets/css/login.css";
import AppLayout from "../components/AppLayout.vue";
import FormLogin from "../components/FormLogin.vue";

export default {
  name: "UserLogin",
  components: {
    FormLogin,
    AppLayout,
  },
};
</script>
