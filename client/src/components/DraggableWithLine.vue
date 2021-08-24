<template>
  <div style="" ref="draggableContainer" id="draggable-container">
    <div
      id="draggable-header"
      @mousedown="dragMouseDown"
      @dblclick="$emit('openDialog', title, description)"
    >
      <!-- <p>
        {{ title }}
      </p> -->
      <!-- <p>
        {{ extractedTopic }}
      </p> -->
      <!-- <svg id="connectors" height="100%" width="100%">
        <line x1="183" y1="686" x2="337" y2="147" class="arrow" />
      </svg> -->
      <svg width="300" height="100">
        <path
          d="M30,150 L100,50"
          style="stroke:red; stroke-width: 1.25px; fill: none;
                 marker-end: url(#arrow);"
        />
      </svg>
      <!-- <p>{{ arrow }}</p> -->
      <img
        :src="picture"
        style="height: 60px;
  width: 60px;
  border-radius: 50%;"
        alt="no image"
      />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  name: "Draggable",
  props: {
    title: String,
    left: Number,
    top: Number,
    id: String,
    description: String,
    extractedTopic: String,
    arrow: String,
  },
  data: function() {
    return {
      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0,
      },
      picture: "",
    };
  },
  computed: {},
  methods: {
    dragMouseDown: function(event) {
      event.preventDefault();
      // get the mouse cursor position at startup:
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;
      document.onmousemove = this.elementDrag;
      document.onmouseup = this.closeDragElement;
    },
    elementDrag: function(event) {
      event.preventDefault();
      this.positions.movementX = this.positions.clientX - event.clientX;
      this.positions.movementY = this.positions.clientY - event.clientY;
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;
      // set the element's new position:
      this.$refs.draggableContainer.style.top =
        this.$refs.draggableContainer.offsetTop -
        this.positions.movementY +
        "px";
      this.$refs.draggableContainer.style.left =
        this.$refs.draggableContainer.offsetLeft -
        this.positions.movementX +
        "px";
    },
    closeDragElement() {
      //sending the position of dropped element to the parent
      this.$emit(
        "posCalc",
        this.positions.clientX,
        this.positions.clientY,
        this.id
      );
      document.onmouseup = null;
      document.onmousemove = null;
    },
    calcPosOfBox() {
      //const boxABB = this.$refs['draggableContainer'].getBoundingClientRect();
      this.$refs["draggableContainer"].style.left = this.left - 25 + "px";
      this.$refs["draggableContainer"].style.top = this.top - 35 + "px";
      // d.style.left = 50 + "px";
      // d.style.top = 50 + "px";
      //console.log(boxABB);
    },
    async wiki(topic) {
      var url = "https://en.wikipedia.org/w/api.php";

      var params = {
        action: "query",
        format: "json",
        list: "allimages",
        aifrom: topic,
        ailimit: "3",
      };

      url = url + "?origin=*";
      Object.keys(params).forEach(function(key) {
        url += "&" + key + "=" + params[key];
      });

      this.picture = await fetch(url)
        .then(function(response) {
          return response.json();
        })
        .then(function(response) {
          var images = response.query.allimages;
          // console.log(images[1].url);
          return images[1].url;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },
  mounted() {
    this.calcPosOfBox();
    // console.log("This is the extractedTopic", this.extractedTopic);
    this.wiki(this.extractedTopic);
  },
};
</script>

<style scoped>
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
.questions {
  display: flex;
}
#draggable-container {
  /* top: 100px;
  left: 150px; */
  position: absolute;
  z-index: 9;
}
#draggable-header {
  z-index: 10;
}
</style>
