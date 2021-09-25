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
        - Then please import a file in txt format in which all the ideas are
        separated by "//".
      </p>
      <p class="card-text">
        - After importing you can move the idea nodes around and place them in
        (Not) Novel areas.
      </p>
      <p class="card-text">
        - Afterwards, you can save your evaluation and import another txt file
        in the same above-mentioned format and let the system does the
        evaluation for you.
      </p>
      <p class="card-text">
        - At the end ,the automatic evaluation of last-imported ideas will be
        illustrated.
      </p>
      <router-link v-if="isLoggedIn" class="card-link" to="/evaluation"
        >Go to Evaluation</router-link
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
