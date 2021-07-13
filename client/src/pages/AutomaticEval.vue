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
    <div v-for="(idea,index) in importedNewIdeas" :key="index">
      <draggable
        class="testmove"
        :id="index"
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
  </div>
</template>

<script>
import Download from "../components/Download";
import Draggable from "../components/Draggable.vue";
import BaseDialog from "../components/BaseDialog.vue";
import FilterLayout from "../components/layouts/FilterLayout.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  components: { Download, FilterLayout,Draggable,
    BaseDialog, },
    data(){
      return{
        importedNewIdeas:null,
        clicked: false,
        convertedNewIdea:[],
        finalEvaluation:[],
        sim:[0.51,0.63,0.23,0.31,0.45]
      }
    },
  computed: { ...mapGetters(["ideas", "saved","newIdeas"]) },
  methods: { ...mapActions(["fetchIdeas","compareIdeas", "countNovelty"]) ,
  ...mapMutations(["UPDATE_SAVED","SET_NEW_IDEAS"]),
   randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
},
async finalEvalMethod(){
  let totalEval = await this.countNovelty();
  totalEval.arr.forEach(item=>{
    if (
            item.Novel > item.NotNovel &&
            (totalEval.total ==
              item.Novel + item.NotNovel || item.Novel>totalEval.total-item.Novel)
          ){
            this.finalEvaluation.push({classification: "Novel",title:item.title,novelAnswers:item.NovelAnswers,
            position:{left: this.randomIntFromInterval(42, 450),
      top: this.randomIntFromInterval(104, 335)}})
          }
           else if(item.NotNovel > item.Novel &&
              (totalEval.total ==
              item.Novel + item.NotNovel || item.NotNovel>totalEval.total-item.NotNovel)){
                this.finalEvaluation.push({classification: "Not Novel",title:item.title,notNovelAnswers:item.NotNovelAnswers,
            position:{left: this.randomIntFromInterval(1000, 1410),
       top: this.randomIntFromInterval(595, 800)}})
              }
              else{
                this.finalEvaluation.push({classification: "",title:item.title,
            position:{left: this.randomIntFromInterval(455, 995),
       top: this.randomIntFromInterval(340, 590),}})
              }
  })
  console.log("This is the final evaluation",this.finalEvaluation);
},
 onStart(){
    // First we need to check what is the evaluation of ideas based on all user's input
      this.finalEvalMethod().then(()=>{
         this.newIdeas.forEach(async(load, index) => {
          if (this.sim[index] > 0.5) {
            // console.log(arr[index]);
            this.convertedNewIdea.push({
              ...load,
              ...this.finalEvaluation[index]
            })
             }
    else{
      this.convertedNewIdea.push({...load,classification:"",
            position: {
      left: this.randomIntFromInterval(455, 995),
      top: this.randomIntFromInterval(340, 590)}
    })}
      })
          // here I want to see the right evaluation for the automatic evaluation
            // let mergedDesc=idea.description+convertedAnswers.join(" ")
          //     let text1 = load.description.split(" ").join("%20") + "%20";
          // let text2 = mergedDesc.split(" ").join("%20") + "%20";
          //   let sim = await this.compareIdeas({
          //   text1,
          //   text2,
          // });
      });
     
     
  }
  },
  created() {
    this.fetchIdeas()
      .then(() => {
          this.onStart()
            console.log("This is the converted new Ideas",this.convertedNewIdea);
            
        //  this.SET_NEW_IDEAS(arr)
        console.log("this is the new ideas",this.newIdeas);
         
        // this.finalEvalMethod()
         
      })
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
  background: rgb(167, 148, 179);
  top: 1rem;
  right: 12rem;
  position: absolute;
}
</style>
