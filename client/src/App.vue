<template>
  <div>
    <the-header></the-header>
    <main-layout></main-layout>
    <div class="position"><router-view></router-view></div>
  </div>
</template>

<script>
import TheHeader from "./components/layouts/TheHeader";
import MainLayout from "./components/layouts/MainLayout.vue";
export default {
  components: {
    TheHeader,
    MainLayout,
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

  background-color: rgb(234, 206, 245);
}
.position {
  padding: 1rem;
}
</style>
