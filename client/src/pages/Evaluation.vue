<template>
  <div>
    <download
      :download-data="$store.state.ideas"
      file-type="json"
      file-name="Ideas"
      class="periodic_table"
      button-text="Save Evaluation"
    >
    </download>
    <draggable-items></draggable-items>
  </div>
</template>

<script>
import Download from '../components/Download';
import DraggableItems from '../components/DraggableItems.vue';
export default {
  components: { Download, DraggableItems }
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
  right: 0;
  top: 90px;
  position: absolute;
}
</style>
