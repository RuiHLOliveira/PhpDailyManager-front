<template>
  <div>
    <div v-if="busy" class="inlineLoaderContainer">
      <div>
        Aguarde...
      </div>
      <div class="inlineLoader"></div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      ini: ''
    }
  },
  props: {
    busy: Boolean
  }
}
</script>

<style>
.inlineLoaderContainer {
  /* position: absolute; */
  /* top: 0; */
  /* left: 0; */
  /* width: 100vw; */
  /* height: 100vh; */
  margin: 0 auto;
  padding: 10px;
  border-radius: 5px;
  width: 140px;
  height: 60px;
  background: #e0e0e0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.inlineLoader {
  border: 5px solid #f3f3f3; /* Light grey */
  border-top: 5px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
