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
import { mapGetters, mapActions } from "vuex";
import FilterLayout from "../components/layouts/FilterLayout.vue";
export default {
  components: { FileReader, FilterLayout },
  methods: {
    ...mapActions(["fetchIdeas", "importDescription"]),
    loadIdeas(input) {
      //loaded ideas by the user
      const loads = input.split("//");
      const descs = { descriptions: loads };
      this.importDescription(descs)
        .then(() => {
          //console.log(res.data);
          console.log(this.ideas.data);
          this.$router.push("/evaluation");
        })
        .catch((err) => {
          console.log(err);
        });
      //You should work on this next
      //write the loaded ideas into the description of idea json
      // ideas.map((idea, index) => {
      //   idea.description = loads[index];
      //   this.$store.dispatch("changeIdeas", idea);
      // });
      //console.log(ideas);
      //this.$router.push("/evaluation");
    },
  },
  created() {
    //fetching the idea from user ideas model
    this.fetchIdeas();
  },
  computed: { ...mapGetters(["ideas"]) },
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
