<style scoped>

.marginVerticalSpacer {
  margin-top: 10px;
  margin-bottom: 10px;
}
.whitespace-pre{
  white-space: pre-wrap;
}

.cardBoxHabito {
  border: 1px solid #bbbbbb;
  border-radius: 5px;
  background-color: #f1f1f1;
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
  display: inline-block;
  border: 1px solid #757575;
  border-radius: 1px;
  text-align: center;
  min-width: 20px;
  max-width: 20px;
  min-height: 20px;
  max-height: 20px;
  margin: 1px;
}
.daySquareGreen {
  background-color: #20c920;
}

.btnPrioridade {
  display: inline;
  margin: 0px 5px 0px 0px;
}

.selected {
  outline: 3px solid #000000;
}

</style>

<template>
  <div>
    <div class="container">

      <div class="divBgBlur"> <!-- HABITOS -->
        
        <div class="flex justify-spacebetween py-5 px-15"> <!-- TITLE -->
          <div class="flex justify-spacebetween alignitens-center"> <!-- left side -->
            <div class="mr-10">
              <h1>Habitos</h1>
            </div>
            <div>
              <button class="btn mx-5 btn-sm" type="button" @click="toggleModalCriarHabito()">Criar Habito +</button>
            </div>
          </div>
          <div> <!-- right side -->
          </div>
        </div>
        
        <div class="px-15"> <!-- BODY -->
          
          <InlineLoader
            :textoAguarde="true"
            :busy="busyHabitosLoad"
            :center="true">
          </InlineLoader>

          <!--  && busyHabitosLoad == true  -->
          <div v-if="habitos != [] && !busyHabitosLoad"> <!-- lista de habitos -->
            <div v-for="habito in habitos" :key="habito.id">

              <div class="cardBoxHabito p-10 m-5">

                <!-- LINE 1 -->
                <div class="flex-wrap justify-spacebetween alignitens-center"> 

                  <!-- common -->
                  <div class="flexGrow1 flex-column alignitens-start" v-if="!habito.editMode"> 
                    <div>
                      <span>
                        <button class="btn btn-checkbox mx-5" type="button" @click="concluirHabito(habito)">
                          {{ habito.realizadoHoje ? '✅' : '🔲' }}
                        </button>
                        {{ habito.hora }} - {{ habito.descricao }}
                      </span>
                    </div>
                  </div>

                  <!-- edicao -->
                  <div class="flexGrow1 flex-column alignitens-start" v-if="habito.editMode"> 
                    <div class="marginVerticalSpacer titleEditInput">
                      <input :disabled="busyHabitosUpdate" name="hora" type="time" v-model="habito.horaEditar">
                      <input :disabled="busyHabitosUpdate" name="descricao" type="text" v-model="habito.descricaoEditar">
                    </div>
                    <div class="marginVerticalSpacer">
                    </div>
                  </div>

                  <!-- right buttons -->
                  <div class="flex-column"> 
                    <button v-if="!habito.editMode" class="btn btn-sm" type="button" @click="toggleEdicaoHabito(habito)">Editar</button>
                    <button :disabled="busyHabitosUpdate" v-if="habito.editMode" class="btn mx-5 my-5 btn-sm" type="button" @click="cancelarEdicaoHabito(habito)">Cancelar</button>
                    <button :disabled="busyHabitosUpdate" v-if="habito.editMode" class="btn mx-5 my-5 btn-sm" type="button" @click="salvarEdicaoHabito(habito)">
                      Salvar
                      <InlineLoader :busy="busyHabitosUpdate"></InlineLoader>
                    </button>
                    <button :disabled="busyHabitosUpdate" v-if="habito.editMode" class="btn mx-5 my-5 btn-sm btn-red" type="button" @click="excluirHabito(habito)">Excluir</button>
                  </div>

                </div>

                <!-- LINE 2 -->
                <div class="mt-15 mb-10">
                  <!-- corpo 1 - concluir -->
                  <!-- <div class="bodyBoxDiv">
                    <button class="btn mx-5 my-10 btn-sm" type="button" @click="concluirHabito(habito)">Concluir agora!</button>
                  </div> -->

                  <!-- corpo 2 - data hora -->
                  <!-- <div class="bodyBoxDiv">
                    <div v-for="habitoRealizado in habito.habitoRealizados" :key="habitoRealizado.id">
                      {{ habitoRealizado.realizadoEm }}
                    </div>
                  </div> -->

                  <!-- corpo 3 - quadrinhos-->
                  <div class="flex-wrap">
                    <span v-for="dia in habito.semana" :key="dia.dia" class="flex-column">
                      <div class="daySquare" :class="{ daySquareGreen : dia.realizado }">
                        {{ dia.weekDayFirstLetter }}
                      </div>
                      <div class="daySquare" :class="{ daySquareGreen : dia.realizado }">
                        {{ dia.dia }}
                      </div>
                    </span>
                  </div>
                  
                </div>
                <!-- fim body -->

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

  </div>
</template>

<script>
import DateTime from '@/core/DateTime.js'
import Request from '@/core/request.js';
import config from '@/core/config.js'
import QueryStringConverter from '@/core/QueryStringConverter.js'
import Loader from '@/components/Loader.vue';
import InlineLoader from '@/components/InlineLoader.vue';
import Notifier from '@/components/Notifier.vue';
import ModalCriarHabito from '@/views/habitos/ModalCriarHabito.vue';

export default {
  name: 'Habitos',
  components: {
    Loader,
    InlineLoader,
    ModalCriarHabito,
    Notifier,
  },
  inject: ['configuracoes'],
  data: () => {
    return {
      busy: false,
      // busyHabitosLoad: false,
      busyHabitosLoad: false,
      busyHabitosUpdate: false,
      busyHabitosConcluir: true,
      // dataPrazo: '',
      meses: [],
      semana: [],
      habitos: [],
      exibirModalCriarHabito: false,
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

    /**
     * FUNCOES TOGGLE
     */
    toggleModalCriarHabito () {
      this.exibirModalCriarHabito = true;
    },

    /**
     * EDIT FORMS
     */
    toggleEdicaoHabito(habito) {
      if(habito.editMode == undefined) habito.editMode = false;
      if(habito.descricaoEditar == undefined) habito.descricaoEditar = habito.descricao;
      if(habito.horaEditar == undefined) habito.horaEditar = habito.hora;
      habito.prioridadeEditar = habito.prioridade;
      habito.situacaoEditar = habito.situacao;
      habito.editMode = !habito.editMode
    },
    cancelarEdicaoHabito(habito) {
      this.toggleEdicaoHabito(habito)
      habito.descricaoEditar = habito.descricao;
      habito.horaEditar = habito.hora;
    },
    salvarEdicaoHabito(habito) {
      console.log(habito.nomeEditar)
      console.log(habito.anotacoesEditar)
      habito.descricao = habito.descricaoEditar
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
      let params = {
        'relations': 'habitoRealizados'
      };
      // params['orderBy'] = 'dataPrazo,desc';
      params = QueryStringConverter.toQueryString(params, true);
      let requestData = {
        'url': `${config.serverUrl}/habitos${params}`,
      };
      Request.fetch(requestData)
      .then(([response, data]) => {
        console.log({data});
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

    defineRealizadoHoje(habitos){
      for (let i = 0; i < habitos.length; i++) {
        habitos[i].realizadoHoje = false;
        for (let j = 0; j < habitos[i].habitoRealizados.length; j++) {
          const dataRealizadoEm = this.formatDevDate(new Date(habitos[i].habitoRealizados[j].realizadoEm));
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
          console.log('habito Realizado', habitos[i].habitoRealizados[j])
          const realizadoEmDateObject = new Date(habitos[i].habitoRealizados[j].realizadoEm);
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
          console.log('depois ', habitos[i].semana[weekDayNumber]);
        }
      }
      return habitos;
    },
    
    updateHabito(habito) {
      console.log(habito.id);
      this.busyHabitosUpdate = true;
      let body = {
        'descricao': habito.descricao,
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
      this.busyHabitosConcluir = true;
      let body = {};

      let requestData = {
        'url': `${config.serverUrl}/habitos/${habito.id}/concluir`,
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'POST',
        'data' : body
      };
      return Request.fetch(requestData).then(([response, data]) => {
        this.busyHabitosConcluir = false;
        this.$refs.notifier.notify('Habito concluído!')
        // this.toggleEdicaoHabito(habito)
        this.buscaHabitos();
      }).catch((error) => {
        console.error(error);
        this.busyHabitosConcluir = false;
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
      console.log('hoje', hoje.getDay(), hoje.getDate());
      let domingo = new Date(hoje.getTime() - (hoje.getDay() * oneDayTimestamp)); //returns to sunday
      console.log('domingo', domingo.getDay(), domingo.getDate());
      let semana = this.montaSemanaAPartirDomingo(domingo);
      console.log(semana);
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
