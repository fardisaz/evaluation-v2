<template>
  <div class="container">
    <div class="myDiv"></div>
    <dialog open>
      <header>
        <slot name="header">
          <span
            class="d-inline-block"
            tabindex="0"
            data-toggle="tooltip"
            :title="description"
          >
            <button
              class="btn btn-light btn-lg"
              style="pointer-events: auto;"
              type="button"
              disabled
            >
              {{ title }}
            </button>
          </span>
        </slot>
      </header>
      <section>
        <slot></slot>
      </section>
      <menu>
        <slot name="actions">
          <!-- <base-button @click="$emit('close')">Close</base-button> -->
        </slot>
      </menu>
    </dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
  },
  emits: ["close"],
};
</script>

<style scoped>
.myDiv {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}
dialog {
  position: fixed;
  top: 2vh;
  left: 10%;
  width: 80%;
  z-index: 100;
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 0;
  margin: 0;
  overflow: hidden;
}
header {
  background-color: #3d9eec;
  color: white;
  width: 100%;
  padding: 1rem;
}
header h2 {
  margin: 0;
}
section {
  padding: 1rem;
}
menu {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  margin: 0;
}
@media (min-width: 768px) {
  dialog {
    left: calc(50% - 20rem);
    width: 40rem;
  }
}
</style>
