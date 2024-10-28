<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="title">Post Title</label>
      <input
        type="text"
        class="form-control"
        id="title"
        v-model="title"
        placeholder="Post Title"
      />
      <div v-if="titleError" class="text-danger">{{ titleError }}</div>
    </div>

    <div class="form-group">
      <label for="postBody">Post Body</label>
      <textarea
        class="form-control"
        id="postBody"
        rows="3"
        v-model="postBody"
      ></textarea>
      <div v-if="postBodyError" class="text-danger">{{ postBodyError }}</div>
    </div>

    <DropzoneComponent
      @files-added="handleFilesAdded"
      :identifier="identifier"
      :isEdit="isEditMode"
    />
    <div v-if="videoFileError" class="text-danger">{{ videoFileError }}</div>

    <div class="text-center mt-4">
      <div v-if="postError" class="text-danger">{{ postError }}</div>
      <button
        type="submit"
        class="btn btn-primary btn-lg"
        :disabled="isLoading"
        style="padding-left: 2.5rem; padding-right: 2.5rem"
      >
        <LoadingSpinner :isLoading="isLoading" />
        <span v-if="isLoading"></span>
        <span v-else>{{ submitButtonText }}</span>
      </button>
    </div>
    <div class="alert" :class="alertClass" role="alert">
      {{ alertMessage }}
    </div>
  </form>
</template>

<script>
import { ref, watch } from "vue";
import DropzoneComponent from "@/components/DropzoneComponent.vue";
import LoadingSpinner from "../common/LoadingSpinner.vue";

export default {
  components: {
    DropzoneComponent,
    LoadingSpinner,
  },
  props: {
    postIdentifier: {
      type: String,
      default: null,
    },
    initialTitle: {
      type: String,
      default: "",
    },
    initialPostBody: {
      type: String,
      default: "",
    },
    submitButtonText: {
      type: String,
      default: "Submit",
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
    alertClass: {
      type: String,
      default: "",
    },
    alertMessage: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const identifier = ref(props.postIdentifier);
    const title = ref(props.initialTitle);
    const postBody = ref(props.initialPostBody);
    const titleError = ref("");
    const postBodyError = ref("");
    const videoFileError = ref("");
    const isLoading = ref(props.disabled);
    const hasFileAdded = ref(false);
    const validateForm = () => {
      titleError.value = "";
      postBodyError.value = "";
      videoFileError.value = "";
      if (!title.value) {
        titleError.value = "Title is required";
        return false;
      }

      if (!postBody.value) {
        postBodyError.value = "Post Body is required";
        return false;
      }
      if (!hasFileAdded.value && !props.isEditMode) {
        videoFileError.value = "Please select a video";
        return false;
      }

      return true;
    };

    watch(
      () => [props.initialTitle, props.initialPostBody],
      ([newTitle, newPostBody]) => {
        title.value = newTitle;
        postBody.value = newPostBody;
      }
    );
    watch(
      () => [props.postIdentifier],
      ([newIdentifier]) => {
        identifier.value = newIdentifier;
        console.log("Updated identifier:", newIdentifier);
      }
    );
    watch(
      () => [props.disabled],
      ([newDisabled]) => {
        isLoading.value = newDisabled;
      }
    );

    const handleFilesAdded = () => {
      hasFileAdded.value = true;
      emit("file-added");
    };

    const handleSubmit = async () => {
      isLoading.value = true;
      if (!validateForm()) {
        isLoading.value = false;
        return;
      } else {
        emit("submitForm", { title: title.value, post_body: postBody.value });
        if (!props.isEditMode) {
          resetForm();
        }
        isLoading.value = false;
      }
    };

    const resetForm = () => {
      title.value = "";
      postBody.value = "";
      isLoading.value = false;
    };

    return {
      title,
      postBody,
      titleError,
      postBodyError,
      isLoading,
      videoFileError,
      handleFilesAdded,
      handleSubmit,
      identifier,
    };
  },
};
</script>

<style>
/* Your existing styles */
</style>
