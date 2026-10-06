<style>
.gameDiv{
  width: 100%;
  padding: 10px;
}
.listaMasmorras{
  
}
.masmorra{
  background-color: var(--bg-color);
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




.container-batalha{
  max-height: 1200px;
  overflow-y: scroll;
  text-align: center;
  border: 2px solid #757575;
  margin-top: 5px;
  margin-bottom: 5px;
}

.log-dano {
  color: var(--font-color);
  font-family: sans-serif;
  padding: 5px;
  margin: 5px 0;
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

.ataqueRecebido, .ataqueFeito {
  color: red;
  font-weight: bold;
  font-size: 1.2rem;
}

@keyframes surgir {
  0% {
    opacity: 0;
    transform: translateY(-10px);
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
    transform: translateY(10px);
  }
}

.habilidadeBox{
  border: 1px solid white;
  width: 50px;
}

.overImage {
  position: absolute;
  bottom: 0px;
  right: 0px;
  font-size: 1rem;
  background-color: rgba(0, 0, 0, 0.486);
}

</style>

<template>
  <div class="gameDiv">

    <InlineLoader
      :textoAguarde="true"
      :busy="busyLoadMasmorroas"
      :center="true">
    </InlineLoader>
    
    <Notifier ref="notifier"></Notifier>

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
              <div class="flex-wrap gap-10 mt-10">

                <div v-for="habilidade in personagem.atributos.habilidades" :key="habilidade.nome">

                  <button type="button" class="btn btn-sm btn-clear tooltip"
                    :disabled="batalhaFinalizada || habilidade.recargaRestante > 0"
                    @click="usaHabilidade(personagem, habilidade, chefaoSelecionado)">

                    <img class="habilidadeBox" :src="'./habilidades/'+habilidade.imagem" :alt="habilidade.imagem">
                    
                    <div class="overImage">
                      {{ habilidade.recargaRestante > 0 ? `(${habilidade.recargaRestante})` : '' }}
                    </div>

                    <span class="tooltiptext">
                      {{ habilidade.teclaCorrespondente }} : {{ habilidade.nome }}
                      Dano: {{ habilidade.dano }} | Recarga {{ habilidade.recarga }} s
                      <br>
                      {{ habilidade.recargaRestante > 0 ? `(${habilidade.recargaRestante})` : '' }}
                    </span>
                    
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

              <div class="flex-column gap-10 mt-10">
                <div v-for="habilidade in chefaoSelecionado.habilidades" :key="habilidade.nome">
                  <button type="button" class="btn btn-sm"
                    :disabled="batalhaFinalizada || habilidade.recargaRestante > 0">
                    {{ habilidade.nome }} > {{ habilidade.dano }}
                    {{ habilidade.recargaRestante > 0 ? `(${habilidade.recargaRestante})` : '' }}
                  </button>
                </div>
              </div>

            </div>
            <img class="imgPersonagemChefao" :src="'./masmorras/'+chefaoSelecionado.imagem" alt="">
          </div>
        </div>
        <div class="batalhaFinalizada" v-if="batalhaFinalizada">
          {{ jogardorVenceu ? 'Você venceu!' : 'Batalha perdida!' }}
        </div>
        <div>
          <div class="container-batalha">
            <div 
              v-for="animacao in pontuacaoDeBatalha" 
              :key="animacao.id" 
              class="log-dano"
              :class="{ 'sumindo': !animacao.mostrar, 'displayNone': !animacao.mostrar2 }"
            >
              <span v-if="animacao.alvo == personagem.nome && animacao.oque == 'atacou'"
                class="ataqueRecebido">
                &lt;
              </span>

              <span>
                {{ animacao.quem }} {{ animacao.oque }} {{ animacao.alvo }} : 
                <strong class="texto-dano">{{ animacao.dano }} (-{{ animacao.defesa }})</strong>
              </span>
              
              <span v-if="animacao.alvo == chefaoSelecionado.nome && animacao.oque == 'atacou'"
                class="ataqueFeito">
                &gt;
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
import Notifier from '@/components/Notifier.vue';
import InlineLoader from '@/components/InlineLoader.vue'
import { MasmorrasStorage } from '@/core/storage/MasmorrasStorage.js'
import { ref, onMounted, onUnmounted, computed } from 'vue';
import BarraDeVida from './BarraDeVida.vue';

const notifier = ref();
const inlineLoader = ref([]);
const props = defineProps(['runGameText','personagem'])

function notify(text, error = false){
  notifier.value.notify(text,error)
}

onMounted( () => {
  loadMasmorras();
  loadHabilidades();
  window.addEventListener('keydown', tratarTeclado);
});

onUnmounted(() => {
  clearInterval(chefeAggradoInterval.value);
  window.removeEventListener('keydown', tratarTeclado);
})

function tratarTeclado (event) {
  tecladoExecutaHabilidadePersonagem(event.key)
};


// VARIAVEIS

const busyLoadMasmorroas = ref(false)
const masmorras = ref([]);
const classes = ref([]);
const pontuacaoDeBatalha = ref([]);
const masmorraSelecionada = ref(null);
const chefaoSelecionado = ref(null);
const habilidades = ref([]);
const batalhaFinalizada = ref(false)
const jogardorVenceu = ref(false);
const chefaoAggrado = ref(false);

const chefeAggradoInterval = ref(null);

function loadHabilidades() {
  const habilidades = [...props.personagem.atributos.habilidades];
  // ordena
  // habilidades.sort((a, b) => {
  //   if (a.linhaRankOrdem === undefined || a.linhaRankOrdem === null) return -1;
  //   if (b.linhaRankOrdem === undefined || b.linhaRankOrdem === null) return 1;
  //   return a.linhaRankOrdem - b.linhaRankOrdem;
  // });

  // define o dano
  habilidades.forEach(habilidade => {
    habilidade.dano = ((props.personagem.atributos.ataque * habilidade.porcentagem) / 100).toFixed(2);
  });

  // atribui a tecla
  for(let i = 0; i < habilidades.length; i++){
    habilidades[i].teclaCorrespondente = i+1;
  }
  props.personagem.atributos.habilidades = habilidades;
}

function tecladoExecutaHabilidadePersonagem (eventKey) {
  let habilidadeEscolhida = null;
  console.log('tecla', parseInt(eventKey))
  for (const key in props.personagem.atributos.habilidades){
    if(props.personagem.atributos.habilidades[key].teclaCorrespondente == parseInt(eventKey)){
      console.log('encontrada!')
      habilidadeEscolhida = props.personagem.atributos.habilidades[key];
      break;
    }
  }
  // if(habilidadeEscolhida == null){
  //   for (const key in props.personagem.atributos.habilidades){
  //     if(props.personagem.atributos.habilidades[key].linhaRankOrdem == undefined){
  //       habilidadeEscolhida = props.personagem.atributos.habilidades[key];
  //       break;
  //     }
  //   }
  // }

  usaHabilidade(props.personagem, habilidadeEscolhida, chefaoSelecionado.value)
}

function chefaoAggroAutoAtaque(){
  if(chefaoAggrado.value == true) return;
  if(chefaoAggrado.value == false) chefaoAggrado.value = true;
  console.log('[começo de batalha]',chefaoSelecionado.value)
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
  // impede habilidade em recarga
  if(habilidade.recargaRestante > 0) return;

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
  const defesa = parseFloat( (defensor.defesa ?? defensor.atributos.defesa).toFixed(2));
  const dano = parseFloat((habilidade.dano - defesa).toFixed(2));

  console.log('[habilidade.dano]',habilidade.dano)
  console.log('[defensor.defesa]', defesa)
  console.log('[dano]',dano)
  // debita dano
  if(defensor.atributos) {
    let vidaResultante = defensor.atributos.vidaAtual - dano
    defensor.atributos.vidaAtual = parseFloat(vidaResultante.toFixed(2))
    if(defensor.atributos.vidaAtual < 0) defensor.atributos.vidaAtual = 0;
  } else {
    let vidaResultante = defensor.pontosVidaAtuais - dano
    defensor.pontosVidaAtuais = parseFloat(vidaResultante.toFixed(2))
    if(defensor.pontosVidaAtuais < 0) defensor.pontosVidaAtuais = 0;
  }
  // invoca texto animado
  animacaoRegistroBatalha(atacante.nome, 'atacou', defensor.nome, dano, defesa);
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

function animacaoRegistroBatalha(quem, oque, alvo, dano, defesa) {
  let novaAnimacao = {
    id: Date.now() + Math.random(),
    quem: quem, 
    oque: oque, 
    alvo: alvo, 
    dano: dano, 
    defesa: defesa, 
    mostrar: true,
    mostrar2: true,
  };

  pontuacaoDeBatalha.value.unshift(novaAnimacao);

  // setTimeout(() => {
  //   const item = pontuacaoDeBatalha.value.find(a => a.id === novaAnimacao.id);
  //   if (item) {
  //     item.mostrar = false;
  //   }
  // }, 1500);

  // setTimeout(() => {
  //   const item = pontuacaoDeBatalha.value.find(a => a.id === novaAnimacao.id);
  //   if (item) {
  //     item.mostrar2 = false;
  //   }
  // }, 3000);
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

function jogarMasmorra(masmorra) {
  masmorraSelecionada.value = masmorra
}

function voltarSelecaoMasmorras(){
  masmorraSelecionada.value = null
}

function lutarContraChefao(chefao){
  chefaoSelecionado.value = chefao
  chefaoSelecionado.value.pontosVidaAtuais = chefaoSelecionado.value.pontosVida;
  chefaoSelecionado.value.habilidades.forEach(habilidade => {
    habilidade.dano = ((chefaoSelecionado.value.ataque * habilidade.porcentagem) / 100).toFixed(2);
  });
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
