<template>
  <div class="card mx-auto">
    <div class="card-header" style="color:white">
      About this application
    </div>

    <div class="card-body">
      <p class="card-text">
        - You will be given 2 txt files which contain some ideas about "Bionic
        Radar" that uses machine learning to uniquely detect movement patterns
        via radar, working even in bad weather.
      </p>
      <p class="card-text">
        - First please register and then login.
      </p>
      <p class="card-text">
        - Then please import the first file.
      </p>
      <p class="card-text">
        - After importing, each idea is shown via a node.You can move the idea
        nodes around and place them in (Not) Novel areas or none of them.
      </p>
      <p class="card-text">
        - If you drop the ideas in (Not) Novel areas, some questions will be
        popped-up.Please answer them briefly.
      </p>
      <p class="card-text">
        - Afterwards, you can save your evaluation and import the second txt
        file and let the system does the evaluation for you.
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
