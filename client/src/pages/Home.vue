<template>
  <div class="card mx-auto">
    <div class="card-header" style="color:white">
      How does this application work?
    </div>
    <div class="card-body">
      <h5 class="card-title"></h5>
      <p class="card-text">
        - First please register and then login.
      </p>
      <p class="card-text">
        - Then import a file in txt format in which all the ideas are separated
        by "//".
      </p>
      <p class="card-text">
        - After the import you can move the idea nodes around and place them in
        Novel/Nor Novel boxes.
      </p>
      <p class="card-text">
        - At the end you can save your evaluation and get an export of your
        evaluation.
      </p>
      <router-link v-if="isLoggedIn" class="card-link" to="/import"
        >Go to Import</router-link
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
};
</script>

<style></style>
