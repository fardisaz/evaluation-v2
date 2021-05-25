<template>
  <label class="text-reader">
    Load Ideas
    <input type="file" @change="loadTextFromFile" />
  </label>
</template>

<script>
export default {
  methods: {
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();

      reader.onload = e => {
        this.$emit('load', e.target.result);
        // console.log(e.target.result);
      };

      reader.readAsText(file);
    }
  }
};
</script>

<style>
/* .text-reader {
  position: relative;
  overflow: hidden;
  display: flex; */

/* Fancy button looking */
/* border: 2px solid black;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
  min-width: 46px;
  max-width: 320px;
  min-height: 46px;
  border-radius: 3px;
  align-items: center;
  justify-content: center;
  border: none;
  text-decoration: none;
  color: inherit;
} */
.text-reader input {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
}
.text-reader {
  display: flex;
  min-width: 46px;
  max-width: 320px;
  min-height: 46px;
  border-radius: 3px;
  align-items: center;
  justify-content: center;
  border: none;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}
</style>
