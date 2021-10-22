<template>
  <div>
    <filter-layout></filter-layout>
    <download
      v-show="saved"
      :download-data="ideas"
      file-type="json"
      file-name="Ideas"
      class="periodic_table"
      button-text="Download Evaluation"
    >
    </download>
    <draggable-items></draggable-items>
  </div>
</template>

<script>
import Download from "../components/Download";
import DraggableItems from "../components/DraggableItems.vue";
import FilterLayout from "../components/layouts/FilterLayout.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { Download, DraggableItems, FilterLayout },
  computed: { ...mapGetters(["ideas", "saved"]) },
  methods: {
    ...mapActions(["fetchIdeas", "compareIdeas"]),
  
   
   
  },
  created() {
    this.fetchIdeas()
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
   
  },
};
</script>

<style>
.periodic_table {
  color: #fff !important;
  font-weight: bold;
  font-size: 15px;
  flex: 1;
  width: 10rem;
  background: #3d9eec;
  top: 1rem;
  right: 12rem;
  position: absolute;
}
</style>
