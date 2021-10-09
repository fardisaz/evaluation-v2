<template>
  <div>
    <svg id="connectors" height="100%" width="100%">
      <line
        :x1="oldLeft + 30"
        :y1="oldTop - 20"
        :x2="newLeft + 50"
        :y2="newTop + 10"
        class="arrow"
      ></line>
      <rect
        :x="(oldLeft + newLeft) / 2"
        :y="(oldTop + newTop) / 2"
        width="150"
        height="20"
        style="fill:yellow;stroke:pink;stroke-width:5;stroke-opacity:0.9"
      />
      <text
        :x="(oldLeft + newLeft) / 2 + 15"
        :y="(oldTop + newTop) / 2 + 15"
        fill="black"
      >
        similarity: {{ similarity }}
      </text>
    </svg>
  </div>
</template>

<script>
export default {
  //   name: "ConnectedIdeas",
  props: {
    oldLeft: Number,
    oldTop: Number,
    newLeft: Number,
    newTop: Number,
    similarity: Number,
  },
};
</script>

<style scopped>
#connectors {
  top: 0;
  left: 0;
  position: absolute;
}
.arrow {
  stroke: red;
  stroke-width: 2;
  marker-end: url(#markerArrow);
}
</style>
