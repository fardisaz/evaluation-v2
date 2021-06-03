<template>
  <div>
    <p>{{ ideas.data }}</p>
    <div v-for="idea in ideas" :key="idea._id">
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
  </div>
</template>

<script>
import Draggable from "./Draggable.vue";
import BaseDialog from "./BaseDialog.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    Draggable,
    BaseDialog,
  },
  data() {
    return {
      //ideas: [],
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
    };
  },
  methods: {
    ...mapActions(["fetchIdeas", "updateIdea"]),
    toggleClick(_title, _desc) {
      this.currentTitle = _title;
      this.currentDescription = _desc;
      this.clicked = true;
    },
    onUpdate(change) {
      this.updateIdea(change)
        .then(() => {})
        .catch((err) => {
          console.log("Error has happened regarding the update function", err);
        });
    },
    closeDialog() {
      this.clicked = false;
    },
    closeNovel() {
      this.novelDialog = false;
      //console.log(this.novelAnswers);
      console.log(this.currentIdea);
      this.onUpdate(this.currentIdea);
      // if (this.currentIdea.classification == "") {
      //   this.novelAnswers = ["", "", ""];
      // }
    },
    closeAntiNovel() {
      this.antiNovelDialog = false;
      this.onUpdate(this.currentIdea);
      // if (this.currentIdea.classification == "") {
      //   this.antiNovelAnswers = ["", "", ""];
      // }
    },
    positionCalculation(x, y, id, title) {
      // console.log("here is the calculation", x, y, id);
      console.log("this is title", title);
      const index = this.ideas.findIndex((idea) => idea._id === id);
      const newIdea = {
        ...this.ideas[index],
        position: {
          left: x,
          top: y,
        },
      };
      this.currentIdea = newIdea;
      console.log(this.currentIdea);
      this.onUpdate(newIdea);
      if (104 < y && y < 335 && 42 < x && x < 450) {
        this.novelDialog = true;
        this.currentIdea.classification = "Novel";
      } else if (595 < y && y < 800 && 1000 < x && x < 1410) {
        this.antiNovelDialog = true;
        this.currentIdea.classification = "Not Novel";
      } else {
        this.currentIdea.classification = "";
        this.onUpdate(this.currentIdea);
      }
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
</style>
