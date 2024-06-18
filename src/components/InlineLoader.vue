<style scoped>

.inlineLoaderContainer {
  /* margin: 0 auto; */
  /* padding: 10px; */
  font-size: 0.8rem;
  border-radius: 5px;
  width: 100px;
  height: 30px;
  background: #e0e0e0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.inlineLoaderContainerTexto {
  /* margin: 0 auto; */
  /* padding: 10px; */
  font-size: 0.8rem;
  border-radius: 5px;
  width: 100px;
  height: 30px;
  background: #e0e0e0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.inlineLoader {
  display: inline-block;
  vertical-align: middle;
  border: 3px solid #f3f3f3; /* Light grey */
  border-top: 3px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 25px;
  height: 25px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

<template>
    <span v-if="busy" :class="{ inlineLoaderContainer }">
      <span v-if="textoAguarde">
        Aguarde...
      </span>
      <div class="inlineLoader"></div>
    </span>
</template>

<script>
export default {
  data: function () {
    return {
      ini: ''
    }
  },
  props: {
    busy: Boolean,
    textoAguarde: Boolean
  }
}
</script>

