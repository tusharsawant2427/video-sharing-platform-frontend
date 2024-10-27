<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-outline mb-4">
      <input
        type="name"
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
        <span
          v-if="isLoading"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
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
import "../assets/css/login.css";
import http from "@/http";
import router from "@/router";

export default {
  setup() {
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const nameError = ref("");
    const emailError = ref("");
    const passwordError = ref("");
    const registrationError = ref("");
    const isLoading = ref(false);

    const validateEmail = (emailValue) => {
      const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return reg.test(emailValue);
    };

    const handleSubmit = async () => {
      isLoading.value = true;
      if (!validateEmail(email.value)) {
        emailError.value = "Please enter valid email address.";
        isLoading.value = false;
      } else {
        emailError.value = "";
      }

      if (password.value.length < 6) {
        passwordError.value = "Password must be at least 6 characters long.";
        isLoading.value = false;
      } else {
        passwordError.value = "";
      }
      if (name.value.length <= 0) {
        nameError.value = "Name Required";
        isLoading.value = false;
      } else {
        nameError.value = "";
      }
      if (email.value && password.value && name.value) {
        try {
          const response = await http.post("/users/register", {
            email: email.value,
            password: password.value,
            name: name.value,
          });
          localStorage.setItem("jwtToken", response.data.token);
          router.push("/my-posts");
        } catch (error) {
          if (error.status == 400) {
            if (error.response && error.response.data) {
              registrationError.value = extractErrorMessages(
                error.response.data.error
              );
            } else {
              registrationError.value = "An unexpected error occurred.";
            }
          } else if (error.status == 422) {
            if (error.response && error.response.data) {
              registrationError.value = error.response.data.data;
            } else {
              registrationError.value = "An unexpected error occurred.";
            }
          } else {
            registrationError.value = error.message;
          }
          isLoading.value = false;
        }
        isLoading.value = false;
      } else {
        registrationError.value = "All Field Required";
        isLoading.value = false;
        return;
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
      validateEmail,
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
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

@media (min-width: 768px) {
  .bd-placeholder-img-lg {
    font-size: 3.5rem;
  }
}
</style>
