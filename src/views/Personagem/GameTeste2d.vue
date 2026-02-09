<style>
.gameContainer{
  image-rendering: pixelated;
}
canvas {
  border: 3px solid var(--blue-hover-button-color);
  border-radius: 5px;
  width: 100%;
  image-rendering: pixelated;
}
</style>

<template>
  <div>
    <div class="gameContainer">
      <canvas id="game-canvas" width="320" height="180"></canvas>
    </div>
  </div>
</template>

<script setup>
import DateTime from '@/core/DateTime.js'
import Request from '@/core/request.js';
import config from '@/core/config.js'
import QueryStringConverter from '@/core/QueryStringConverter.js'
import {resources} from '@/core/gameEngine/Resources.js';
import {Sprite} from '@/core/gameEngine/Sprite.js';
import {Vector2} from '@/core/gameEngine/Vector2.js';

import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps(['runGame','personagem'])

// const personagem = ref([]);
// const windowWidth =  ref(0);
// const windowHeight =  ref(0);
let canvasTag;
let ctx;
let goldMoeda;

onMounted( () => {
    canvasTag = document.getElementById('game-canvas');
    ctx = canvasTag.getContext("2d");
    goldMoeda = new Sprite({
      resource: resources.images.goldMoeda,
      frameSize: new Vector2(16,16),
      hFrames: 4,
      vFrames: 1,
      frame: 0,
      scale: 1,
    });
    setInterval(() => { draw(); }, 300)
});

function draw (){

  goldMoeda.drawImage(ctx, 100 ,0)

};



function loadPersonagens () {
  busyPersonagensLoad.value = true;
  // const params = {'orderBy': 'created_at, desc', 'properties' : 'projeto'};
  PersonagensStorage.index()
  .then(([response, data]) => {
    console.log('[data] ', data)
    data = data[0]
    data.personagemhistoricos.forEach(historico => {
      if(typeof historico.dadosjson === 'string') historico.dadosjson = JSON.parse(historico.dadosjson);
      let dateobject = DateTime.convertStringToDateObject(historico.createdat.date);
      historico.createdatFormatted = DateTime.getWeekDay(dateobject) +', '+ DateTime.formatBrDateTime(dateobject);
    });
    personagem.value = data
    busyPersonagensLoad.value = false;
  })
  .catch((error) => {
    busyPersonagensLoad.value = false;
    console.error(error);
    notify(`Ocorreu um erro: ${error}`, true)
  });
}

</script>
