<style>

.personagem {
  padding: 10px;
  background-color: var(--bg-color);
  border-radius: 5px;
  max-width: 700px;
  border: 1px solid var(--border-color);
}
.personagem__titulo{
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.historicoPersonagem {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--border-color);
  /* border-radius: 10px; */
  margin-bottom: 10px;
  padding: 20px
}

.grayBox { 
  background-color: var(--bg-color-gray);
  margin-bottom: 5px;
  border-radius: 10px;
  padding: 5px;
}

.boxImgInline {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.boxImgInline img.imgInline{
  width: 24px;
  max-width: 24px;
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
            <!-- <button type="button" class="ml-10 btn btn-sm" @click="jogar2d()">Jogar 2d</button> -->
            <button type="button" class="ml-10 btn btn-sm" :disabled="busyPersonagensLoad" @click="jogarText()">Jogar text</button>
            <button type="button" class="ml-10 btn btn-sm" :disabled="busyPersonagensLoad" @click="carregarLoja()">Loja</button>
            <button type="button" class="ml-10 btn btn-sm" :disabled="busyPersonagensLoad" @click="carregarTelaClasse()">Classe</button>
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

            <div class="flex-column">
              
              <div class="flex-row">
                <span class="boxImgInline grayBox">
                  <img class="imgInline ml-5" src="/habilidades/fisico/lancadocampeao.jpg" alt=""> 
                  <span class="ml-5">
                    {{ personagem.atributos.ataque }}
                  </span>
                
                  <img class="imgInline ml-20" src="/habilidades/fisico/posturadefensiva.jpg" alt=""> 
                  <span class="ml-5">
                    {{ personagem.atributos.defesa }}
                  </span>

                  <img class="imgInline ml-20" src="/habilidades/fisico/treinamentobarbaro.jpg" alt=""> 
                  <span class="ml-5">
                    {{ personagem.atributos.vidaMaxima }}
                  </span>
                </span>
              </div>

              <div class="flex-row">
                <span class="boxImgInline grayBox">
                  <img class="imgInline" src="/fc865.png" alt="">
                  <span class="ml-5">
                    {{ personagem.nivel }}
                  </span>
                
                  <img class="imgInline ml-20 " src="/moeda/xp_icon.jpg" alt="">
                  <span class="ml-5">
                    {{ personagem.experiencia }} / {{ personagem.expProximoNivel }}
                  </span>

                  <img class="imgInline ml-20" src="/moeda/gold_icon.jpg" alt="">
                  <span class="ml-5">
                    {{ personagem.ouro }}
                  </span>
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
                  <span v-for="recompensa in historico.dadosjson.recompensas" class="boxImgInline ml-10">
                    {{ recompensa.quantidade }}
                    <img v-if="recompensa.moeda == 'ouro'" class="imgInline ml-5" src="/moeda/gold_icon.jpg" alt="">
                    <img v-if="recompensa.moeda == 'experiencia'" class="imgInline ml-5" src="/moeda/xp_icon.jpg" alt="">
                  </span>
                </span>
              </div>
            </div>
          </div>
          
        </div>

      </section>

    <ClassesEspecializacoesTalentos ref="classesEspecializacoesTalentos" class="mt-10"
      v-if="telaClasse"
      :telaClasse="telaClasse"
      :personagem="personagem"
    ></ClassesEspecializacoesTalentos>

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
import ClassesEspecializacoesTalentos from '@/views/Personagem/ClassesEspecializacoesTalentos.vue';
import { PersonagensStorage } from '@/core/storage/PersonagensStorage.js'
import { ref, onMounted, onUnmounted } from 'vue';

defineEmits(['redirectAfterLogin']);

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

const classesEspecializacoesTalentos = ref();
const gameTeste2d = ref();
const gameTesteText = ref();
const notifier = ref();

const busyPersonagensLoad = ref(false);
const showHistorico = ref(true);
const runGame2d = ref(false);
const runGameText = ref(false);
const runLoja = ref(false);
const telaClasse = ref(false);

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

function carregarLoja(){
  showHistorico.value = false;
  runLoja.value = true;
}

function carregarTelaClasse() {
  showHistorico.value = false;
  telaClasse.value = true;
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
