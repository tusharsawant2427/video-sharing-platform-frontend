<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-outline mb-4">
      <input
        type="text"
        id="name"
        class="form-control form-control-lg"
        placeholder="Full name"
        v-model="name"
      />
      <div v-if="nameError" class="text-danger">{{ nameError }}</div>
    </div>

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

    <div class="text-center text-lg-start mt-4 pt-2">
      <div v-if="registrationError" class="text-danger">
        {{ registrationError }}
      </div>

      <button
        type="submit"
        class="btn btn-primary btn-lg"
        style="padding-left: 2.5rem; padding-right: 2.5rem"
        :disabled="isLoading"
      >
        <LoadingSpinner :isLoading="isLoading" />
        Register
      </button>

      <p class="small fw-bold mt-2 pt-1 mb-0">
        Already have an account
        <a href="/login" class="link-danger">Login</a>
      </p>
    </div>
  </form>
</template>

<script>
import { ref } from "vue";
import http from "@/http";
import router from "@/router";
import LoadingSpinner from "../common/LoadingSpinner.vue";
import "../../assets/css/login.css";

export default {
  components: { LoadingSpinner },

  setup() {
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const nameError = ref("");
    const emailError = ref("");
    const passwordError = ref("");
    const registrationError = ref("");
    const isLoading = ref(false);

    const validateEmail = (emailValue) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

    const validateFields = () => {
      nameError.value = name.value ? "" : "Name Required";
      emailError.value = validateEmail(email.value)
        ? ""
        : "Please enter valid email address.";
      passwordError.value =
        password.value.length >= 6
          ? ""
          : "Password must be at least 6 characters long.";

      return !nameError.value && !emailError.value && !passwordError.value;
    };

    const handleSubmit = async () => {
      isLoading.value = true;
      registrationError.value = "";
      console.log(validateFields());
      if (!validateFields()) {
        registrationError.value = "All fields are required.";
        isLoading.value = false;
        return;
      }

      try {
        const response = await http.post("/users/register", {
          email: email.value,
          password: password.value,
          name: name.value,
        });
        localStorage.setItem("jwtToken", response.data.token);
        router.push("/my-posts");
      } catch (error) {
        handleError(error);
      } finally {
        isLoading.value = false;
      }
    };

    const handleError = (error) => {
      if (error.response) {
        const status = error.response.status;
        registrationError.value = extractErrorMessages(
          error.response.data.error || {}
        );
        if (status === 422) {
          registrationError.value =
            error.response.data.data || "An unexpected error occurred.";
        }
      } else {
        registrationError.value =
          error.message || "An unexpected error occurred.";
      }
    };

    const extractErrorMessages = (errors) => {
      return Object.values(errors).flat().join(", ");
    };

    return {
      name,
      email,
      password,
      nameError,
      emailError,
      passwordError,
      registrationError,
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
