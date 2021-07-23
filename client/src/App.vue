<template>
  <div>
    <the-header></the-header>
    <main-layout></main-layout>
    <div class="position">
      <errors v-if="error" :msg="error"></errors>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import TheHeader from "./components/layouts/TheHeader";
import MainLayout from "./components/layouts/MainLayout.vue";
import { mapGetters } from "vuex";
import Errors from "./components/Errors.vue";
export default {
  components: {
    TheHeader,
    MainLayout,
    Errors,
  },
  computed: {
    ...mapGetters(["error"]),
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

* {
  box-sizing: border-box;
}

html {
  font-family: "Roboto", sans-serif;
}

body {
  padding: 0;
  margin: 0;

  background-color: rgb(247, 244, 248);
}
.position {
  padding: 1rem;
}
</style>
