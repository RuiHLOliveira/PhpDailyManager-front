<style>

.personagem {
  padding: 20px;
  background-color: var(--darkmode-border-gray);
  border-radius: 5px;
  max-width: 700px;
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

.listaHistoricosPersonagem{
  max-height: 50vh;
  overflow-y: scroll;
}

</style>

<template>
  <div>
    <div class="container">

      <section class="mt-10">
        <div class="flex alignitems-center">
          <h1 class="">Personagem</h1>
          <div>
            <button type="button" class="ml-10 btn btn-sm" @click="jogar2d()">Jogar 2d</button>
            <button type="button" class="ml-10 btn btn-sm" @click="jogarText()">Jogar text</button>
          </div>
        </div>
      </section>

      <section class="flex-column alignitems-center">

        <InlineLoader
          :textoAguarde="true"
          :busy="busyPersonagensLoad"
          :center="true">
        </InlineLoader>

        <div v-if="!busyPersonagensLoad && personagem.id"> 
          <div class="personagem flex-column alignitems-center">

            <span class="personagem__titulo">{{ personagem.nome }}</span>

            <div class="flex gap-20">

              <div class="flex-column">
                <!-- <span>{{ personagem.atributos }}</span> -->
                <span>Ataque {{ personagem.atributos.ataque }}</span>
                <span>Defesa {{ personagem.atributos.defesa }}</span>
                <span>Vida {{ personagem.atributos.vidaMaxima }}</span>
              </div>

              <div class="flex-column">
                <span class="boxImgInline">
                  <img class="imgInline" src="/fc865.png" alt="">
                  {{ personagem.nivel }}
                </span>
                <span class="boxImgInline">
                  <img class="imgInline" src="/fc865.png" alt="">
                  {{ personagem.experiencia }} / {{ personagem.expProximoNivel }}
                </span>
                <span class="boxImgInline">
                  <img class="imgInline" src="/fc131.png" alt="">
                  {{ personagem.ouro }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="showHistorico" class="personagem flex-column mt-5">
            <div class="listaHistoricosPersonagem pr-10">
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

    <GameTeste2d ref="gameTeste" class="mt-10"
      v-if="runGame2d"
      :runGame2d="runGame2d"
      :personagem="personagem"
    ></GameTeste2d>

    <GameTesteText ref="gameTeste" class="mt-10"
      v-if="runGameText"
      :runGameText="runGameText"
      :personagem="personagem"
    ></GameTesteText>


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
import GameTesteText from '@/views/Personagem/GameTesteText.vue';
import GameTeste2d from '@/views/Personagem/GameTeste2d.vue';
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
function getDimensions () {
  windowWidth.value = document.documentElement.clientWidth;
  windowHeight.value = document.documentElement.clientHeight;
}
function notify(text, error = false){
  notifier.value.notify(text,error)
}

const gameTeste2d = ref();
const gameTesteText = ref();
const notifier = ref();

const busyPersonagensLoad = ref(false);
const showHistorico = ref(true);
const runGame2d = ref(false);
const runGameText = ref(false);
const personagem = ref([]);
const windowWidth =  ref(0);
const windowHeight =  ref(0);

function jogar2d(){
  showHistorico.value = false;
  runGame2d.value = true;
}

function jogarText(){
  showHistorico.value = false;
  runGameText.value = true;
}

function loadPersonagens () {
  busyPersonagensLoad.value = true;
  // const params = {'orderBy': 'created_at, desc', 'properties' : 'projeto'};

  PersonagensStorage.index()
  .then(([response, data]) => {
    console.log('[personagem] ', data)
    data = data[0]
    data.personagemhistoricos.forEach(historico => {
      if(typeof historico.dadosjson === 'string') historico.dadosjson = JSON.parse(historico.dadosjson);
      let dateobject = DateTime.convertStringToDateObject(historico.createdat.date);
      historico.createdatFormatted = DateTime.getWeekDay(dateobject) +', '+ DateTime.formatBrDateTime(dateobject);
    });
    data.atributos = JSON.parse(data.atributosjson);
    console.log('[personagem.atributos] ', data.atributos)
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
