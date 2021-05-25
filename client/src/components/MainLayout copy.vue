<template>
  <div>
    <!-- <button @click="saveIdeas">Save evaluation</button> -->
    <!-- Component to export JSON file -->
    <download
      :download-data="$store.state.ideas"
      file-type="json"
      file-name="Ideas"
      class="periodic_table"
      button-text="Save Evaluation"
    >
    </download>
    <!-- Import txt file -->
    <!-- <textarea rows="10" v-model="text"></textarea> -->
    <file-reader @load="loadIdeas" class="import_button"></file-reader>
    <div class="classification">
      <h3>Novel Ideas</h3>
    </div>
    <div class="classification notNovel">
      <h3>Not Novel Ideas</h3>
    </div>

    <draggable-items></draggable-items>
  </div>
</template>

<script>
import Download from './Download.vue';
import DraggableItems from './DraggableItems.vue';
import FileReader from './FileReader.vue';

export default {
  components: { DraggableItems, Download, FileReader },

  data() {
    return {
      isDescriptionOpened: false,
      text: ''
    };
  },
  methods: {
    loadIdeas(input) {
      //loaded ideas by the user
      const loads = input.split('//');
      // console.log(loads);
      let ideas = this.$store.state.ideas;
      //write the loaded ideas into the description of idea json
      ideas.map((idea, index) => {
        idea.description = loads[index];
      });
    }
  }
};
</script>

<style scoped>
.classification {
  display: flex;
  color: rgb(234, 206, 245);
  justify-content: center;
  align-items: flex-start;
  height: 230px;
  width: 450px;
  background-color: #725e88;
  border-radius: 10%;
}
.notNovel {
  position: absolute;
  bottom: 0;
  right: 0;
}
.periodic_table {
  color: #fff !important;
  font-weight: bold;
  font-size: 15px;
  flex: 1;
  width: 10rem;
  background: rgb(167, 148, 179);
  right: 0;
  position: absolute;
}
.import_button {
  color: #fff !important;
  font-weight: bold;
  font-size: 15px;
  width: 10rem;
  background: rgb(167, 148, 179);
  flex: 0;
  right: 0px;
  top: 150px;
  position: absolute;
}
</style>
