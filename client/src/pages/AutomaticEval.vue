<template>
  <div>
    <filter-layout></filter-layout>
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
      <defs>
        <marker
          id="markerArrow"
          markerWidth="13"
          markerHeight="13"
          refX="2"
          refY="6"
          orient="auto"
        >
          <path d="M2,2 L2,11 L10,6 L2,2" />
        </marker>
      </defs>

      <line
        :x1="arrow.oldPosition.left"
        :y1="arrow.oldPosition.top"
        :x2="arrow.newPosition.left + 45"
        :y2="arrow.newPosition.top + 45"
        class="arrow"
      />
    </svg>
    <div v-for="(idea, index) in importedIdea" :key="index">
      <draggable
        class="newIdeas"
        :id="index"
        :extractedTopic="idea.title"
        :description="idea.description"
        :left="idea.position.left"
        :top="idea.position.top"
        @openDialog="toggleClick"
        @posCalc="positionCalculation"
      >
      </draggable>
    </div>
    <div v-for="(idea, index) in ideas" :key="index">
      <draggable
        class="oldIdeas"
        :id="index"
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
export default {
  components: { Download, FilterLayout, Draggable, BaseDialog },
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
    };
  },
  computed: { ...mapGetters(["ideas", "saved", "newIdeas"]) },
  methods: {
    ...mapActions(["fetchIdeas", "compareIdeas", "countNovelty"]),
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
    async finalEvalMethod() {
      let totalEval = await this.countNovelty();
      totalEval.arr.forEach((item) => {
        if (
          item.Novel > item.NotNovel &&
          (totalEval.total == item.Novel + item.NotNovel ||
            item.Novel > totalEval.total - item.Novel)
        ) {
          let desc = this.ideas.find((idea) => idea.title == item.title)
            .description;
          this.finalEvaluation.push({
            classification: "Novel",
            title: item.title,
            novelAnswers: item.NovelAnswers.join(" "),
            description: desc,
            descAndAnswers: desc + [...new Set(item.NovelAnswers)].join(" "),
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
          this.finalEvaluation.push({
            classification: "Not Novel",
            title: item.title,
            notNovelAnswers: item.NotNovelAnswers.join(" "),
            description: desc,
            descAndAnswers: desc + [...new Set(item.NotNovelAnswers)].join(" "),
            position: {
              left: this.randomIntFromInterval(1000, 1410),
              top: this.randomIntFromInterval(595, 800),
            },
          });
        } else {
          let desc = this.ideas.find((idea) => idea.title == item.title)
            .description;
          this.finalEvaluation.push({
            classification: "",
            title: item.title,
            description: desc,
            descAndAnswers: desc,
            position: {
              left: this.randomIntFromInterval(455, 995),
              top: this.randomIntFromInterval(340, 590),
            },
          });
        }
      });
      console.log("This is the final evaluation", this.finalEvaluation);
    },
    async similarityMethod() {
      let allSimilarity = [];
      let b = [];
      let newArr = [];
      this.newIdeas.forEach(async (item, index) => {
        this.convertedNewIdea.push({
          ...item,
          title: this.finalEvaluation[index].title,
        });
      });

      // Do not forget to uncomment line 166 & 167
      //  compare each new idea with old idea to get the most similar one
      for (const item of this.convertedNewIdea) {
        allSimilarity = [];
        b = [];
        for (const final of this.finalEvaluation) {
          let text1 = item.description.split(" ").join("%20") + "%20";
          let text2 = final.description.split(" ").join("%20") + "%20";
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
                left: old.position.left + 60,
                top: old.position.top + 60,
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
        this.arrowArray.push({
          oldPosition: this.ideas.find((idea) => item.oldIdea === idea.title)
            .position,
          newPosition: this.importedIdea.find((im) => item.newIdea === im.title)
            .position,
        });
      }
      console.log("This is the positions of old new ideas", this.arrowArray);
    },

    onStart() {
      // First we need to check what is the evaluation of ideas based on all user's input
      this.finalEvalMethod().then(async () => {
        this.sim = await this.similarityMethod();
      });
    },
  },
  created() {
    this.fetchIdeas()
      .then(() => {
        this.onStart();
        console.log("this is the new ideas", this.newIdeas);      
        })
      .catch((err) => {
        console.log(err);
      });
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

#markerArrow {
  fill: red;
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
  position: absolute;
  top: 0;
  height: 80px;
  width: 80px;
  border-radius: 50%;
  background: #3d9eec;
  color: #0e0d0d;
  text-align: center;
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
