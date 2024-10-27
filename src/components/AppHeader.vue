<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img
          src="https://getbootstrap.com/docs/5.0/assets/brand/bootstrap-logo.svg"
          alt="Logo"
          width="30"
          height="30"
          class="d-inline-block align-text-top"
        />
        Play Now
      </a>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <template v-if="isTokenValid()">
            <li>
              <a class="btn btn-primary btn-md" style="margin: 10px" href="/">
                Posts
              </a>
            </li>
            <li>
              <a
                class="btn btn-info btn-md"
                style="margin: 10px"
                href="/my-posts"
              >
                My Posts
              </a>
            </li>
            <li>
              <a
                class="btn btn-info btn-md"
                style="margin: 10px"
                href="/my-posts/create"
              >
                Create New Post
              </a>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="../assets/images/user.png"
                  alt="Profile Avatar"
                  width="30"
                  height="30"
                  class="rounded-circle"
                />
              </a>
              <ul
                class="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdown"
              >
                <li><a class="dropdown-item" href="/profile">Update Profile</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a class="dropdown-item" href="#" @click="logout">Logout</a>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import router from "@/router";
import { jwtDecode } from "jwt-decode";
import { ref, watch } from "vue";

export default {
  setup() {
    const token = ref(localStorage.getItem("jwtToken"));
    watch(token, (newValue) => {
      if (newValue) {
        console.log("Token updated:", newValue);
      }
    });

    const isTokenValid = () => {
      if (!token.value) return false;
      try {
        const decoded = jwtDecode(token.value);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
      } catch (error) {
        console.error("Token validation error:", error);
        return false;
      }
    };

    const logout = () => {
      localStorage.removeItem("jwtToken");
      token.value = null; 
      router.push("/login");
    };

    return {
      token,
      isTokenValid,
      logout,
    };
  },
};

</script>

<style scoped>
.navbar {
  padding: 0.5rem 1rem;
}
</style>
