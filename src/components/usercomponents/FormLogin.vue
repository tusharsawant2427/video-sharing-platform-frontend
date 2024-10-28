<template>
  <form @submit.prevent="handleSubmit">
    <!-- Email input -->
    <div class="form-outline mb-4">
      <input
        type="email"
        id="email"
        class="form-control form-control-lg"
        placeholder="Email address"
        v-model="email"
      />
      <div v-if="emailError" class="text-danger">{{ emailError }}</div>
    </div>

    <div class="form-outline mb-3">
      <input
        type="password"
        id="password"
        class="form-control form-control-lg"
        placeholder="Enter password"
        v-model="password"
      />
      <div v-if="passwordError" class="text-danger">{{ passwordError }}</div>
    </div>

    <div class="d-flex justify-content-between align-items-center">
      <div class="form-check mb-0">
        <input class="form-check-input me-2" type="checkbox" id="rememberMe" />
        <label class="form-check-label" for="rememberMe"> Remember me </label>
      </div>
    </div>

    <div class="text-center text-lg-start mt-4 pt-2">
      <div v-if="loginError" class="text-danger">{{ loginError }}</div>
      <button
        type="submit"
        class="btn btn-primary btn-lg"
        :disabled="isLoading"
        style="padding-left: 2.5rem; padding-right: 2.5rem"
      >
        <LoadingSpinner :isLoading="isLoading" /> Login
      </button>
      <p class="small fw-bold mt-2 pt-1 mb-0">
        Don't have an account?
        <a href="/register" class="link-danger">Register</a>
      </p>
    </div>
  </form>
</template>

<script>
import http from "@/http";
import router from "@/router";
import { ref } from "vue";
import LoadingSpinner from "../common/LoadingSpinner.vue";

export default {
  components: {
    LoadingSpinner,
  },
  setup() {
    const email = ref("");
    const password = ref("");
    const emailError = ref("");
    const passwordError = ref("");
    const loginError = ref("");
    const isLoading = ref(false);

    const validateEmail = (emailValue) => {
      const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return reg.test(emailValue);
    };

    const handleSubmit = async () => {
      isLoading.value = true;
      emailError.value = "";
      passwordError.value = "";
      loginError.value = "";

      if (!validateEmail(email.value)) {
        emailError.value = "Please enter a valid email address.";
        isLoading.value = false;
        return;
      }

      if (password.value.length < 6) {
        passwordError.value = "Password must be at least 6 characters long.";
        isLoading.value = false;
        return;
      }

      try {
        const response = await http.post("/users/login", {
          email: email.value,
          password: password.value,
        });
        localStorage.setItem("jwtToken", response.data.token);
        router.push("/");
      } catch (error) {
        loginError.value = error.response?.data?.message || "Login failed.";
      } finally {
        isLoading.value = false;
      }
    };

    return {
      email,
      password,
      emailError,
      passwordError,
      loginError,
      handleSubmit,
      isLoading,
    };
  },
};
</script>

<style>
.bd-placeholder-img {
  font-size: 1.125rem;
  text-anchor: middle;
  user-select: none;
}

@media (min-width: 768px) {
  .bd-placeholder-img-lg {
    font-size: 3.5rem;
  }
}
</style>
