<template>
  <div style="" ref="draggableContainer" id="draggable-container">
    <div
      id="draggable-header"
      @mousedown="dragMouseDown"
      @dblclick="$emit('openDialog', title, description)"
    >
      <p>
        {{ title }} - top: {{ positions.clientY }} -left:{{ positions.clientX }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  name: 'Draggable',
  props: {
    title: String,
    left: Number,
    top: Number,
    id: String,
    description: String
  },
  data: function() {
    return {
      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0
      }
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
        'px';
      this.$refs.draggableContainer.style.left =
        this.$refs.draggableContainer.offsetLeft -
        this.positions.movementX +
        'px';
    },
    closeDragElement() {
      //sending the position of dropped element to the parent
      this.$emit(
        'posCalc',
        this.positions.clientX,
        this.positions.clientY,
        this.id,
        this.title
      );
      document.onmouseup = null;
      document.onmousemove = null;
    },
    calcPosOfBox() {
      //const boxABB = this.$refs['draggableContainer'].getBoundingClientRect();
      this.$refs['draggableContainer'].style.left = this.left - 25 + 'px';
      this.$refs['draggableContainer'].style.top = this.top - 35 + 'px';
      // d.style.left = 50 + "px";
      // d.style.top = 50 + "px";
      //console.log(boxABB);
    }
  },
  mounted() {
    this.calcPosOfBox();
  }
};
</script>

<style scoped>
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
