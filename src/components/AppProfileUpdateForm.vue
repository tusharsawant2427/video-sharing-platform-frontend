<template>
  <form @submit.prevent="handleUpdate">
    <div class="form-group">
      <label for="name">Name</label>
      <input
        type="text"
        class="form-control"
        id="name"
        v-model="user.name"
        required
      />
      <div v-if="nameError" class="text-danger">{{ nameError }}</div>
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input
        type="email"
        class="form-control"
        id="email"
        v-model="user.email"
        required
      />
      <div v-if="emailError" class="text-danger">{{ emailError }}</div>
    </div>
    <div class="text-center mt-4">
      <button type="submit" class="btn btn-primary" :disabled="isLoading">
        <span
          v-if="isLoading"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        <span v-if="!isLoading">Update Profile</span>
        <span v-else>Updating...</span>
      </button>
      <div v-if="updateError" class="text-danger">{{ updateError }}</div>
    </div>
  </form>
</template>

<script>
import { ref, onMounted } from "vue";
import http from "@/http";

export default {
  name: "ProfileUpdate",
  setup() {
    const user = ref({ name: "", email: "" });
    const nameError = ref("");
    const emailError = ref("");
    const updateError = ref("");
    const isLoading = ref(false); 

    const fetchUserData = async () => {
      try {
        const response = await http.get("/users");
        user.value = response.data; 
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const handleUpdate = async () => {
      nameError.value = "";
      emailError.value = "";
      updateError.value = "";
      isLoading.value = true; 

      if (!user.value.name) {
        nameError.value = "Name is required.";
        isLoading.value = false; 
        return;
      }
      if (!user.value.email) {
        emailError.value = "Email is required.";
        isLoading.value = false; 
        return;
      }

      try {
        await http.put("/users/update", {
          name: user.value.name,
          email: user.value.email,
        });
        alert("Profile updated successfully!");
      } catch (error) {
        updateError.value = "Failed to update profile.";
        console.error("Error updating profile:", error);
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(fetchUserData);

    return {
      user,
      nameError,
      emailError,
      updateError,
      isLoading,
      handleUpdate,
    };
  },
};
</script>

<style scoped>
.text-danger {
  color: red;
}
</style>
