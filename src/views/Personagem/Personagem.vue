<style>

.personagem {
  padding: 20px;
  background-color: var(--darkmode-border-gray);
  border-radius: 5px;
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  /* align-items: flex-end; */
}
.personagem__titulo{
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.historicoPersonagem {
  display: flex;
  flex-direction: column;
  border-top: 1px solid rgb(180, 180, 180);
  /* border-radius: 10px; */
  margin-top: 20px;
  padding-top: 10px
}

.boxImgInline {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
}
.boxImgInline img.imgInline{
  max-width: 32px;
}

</style>

<template>
  <div>
    <div class="container">

      <section class="mt-10">
        <div class="">
          <h1 class="">Personagem</h1>
        </div>
      </section>

      <section class="flex-column">

        <InlineLoader
          :textoAguarde="true"
          :busy="busyPersonagensLoad"
          :center="true">
        </InlineLoader>

        <div v-if="!busyPersonagensLoad">
          <div class="personagem">
            <span class="personagem__titulo">{{ personagem.nome }}</span>
            <span>Lv {{ personagem.nivel }}</span>
            <span class="boxImgInline">
              {{ personagem.experiencia }} / {{ personagem.expProximoNivel }}
              <img class="imgInline" src="/fc865.png" alt="">
            </span>
            <span class="boxImgInline">
              {{ personagem.ouro }}
              <img class="imgInline" src="/fc131.png" alt="">
            </span>
            <div>
              <div v-for="historico in personagem.personagemhistoricos" class="historicoPersonagem">
                <span>{{ historico.createdatFormatted }}</span>
                <span>{{ historico.texto }}</span>
                <span class="boxImgInline">
                  <span v-for="recompensa in historico.dadosjson.recompensas" class="boxImgInline">
                    {{ recompensa.quantidade }}
                    <img v-if="recompensa.moeda == 'ouro'" class="imgInline" src="/fc131.png" alt="">
                    <img v-if="recompensa.moeda == 'experiencia'" class="imgInline" src="/fc865.png" alt="">
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

      </section>

    <Notifier ref="notifier"></Notifier>

    </div>
  </div>
</template>

<script setup>
import DateTime from '@/core/DateTime.js'
import Request from '@/core/request.js';
import config from '@/core/config.js'
import QueryStringConverter from '@/core/QueryStringConverter.js'
import InlineLoader from '@/components/InlineLoader.vue';
import Notifier from '@/components/Notifier.vue';
import { PersonagensStorage } from '@/core/storage/PersonagensStorage.js'

import { ref, onMounted, onUnmounted } from 'vue';

onMounted( () => {
    window.addEventListener('resize', getDimensions());
    getDimensions()
    loadPersonagens();
});

onUnmounted( () => {
    window.removeEventListener('resize', getDimensions());
});

const notifier = ref();
const busyPersonagensLoad = ref(false);
const personagem = ref([]);
const windowWidth =  ref(0);
const windowHeight =  ref(0);

function getDimensions () {
  windowWidth.value = document.documentElement.clientWidth;
  windowHeight.value = document.documentElement.clientHeight;
}

function notify(text, error = false){
  notifier.value.notify(text,error)
}

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
