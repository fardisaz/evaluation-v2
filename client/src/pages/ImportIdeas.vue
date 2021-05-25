<template>
  <div>
    <filter-layout></filter-layout>
    <file-reader @load="loadIdeas" class="import_button">
      <!-- <router-link to="/evaluation"></router-link> -->
    </file-reader>
  </div>
</template>

<script>
import FileReader from "../components/FileReader";
import { mapState } from "vuex";
import FilterLayout from "../components/layouts/FilterLayout.vue";
export default {
  components: { FileReader, FilterLayout },
  methods: {
    loadIdeas(input) {
      //loaded ideas by the user
      const loads = input.split("//");
      let ideas = this.$store.state.ideas;
      //write the loaded ideas into the description of idea json
      ideas.map((idea, index) => {
        idea.description = loads[index];
        this.$store.dispatch("changeIdeas", idea);
      });
      //console.log(ideas);
      this.$router.push("/evaluation");
    },
  },
  created() {
    //fetching the idea from json server
    this.$store.dispatch("fetchIdeas");
  },
  computed: mapState(["ideas"]),
};
</script>

<style>
.import_button {
  color: #fff !important;
  font-weight: bold;
  font-size: 15px;
  width: 10rem;
  background: rgb(167, 148, 179);
  flex: 0;
  right: 0px;
  top: 90px;
  position: absolute;
}
</style>
