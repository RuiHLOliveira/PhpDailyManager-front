<style>
.container{
  max-width: 900px;
}

.box {
  border-radius: 5px;
  padding: 5px;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
}

.boxButton:hover {
  cursor: pointer;
  background-color: var(--bg-color-variant);
}

.boxHabilidade{
  background-color: var(--bg-color);
  border: 2px solid var(--border-color);
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
  width: 270px;
  height: 100px;
}
.boxHabilidade:hover {
  background-color: var(--bg-color-variant);
}

.tituloHabilidade{
  font-size: 1rem;
}
.explicacaoHabilidade{
  border-top: 1px solid #7c7c7c7a;
  font-size: 0.8rem;
}


.habilidadeImg {
  border: 1px solid white;
}

.escolhida{
  border-color: #b48b33;
}
.completa{
  border-color: var(--default-button-color);
}

.boxtop {
  min-width: 45%;
  max-width: 700px;
  border: 1px solid white;
  margin: 5px auto;
  padding: 10px;
}

</style>

<template>
  <div class="flex-column alignitems-center">
    <div class="container">

      <div class="mb-20 flex-wrap">
        <div class="gap-10 boxtop">
          <div>Ativas</div>
          <div v-for="habilidade in personagem.atributos.habilidades">
            {{ habilidade.nome }} > {{ habilidade.dano }} | {{ habilidade.recarga }}
          </div>
        </div>
        <div class="gap-10 boxtop">
          <div>Passivas</div>
          <div v-for="habilidade in personagem.atributos.habilidadesPassivas">
            {{ habilidade.nome }} > {{ habilidade.dano }} | {{ habilidade.recarga }}
          </div>
        </div>
      </div>

      <div class="mb-20 flex-wrap">

        <div class="gap-10 boxtop">
          <div>{{ personagem.atributos.ataque }} de Ataque</div>
          <div>{{ personagem.atributos.defesa }} de defesa</div>
          <div>{{ personagem.atributos.critChance }} de critico</div>
          <div>{{ personagem.atributos.vidaMaxima }} de vida maxima</div>
        </div>

        <div class="gap-10 boxtop">
          <div>{{ personagem.atributos.modificadores?.ATRIBUTO_DANO ?? '' }} % de Dano Adicional</div>
          <div>{{ personagem.atributos.modificadores?.ATRIBUTO_CRITCHANCE ?? '' }} % de Chance Crítica Adicional</div>
          <div>{{ personagem.atributos.modificadores?.ATRIBUTO_DEFESA ?? ''}} % de Defesa Adicional</div>
          <div>{{ personagem.atributos.modificadores?.ATRIBUTO_VIDAMAXIMA ?? '' }} % de Vida Máxima Adicional</div>
          <div>{{ personagem.atributos.modificadores?.ATRIBUTO_CURA ?? ''}} % de Cura Adicional</div>
        </div>
        
      </div>

      
      <div class="mb-10">
        <div>Pontos usados: {{ personagem.atributos.pontosGastos }} de {{ personagem.nivel }}</div>
      </div>

      <InlineLoader
        :textoAguarde="true"
        :busy="busyLoadArvores"
        :center="true">
      </InlineLoader>
      
      <Notifier ref="notifier"></Notifier>

      <div class="p-10">

        <button type="button" class="btn btn-sm" @click="zerarArvore()">Zerar pontos</button>

        <div class="flex-column">
          <span>LISTA DE ARVORES</span>
          <div v-for="arvore in arvores" class="flex-column mt-20">
            <h1>{{ arvore.nome }}</h1>

            <div class="flex-wrap gap-10">
              <span v-for="linhaArvore in arvore.arvoreHabilidades" class="">
                <div class="boxHabilidade flex"
                  :class="{
                    'completa' : linhaArvore.habilidade.quantidade == linhaArvore.habilidade.quantidadeMaxima,
                    'escolhida' : linhaArvore.habilidade.quantidade > 0 && linhaArvore.habilidade.quantidade < linhaArvore.habilidade.quantidadeMaxima
                  }"
                  @click="escolherHabilidadeArvore(arvore, linhaArvore.habilidade)">
                  <div>
                    <img class="habilidadeImg"
                      :class="{
                        'completa' : linhaArvore.habilidade.quantidade == linhaArvore.habilidade.quantidadeMaxima,
                        'escolhida' : linhaArvore.habilidade.quantidade > 0 && linhaArvore.habilidade.quantidade < linhaArvore.habilidade.quantidadeMaxima
                      }"
                      :src="'./habilidades/'+linhaArvore.habilidade.imagem" :alt="linhaArvore.habilidade.imagem">
                  </div>
                  <div class="ml-5">
                    <div class="tituloHabilidade">{{ linhaArvore.habilidade.quantidade ?? 0 }}x {{ linhaArvore.habilidade.nome }}</div>
                    <div class="explicacaoHabilidade">{{ linhaArvore.habilidade.descricao }}</div>
                  </div>
                </div>
              </span>
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
import { ArvoresStorage } from '@/core/storage/ArvoresStorage.js'
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
  loadArvores();
});


const arvores = ref([]);
const busyLoadArvores = ref(false);
const busySavePersonagem = ref(false);
const especializacoesDisponiveisClassePersonagem = ref([]);
const arvoreHabilidades = ref([]);

// const masmorraSelecionada = ref(null);
// const batalhaFinalizada = ref(false)
// const jogardorVenceu = ref(false);


const classesCarregadas = computed(() => {
  return !busyLoadArvores.value
    && classes.value != []
})
const personagemPossuiClasse = computed(() => {
  return props.personagem.atributos.classe?.nome;
})
const personagemPossuiEspecializacao = computed(() => {
  return props.personagem.atributos.classe?.especializacao?.nome;
})

function updateListaArvoreSelecionada() {
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

function zerarArvore () {
  
  let pontosGastos = 0;
  let listaHabilidades = [];
  let listaHabilidadesPassivas = [];

  props.personagem.atributos.habilidades = listaHabilidades;
  props.personagem.atributos.habilidadesPassivas = listaHabilidadesPassivas;
  props.personagem.atributos.pontosGastos = pontosGastos;

  salvarPersonagem()
  arvores.value.forEach(linha => {
    linha.arvoreHabilidades.forEach(ln => {
      ln.habilidade.quantidade = 0;
    });
  });
}

function escolherHabilidadeArvore (linhaArvore, habilidade) {
  if(props.personagem.atributos.pontosGastos == undefined) {
    props.personagem.atributos.pontosGastos = 0;
  }
  if(props.personagem.atributos.pontosGastos >= props.personagem.nivel) {
    console.log('[BLOQUEADO]')
    return;
  }
  // adicionar o ponto na árvore
  if(habilidade.quantidade == undefined) {
    habilidade.quantidade = 0;
  }
  if(habilidade.tipo == 'TIPO_ATIVO' && habilidade.quantidade == 1){
    return;
  }
  if(habilidade.tipo == 'TIPO_ATIVO' && habilidade.quantidade == 0){
    habilidade.quantidade = 1;
  }
  if(habilidade.tipo == 'TIPO_PASSIVO'){
    habilidade.quantidade += 1;
  }

  // reseta
  let pontosGastos = props.personagem.atributos.pontosGastos;
  let listaHabilidades = [];
  let listaHabilidadesPassivas = [];

  // adicionar o ponto gasto
  pontosGastos++;
  
  // circular pelas arvores, guardando e somando quem está marcado
  arvores.value.forEach(linha => {
    linha.arvoreHabilidades.forEach(ln => {
      if(ln.habilidade.quantidade != undefined && ln.habilidade.quantidade > 0){
        if(ln.habilidade.tipo == 'TIPO_PASSIVO') {
          // personagemAtributos.modificadores[ln.habilidade.atributo] = ln.habilidade.quantidade * ln.habilidade.porcentagem;
          listaHabilidadesPassivas.push(ln.habilidade);
        }
        if(ln.habilidade.tipo == 'TIPO_ATIVO') {
          listaHabilidades.push(ln.habilidade);
        }
      }
    });
  });

  props.personagem.atributos.habilidades = listaHabilidades;
  props.personagem.atributos.habilidadesPassivas = listaHabilidadesPassivas;
  props.personagem.atributos.pontosGastos = pontosGastos;

  salvarPersonagem()
}

function updateArvoresDadosPersonagem() {
  if(props.personagem.atributos.habilidades != undefined) {
    props.personagem.atributos.habilidades.forEach(h => {
      arvores.value.forEach(linha => {
        linha.arvoreHabilidades.forEach(ln => {
          if(ln.habilidade.nome == h.nome){
            ln.habilidade.quantidade = h.quantidade;
          }
        });
      });
    })
  }
  if(props.personagem.atributos.habilidadesPassivas != undefined) {
    props.personagem.atributos.habilidadesPassivas.forEach(hp => {
      arvores.value.forEach(linha => {
        linha.arvoreHabilidades.forEach(ln => {
          if(ln.habilidade.nome == hp.nome){
            ln.habilidade.quantidade = hp.quantidade;
          }
        });
      });
    })
  }
}

function salvarPersonagem(){
  props.personagem.atributosjson = JSON.stringify(props.personagem.atributos)
  busySavePersonagem.value = true;
  PersonagensStorage.salvarAtributos(props.personagem)
  .then(([response, data]) => {
    busySavePersonagem.value = false;
    props.personagem.atributos = JSON.parse(data.atributosjson);
  })
  .catch((error) => {
    busySavePersonagem.value = false;
    console.error(error);
    notify(`Ocorreu um erro: ${error}`, true)
  });
}

function loadArvores () {
  busyLoadArvores.value = true;
  ArvoresStorage.index().then(([response, data]) => {
    console.log('[arvores] ', data)
    arvores.value = data
    busyLoadArvores.value = false;
    updateArvoresDadosPersonagem()
  })
  .catch((error) => {
    busyLoadArvores.value = false;
    console.error(error);
    notify(`Ocorreu um erro: ${error}`, true)
  });
}

</script>
