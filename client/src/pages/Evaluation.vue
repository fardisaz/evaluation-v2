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
  data() {
    return {};
  },
  methods: {
    ...mapActions(["fetchIdeas", "compareIdeas"]),

    async extractKey(input) {
      try {
        let item = {
          data: [input],
        };
        let res = await fetch(
          "https://api.monkeylearn.com/v3/extractors/ex_YCya9nrn/extract/",
          {
            body: JSON.stringify(item),
            headers: {
              Authorization: "Token 8f63565138dfcd376a749dc9cdea2c4b7f51a507",
              "Content-Type": "application/json",
            },
            method: "POST",
          }
        );
        let data = await res.json();
        console.log("This is the data from monkeylearn: ", data[0].extractions);
      } catch (err) {
        if (err.code == "CONCURRENCY_RATE_LIMIT") {
          // if (err.retryable) {
          await this.delay(1000);
          // continue;
        } else {
          throw err;
        }
      }
    },
    delay(time) {
      return new Promise((resolve) => {
        setTimeout(resolve, time);
      });
    },
    async onStart() {
      for (let s of this.input) {
        await this.extractKey(s);
      }
    },
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
