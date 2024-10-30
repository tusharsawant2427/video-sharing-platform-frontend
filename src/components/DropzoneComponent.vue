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
import { computed, ref, watch } from "vue";
import vueDropzone from "dropzone-vue3";
import "dropzone/dist/dropzone.css";
import { useStore } from "vuex";

const CHUNK_SIZE = 5 * 1024 * 1024;
const ALERT_SUCCESS = "alert-success";
const ALERT_DANGER = "alert-danger";
const ALERT_INFO = "alert-success";
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
    const store = useStore();
    const myDropzone = ref(null);
    const canUploadFile = computed(() => store.state.canUploadFile);
    const hasFileAdded = ref(false);
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
      autoProcessQueue: false,
      acceptedFiles: "video/*",
    });
    watch(
      () => store.state.canUploadFile,
      (canUploadFileStatus) => {
        canUploadFile.value = canUploadFileStatus;
        if (canUploadFile.value && hasFileAdded.value) {
          store.dispatch("setAlert", {
            alertClass: ALERT_INFO,
            alertMessage: "Video Uploading In-Progress...",
          });
          const dropzone = myDropzone.value.dropzone;
          dropzone.options.url = `${process.env.VUE_APP_API_BASE_URL}/posts/my-posts/${props.identifier}/upload-video`;
          const token = localStorage.getItem("jwtToken");
          dropzone.options.headers = {
            Authorization: `Bearer ${token}`,
          };
          dropzone.processQueue();
        }
      }
    );

    const handleSuccess = () => {
      store.dispatch("setAlert", {
        alertClass: ALERT_SUCCESS,
        alertMessage: "File uploaded successfully.",
      });
      store.dispatch("setCanUpload", false);
      hasFileAdded.value = false;
      const dropzone = myDropzone.value.dropzone;
      dropzone.removeAllFiles(true); 
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

      store.dispatch("setAlert", {
        alertClass: ALERT_DANGER,
        alertMessage: errorMessage,
      });
      store.dispatch("setCanUpload", false);
      const dropzone = myDropzone.value.dropzone;
      dropzone.removeAllFiles(file); 
    };

    const handleFilesAdded = () => {
      hasFileAdded.value = true;
      emit("files-added");
    };

    return {
      myDropzone,
      dropzoneOptions,
      handleSuccess,
      handleError,
      handleFilesAdded,
      canUploadFile,
      hasFileAdded
    };
  },
};
</script>
