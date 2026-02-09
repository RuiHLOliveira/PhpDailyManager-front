<style>
.gameDiv{
  /* border: 3px solid var(--darkmode-dark-button-color); */
  width: 100%;
  padding: 10px;
}
.listaMasmorras{
  
}
.masmorra{
  background-color: var(--darkGray);
  padding: 10px;
  border-radius: 5px;
}
.masmorraImg {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
}
.chefaoImg{
  width: 150px;
  max-height: 3000px;
  object-fit: cover;
  border-radius: 10px;
}
.masmorraImgSm {
  width: 75px;
  height: 75px;
  object-fit: cover;
  border-radius: 10px;
}
.masmorraTitle{
  font-size: 1.5rem;
}
.masmorraDescricao{

}

.imgPersonagemChefao{
  max-width: 150px;
  max-height: 150px;
  object-fit: cover;
  border-radius: 10px;
}

.batalhaFinalizada {
  font-size: 1.5rem;
  text-align: center;
}





.log-dano {
  font-family: sans-serif;
  padding: 5px;
  margin: 5px 0;
  color: white;
  text-shadow: 1px 1px 2px black;
  animation: surgir 1s ease-out forwards;
  transition: opacity 1s, transform 1s;
}

.texto-dano { color: #ffeb3b; }

.log-dano.sumindo {
  animation: sumir 1s ease-out forwards;
  transition: opacity 1s, transform 1s;
}

.log-dano.sumindo.displayNone {
  display: none;
}

@keyframes surgir {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes sumir {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}

</style>

<template>
  <div class="gameDiv">

    <InlineLoader
      :textoAguarde="true"
      :busy="busyLoadMasmorroas"
      :center="true">
    </InlineLoader>

    <!-- LISTA MASMORRAS -->
    <div class="listaMasmorras" v-if="exibirListaMasmorras">
      <div v-for="masmorra in masmorras" class="masmorra flex-column">
        <div class="flex gap-20 alignitems-center">
          <img class="masmorraImg" :src="'./masmorras/'+masmorra.imagem" alt="">
          <div class="flex-column">
            <div class="masmorraTitle">{{ masmorra.nome }}</div>
            <div class="masmorraDescricao">{{ masmorra.descricao }}</div>
          </div>
        </div>
        <div class="flex justify-end">
          <button type="button" class="btn btn-sm" @click="jogarMasmorra(masmorra)">Jogar</button>
        </div>
      </div>
    </div>

    

    <!-- LISTA CHEFAO -->
    <div class="" v-if="exibirListaChefoes">
      <!-- BREADCRUMB MASMORRA -->
      <div class="masmorra flex-column mb-5">
        <div class="flex gap-20 alignitems-center">
          <img class="masmorraImgSm" :src="'./masmorras/'+masmorraSelecionada.imagem" alt="">
          <div class="flex-column">
            <div class="masmorraTitle">{{ masmorraSelecionada.nome }}</div>
            <div class=""><button type="button" class="btn btn-sm" @click="voltarSelecaoMasmorras()">Voltar</button></div>
          </div>
        </div>
      </div>
      <!-- CHEFOES -->
      <div v-for="chefao in masmorraSelecionada.chefoes" class="masmorra flex-column">
        <div class="flex gap-20 alignitems-center">
          <img class="chefaoImg" :src="'./masmorras/'+chefao.imagem" alt="">
          <div class="flex-column">
            <div class="masmorraTitle">{{ chefao.nome }}</div>
          </div>
        </div>
        <div class="flex justify-end">
          <button type="button" class="btn btn-sm" @click="lutarContraChefao(chefao)">Lutar!</button>
        </div>
      </div>
    </div>

    <!-- MECANICA DE LUTA -->
    <div class="" v-if="exibirLuta && chefaoSelecionado != null">
      <div class="masmorra flex-column">
        <div class="flex gap-20 justify-spacebetween alignitems-center">

          <!-- COLUNA JOGADOR --> <!-- LINHA 1 -->
          <div class="flex justify-start gap-20">
            <img class="imgPersonagemChefao" :src="'./sprites/arator.png'" alt="">
            <div class="flex-column">
              <div class="masmorraTitle">{{ personagem.nome }}</div>
              <div>
                <BarraDeVida
                  :vidaTotal="personagem.atributos.vidaMaxima"
                  :vidaAtual="personagem.atributos.vidaAtual"
                ></BarraDeVida>
              </div>
              <div class="flex-column gap-10 mt-10">
                <div v-for="habilidade in habilidades" :key="habilidade.nome">
                  <button type="button" class="btn btn-sm"
                    :disabled="batalhaFinalizada || habilidade.recargaRestante > 0"
                    @click="usaHabilidade(personagem, habilidade, chefaoSelecionado)">
                    {{ habilidade.nome }}
                    {{ habilidade.recargaRestante > 0 ? `(${habilidade.recargaRestante})` : '' }}
                  </button>
                </div>
              </div>
            </div>
          </div>


          <!-- COLUNA CHEFAO -->
          <div class="flex justify-end gap-20">
            <div class="flex-column">
              <div class="masmorraTitle">{{ chefaoSelecionado.nome }}</div>
              <BarraDeVida
                :vidaTotal="chefaoSelecionado.pontosVida"
                :vidaAtual="chefaoSelecionado.pontosVidaAtuais"
              ></BarraDeVida>

              colocar habilidades aqui
              
              <div class="flex-column gap-10 mt-10">
                <div v-for="habilidade in chefaoSelecionado.habilidades" :key="habilidade.nome">
                  <button type="button" class="btn btn-sm"
                    :disabled="batalhaFinalizada || habilidade.recargaRestante > 0">
                    {{ habilidade.nome }}
                    {{ habilidade.recargaRestante > 0 ? `(${habilidade.recargaRestante})` : '' }}
                  </button>
                </div>
              </div>

            </div>
            <img class="imgPersonagemChefao" :src="'./masmorras/'+chefaoSelecionado.imagem" alt="">
          </div>
        </div>
        <div>
          <div class="container-batalha">
            <div 
              v-for="animacao in pontuacaoDeBatalha" 
              :key="animacao.id" 
              class="log-dano"
              :class="{ 'sumindo': !animacao.mostrar, 'displayNone': !animacao.mostrar2 }"
            >
              <span>
                {{ animacao.quem }} {{ animacao.oque }} {{ animacao.alvo }} : 
                <strong class="texto-dano">{{ animacao.dano }}</strong>
              </span>
            </div>
          </div>
        </div>
        <div class="batalhaFinalizada" v-if="batalhaFinalizada">
          {{ jogardorVenceu ? 'Você venceu!' : 'Batalha perdida!' }}
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
import { MasmorrasStorage } from '@/core/storage/MasmorrasStorage.js'

import { ref, onMounted, onUnmounted, computed } from 'vue';
import BarraDeVida from './BarraDeVida.vue';

const props = defineProps(['runGameText','personagem'])

const inlineLoader = ref([]);
const busyLoadMasmorroas = ref(false)

const masmorras = ref([]);
const pontuacaoDeBatalha = ref([]);
const masmorraSelecionada = ref(null);
const chefaoSelecionado = ref(null);
const habilidades = ref([]);
const batalhaFinalizada = ref(false)
const jogardorVenceu = ref(false);
const chefaoAggrado = ref(false);

const chefeAggradoInterval = ref(null);

function loadHabilidades() {
  habilidades.value = [
    {
      nome: 'ataque especial',
      dano: props.personagem.atributos.ataque * 1.9,
      recarga: 15,
      recargaRestante: 0,
    },
    {
      nome: 'ataque comum',
      dano: props.personagem.atributos.ataque * 1,
      recarga: 3,
      recargaRestante: 0,
    },
  ];
}

function chefaoAggroAutoAtaque(){
  if(chefaoAggrado.value == true) return;
  if(chefaoAggrado.value == false) chefaoAggrado.value = true;
  chefeAggradoInterval.value = setInterval(() => {
    // escolhe habilidade do chefao
    let habilidadeEscolhida = null;
    for (let habilidade of chefaoSelecionado.value.habilidades) {
      if(habilidade.recargaRestante == 0){
        habilidadeEscolhida = habilidade;
        console.log('[habilidadeEscolhida]',habilidadeEscolhida.nome, habilidadeEscolhida)
        break;
      }
    }
    if(habilidadeEscolhida == null){
      console.log('[não escolhida]');
      return;
    }
    //executa habilidade
    usaHabilidade (chefaoSelecionado.value, habilidadeEscolhida, props.personagem)
  }, 2000);
}

function usaHabilidade (atacante, habilidade, defensor) {
  // começa batalha caso não tenha iniciado
  chefaoAggroAutoAtaque()
  //aplica cd
  habilidade.recargaRestante = habilidade.recarga;
  for (let i = 0; i < habilidade.recarga; i++){
    let timeout = 1000 * (i+1);
    // console.log('registrou timeout em', habilidade.nome, timeout);
    setTimeout(() => {
      habilidade.recargaRestante--;
      // console.log('rodou timeout em', habilidade.nome, habilidade.recargaRestante);
    }, timeout);
  }
  // calcula dano
  
  const defesa = defensor.defesa ?? defensor.atributos.defesa;

  const dano = habilidade.dano - defesa
  console.log('[habilidade.dano]',habilidade.dano)
  console.log('[defensor.defesa]', defesa)
  console.log('[dano]',dano)
  // debita dano
  if(defensor.atributos) {
    defensor.atributos.vidaAtual -= dano
  } else {
    defensor.pontosVidaAtuais -= dano
  }
  // invoca texto animado
  animacaoRegistroBatalha(atacante.nome, 'atacou', defensor.nome, dano);
  // handle fim batalha
  handleFimBatalha()
}

function handleFimBatalha(){
  if(chefaoSelecionado.value.pontosVidaAtuais <= 0){
    // fim batalha
    jogardorVenceu.value = true;

    batalhaFinalizada.value = true;
    chefaoAggrado.value = false;
    clearInterval(chefeAggradoInterval.value)
  }
  else if(props.personagem.atributos.vidaAtual <= 0){
    // fim batalha
    batalhaFinalizada.value = true;
    chefaoAggrado.value = false;
    clearInterval(chefeAggradoInterval.value)
  }
}

function animacaoRegistroBatalha(quem, oque, alvo, dano) {
  let novaAnimacao = {
    id: Date.now() + Math.random(),
    quem: quem, 
    oque: oque, 
    alvo: alvo, 
    dano: dano, 
    mostrar: true,
    mostrar2: true
  };

  pontuacaoDeBatalha.value.push(novaAnimacao);

  setTimeout(() => {
    const item = pontuacaoDeBatalha.value.find(a => a.id === novaAnimacao.id);
    if (item) {
      item.mostrar = false;
    }
  }, 1500);

  setTimeout(() => {
    const item = pontuacaoDeBatalha.value.find(a => a.id === novaAnimacao.id);
    if (item) {
      item.mostrar2 = false;
    }
  }, 3000);
}

const masmorrasCarregadas = computed(() => {
  return !busyLoadMasmorroas.value
    && masmorras.value != []
})
const exibirListaMasmorras = computed(() => {
  return masmorrasCarregadas.value
    && masmorraSelecionada.value == null
})
const exibirListaChefoes = computed(() => {
  return masmorrasCarregadas.value
    && masmorraSelecionada.value != null
    && chefaoSelecionado.value == null
})
const exibirLuta = computed(() => {
  return masmorrasCarregadas.value
    && chefaoSelecionado.value != null
})


onMounted( () => {
    loadMasmorras();
    loadHabilidades();
});

function jogarMasmorra(masmorra) {
  masmorraSelecionada.value = masmorra
}
function voltarSelecaoMasmorras(){
  masmorraSelecionada.value = null
}
function lutarContraChefao(chefao){
  chefaoSelecionado.value = chefao
  chefaoSelecionado.value.pontosVidaAtuais = chefaoSelecionado.value.pontosVida;
  console.log('props.personagem.atributos.vidaAtual',props.personagem.atributos.vidaAtual)
  console.log('props.personagem.atributos.vidaMaxima',props.personagem.atributos.vidaMaxima)
}

function loadMasmorras () {
  busyLoadMasmorroas.value = true;
  MasmorrasStorage.index().then(([response, data]) => {
    console.log('[masmorras] ', data)
    masmorras.value = data
    busyLoadMasmorroas.value = false;
  })
  .catch((error) => {
    busyLoadMasmorroas.value = false;
    console.error(error);
    notify(`Ocorreu um erro: ${error}`, true)
  });
}

</script>
