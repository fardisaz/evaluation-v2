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
    <button @click="onAutomatic">Click to see</button>
    <div v-for="(idea,index) in importedIdea" :key="index">
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
        importedIdea:[],
        finalEvaluation:[],
        // sim:[0.51,0.63,0.23,0.31,0.45]
        sim:[]
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
            let desc=this.ideas.find((idea)=>idea.title==item.title).description
            this.finalEvaluation.push({classification: "Novel",title:item.title,novelAnswers:item.NovelAnswers.join(" "),
            description:desc,
            position:{left: this.randomIntFromInterval(42, 450),
      top: this.randomIntFromInterval(104, 335)}})
          }
           else if(item.NotNovel > item.Novel &&
              (totalEval.total ==
              item.Novel + item.NotNovel || item.NotNovel>totalEval.total-item.NotNovel)){
                let desc=this.ideas.find((idea)=>idea.title==item.title).description
                this.finalEvaluation.push({classification: "Not Novel",title:item.title,notNovelAnswers:item.NotNovelAnswers.join(" "),
                description:desc,
            position:{left: this.randomIntFromInterval(1000, 1410),
       top: this.randomIntFromInterval(595, 800)}})
              }
              else{
                let desc=this.ideas.find((idea)=>idea.title==item.title).description
                this.finalEvaluation.push({classification: "",title:item.title,
                description:desc,
            position:{left: this.randomIntFromInterval(455, 995),
       top: this.randomIntFromInterval(340, 590),}})
              }
  })
  
  console.log("This is the final evaluation",this.finalEvaluation);
},
async similarityMethod(){
  let newArr=[];
   this.newIdeas.forEach(async(item,index)=>{
     let text1=item.description.split(" ").join("%20") + "%20";
     let text2=this.finalEvaluation[index].description.split(" ").join("%20") + "%20";
    this.convertedNewIdea.push({
              ...item,
              title:this.finalEvaluation[index].title
            })
      let similarity=await this.compareIdeas({text1,text2})
      newArr.push({similarity,title:this.finalEvaluation[index].title})
     
   })
  //     newArr= new Promise((resolve) => {
  //   resolve([{title:"Idea 3",similarity:0.51},{title:"Idea 1",similarity:0.63},{title:"Idea 5",similarity:0.23},{title:"Idea 2",similarity:0.31},{title:"Idea 4",similarity:0.45}]);
  // })
   return newArr
},
onAutomatic(){
  // console.log("this is the converted",this.convertedNewIdea);
this.convertedNewIdea.forEach(async(load, index) => {
  console.log(load.title);
          if (this.sim.find(s=>s.title==load.title).similarity > 0.5) {
            // console.log(arr[index]);
            this.importedIdea.push({
              ...load,
              ...this.finalEvaluation[index]
            })
             }
    else{
      this.importedIdea.push({...load,
      // title:this.finalEvaluation[index].title,
      classification:"",
            position: {
      left: this.randomIntFromInterval(455, 995),
      top: this.randomIntFromInterval(340, 590)}
    })}
      })
       console.log("This is the imported Ideas",this.importedIdea); 
},
 onStart(){
    // First we need to check what is the evaluation of ideas based on all user's input
      this.finalEvalMethod().then(async()=>{
        this.sim=await this.similarityMethod()
        console.log("This is the SIM",this.sim);
      });  
  }
  },
  created() {
    this.fetchIdeas()
      .then(() => {
           this.onStart()
           
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
