<template>
  <span
    v-if="isLoading"
    class="spinner-border spinner-border-sm"
    role="status"
    aria-hidden="true"
  ></span>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
/* You can add styles specific to the spinner here, if needed */
</style>
