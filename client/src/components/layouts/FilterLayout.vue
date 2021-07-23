<template>
  <div>
    <div class="classification">
      <h3>Novel Ideas</h3>
    </div>
    <div class="classification notNovel">
      <h3>Not Novel Ideas</h3>
    </div>
  </div>
</template>
<script>
export default {};
</script>

<style>
.classification {
  display: flex;
  color: rgb(7, 7, 7);
  justify-content: center;
  align-items: flex-start;
  height: 230px;
  width: 450px;
  background-color: #9dd9f7;
  border-radius: 10%;
}
.notNovel {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
