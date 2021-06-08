<template>
  <div>
    <p>{{ ideas.data }}</p>
    <div v-for="idea in importedIdeas" :key="idea._id">
      <draggable
        class="testmove"
        :id="idea._id"
        :title="idea.title"
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
        <div class="questions">
          <span class="question">What is the limitation of other ideas?</span>
          <br />
          <textarea
            class="answerText"
            v-model="currentIdea.answers[0]"
            placeholder="add multiple lines"
          ></textarea>
        </div>

        <div class="questions">
          <span>What are the ideas included in this idea?</span>

          <br />
          <textarea
            v-model="currentIdea.answers[1]"
            class="answerText"
            placeholder="add multiple lines"
          ></textarea>
        </div>

        <div class="questions">
          <span>What is radically new about this idea?</span>

          <br />
          <textarea
            v-model="currentIdea.answers[2]"
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
            v-model="currentIdea.answers[0]"
            class="answerText"
            placeholder="add multiple lines"
          ></textarea>
        </div>
        <div class="questions">
          <span>Why is this idea not novel?</span>
          <br />
          <textarea
            v-model="currentIdea.answers[1]"
            class="answerText"
            placeholder="add multiple lines"
          ></textarea>
        </div>
        <div class="questions">
          <span>Why is this idea not useful?</span>
          <br />
          <textarea
            v-model="currentIdea.answers[2]"
            class="answerText"
            placeholder="add multiple lines"
          ></textarea>
        </div>
        <div class="questions">
          <span>Can you name similar idea(s) that already exist here?</span>
          <br />
          <textarea
            v-model="currentIdea.answers[3]"
            class="answerText"
            placeholder="add multiple lines"
          ></textarea>
        </div>
      </template>
      <template #actions>
        <button @click="closeAntiNovel">Okay</button>
      </template>
    </base-dialog>
    <button
      type="button"
      id="liveToast"
      class="btn  btnPosition"
      @click="onSave"
    >
      Save Evaluation
    </button>
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
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  components: {
    Draggable,
    BaseDialog,
  },
  data() {
    return {
      importedIdeas: null,
      clicked: false,
      currentTitle: null,
      currentDescription: null,
      ideaItem: {},
      novelDialog: false,
      novelTitle: null,
      antiNovelDialog: false,
      antiNovelTitle: null,
      novelAnswers: ["", "", ""],
      antiNovelAnswers: ["", "", ""],
      currentIdea: null,
      toast: false,
    };
  },
  methods: {
    ...mapActions(["fetchIdeas", "updateIdea"]),
    ...mapMutations(["UPDATE_SAVED"]),
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
      this.importedIdeas[index] = {
        ...this.importedIdeas[index],
        answers: this.currentIdea.answers,
      };
    },
    closeAntiNovel() {
      this.antiNovelDialog = false;
      const index = this.importedIdeas.findIndex(
        (idea) => idea._id === this.currentIdea._id
      );
      this.importedIdeas[index] = {
        ...this.importedIdeas[index],
        answers: this.currentIdea.answers,
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
        };
      } else if (595 < y && y < 800 && 1000 < x && x < 1410) {
        this.antiNovelDialog = true;
        this.importedIdeas[index] = {
          ...this.importedIdeas[index],
          classification: "Not Novel",
        };
      } else {
        this.importedIdeas[index] = {
          ...this.importedIdeas[index],
          classification: "",
        };
      }
    },
  },
  created() {
    //fetching the idea from user ideas model
    this.fetchIdeas();
    this.UPDATE_SAVED(false);
    this.importedIdeas = this.ideas;
  },
  computed: { ...mapGetters(["ideas"]) },
};
</script>

<style>
.testmove {
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
  background: #b9829e;
  color: #f5c9e0;
  text-align: center;
  /* justify-content: center; */
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
  background: rgb(167, 148, 179);
  right: 0;
  top: 90px;
  position: absolute;
}
.alert.alert-light.alert-dismissible.fade.show {
  /* display: flex; */
  width: 20rem;
  top: -40vh;
  left: 60vh;
}
</style>
