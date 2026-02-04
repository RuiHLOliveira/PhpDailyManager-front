<style>

.personagem {
  padding: 20px;
  background-color: var(--darkmode-border-gray);
  border-radius: 5px;
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.personagem__titulo{
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 10px;
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

        <div v-if="!busyPersonagensLoad" class="personagem">
          <span class="personagem__titulo">{{ personagem.nome }}</span>
          <span>Lv {{ personagem.nivel }}</span>
          <span>{{ personagem.experiencia }} XP</span>
          <span>Ouro: {{ personagem.ouro }}</span>
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
    personagem.value = data[0]
    console.log('[personagem] ', personagem)
    console.log('[personagem.value] ', personagem.value)
    busyPersonagensLoad.value = false;
  })
  .catch((error) => {
    busyPersonagensLoad.value = false;
    console.error(error);
    notify(`Ocorreu um erro: ${error}`, true)
  });
}

</script>
