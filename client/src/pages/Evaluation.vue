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
    ...mapActions(["fetchIdeas"]),
    extractKey() {
      let item = {
        data: [
          "Elon Musk has shared a photo of the spacesuit designed by SpaceX. This is the second image shared of the new design and the first to feature the spacesuit’s full-body look.",
        ],
      };
      fetch("https://api.monkeylearn.com/v3/extractors/ex_YCya9nrn/extract/", {
        body: JSON.stringify(item),
        headers: {
          Authorization: "Token e2bf65ca6d8f2e4885acc53df3589605e1bf5dda",
          "Content-Type": "application/json",
        },
        method: "POST",
      })
        .then((res) => {
          return res.json();
        })
        .then(function(data) {
          console.log("This is the data: ", data[0].extractions);
        });
    },
    dbpedia() {
      var url = "http://dbpedia.org/sparql";
      var query =
        "" +
        "prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX dbo:     <http://dbpedia.org/ontology/>" +
        "\n" +
        "select distinct ?resource ?abstract ?birthName where {\n" +
        "  ?resource rdfs:label 'Elon Musk'@en.\n" +
        "  ?resource dbo:abstract ?abstract.\n" +
        "  ?resource dbo:birthName ?birthName.\n" +
        "  FILTER (lang(?abstract) = 'en')}";

      console.log("query: ", query);
      var queryUrl =
        url + "?query=" + encodeURIComponent(query) + "&format=json";
      console.log("This is queryUrl: ", queryUrl);
    },
  },
  created() {
    this.fetchIdeas()
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
    // In the following function we use monkeylearn

    this.extractKey();
    // In the following function, we use dbpedia sparql query
    this.dbpedia();
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
