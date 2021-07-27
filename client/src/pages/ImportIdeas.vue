<template>
  <div>
    <filter-layout></filter-layout>
    <file-reader @load="loadIdeas" class="import_button" title="Load Ideas">
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
          this.fetchIdeas()
            .then(() => {
              this.$router.push("/evaluation");
            })
            .catch((err) => {
              console.log("Error in fetching the user's ideas ", err);
            });
        })
        .catch((err) => {
          console.log("Error in importing the descriptions ", err);
        });
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
  background: #3d9eec;
  flex: 0;
  right: 0px;
  top: 90px;
  position: absolute;
}
</style>
