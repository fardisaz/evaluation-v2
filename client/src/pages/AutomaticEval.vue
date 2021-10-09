<template>
  <div>
    <first-automatic></first-automatic>
    <button class="btn " @click="clickToshow" style="cursor:pointer">
      {{ number }}
    </button>
  </div>
</template>

<script>
import FirstAutomatic from "../components/FirstAutomatic.vue";
export default {
  components: { FirstAutomatic },
  data() {
    return {
      number: 0,
    };
  },
  methods: {
    clickToshow() {
      // this.showSim = true;
      this.number++;
    },
  },
};
</script>

<style></style>
