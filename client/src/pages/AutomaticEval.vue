<template>
  <div>
    <filter-layout></filter-layout>
    <!-- Color reference -->
    <div class="signPosition">
      <div
        style="display: inline-flex;
  margin-right:1.5em;"
      >
        <div class="newSign"></div>
        <p>New Ideas</p>
      </div>
      <div
        style="display: inline-flex;
  margin-right:1.5em;"
      >
        <div class="oldSign"></div>
        <p>Old Ideas</p>
      </div>
    </div>
    <download
      :download-data="ideas"
      file-type="json"
      file-name="Ideas"
      class="periodic_table"
      button-text="Download Evaluation"
    >
    </download>
    <!-- This is for arrow connection between ideas -->
    <svg
      id="connectors"
      height="100%"
      width="100%"
      v-for="(arrow, index) in arrowArray"
      :key="index"
    >
      <line
        :x1="arrow.oldPosition.left + 30"
        :y1="arrow.oldPosition.top - 20"
        :x2="arrow.newPosition.left + 50"
        :y2="arrow.newPosition.top + 10"
        class="arrow"
      />
    </svg>
    <div v-for="(idea, index) in importedIdea" :key="index">
      <new-draggable
        class="oldIdeas"
        :id="index"
        :title="idea.title"
        :extractedTopic="idea.extractedTopic"
        :description="idea.description"
        :left="idea.position.left"
        :top="idea.position.top"
        @openDialog="toggleClick"
        @posCalc="positionCalculation"
      >
      </new-draggable>
    </div>
    <div v-for="(idea, index) in ideas" :key="index">
      <draggable
        class="oldIdeas"
        :id="index"
        :title="idea.title"
        :extractedTopic="idea.extractedTopic"
        :description="idea.description"
        :left="idea.position.left"
        :top="idea.position.top"
        @openDialog="toggleClick"
        @posCalc="positionCalculation"
      >
      </draggable>
    </div>
    <!-- Description Dialog -->
    <base-dialog v-if="clicked" :title="currentTitle">
      <template #default>
        <p>{{ currentDescription }}</p>
      </template>
      <template #actions>
        <button @click="closeDialog">Okay</button>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import Download from "../components/Download";
import Draggable from "../components/Draggable.vue";
import BaseDialog from "../components/BaseDialog.vue";
import FilterLayout from "../components/layouts/FilterLayout.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
import NewDraggable from "../components/NewDraggable.vue";
export default {
  components: {
    Download,
    FilterLayout,
    Draggable,
    BaseDialog,
    NewDraggable,
  },
  data() {
    return {
      importedNewIdeas: null,
      clicked: false,
      convertedNewIdea: [],
      importedIdea: [],
      finalEvaluation: [],
      sim: [],
      currentTitle: null,
      currentDescription: null,
      arrowArray: [],
      newIdeasTitle: [],
      newImportedIdeas: [],
      refreshPage: false,
      initial: 0,
    };
  },
  computed: { ...mapGetters(["ideas", "saved", "newIdeas"]) },
  methods: {
    ...mapActions([
      "fetchIdeas",
      "compareIdeas",
      "countNovelty",
      "updateNewIdea",
    ]),
    ...mapMutations(["UPDATE_SAVED", "SET_NEW_IDEAS"]),
    randomIntFromInterval(min, max) {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    toggleClick(_title, _desc) {
      this.currentTitle = _title;
      this.currentDescription = _desc;
      this.clicked = true;
    },
    closeDialog() {
      this.clicked = false;
    },
    onNewIdeaUpdate(change) {
      this.updateNewIdea(change)
        .then(() => {
          this.fetchIdeas()
            .then(() => {})
            .catch((err) => {
              console.log("Error in fetching the user's ideas ", err);
            });
        })
        .catch((err) => {
          console.log(
            "Error has happened regarding the update new idea function",
            err
          );
        });
    },
    capitalize(input) {
      return input.charAt(0).toUpperCase() + input.slice(1);
    },
    extractKey(input) {
      let exKey;
      let item = {
        data: [input],
      };
      return fetch(
        "https://api.monkeylearn.com/v3/extractors/ex_YCya9nrn/extract/",
        {
          body: JSON.stringify(item),
          headers: {
            Authorization: "Token 8f63565138dfcd376a749dc9cdea2c4b7f51a507",
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.length > 0 && data[0] && data[0].extractions.length > 0) {
            // console.log("This is the data:", data[0]);
            exKey = data[0].extractions[0].parsed_value;
          } else {
            exKey = "";
          }
          console.log("This is the exKey:", exKey);
          if (exKey.slice(exKey.length - 1) === "s") {
            return this.capitalize(exKey).slice(0, exKey.length - 1);
          } else if (exKey.indexOf(" ") > 0) {
            return this.capitalize(exKey).slice(0, exKey.indexOf(" "));
          }
          return this.capitalize(exKey);
          // console.log("This is the data from monkeylearn: ", exKey);
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
      // console.log("This is the queryUrl for dbpedia: ", queryUrl);
      return queryUrl;
    },
    async getDbpedia(url) {
      // Storing response
      const response = await fetch(url);

      // Storing data in form of JSON
      var data = await response.json();
      if (data.results.bindings.length <= 0) {
        // console.log("Nothing found on dbpedia");
        return "";
      } else {
        // console.log(
        //   "This is the data from dbpedia: ",
        //   data.results.bindings[0].comment.value
        // );
        return data.results.bindings[0].comment.value;
      }

      // if (response) {

      // }
    },
    async answerKeys(items) {
      let newItems = [...new Set(items)];
      let exKeys = [];
      for (let item of newItems) {
        if (item) {
          let ex = await this.extractKey(item);
          if (ex) {
            exKeys.push(ex);
          }
        }
      }
      return exKeys;
    },
    async finalEvalMethod() {
      let totalEval = await this.countNovelty();

      for (let item of totalEval.arr) {
        if (
          item.Novel > item.NotNovel &&
          (totalEval.total == item.Novel + item.NotNovel ||
            item.Novel > totalEval.total - item.Novel)
        ) {
          let desc = this.ideas.find((idea) => idea.title == item.title)
            .description;
          let newDesc = await this.extractKey(desc);
          let exKeys = await this.answerKeys(item.NovelAnswers);
          let descArr = new Array(newDesc);
          this.finalEvaluation.push({
            classification: "Novel",
            title: item.title,
            novelAnswers: exKeys,
            description: desc,
            descAndAnswers: [...new Set(descArr.concat(exKeys))],
            position: {
              left: this.randomIntFromInterval(42, 450),
              top: this.randomIntFromInterval(104, 335),
            },
          });
        } else if (
          item.NotNovel > item.Novel &&
          (totalEval.total == item.Novel + item.NotNovel ||
            item.NotNovel > totalEval.total - item.NotNovel)
        ) {
          let desc = this.ideas.find((idea) => idea.title == item.title)
            .description;
          let newDesc = await this.extractKey(desc);
          let exKeys = await this.answerKeys(item.NotNovelAnswers);
          let descArr = new Array(newDesc);
          this.finalEvaluation.push({
            classification: "Not Novel",
            title: item.title,
            notNovelAnswers: item.NotNovelAnswers,
            description: desc,
            descAndAnswers: [...new Set(descArr.concat(exKeys))],
            position: {
              left: this.randomIntFromInterval(1000, 1410),
              top: this.randomIntFromInterval(595, 800),
            },
          });
        } else {
          let desc = this.ideas.find((idea) => idea.title == item.title)
            .description;
          let newDesc = await this.extractKey(desc);
          let descArr = new Array(newDesc);
          this.finalEvaluation.push({
            classification: "",
            title: item.title,
            description: desc,
            descAndAnswers: descArr,
            position: {
              left: this.randomIntFromInterval(455, 995),
              top: this.randomIntFromInterval(340, 590),
            },
          });
        }
      }
      console.log("This is the finalEvaluation: ", this.finalEvaluation);
    },
    async finalEvalMock() {
      //This is a mock data for this.finalEvaluation
      this.finalEvaluation = [
        {
          classification: "Novel",
          descAndAnswers: ["Instrument", "Art", "Brain", "Creativity"],
          description: "instruments",
          novelAnswers: ["Art", "Brain", "Creativity"],
          position: { left: 195, top: 278 },
          title: "Idea 1",
        },
        {
          classification: "",
          descAndAnswers: ["Book"],
          description: "Book",
          position: { left: 506, top: 420 },
          title: "Idea 2",
        },
        {
          classification: "Novel",
          descAndAnswers: ["Friend", "Communication"],
          description: "friend",
          novelAnswers: ["Communication"],
          position: { left: 418, top: 206 },
          title: "Idea 3",
        },
        {
          classification: "",
          descAndAnswers: ["Art"],
          description: "art",
          position: { left: 518, top: 413 },
          title: "Idea 4",
        },
        {
          classification: "Novel",
          descAndAnswers: ["Gym", "Physical"],
          description: "Gym",
          novelAnswers: ["Physical", "Physical"],
          position: { left: 115, top: 116 },
          title: "Idea 5",
        },
      ];
      console.log("This is the finalEvaluation: ", this.finalEvaluation);
    },
    async similarityMethod() {
      let allSimilarity = [];
      let b = [];
      let newArr = [];
      // please uncomment the following line when you come back to Germany & comment the mockdata for this.convertedNewIdea

      // this.newIdeas.forEach(async (item) => {
      //   let newDesc = await this.extractKey(item.description);
      //   this.convertedNewIdea.push({
      //     ...item,
      //     newDesc,
      //   });
      // });
      this.convertedNewIdea = [
        {
          classification: "",
          description: "Doing sports improves us mentally and physically",
          extractedTopic: "sport",
          extractedUrl: "",
          newDesc: "Sport",
          notNovelAnswers: {},
          novelAnswers: {},
          position: { left: 0, top: 0 },
          similarIdeas: {},
          title: "Idea 2",
          _id: "611bd93fd940da9fb45ed9ae",
        },
        {
          classification: "",
          description: "Go for a walk.",
          extractedTopic: "no title",
          extractedUrl: "",
          newDesc: "Walk",
          notNovelAnswers: {},
          novelAnswers: {},
          position: { left: 0, top: 0 },
          similarIdeas: {},
          title: "Idea 1",
          _id: "611bd93fd940da9fb45ed9ad",
        },
        {
          classification: "",
          description: "Spend time with people I know is entertaining.",
          extractedTopic: "people",
          extractedUrl: "",
          newDesc: "Time",
          notNovelAnswers: {},
          novelAnswers: {},
          position: { left: 0, top: 0 },
          similarIdeas: {},
          title: "Idea 3",
          _id: "611bd93fd940da9fb45ed9af",
        },
        {
          classification: "",
          description: "Learn new Language.",
          extractedTopic: "language",
          extractedUrl: "",
          newDesc: "",
          notNovelAnswers: {},
          novelAnswers: {},
          position: { left: 0, top: 0 },
          similarIdeas: {},
          title: "Idea 4",
          _id: "611bd93fd940da9fb45ed9b0",
        },
        {
          classification: "",
          description: "Learn an art like musical instrument.",
          extractedTopic: "art",
          extractedUrl: "",
          newDesc: "Musical instrument",
          notNovelAnswers: {},
          novelAnswers: {},
          position: { left: 0, top: 0 },
          similarIdeas: {},
          title: "Idea 5",
          _id: "611bd93fd940da9fb45ed9b1",
        },
      ];
      console.log("This is the converetedNewIdea: ", this.convertedNewIdea);
      console.log("This is the final evaluation:", this.finalEvaluation);
      // Do not forget to uncomment line 166 & 167
      //  compare each new idea with old idea to get the most similar one
      for (const item of this.convertedNewIdea) {
        allSimilarity = [];
        b = [];
        for (const final of this.finalEvaluation) {
          let newUrl = this.dbpedia(item.newDesc);
          let newText = await this.getDbpedia(newUrl);
          // for oldUrls you should try to give all the array member of final.descAndAnswers to dbpedia
          let oldUrl = this.dbpedia(final.descAndAnswers[0]);
          let oldText = await this.getDbpedia(oldUrl);
          console.log(
            "This is the new text: ",
            newText.slice(0, 180).replace(/['"]+/g, "")
          );
          console.log(
            "This is the old text: ",
            oldText.slice(0, 180).replace(/['"]+/g, "")
          );
          let text1 =
            newText
              .slice(0, 120)
              .replace(/['"]+/g, "")
              .split(" ")
              .join("%20") + "%20";

          let text2 =
            oldText
              .slice(0, 120)
              .replace(/['"]+/g, "")
              .split(" ")
              .join("%20") + "%20";
          console.log("Text1 :", text1);
          console.log("Text2 :", text2);
          let similarity = await this.compareIdeas({ text1, text2 });
          allSimilarity.push({
            similarity,
            oldIdea: final.title,
            newIdea: item.title,
          });
          b.push(similarity);
        }
        newArr.push(allSimilarity.find((a) => a.similarity == Math.max(...b)));
      }

      //Here is for test

      // const items = [this.convertedNewIdea[3], this.convertedNewIdea[4]];
      // for (const item of items) {
      //   b = [];
      //   allSimilarity = [];
      //   for (const final of this.finalEvaluation) {
      //     let text1 = item.description.split(" ").join("%20") + "%20";
      //     let text2 = final.descAndAnswers.split(" ").join("%20") + "%20";
      //     let similarity = await this.compareIdeas({ text1, text2 });
      //     allSimilarity.push({
      //       similarity,
      //       oldIdea: final.title,
      //       newIdea: item.title,
      //     });
      //     b.push(similarity);
      //   }
      //   console.log("This is all similarity", allSimilarity);
      //   console.log("This is b", b);
      //   newArr.push(allSimilarity.find((a) => a.similarity == Math.max(...b)));
      // }

      //  Mock api response for testing
      // newArr = [
      //   { oldIdea: "Idea 1", newIdea: "Idea 5", similarity: 0.802 },
      //   { oldIdea: "Idea 5", newIdea: "Idea 2", similarity: 0.52 },
      //   { oldIdea: "Idea 3", newIdea: "Idea 3", similarity: 0.69 },
      //   { oldIdea: "Idea 4", newIdea: "Idea 4", similarity: 0.54 },
      //   { oldIdea: "Idea 2", newIdea: "Idea 1", similarity: 0.0 },
      // ];
      console.log("This is the new array", newArr);
      let old;
      for (const load of this.convertedNewIdea) {
        // if (newArr.find(s=>s.newIdea==load.title).similarity > 0.5)
        if (newArr.find((s) => s.newIdea == load.title).similarity > 0.3) {
          // console.log(arr[index]);
          old = this.finalEvaluation.find(
            (final) =>
              final.title == newArr.find((s) => s.newIdea == load.title).oldIdea
          );
          if (
            this.importedIdea.find(
              (i) => JSON.stringify(i.position) === JSON.stringify(old.position)
            )
          ) {
            this.importedIdea.push({
              ...load,
              classification: old.classification,
              position: {
                left: old.position.left + 40,
                top: old.position.top + 40,
              },
            });
          } else {
            this.importedIdea.push({
              ...load,
              classification: old.classification,
              position: old.position,
            });
          }
        } else {
          this.importedIdea.push({
            ...load,
            classification: "",
            position: {
              left: this.randomIntFromInterval(455, 995),
              top: this.randomIntFromInterval(340, 590),
            },
          });
        }
      }
      console.log("This is the imported Ideas", this.importedIdea);
      for (let item of newArr) {
        if (item.similarity != 0) {
          this.arrowArray.push({
            oldPosition: this.ideas.find((idea) => item.oldIdea === idea.title)
              .position,
            newPosition: this.importedIdea.find(
              (im) => item.newIdea === im.title
            ).position,
          });
        }
      }
      console.log("This is the positions of old new ideas", this.arrowArray);
    },

    onStart() {
      // First we need to check what is the evaluation of ideas based on all user's input
      //when you come back to Germany please call this.finalEvalMethod() method instead of this.finalEvalMock()
      this.finalEvalMock().then(async () => {
        this.sim = await this.similarityMethod();
        console.log("Here is inside onStart");
      });
      // this.finalEvalMethod().then(async () => {
      //  this.sim = await this.similarityMethod();
      // console.log("Here is inside onStart");
      // });
    },
    topicExtractor() {
      this.newIdeas.forEach((i) => {
        const formdata = new FormData();
        formdata.append("key", "e56b7da7f51fdb919509b4c93e59b6bf");
        formdata.append("txt", i.description);
        formdata.append("lang", "en"); // 2-letter code, like en es fr ...
        formdata.append("tt", "a"); // all topics
        const requestOptions = {
          method: "POST",
          body: formdata,
          redirect: "follow",
        };
        fetch("https://api.meaningcloud.com/topics-2.0", requestOptions)
          .then((response) => ({
            status: response.status,
            body: response.json(),
          }))
          .then(async ({ status, body }) => {
            console.log(status, body);
            body
              .then((newBody) => {
                if (newBody.concept_list.length > 0) {
                  let item = Object.assign(
                    {},
                    { ...i },
                    { extractedTopic: newBody.concept_list[0].form }
                  );
                  this.updateNewIdea(item)
                    .then(() => {
                      this.fetchIdeas()
                        .then(() => {})
                        .catch((err) => {
                          console.log(
                            "Error in fetching the user's ideas ",
                            err
                          );
                        });
                    })
                    .catch((err) => {
                      console.log(
                        "Error has happened regarding the update function",
                        err
                      );
                    });
                  console.log(item);
                } else {
                  let item = Object.assign(
                    {},
                    { ...i },
                    { extractedTopic: "no title" }
                  );
                  this.updateNewIdea(item)
                    .then(() => {
                      this.fetchIdeas()
                        .then(() => {})
                        .catch((err) => {
                          console.log(
                            "Error in fetching the user's ideas ",
                            err
                          );
                        });
                    })
                    .catch((err) => {
                      console.log(
                        "Error has happened regarding the update function",
                        err
                      );
                    });
                }
              })
              .catch((err) => console.log("Topic Api error: ", err));
          })
          .catch((error) => console.log("error", error));
      });
    },
  },
  created() {
    // let url = this.dbpedia();
    // this.getDbpedia(url);
    console.log("This is the new ideas: ", this.newIdeas);
    this.topicExtractor();
    this.fetchIdeas()
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  },
  updated() {
    console.log("This is updated");
    this.initial++;
    if (this.initial == 5) {
      this.fetchIdeas()
        .then(() => {
          this.onStart();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
</script>

<style>
#connectors {
  position: absolute;
  top: 0;
  left: 0;
}
.arrow {
  stroke: red;
  stroke-width: 2;
  marker-end: url(#markerArrow);
}
.signPosition {
  top: 2rem;
  left: 38rem;
  flex: 1;
  position: absolute;
}
.newSign {
  height: 20px;
  width: 20px;
  margin-right: 2px;
  background: #eb2751;
}
.oldSign {
  height: 20px;
  width: 20px;
  margin-right: 2px;
  background: #3d9eec;
}
.periodic_table {
  color: #fff !important;
  font-weight: bold;
  font-size: 15px;
  flex: 1;
  width: 10rem;
  background: #3d9eec;
  top: 1rem;
  right: 0.6rem;
  position: absolute;
}
.btnSide {
  color: #fff !important;
  font-weight: bold;
  font-size: 15px;
  flex: 1;
  width: 10rem;
  height: 3rem;
  /* background: rgb(167, 148, 179); */
  top: 1rem;
  right: 12rem;
  position: absolute;
}
.oldIdeas {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  /* display: block; */
  position: absolute;
  top: 0;
  height: 140px;
  width: 140px;
  border-radius: 50%;
  /* background: #3d9eec; */
  color: #0e0d0d;
  text-align: center;
  /* justify-content: center; */
}
.newIdeas {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  /* display: block; */
  position: absolute;
  top: 0;
  height: 80px;
  width: 80px;
  border-radius: 50%;
  background: #eb2751;

  color: #0e0d0d;
  text-align: center;
  /* justify-content: center; */
}
</style>
