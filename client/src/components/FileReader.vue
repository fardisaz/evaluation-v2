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

      reader.onload = (e) => {
        this.$emit("load", e.target.result);
        // console.log(e.target.result);
      };

      reader.readAsText(file);
    },
  },
};
</script>

<style>
.text-reader input {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
  cursor: pointer;
}
.text-reader {
  border: none;
  text-decoration: none;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 46px;
  max-width: 320px;
  min-height: 46px;
  color: inherit;
  cursor: pointer;
}
label.text-reader.import_button {
  top: 1rem;
  right: 0.6rem;
}
</style>
