<style>


.hp-bar-bg {
  width: 250px;
  height: 30px;
  background-color: #444;
  border-radius: 5px;
  overflow: hidden;
  border: 2px solid #222;
}

.hp-bar-fill {
  height: 100%;
  background-color: #4caf50; /* Verde */
  transition: width 0.3s ease-in-out; /* O efeito de deslizar */
  display: flex;
}
.low-hp {
  background-color: #f44336; /* Vermelho */
}
.valores {
  text-align: center;
  color: white;
  font-weight: bold;
  font-family: sans-serif;
  font-size: 14px;
  position: relative;
  top: -22px;
  text-shadow: 1px 1px 2px black;
  /* border: 2px solid #f44336; */
}
</style>

<template>
  <div class="hp-bar-bg">
    <div class="hp-bar-fill"
      :style="{ width: ((vidaAtual * 100)/vidaTotal) + '%' }"
      :class="{ 'low-hp': ((vidaAtual * 100)/vidaTotal) < 30 }">
    </div>
    <div class="valores">
      <span class="mr-5">[{{ ((vidaAtual * 100)/vidaTotal).toFixed(2) }}%]</span>
      <span>{{ vidaAtual }} / {{ vidaTotal }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps(['vidaTotal','vidaAtual'])

const porcentagemAtual = ref(0);

onMounted( () => {
   
});

</script>
