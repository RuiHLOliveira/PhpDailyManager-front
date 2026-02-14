<style>
.container{
  max-width: 900px;
}

.macroBox {
}

.box {
  border-radius: 5px;
  padding: 5px;
  background-color: var(--darkGray);
}

.boxButton:hover {
  cursor: pointer;
}
.boxButton:hover {
  background-color: #424242;
}

.boxHabilidade{
  border-radius: 5px;
  padding: 5px;
  background-color: var(--darkGray);
  cursor: pointer;
  width: 200px;
}
.boxHabilidade:hover {
  background-color: #424242;
}

.tituloHabilidade{
  font-size: 1.3rem;
  border-bottom: 2px solid var(--darkmode-border-gray);
  width: 100%;
  height: 50px;
  text-align: center;
  padding-bottom: 5px;
}
.explicacaoHabilidade{
  font-size: 0.8rem;
  padding-top: 10px;
  padding-bottom: 10px;
}
.escolhida{
  border: 2px solid var(--darkmode-default-button-color);
}

</style>

<template>
  <div class="flex-column alignitems-center">
    <div class="container">

      <div class="mb-20">
        dados personagem atributos referencia <br> 
        <div v-for="habilidade in personagem.atributos.habilidades">
          {{ habilidade }}
        </div>
      </div> 

      <InlineLoader
        :textoAguarde="true"
        :busy="busyLoadClasses"
        :center="true">
      </InlineLoader>
      
      <Notifier ref="notifier"></Notifier>

      <!-- LISTA MASMORRAS -->
      <div class="macroBox p-10" v-if="classesCarregadas">

        <button type="button" class="btn btn-sm" @click="zerarClasse()">Mudar Classe/Spec</button>

        <div v-if="personagemPossuiClasse">
          Classe: {{ personagem.atributos.classe.nome }}
          Tipo Armadura: {{ personagem.atributos.classe.tipoArmadura.nome }}
        </div>
        
        <div v-if="personagemPossuiClasse && personagemPossuiEspecializacao">
          Spec Atual: {{ personagem.atributos.classe?.especializacao?.nome }}
        </div>

        <div v-if="!personagemPossuiClasse" class="flex-column alignitems-center">
          <span>Escolha sua classe!</span>
          <div class="mt-10 flex-wrap justify-center gap-20">
            <div v-for="classe in classes">
              <div class="box flex-column alignitems-center boxButton" @click="escolherClasse(classe)">
                <span>{{ classe.nome }}</span>
                <span>Armadura de {{ classe.tipoArmadura.nome }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="personagemPossuiClasse && !personagemPossuiEspecializacao" class="flex-column alignitems-center">
          <span>Escolha sua especializacao!</span>
          <div class="mt-10 flex-wrap justify-center gap-20">
            <div v-for="especializacao in especializacoesDisponiveisClassePersonagem">
              <div class="box flex-column alignitems-center boxButton" @click="escolherEspecializacao(especializacao)">
                <span>{{ especializacao.nome }}</span>
                <span>{{ especializacao.habilidadePadrao.nome }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="personagemPossuiClasse && personagemPossuiEspecializacao" class="flex-column alignitems-center">
          <div>Árvore de Habilidades</div>
          <div v-for="linhaArvore in arvoreHabilidades" class="mt-10 flex justify-center gap-10">
            <div v-for="habilidade in linhaArvore.habilidades" class="" >
              <div class="boxHabilidade flex-column alignitems-center justify-center"
                :class="{'escolhida' : habilidade.escolhida == true}"
                @click="personagem.atributos.linhaArvoreMaxima >= linhaArvore.rankOrdem ? escolherHabilidadeArvore(linhaArvore, habilidade) : null">
                <!-- @click="escolherHabilidadeArvore(linhaArvore, habilidade)"> -->
                <div class="tituloHabilidade">{{ habilidade.nome }}</div>
                <div class="explicacaoHabilidade">
                  Causa X {{ habilidade.dano }} de dano 
                  <span v-if="habilidade.tipo == 'TIPO_DANO_FISICO'">físico</span>
                  <span v-if="habilidade.tipo == 'TIPO_DANO_SAGRADO'">sagrado</span>
                  <span v-if="habilidade.tipo == 'TIPO_DANO_FOGO'">de fogo</span>
                  <span v-if="habilidade.tipo == 'TIPO_DANO_GELO'">de gelo</span>
                  com recarga de {{ habilidade.recarga }} segundos.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import DateTime from '@/core/DateTime.js'
import Request from '@/core/request.js';
import config from '@/core/config.js'
import QueryStringConverter from '@/core/QueryStringConverter.js'
import InlineLoader from '@/components/InlineLoader.vue'
import { ClassesStorage } from '@/core/storage/ClassesStorage.js'
import { PersonagensStorage } from '@/core/storage/PersonagensStorage.js'
import Notifier from '@/components/Notifier.vue';

import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps(['telaClasse','personagem'])

const notifier = ref();
const inlineLoader = ref([]);

function notify(text, error = false){
  notifier.value.notify(text,error)
}

onMounted( () => {
  loadClasses();
});


const classes = ref([]);
const busyLoadClasses = ref(false);
const busySavePersonagem = ref(false);
const especializacoesDisponiveisClassePersonagem = ref([]);
const arvoreHabilidades = ref([]);

// const masmorraSelecionada = ref(null);
// const batalhaFinalizada = ref(false)
// const jogardorVenceu = ref(false);


const classesCarregadas = computed(() => {
  return !busyLoadClasses.value
    && classes.value != []
})
const personagemPossuiClasse = computed(() => {
  return props.personagem.atributos.classe?.nome;
})
const personagemPossuiEspecializacao = computed(() => {
  return props.personagem.atributos.classe?.especializacao?.nome;
})

// const exibirListaMasmorras = computed(() => {
//   return masmorrasCarregadas.value
//     && masmorraSelecionada.value == null
// })
// const exibirListaChefoes = computed(() => {
//   return masmorrasCarregadas.value
//     && masmorraSelecionada.value != null
//     && chefaoSelecionado.value == null
// })
// const exibirLuta = computed(() => {
//   return masmorrasCarregadas.value
//     && chefaoSelecionado.value != null
// })

// function jogarMasmorra(masmorra) {
//   masmorraSelecionada.value = masmorra
// }
// function voltarSelecaoMasmorras(){
//   masmorraSelecionada.value = null
// }

function updateListaEspecializacoesClasseSelecionada() {
  let classeEncontrada = null;
  if(personagemPossuiClasse.value){
    for (const classe of classes.value) {
      if(classe.codigo == props.personagem.atributos.classe.codigo){
        classeEncontrada = classe
        break;
      }
    }
    if(classeEncontrada) {
      especializacoesDisponiveisClassePersonagem.value = classeEncontrada.listaEspecializacoes;
    }
  }
  if(personagemPossuiEspecializacao.value){
    let especializacaoEncontrada = null;
    for (const especializacao of classeEncontrada.listaEspecializacoes) {
      if(especializacao.codigo == props.personagem.atributos.classe.especializacao.codigo){
        especializacaoEncontrada = especializacao
        break;
      }
    }
    if(especializacaoEncontrada) {
      arvoreHabilidades.value = especializacaoEncontrada.arvoreHabilidades;
      processaArvoreComHabilidadesExistentes()
    }
  }
}

function escolherClasse(classe) {
  props.personagem.atributos['classe'] = {
    codigo: classe.codigo,
    nome: classe.nome,
    tipoArmadura: classe.tipoArmadura
  }
  especializacoesDisponiveisClassePersonagem.value = classe.listaEspecializacoes;
  // salvar personagem
  salvarPersonagem()
}

function escolherEspecializacao(especializacao){
  props.personagem.atributos.classe['especializacao'] = {
    codigo: especializacao.codigo,
    nome: especializacao.nome,
  }
  props.personagem.atributos['habilidades'] = [
    especializacao.habilidadePadrao
  ];
  arvoreHabilidades.value = especializacao.arvoreHabilidades;
  // salvar personagem
  salvarPersonagem()
}

function processaArvoreComHabilidadesExistentes(){
  for (const personagemHabilidade of props.personagem.atributos.habilidades){
    if(personagemHabilidade.linhaRankOrdem != undefined) {
      for (const i in arvoreHabilidades.value) {
        if(personagemHabilidade.linhaRankOrdem == arvoreHabilidades.value[i].rankOrdem){
          for (const j in arvoreHabilidades.value[i].habilidades) {
            if(arvoreHabilidades.value[i].habilidades[j].nome == personagemHabilidade.nome){
              arvoreHabilidades.value[i].habilidades[j] = arvoreSetHabilidadeEscolhida(arvoreHabilidades.value[i], arvoreHabilidades.value[i].habilidades[j]);
            }
          }
        }
      }
    }
  }
}

function zerarClasse(){
  props.personagem.atributos.classe = null;
  props.personagem.atributos.habilidades = null;
}

function arvoreSetHabilidadeEscolhida(linhaArvore, habilidade){
  zeraLinhaHabilidadeArvore(linhaArvore);
  habilidade.escolhida = true;
  habilidade['linhaRankOrdem'] = linhaArvore.rankOrdem;
  return habilidade;
}

function zeraLinhaHabilidadeArvore(linhaArvore) {
  linhaArvore.habilidades.forEach(h => {
    h['escolhida'] = false;
  });
}

function escolherHabilidadeArvore (linhaArvore, habilidade) {
  if(habilidade.escolhida == true) return;
  zeraLinhaHabilidadeArvore(linhaArvore);
  habilidade.escolhida = true;
  habilidade['linhaRankOrdem'] = linhaArvore.rankOrdem;
  let listaHabilidades = props.personagem.atributos.habilidades
  for (let i = 0; i < listaHabilidades.length; i++) {
    if(listaHabilidades[i].linhaRankOrdem == linhaArvore.rankOrdem) {
      listaHabilidades.splice(i,1);
    }
  }
  listaHabilidades.push(habilidade);
  props.personagem.atributos.habilidades = listaHabilidades;
  salvarPersonagem()
}

function salvarPersonagem(){
  props.personagem.atributosjson = JSON.stringify(props.personagem.atributos)
  busySavePersonagem.value = true;
  PersonagensStorage.salvarAtributos(props.personagem)
  .then(([response, data]) => {
    busySavePersonagem.value = false;
  })
  .catch((error) => {
    busySavePersonagem.value = false;
    console.error(error);
    notify(`Ocorreu um erro: ${error}`, true)
  });
}

function loadClasses () {
  busyLoadClasses.value = true;
  ClassesStorage.index().then(([response, data]) => {
    console.log('[classes] ', data)
    classes.value = data
    busyLoadClasses.value = false;
    updateListaEspecializacoesClasseSelecionada()
  })
  .catch((error) => {
    busyLoadClasses.value = false;
    console.error(error);
    notify(`Ocorreu um erro: ${error}`, true)
  });
}

</script>
