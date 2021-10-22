<template>
  <div>
    <!-- <p>{{ ideas.data }}</p> -->

    <div v-for="idea in importedIdeas" :key="idea._id">
      <draggable
        class="testmove"
        :id="idea._id"
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
    <!-- Novel Ideas Dialog -->
    <base-dialog v-if="novelDialog" :title="currentIdea.title">
      <template #default>
        <!-- <div class="questions">
          <span class="question">What is the limitation of other ideas?</span>
          <br />
          <textarea
            class="answerText"
            v-model="currentIdea.novelAnswers[0]"
            placeholder="add multiple lines"
          ></textarea>
        </div> -->

        <div class="questions">
          <span
            >What are the ideas included in this idea?(Please write the title
            name.Example:Idea 1,Idea 2,...)</span
          >
          <br />
          <textarea
            v-model="currentIdea.novelAnswers[0]"
            class="answerText"
            placeholder="add multiple lines"
          ></textarea>
        </div>

        <div class="questions">
          <span>What is radically new about this idea?</span>
          <br />
          <textarea
            v-model="currentIdea.novelAnswers[1]"
            class="answerText"
            placeholder="add multiple lines"
          ></textarea>
        </div>
      </template>
      <template #actions>
        <button @click="closeNovel">Okay</button>
      </template>
    </base-dialog>
    <!-- Not Novel Ideas Dialog -->
    <base-dialog v-if="antiNovelDialog" :title="currentIdea.title">
      <template #default>
        <div class="questions">
          <span>What is the limitation of this idea?</span>
          <br />
          <textarea
            v-model="currentIdea.notNovelAnswers[0]"
            class="answerText"
            placeholder="add multiple lines"
          ></textarea>
        </div>
        <div class="questions">
          <span>Why is this idea not novel?</span>
          <br />
          <textarea
            v-model="currentIdea.notNovelAnswers[1]"
            class="answerText"
            placeholder="add multiple lines"
          ></textarea>
        </div>
        <div class="questions">
          <span>Why is this idea not useful?</span>
          <br />
          <textarea
            v-model="currentIdea.notNovelAnswers[2]"
            class="answerText"
            placeholder="add multiple lines"
          ></textarea>
        </div>
        <!-- <div class="questions">
          <span>Can you name similar idea(s) that already exist here?</span>
          <br />
          <textarea
            v-model="currentIdea.notNovelAnswers[3]"
            class="answerText"
            placeholder="add multiple lines"
          ></textarea>
        </div> -->
      </template>
      <template #actions>
        <button @click="closeAntiNovel">Okay</button>
      </template>
    </base-dialog>
    <button
      type="button"
      id="liveToast"
      class="btn btnPosition"
      @click="onSave"
    >
      Save Evaluation
    </button>
    <file-reader
      @load="autoEval"
      class="btn evalBtn"
      title="Automatic Evaluation"
    >
    </file-reader>
    <div
      v-if="toast"
      class="alert alert-light alert-dismissible fade show"
      role="alert"
    >
      Your evaluation is saved!
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        @click="closeAlert"
      ></button>
    </div>
  </div>
</template>

<script>
import Draggable from "./Draggable.vue";
import BaseDialog from "./BaseDialog.vue";
import FileReader from "./FileReader.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  components: {
    Draggable,
    BaseDialog,
    FileReader,
  },
  data() {
    return {
      importedIdeas: [],
      clicked: false,
      currentTitle: null,
      currentDescription: null,
      novelDialog: false,
      novelTitle: null,
      antiNovelDialog: false,
      antiNovelTitle: null,
      currentIdea: null,
      toast: false,
    };
  },
  methods: {
    ...mapActions([
      "fetchIdeas",
      "updateIdea",
      "compareIdeas",
      "countNovelty",
      "importNewDescription",
    ]),
    ...mapMutations(["UPDATE_SAVED", "SET_NEW_IDEAS"]),
    toggleClick(_title, _desc) {
      this.currentTitle = _title;
      this.currentDescription = _desc;
      this.clicked = true;
    },
    onSave() {
      this.importedIdeas.forEach((idea) => {
        this.onUpdate(idea);
      });
      console.log(this.ideas);
      this.UPDATE_SAVED(true);
      this.toast = true;
    },
    closeAlert() {
      this.toast = false;
    },
    onUpdate(change) {
      this.updateIdea(change)
        .then(() => {
          this.fetchIdeas()
            .then(() => {})
            .catch((err) => {
              console.log("Error in fetching the user's ideas ", err);
            });
        })
        .catch((err) => {
          console.log("Error has happened regarding the update function", err);
        });
    },
    closeDialog() {
      this.clicked = false;
    },
    closeNovel() {
      this.novelDialog = false;
      const index = this.importedIdeas.findIndex(
        (idea) => idea._id === this.currentIdea._id
      );
      let newNovelanswers = [];
      if (this.currentIdea.novelAnswers[0].toUpperCase().includes("IDEA")) {
        let titles = this.currentIdea.novelAnswers[0].split(",");
        titles.forEach((title) => {
          newNovelanswers.push(
            this.importedIdeas.find((idea) => idea.title == title).description
          );
        });
      } else if (this.currentIdea.novelAnswers[0]) {
        newNovelanswers.push(this.currentIdea.novelAnswers[0]);
      }
      newNovelanswers.push(this.currentIdea.novelAnswers[1]);
      this.importedIdeas[index] = {
        ...this.importedIdeas[index],
        novelAnswers: newNovelanswers,
        notNovelAnswers: ["", "", ""],
      };
    },
    closeAntiNovel() {
      this.antiNovelDialog = false;
      const index = this.importedIdeas.findIndex(
        (idea) => idea._id === this.currentIdea._id
      );
      this.importedIdeas[index] = {
        ...this.importedIdeas[index],
        notNovelAnswers: this.currentIdea.notNovelAnswers,
        novelAnswers: ["", ""],
      };
    },
    positionCalculation(x, y, id) {
      const index = this.importedIdeas.findIndex((idea) => idea._id === id);
      this.importedIdeas[index] = {
        ...this.importedIdeas[index],
        position: {
          left: x,
          top: y,
        },
      };
      this.currentIdea = this.importedIdeas[index];
      if (104 < y && y < 335 && 42 < x && x < 450) {
        this.novelDialog = true;
        this.importedIdeas[index] = {
          ...this.importedIdeas[index],
          classification: "Novel",
          notNovelAnswers: ["", "", ""],
        };
      } else if (595 < y && y < 800 && 1000 < x && x < 1410) {
        this.antiNovelDialog = true;
        this.importedIdeas[index] = {
          ...this.importedIdeas[index],
          classification: "Not Novel",
          novelAnswers: ["", ""],
        };
      } else {
        this.importedIdeas[index] = {
          ...this.importedIdeas[index],
          classification: "",
          notNovelAnswers: ["", "", ""],
          novelAnswers: ["", ""],
        };
      }
    },
    autoEval(input) {
      // For next phase please read the comments in this function
      // For this function it's better to go to another page and do the rest of evaluation there
      console.log("Auto evaluation");
      const loads = input.split("//");
      const descs = { descriptions: loads };
      console.log("This is the descs", descs);
      this.importNewDescription(descs)
        .then(() => {
          this.fetchIdeas()
            .then(() => {
              this.$router.push("/automaticEvaluation");
            })
            .catch((err) => {
              console.log("Error in fetching the user's  ideas ", err);
            });
        })
        .catch((err) => {
          console.log("Error in importing the new descriptions ", err);
        });
    },
    async topicExtractor() {
      for (let input of this.ideas) {
        const formdata = new FormData();
        formdata.append("key", "e56b7da7f51fdb919509b4c93e59b6bf");
        formdata.append("txt", input.description);
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
                  this.importedIdeas.push(
                    Object.assign({}, JSON.parse(JSON.stringify(input)), {
                      extractedTopic: newBody.concept_list[0].form,
                    })
                  );
                } else {
                  this.importedIdeas.push(
                    Object.assign({}, JSON.parse(JSON.stringify(input)), {
                      extractedTopic: "no title",
                    })
                  );
                }
              })
              .catch((err) => console.log("Topic Api error: ", err));
          })
          .catch((error) => console.log("error", error));

        //   console.log(newArr);
        //   // return importArr;
      }
    },
  },

  created() {
    //fetching the idea from user ideas model
    this.fetchIdeas()
      .then(() => {
        this.UPDATE_SAVED(false);
        this.topicExtractor().then(() => {
          console.log("This is the imported", this.importedIdeas);
        });

        // this.importedIdeas = this.ideas;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  computed: { ...mapGetters(["ideas", "token", "newIdeas"]) },
};
</script>

<style>
.testmove {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  height: 160px;
  width: 160px;
  border-radius: 50%;
  color: #0e0d0d;
  text-align: center;
}
.questions {
  margin-bottom: 0.5rem;
}
.answerText {
  margin-top: 0.5rem;
  width: 37rem;
  height: 4rem;
}
.btnPosition {
  color: #fff !important;
  font-weight: bold;
  font-size: 15px;
  flex: 1;
  width: 10rem;
  height: 3rem;
  top: 1rem;
  right: 0.6rem;
  position: absolute;
}
.evalBtn {
  color: #fff !important;
  font-weight: bold;
  font-size: 15px;
  flex: 1;
  width: 12rem;
  height: 3rem;

  top: 1rem;
  right: 12rem;
  position: absolute;
}
.alert.alert-light.alert-dismissible.fade.show {
  /* display: flex; */
  width: 20rem;
  top: -35vh;
  left: 64vh;
}
</style>
