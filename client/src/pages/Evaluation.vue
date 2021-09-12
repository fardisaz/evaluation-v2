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
    extractKey(input) {
      let item = {
        data: [input],
      };
      fetch("https://api.monkeylearn.com/v3/extractors/ex_YCya9nrn/extract/", {
        body: JSON.stringify(item),
        headers: {
          Authorization: "Token 8f63565138dfcd376a749dc9cdea2c4b7f51a507",
          "Content-Type": "application/json",
        },
        method: "POST",
      })
        .then((res) => {
          return res.json();
        })
        .then(function(data) {
          console.log(
            "This is the data from monkeylearn: ",
            data[0].extractions
          );
        });
    },
    dbpedia(item) {
      var url = "http://dbpedia.org/sparql";
      let input = JSON.stringify(item);
      var query =
        "" +
        "prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX dbo:     <http://dbpedia.org/ontology/>" +
        "\n" +
        "select distinct ?label ?comment ?type where {\n" +
        `  ?resource rdfs:label ${input}@en.\n` +
        "  ?resource rdfs:comment ?comment.\n" +
        "  ?resource rdfs:label ?label.\n" +
        "  ?resource rdf:type ?type.\n" +
        " FILTER (lang(?label) = 'en')" +
        "  FILTER (lang(?comment) = 'en')}";

      // console.log("query: ", query);
      var queryUrl =
        url + "?query=" + encodeURIComponent(query) + "&format=json";
      console.log("This is the queryUrl for dbpedia: ", queryUrl);
      return queryUrl;
    },
    async getApi(url) {
      // Storing response
      const response = await fetch(url);

      // Storing data in form of JSON
      var data = await response.json();
      if (data.results.bindings.length <= 0) {
        console.log("Nothing found on dbpedia");
        return "";
      } else {
        console.log(
          "This is the data from dbpedia: ",
          data.results.bindings[0].comment.value
        );
        return data.results.bindings[0].comment.value;
      }

      // if (response) {

      // }
    },
  },
  created() {
    this.fetchIdeas()
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
    // In the following function we use monkeylearn
    // let input =
    //   "Learn a new Language which helps people to communicate with one another and travel to different countries";
    // let input = "The device to help iphone";
    // this.extractKey(input);
    // In the following function, we use dbpedia sparql query

    // for (let item of convertedNewIdea) {
    //   let newUrl = this.dbpedia(item.newDesc);
    //   let newText = this.getApi(newUrl);
    //   console.log("this the newText:", newText);
    // }
    // let url = this.dbpedia();
    // this.getApi(url);
    let newText =
      "Sport pertains to any form of competitive physical activity or game that aims to use, maintain or improve physical ability and skills while providing enjoyment to participants and";
    let oldText = "Describes all musical instrument";
    let text1 =
      newText
        .trim()
        .split(" ")
        .join("%20") + "%20";
    let text2 =
      oldText
        .trim()
        .split(" ")
        .join("%20") + "%20";
    console.log(text1);
    console.log(text2);
    let similarity = this.compareIdeas({ text1, text2 });
    console.log("This is the similarity: ", similarity);
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
