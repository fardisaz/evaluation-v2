<template>
  <div>
    <div v-for="idea in ideas" :key="idea.id">
      <draggable
        class="testmove"
        :id="idea.id"
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
    <base-dialog v-if="novelDialog" :title="novelTitle">
      <template #default>
        <div class="questions">
          <span class="question">What is the limitation of other ideas?</span>
          <br />
          <textarea
            class="answerText"
            v-model="novelAnswers[0]"
            placeholder="add multiple lines"
          ></textarea>
        </div>

        <div class="questions">
          <span>What are the ideas included in this idea?</span>

          <br />
          <textarea
            v-model="novelAnswers[1]"
            class="answerText"
            placeholder="add multiple lines"
          ></textarea>
        </div>

        <div class="questions">
          <span>What is radically new about this idea?</span>

          <br />
          <textarea
            v-model="novelAnswers[2]"
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
    <base-dialog v-if="antiNovelDialog" :title="antiNovelTitle">
      <template #default>
        <div class="questions">
          <span>What is the limitation of this idea?</span>
          <br />
          <textarea
            v-model="antiNovelAnswers[0]"
            class="answerText"
            placeholder="add multiple lines"
          ></textarea>
        </div>
        <div class="questions">
          <span>Why is this idea not novel?</span>
          <br />
          <textarea
            v-model="antiNovelAnswers[1]"
            class="answerText"
            placeholder="add multiple lines"
          ></textarea>
        </div>
        <div class="questions">
          <span>Why is this idea not useful?</span>
          <br />
          <textarea
            v-model="antiNovelAnswers[2]"
            class="answerText"
            placeholder="add multiple lines"
          ></textarea>
        </div>
        <div class="questions">
          <span>Can you name similar idea(s) that already exist here?</span>
          <br />
          <textarea
            v-model="antiNovelAnswers[3]"
            class="answerText"
            placeholder="add multiple lines"
          ></textarea>
        </div>

        <!-- <div class="questions">
          <span>What is radically new about this idea?</span>
          <p style="white-space: pre-line;">{{ message }}</p>
          <br />
          <textarea
            v-model="message"
            placeholder="add multiple lines"
          ></textarea>
        </div> -->
      </template>
      <template #actions>
        <button @click="closeAntiNovel">Okay</button>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import Draggable from './Draggable.vue';
// import ideas from "../../db.json";
import BaseDialog from './BaseDialog.vue';
import { mapState } from 'vuex';
export default {
  components: {
    Draggable,
    BaseDialog
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
      novelAnswers: ['', '', ''],
      antiNovelAnswers: ['', '', '', ''],
      currentIdea: null
    };
  },
  methods: {
    toggleClick(_title, _desc) {
      this.currentTitle = _title;
      this.currentDescription = _desc;
      this.clicked = true;
    },
    closeDialog() {
      this.clicked = false;
      console.log(this.novelAnswers);
    },
    closeNovel() {
      this.novelDialog = false;
      //console.log(this.novelAnswers);
      //console.log(this.currentIdea);
      this.$store.dispatch('changeIdeas', this.currentIdea);
      this.novelAnswers = ['', '', ''];
    },
    closeAntiNovel() {
      this.antiNovelDialog = false;
      this.$store.dispatch('changeIdeas', this.currentIdea);
      this.novelAnswers = ['', '', '', ''];
    },
    positionCalculation(x, y, id, title) {
      //console.log("here is the calculation", x, y, id);
      const index = this.ideas.findIndex(idea => idea.id === id);
      const newIdea = {
        ...this.ideas[index],
        position: {
          left: x,
          top: y
        }
      };
      this.currentIdea = newIdea;
      //console.log(newIdea);
      this.$store.dispatch('changeIdeas', newIdea);
      //console.log(this.$store.state.ideas);
      if (110 < y && y < 300 && 10 < x && x < 430) {
        this.novelDialog = true;
        this.novelTitle = title;
        newIdea.classification = 'Novel';
        newIdea.answers = this.novelAnswers;
        this.$store.dispatch('changeIdeas', newIdea);
      } else if (607 < y && y < 809 && 1005 < x && x < 1407) {
        this.antiNovelDialog = true;
        this.antiNovelTitle = title;
        newIdea.classification = 'Not Novel';
        newIdea.answers = this.antiNovelAnswers;
        this.$store.dispatch('changeIdeas', newIdea);
      }
    }
  },
  created() {
    //fetching the idea from json server
    this.$store.dispatch('fetchIdeas');
  },
  computed: mapState(['ideas'])
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
  margin-bottom: 1rem;
}
.answerText {
  margin-top: 1rem;
  width: 37rem;
  height: 4rem;
}
</style>
