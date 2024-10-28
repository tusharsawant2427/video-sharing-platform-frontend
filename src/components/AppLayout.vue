<template>
  <AppHeader></AppHeader>
  <section class="min-vh-100">
    <div class="container-fluid h-custom">
      <slot></slot>
    </div>
  </section>
  <AppFooter></AppFooter>
</template>
<script>
import AppFooter from "./AppFooter.vue";
import AppHeader from "./AppHeader.vue";

export default {
  components: {
    AppFooter,
    AppHeader
  },
};
</script>

