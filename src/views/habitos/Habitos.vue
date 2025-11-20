<style scoped>

.marginVerticalSpacer {
  margin-top: 10px;
  margin-bottom: 10px;
}
.whitespace-pre{
  white-space: pre-wrap;
}

.habitosList{
  display: flex;
  flex-direction: column;
}

.cardBoxHabito {
  border: 1px solid #bbbbbb;
  border-radius: 5px;
  background-color: #f1f1f1;
  flex-grow: 1;
  flex-shrink: 0;
}

.titleEditInput {
  flex-grow: 1;
  color: red;
}

.monthLine{
  margin: 0px;
  height: 15px;
}

.daySquare {
  font-size: 0.8rem;
  display: inline-block;
  border: 1px solid #757575;
  border-radius: 1px;
  text-align: center;
  min-width: 16px;
  max-width: 16px;
  min-height: 16px;
  max-height: 16px;
  margin: 1px;
}
.daySquareGreen {
  background-color: #20c920;
}

.btnPrioridade {
  display: inline;
}

.selected {
  outline: 3px solid #000000;
}

.boxDescricao {
  display: flex;
  flex-direction: column;
  background-color: #88888822;
  /* border-radius: 10px; */
  width: calc(100% - 260px);
  justify-content: center; /* centralização vertical */
  padding: 5px 5px;
  margin-bottom: 10px;
}
.boxDias {
  display: flex;
  flex-direction: column;
  align-items: center; /* centralização horizontal */
  /* background-color: #00000011; */
  /* border-radius: 10px; */
  min-width: 240px;
  margin-bottom: 10px;
  /* overflow-x: hidden; */
}
.iconDiaRealizado{
  font-size: 1.6rem;
  color: green;
}

.daySquareNovo {
  font-size: 0.9rem;
  display: inline-block;
  border: 1px solid #757575;
  border-radius: 1px;
  text-align: center;
  min-width:  30px;
  max-width:  30px;
  min-height: 30px;
  max-height: 30px;
  margin: 1px;
  align-items: center;
}
</style>

<template>
  <div>
    <div class="container">

      <div class="darkmodeBgBlack"> <!-- HABITOS -->
        
        <div class="flex justify-spacebetween py-5 px-15"> <!-- TITLE -->
          <div class="flex justify-spacebetween alignitens-center"> <!-- left side -->
            <div class="mr-10">
              <h1>Habitos</h1>
            </div>
            <div>
              <button class="btn mx-5 btn-clear btn-sm" type="button" @click="toggleModalCriarHabito()">Criar Habito +</button>
            </div>
          </div>
          <div> <!-- right side -->
              <router-link class="btn btn-clear btn-sm" to="/editarHabitos">
                  <i class="fi fi-rs-brightness"></i> Editar Hábitos
              </router-link>
          </div>
        </div>
        
        <div class="px-15"> <!-- BODY -->
          
          <InlineLoader
            :textoAguarde="true"
            :busy="busyHabitosLoad"
            :center="true">
          </InlineLoader>

          <!-- linha 1 -->
          <div class="flex flex-center-combo mb-5">

            <div class="ml-5 boxDias">
              <div class="flex">
                <span v-for="dia in semana" :key="dia.dia" class="daySquareNovo flex-column flex-center-combo">
                  <div>{{ dia.weekDayFirstLetter }}</div>
                  <div>{{ dia.dia }}</div>
                </span>
              </div>
            </div>
            
            <!-- descricao do habito -->
            <div class="flex-column boxDescricao">
              <div class="flex font-weight-bold">
                Descrição
              </div>
            </div>
          </div>

          <!-- lista de habitos -->
          <div v-if="habitos != [] && !busyHabitosLoad" class="habitosList">
            <div v-for="habito in habitos" :key="habito.id">

              <!-- linha 1 -->
              <div class="flex flex-center-combo mb-5">
                
                <div class="ml-5 boxDias">
                  <div class="flex-wrap">
                    <span v-for="dia in habito.semana" :key="dia.dia" class="flex-column">
                      <!-- <div class="daySquareNovo" :class="{ daySquareGreen : dia.realizado }"> -->
                      <div class="daySquareNovo flex-column flex-center-combo">
                        <!-- <div>{{ dia.weekDayFirstLetter }}</div> -->
                        <!-- <div>{{ dia.dia }}</div> -->
                        <i v-if="dia.realizado" class="fi fi-bs-check iconDiaRealizado"></i>
                      </div>
                    </span>
                  </div>
                </div>

                <!-- descricao do habito -->
                <div class="boxDescricao">
                  <div class="">

                    <InlineLoader
                      :busy="habito.busyHabitosConcluir">
                    </InlineLoader>

                    <button class="btn btn-checkbox mx-5" style="position: relative; top: 3px;" 
                      type="button" @click="toggleModalConcluirHabito(habito)"
                      :disabled="habito.busyHabitosConcluir"
                      v-if="!habito.busyHabitosConcluir">
                      <i class="fi fi-bs-checkbox" style="color: green;" v-if="habito.realizadoHoje"></i>
                      <i class="fi fi-bs-square" style="color: #444444;" v-if="!habito.realizadoHoje"></i>
                    </button>

                    <span class="mr-10 font-weight-bold">{{ habito.hora }}</span>
                    <span>{{ habito.descricao }}</span>
                  </div>
                  <div v-if="showMotivo[habito.id]">
                    <span class="my-5 p-5 italicoSutil" >
                      {{ habito.motivo ?? 'sem motivo cadastrado' }}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
      
    </div>

    <Notifier ref="notifier"></Notifier>

    <ModalCriarHabito
      v-model:exibirModal="exibirModalCriarHabito"
      @reloadListaHabitosHabitTracker="buscaHabitos()">
    </ModalCriarHabito>
    
    <ModalCompletarHabito
      v-model:exibirModal="exibirModalCompletarHabito"
      v-model:habitoCompletar="habitoCompletar"
      @reloadListaHabitosHabitTracker="buscaHabitos()">
    </ModalCompletarHabito>

  </div>
</template>

<script>
import DateTime from '@/core/DateTime.js'
import { HabitosStorage } from '@/core/storage/HabitosStorage.js'
import Request from '@/core/request.js';
import config from '@/core/config.js'
import QueryStringConverter from '@/core/QueryStringConverter.js'
import Loader from '@/components/Loader.vue';
import InlineLoader from '@/components/InlineLoader.vue';
import Notifier from '@/components/Notifier.vue';
import ModalCriarHabito from '@/views/habitos/ModalCriarHabito.vue';
import ModalCompletarHabito from './ModalCompletarHabito.vue';

export default {
  name: 'Habitos',
  components: {
    Loader,
    InlineLoader,
    ModalCriarHabito,
    ModalCompletarHabito,
    Notifier,
  },
  inject: ['configuracoes'],
  data: () => {
    return {
      busy: false,
      // busyHabitosLoad: false,
      busyHabitosLoad: false,
      busyHabitosUpdate: false,
      // dataPrazo: '',
      meses: [],
      semana: [],
      habitos: [],
      showMotivo: [],
      exibirModalCriarHabito: false,
      exibirModalCompletarHabito: false,
      habitoCompletar: [],
    }
  },
  methods: {
    
    /** 
     * FUNCOES HELPER IMPORTADAS
    */
    formatDevDate(dateObject){return DateTime.formatDevDate(dateObject);},
    formatBrDate(dateObject){return DateTime.formatBrDate(dateObject);},
    getWeekDay(dateObject){return DateTime.getWeekDay(dateObject);},
    getWeekDayFirstLetter(dateObject){return DateTime.getWeekDayFirstLetter(dateObject);},
    getYear(dateObject){return DateTime.getYear(dateObject);},
    getMonth(dateObject){return DateTime.getMonth(dateObject);},
    getDate(dateObject){return DateTime.getDate(dateObject);},
    getWeekDayNumber(dateObject){return DateTime.getWeekDayNumber(dateObject);},
    newDatetimeTz(dateString){return DateTime.newDatetimeTz(dateString);},

    /**
     * FUNCOES TOGGLE
     */

    toggleModalConcluirHabito(habitoCompletar) {
      this.exibirModalCompletarHabito = !this.exibirModalCompletarHabito
      if(this.exibirModalCompletarHabito) {
        console.info("abrindo modal", this.habitoCompletar)
        this.habitoCompletar = habitoCompletar;
      } else {
        this.habitoCompletar = [];
        console.info("fechando modal", this.habitoCompletar)
      }
    },

    toggleModalCriarHabito () {
      this.exibirModalCriarHabito = true;
    },

    toggleShowMotivoHabito (habito) {
      this.showMotivo[habito.id] = !this.showMotivo[habito.id];
    },

    /**
     * EDIT FORMS
     */
    toggleEdicaoHabito(habito) {
      if(habito.editMode == undefined) habito.editMode = false;
      if(habito.descricaoEditar == undefined) habito.descricaoEditar = habito.descricao;
      if(habito.motivoEditar == undefined) habito.motivoEditar = habito.motivo;
      if(habito.horaEditar == undefined) habito.horaEditar = habito.hora;
      habito.prioridadeEditar = habito.prioridade;
      habito.situacaoEditar = habito.situacao;
      habito.editMode = !habito.editMode
    },
    cancelarEdicaoHabito(habito) {
      this.toggleEdicaoHabito(habito)
      habito.descricaoEditar = habito.descricao;
      habito.motivoEditar = habito.motivo;
      habito.horaEditar = habito.hora;
    },
    salvarEdicaoHabito(habito) {
      console.log(habito.nomeEditar)
      console.log(habito.anotacoesEditar)
      habito.descricao = habito.descricaoEditar
      habito.motivo = habito.motivoEditar
      habito.hora = habito.horaEditar
      habito.prioridade = habito.prioridadeEditar
      habito.situacao = habito.situacaoEditar
      console.log(habito);
      this.updateHabito(habito);
    },
    toggleEditarSituacao(habito, novaSituacao){
      habito.situacaoEditar = novaSituacao;
    },
    toggleEditarPrioridade(habito, novaPrioridade){
      habito.prioridadeEditar = novaPrioridade;
    },

    excluirHabito(habito) {
      // ask for confirmation
      if(!confirm("Deseja apagar o habito?")){
        return;
      }
      console.log(habito.id);
      this.busy = true;
      let requestData = {
        'url': `${config.serverUrl}/habitos/${habito.id}`,
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'DELETE',
      };
      return Request.fetch(requestData).then(([response, data]) => {
        this.busy = false;
        this.$refs.notifier.notify('Habito excluído!')
        this.toggleEdicaoHabito(habito)
        this.buscaHabitos();
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
      });
    },

    /**
     * FUNCOES FETCH API
     */
    buscaHabitos () {
      this.busyHabitosLoad = true;
      HabitosStorage.index()
      .then(([response, data]) => {
        console.log({data});
        this.fillShowMotivo(data)
        data = this.ordenarHabitos(data)
        data = this.defineCamposExtras(data)
        data = this.defineRealizadoHoje(data)
        data = this.fillSemanaRealizados(data)
        this.habitos = data
        this.busyHabitosLoad = false;
      })
      .catch((error) => {
        this.busyHabitosLoad = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
        console.error(error);
      });
    },

    fillShowMotivo(habitos)
    {
      for (let i = 0; i < habitos.length; i++) {
        this.showMotivo[habitos[i].id] = false;
      }
    },

    ordenarHabitos(habitos){
      habitos = habitos.sort((a,b) => {
        return a.hora > b.hora
      })
      return habitos
    },

    
    defineCamposExtras(habitos){
      for (let i = 0; i < habitos.length; i++) {
        habitos[i].busyHabitosConcluir = false;
      }
      return habitos;
    },

    defineRealizadoHoje(habitos){
      for (let i = 0; i < habitos.length; i++) {
        habitos[i].realizadoHoje = false;
        for (let j = 0; j < habitos[i].habitoRealizados.length; j++) {
          const dataRealizadoEm = this.formatDevDate(this.newDatetimeTz(habitos[i].habitoRealizados[j].realizadoEm));
          const dataHoje = this.formatDevDate(new Date());
          if( dataRealizadoEm == dataHoje ){
            habitos[i].realizadoHoje = true;
          }
        }
      }
      return habitos;
    },

    fillSemanaRealizados(habitos){
      for (let i = 0; i < habitos.length; i++) {
        habitos[i].semana = this.montaSemanaAtual()
        for (let j = 0; j < habitos[i].habitoRealizados.length; j++) {
          // console.log('habito Realizado', habitos[i].habitoRealizados[j])
          const realizadoEmDateObject = this.newDatetimeTz(habitos[i].habitoRealizados[j].realizadoEm);
          const weekDayNumber = this.getWeekDayNumber(realizadoEmDateObject)
          const date = this.getDate(realizadoEmDateObject)
          const month = this.getMonth(realizadoEmDateObject)
          const year = this.getYear(realizadoEmDateObject)
          if(date == habitos[i].semana[weekDayNumber].dia
            && month == habitos[i].semana[weekDayNumber].mes
            && year == habitos[i].semana[weekDayNumber].ano
          ){
            habitos[i].semana[weekDayNumber]['realizado'] = true
          }
          // console.log('depois ', habitos[i].semana[weekDayNumber]);
        }
      }
      return habitos;
    },
    
    updateHabito(habito) {
      console.log(habito.id);
      this.busyHabitosUpdate = true;
      let body = {
        'descricao': habito.descricao,
        'motivo': habito.motivo,
        'hora': habito.hora,
        'prioridade': habito.prioridade,
        'situacao': habito.situacao,
      };

      let requestData = {
        'url': `${config.serverUrl}/habitos/${habito.id}`,
        'headers': new Headers({'Content-Type': 'application/json'}),
        
        'method' : 'PUT',
        'data' : body
      };
      return Request.fetch(requestData).then(([response, data]) => {
        this.busyHabitosUpdate = false;
        // this.resetFields(true)
        this.$refs.notifier.notify('Habito salvo!')
        this.toggleEdicaoHabito(habito)
        this.buscaHabitos();
      }).catch((error) => {
        console.error(error);
        this.busyHabitosUpdate = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
      });
    },

    concluirHabito(habito) {
      if(habito.realizadoHoje == true) return;
      console.log(habito.id);
      habito.busyHabitosConcluir = true;
      let body = {};

      let requestData = {
        'url': `${config.serverUrl}/habitos/${habito.id}/concluir`,
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'POST',
        'data' : body
      };
      return Request.fetch(requestData).then(([response, data]) => {
        habito.busyHabitosConcluir = false;
        this.$refs.notifier.notify('Habito concluído!')
        // this.toggleEdicaoHabito(habito)
        this.buscaHabitos();
      }).catch((error) => {
        console.error(error);
        habito.busyHabitosConcluir = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
      });
    },

    montaSemanaAPartirDomingo(dateDomingo)
    {
      const oneDayTimestamp = 24 * 60 * 60 * 1000
      let dia = dateDomingo
      let semana = [];
      let qtd = 7;
      for (let i = 0; i < qtd; i++) {
        if(i > 0) {
          dia.setTime(dia.getTime() + (oneDayTimestamp)); // sums 1 day
        }
        semana.push({
          dateObject: new Date(dia.getTime()),
          dia: this.getDate(new Date(dia.getTime())),
          mes: this.getMonth(new Date(dia.getTime())),
          ano: this.getYear(new Date(dia.getTime())),
          weekDay: this.getWeekDay(new Date(dia.getTime())),
          weekDayFirstLetter: this.getWeekDayFirstLetter(new Date(dia.getTime())),
          realizado: false
        })
      }
      return semana;
    },
    montaSemanaAtual() {
      const oneDayTimestamp = 24 * 60 * 60 * 1000
      let hoje = new Date()
      // console.log('hoje', hoje.getDay(), hoje.getDate());
      let domingo = new Date(hoje.getTime() - (hoje.getDay() * oneDayTimestamp)); //returns to sunday
      // console.log('domingo', domingo.getDay(), domingo.getDate());
      let semana = this.montaSemanaAPartirDomingo(domingo);
      // console.log(semana);
      this.semana = semana
      return semana;
    },

  },
  watch: {
    configuracoes(a, b) {
      // do something
    }
  },
  created () {
    // this.montaSemanaAtual();
    this.buscaHabitos();
  },
}
</script>
