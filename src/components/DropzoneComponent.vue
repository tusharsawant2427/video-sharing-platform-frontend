<template>
  <div>
    <vue-dropzone
      ref="myDropzone"
      @vdropzone-success="handleSuccess"
      @vdropzone-error="handleError"
      @vdropzone-file-added="handleFilesAdded"
      @vdropzone-removed="handleRemoved"
      :options="dropzoneOptions"
    >
      <template #preview-template>
        <div class="dz-preview dz-file-preview">
          <div class="dz-image">
            <img data-dz-thumbnail />
          </div>
          <div class="dz-details">
            <div class="dz-size"><span data-dz-size></span></div>
            <div class="dz-filename"><span data-dz-name></span></div>
          </div>
        </div>
      </template>
    </vue-dropzone>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import vueDropzone from "dropzone-vue3";
import "dropzone/dist/dropzone.css";

const CHUNK_SIZE = 5 * 1024 * 1024;

export default {
  components: {
    vueDropzone,
  },
  props: {
    identifier: {
      type: String,
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  setup(props, { emit }) {
    const myDropzone = ref(null);
    const dropzoneOptions = ref({
      url: "/",
      maxFilesize: 500,
      chunking: true,
      forceChunking: true,
      parallelChunkUploads: true,
      chunkSize: CHUNK_SIZE,
      retryChunks: true,
      retryChunksLimit: 3,
      addRemoveLinks: true,
      autoProcessQueue: props.isEdit,
      acceptedFiles: "video/*",
    });
    onMounted(() => {
      try {
        const dropzone = myDropzone.value.dropzone;
        dropzone.processQueue();
      } catch (error) {
        console.log(error);
      }
    });

    watch(
      () => props.identifier,
      (newIdentifier) => {
        const dropzone = myDropzone.value.dropzone;
        dropzone.options.url = `${process.env.VUE_APP_API_BASE_URL}/posts/my-posts/${newIdentifier}/upload-video`;
        const token = localStorage.getItem("jwtToken");
        dropzone.options.headers = {
          Authorization: `Bearer ${token}`,
        };
        dropzone.processQueue();
      }
    );

    const handleSuccess = () => {
      emit("file-upload-success");
    };

    const handleError = (file, response) => {
      let errorMessage = "An unknown error occurred.";

      if (response && typeof response === "object") {
        errorMessage = response.error
          ? Object.values(response.error).flat().join(", ")
          : errorMessage;
      } else if (typeof response === "string") {
        errorMessage = response; 
      }

      emit("file-upload-error", errorMessage);
    };

    const handleFilesAdded = () => {
      emit("files-added");
    };

    return {
      myDropzone,
      dropzoneOptions,
      handleSuccess,
      handleError,
      handleFilesAdded,
    };
  },
};
</script>
