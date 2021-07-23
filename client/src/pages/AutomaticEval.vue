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
        sim:[],
        currentTitle: null,
      currentDescription: null,
      }
    },
  computed: { ...mapGetters(["ideas", "saved","newIdeas"]) },
  methods: { ...mapActions(["fetchIdeas","compareIdeas", "countNovelty"]) ,
  ...mapMutations(["UPDATE_SAVED","SET_NEW_IDEAS"]),
   randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
},
toggleClick(_title, _desc) {
      this.currentTitle = _title;
      this.currentDescription = _desc;
      this.clicked = true;
    },
    closeDialog() {
      this.clicked = false;
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
  let allSimilarity=[]
let b=[];
let newArr=[];
  this.newIdeas.forEach(async(item,index)=>{
    this.convertedNewIdea.push({
              ...item,
              title:this.finalEvaluation[index].title
            })})
          //  compare each new idea with old idea to get the most similar one
            for(const item of this.convertedNewIdea){
              allSimilarity=[];
              b=[];
              for(const final of this.finalEvaluation){
                 let text1=item.description.split(" ").join("%20") + "%20";
     let text2=final.description.split(" ").join("%20") + "%20";
     let similarity= await this.compareIdeas({text1,text2})
     allSimilarity.push({similarity,oldIdea:final.title,newIdea:item.title})
     b.push(similarity)
              }
              newArr.push(allSimilarity.find(a=>(a.similarity==Math.max(...b))))
            }
     
    //Here is for test
    
    // const items=[this.convertedNewIdea[0],this.convertedNewIdea[2]]
    // for (const item of items){
    //    b=[]
    //   allSimilarity=[]
    //     for(const final of this.finalEvaluation){
    //       let text1=item.description.split(" ").join("%20") + "%20";
    //  let text2=final.description.split(" ").join("%20") + "%20";
    //  let similarity= await this.compareIdeas({text1,text2})
    //  allSimilarity.push({similarity,oldIdea:final.title,newIdea:item.title})
    //  b.push(similarity)
    //     }
    //     console.log("This is all similarity",allSimilarity);
    //     console.log("This is b",b);
    //     newArr.push(allSimilarity.find(a=>(a.similarity==Math.max(...b))))
        
    // }

  
    
   
  //  Mock api response for testing
  //   newArr= new Promise((resolve) => {
  //   resolve([{oldIdea:"Idea 1",newIdea:"Idea 3",similarity:0.51},{oldIdea:"Idea 2",newIdea:"Idea 4",similarity:0.63},{oldIdea:"Idea 3",newIdea:"Idea 5",similarity:0.23},{oldIdea:"Idea 4",newIdea:"Idea 2",similarity:0.31},{oldIdea:"Idea 5",newIdea:"Idea 1",similarity:0.45}]);
  //  })
   console.log("This is the new array",newArr)
   let old;
   for(const load of this.convertedNewIdea){
      if (newArr.find(s=>s.newIdea==load.title).similarity > 0.5) {
            // console.log(arr[index]);
            old=this.finalEvaluation.find(final=>(final.title==newArr.find(s=>s.newIdea==load.title).oldIdea))
            this.importedIdea.push({
              ...load,
              classification:old.classification,
              position:old.position
            })
             }
    else{
      this.importedIdea.push({...load,
      classification:"",
            position: {
      left: this.randomIntFromInterval(455, 995),
      top: this.randomIntFromInterval(340, 590)}
    })}
   }
       console.log("This is the imported Ideas",this.importedIdea); 
},

 onStart(){
    // First we need to check what is the evaluation of ideas based on all user's input
      this.finalEvalMethod().then(async()=>{
         this.sim=await this.similarityMethod()
      })
  }
  },
  created() {
    this.fetchIdeas()
      .then(() => {
           this.onStart()
        console.log("this is the new ideas",this.newIdeas);        
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
  background: #3d9eec;
  top: 1rem;
  right: 0.6rem;
  position: absolute;
}
.btnSide{
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
</style>
