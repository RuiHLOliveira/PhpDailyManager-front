<style>

.marginVerticalSpacer {
  margin-top: 10px;
  margin-bottom: 10px;
}
.whitespace-pre{
  white-space: pre-wrap;
}

.pageTitleProjetos{
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.pageTitleProjetos > .title {
  font-size: 1.5rem;
}
.cardBox {
  border: 1px solid #bbbbbb;
  border-radius: 5px;
  margin: 20px 0px 20px 0px;
}
.titleBox {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #bbbbbb;
  border-radius: 5px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  padding: 10px 10px;
  background-color: #f1f1f1;
}
.titleBoxLeft {
  flex-grow: 1;
  display: flex;
  flex-flow: column;
  align-items: flex-start;
}
.titleBoxLeft-editBox {
  flex-grow: 1;
  display: flex;
  flex-flow: column;
  align-items: flex-start;
}
.titleEditInput {
  flex-grow: 1;
  color: red;
}
.titleBoxRight {
  display: flex;
  flex-flow: column;
}
.bodyBox {
  padding: 10px 10px;
}
.bodyBoxDiv {
  margin: 10px 0px;
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
  min-width: 10px;
  max-width: 10px;
  min-height: 10px;
  max-height: 10px;
  margin: 1px;
}
.daySquareGreen {
  background-color: #20c920;
}





.linhaTarefa {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.linhaTarefa-lined {
  border-bottom: 1px solid #9c9c9c;
}
.linhaTarefa-round {
  border-radius: 5px;
  background-color: #ebebeb;
}
.linhaTarefa-round:hover {
  background-color: #d4d4d4;
}

.btnPrioridade {
  display: inline;
}

.selected {
  outline: 3px solid #000000;
}

.prioridadeUrgente, .prioridadeUrgente:hover {
  background-color: rgb(109, 0, 0);
}
.prioridadeAlta, .prioridadeAlta:hover {
  background-color: rgb(255, 21, 21);
}
.prioridadeMedia, .prioridadeMedia:hover {
  background-color: rgb(255, 95, 21);
}
.prioridadeBaixa, .prioridadeBaixa:hover {
  background-color: rgb(255, 173, 21);
}
.prioridadeBaixissima, .prioridadeBaixissima:hover {
  color: #444444;
  background-color: rgb(234, 238, 0);
}

.situacaoPendente, .situacaoPendente:hover {
  background-color: #20c920;
}
.situacaoAguardandoResposta, .situacaoAguardandoResposta:hover {
  background-color: #0099ff;
}
.situacaoPausado, .situacaoPausado:hover {
  background-color: #757575;
}
.situacaoConcluido, .situacaoConcluido:hover {
  color: #444444;
  text-decoration: line-through;
  background-color: #d8d8d8;
}

.red, .red:hover {
  background-color: red;
}
.orange, .orange:hover {
  background-color: orange;
}
.yellow, .yellow:hover {
  background-color: rgb(241, 241, 46);
  color: black;
}
.green, .green:hover {
  background-color: rgb(66, 190, 66);
}
.blue, .blue:hover {
  background-color: rgb(91, 147, 219);
}

</style>

<template>
  <div>
    <div class="container">

      <div class="cardBox">
        <!-- TITLE -->
        <div class="titleBox">
          <!-- left side -->
          <div class="pageTitleProjetos">
            <div class="title">Lista de Habitos</div>
            <button class="btn mx-5 my-5 btn-sm" type="button" @click="toggleModalCriarHabito()">Criar Habito +</button>
          </div>
          <!-- right side -->
          <div>
          </div>
        </div>
        <!-- BODY -->
        <div class="bodyBox">
          <div v-if="habitos != []">
            <div v-for="habito in habitos" :key="habito.id">
              <div class="cardBox">
                <!-- TITLE -->
                <div class="titleBox">

                  <!-- common -->
                  <div class="titleBoxLeft" v-if="!habito.editMode">
                    <div>
                      <span>
                        {{ habito.hora }} - {{ habito.descricao }}
                      </span>
                    </div>
                  </div>

                  <!-- edicao -->
                  <div class="titleBoxLeft titleBoxLeft-editBox" v-if="habito.editMode">
                    <div class="marginVerticalSpacer titleEditInput">
                      <input name="hora" type="time" v-model="habito.horaEditar">
                      <input name="descricao" type="text" v-model="habito.descricaoEditar">
                    </div>
                    <div class="marginVerticalSpacer">
                    </div>
                  </div>

                  <!-- buttons -->
                  <div class="titleBoxRight">
                    <button v-if="!habito.editMode" class="btn btn-sm" type="button" @click="toggleEdicaoHabito(habito)">Editar</button>
                    <button v-if="habito.editMode" class="btn mx-5 my-10 btn-sm" type="button" @click="cancelarEdicaoHabito(habito)">Cancelar</button>
                    <button v-if="habito.editMode" class="btn mx-5 my-10 btn-sm" type="button" @click="salvarEdicaoHabito(habito)">Salvar</button>
                    <button v-if="habito.editMode" class="btn mx-5 my-10 btn-sm btn-red" type="button" @click="excluirHabito(habito)">Excluir</button>
                  </div>
                </div>

                <!-- BODY -->
                <div class="bodyBox">
                  <div class="bodyBoxDiv">
                    <button class="btn mx-5 my-10 btn-sm" type="button" @click="concluirHabito(habito)">Concluir agora!</button>
                    <!-- <span style="font-size: 0.8rem; color: #444444">Anotações: </span>
                    <div v-if="!habito.editMode" class="whitespace-pre">
                      {{ habito.anotacoes }}
                    </div> -->
                    <!-- <div v-if="habito.editMode">
                      <textarea class="textarea textareaHeight150" name="anotacoes" placeholder="anotacoes" v-model="habito.anotacoesEditar"></textarea>
                    </div> -->
                  </div>
                  <div class="bodyBoxDiv">
                    <div v-for="habitoRealizado in habito.habitoRealizados" :key="habitoRealizado.id">
                      {{ habitoRealizado.realizadoEm }}
                    </div>
                  </div>
                  <div class="bodyBoxDiv">
                    <div class="monthLine" v-for="mes in habito.meses" :key="mes.mes">
                      <div class="daySquare" :class="{ daySquareGreen : dia.realizado }" v-for="dia in mes.dias" :key="dia.dia">
                      </div>
                    </div>
                  </div>
                  
                </div>

              </div>

            </div>

          </div>

        </div>


      </div>
      
    </div>

    <Notifier ref="notifier"></Notifier>
    <Loader :busy="busy"></Loader>

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
import Notifier from '@/components/Notifier.vue';
import ModalCriarHabito from '@/views/habitos/ModalCriarHabito.vue';

export default {
  name: 'Habitos',
  components: {
    Loader,
    ModalCriarHabito,
    Notifier,
  },
  inject: ['configuracoes'],
  data: () => {
    return {
      busy: false,
      // dataPrazo: '',
      meses: [],
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
    getMonth(dateObject){return DateTime.getMonth(dateObject);},
    getDay(dateObject){return DateTime.getDay(dateObject);},

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
      this.busy = true;
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
        data = this.fillMesesDiasRealizados(data)
        this.habitos = data
        this.busy = false;
      })
      .catch((error) => {
        this.busy = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
        console.error(error);
      });
    },

    fillMesesDiasRealizados(habitos){
      for (let i = 0; i < habitos.length; i++) {
        habitos[i].meses = this.meses
        for (let j = 0; j < habitos[i].habitoRealizados.length; j++) {
          console.log('habito Realizado', habitos[i].habitoRealizados[j])
          let month = this.getMonth(new Date(habitos[i].habitoRealizados[j].realizadoEm))
          let day = this.getDay(new Date(habitos[i].habitoRealizados[j].realizadoEm))
          console.log('mes ', habitos[i].meses[month].dias[day] );
          console.log('antes ', habitos[i].meses[month].dias[day]);
          habitos[i].meses[month].dias[day]['realizado'] = true
          console.log('depois ', habitos[i].meses[month].dias[day]);
        }
      }
      return habitos;
    },
    
    updateHabito(habito) {
      console.log(habito.id);
      this.busy = true;
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
        this.busy = false;
        // this.resetFields(true)
        this.$refs.notifier.notify('Habito salvo!')
        this.toggleEdicaoHabito(habito)
        this.buscaHabitos();
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
      });
    },

    concluirHabito(habito) {
      console.log(habito.id);
      this.busy = true;
      let body = {};

      let requestData = {
        'url': `${config.serverUrl}/habitos/${habito.id}/concluir`,
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'POST',
        'data' : body
      };
      return Request.fetch(requestData).then(([response, data]) => {
        this.busy = false;
        this.$refs.notifier.notify('Habito concluído!')
        // this.toggleEdicaoHabito(habito)
        this.buscaHabitos();
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
      });
    },

    montaDiasDoMes(qtd){
      let diasDoMes = [];
      for (let i = 1; i <= qtd; i++) {
        diasDoMes.push({dia: i, realizado: false})
      }
      return diasDoMes;
    },
    premakeMeses(){
      let meses = [];
      for (let i = 1; i <= 12; i++){
        let qtdDias = i == 2 ? 28 : 31;
        if([4,6,9,11].includes(i)) {
          qtdDias = 30
        }
        let listaDiasDoMes = this.montaDiasDoMes(qtdDias);
        // console.log(`mes ${i} tem os dias`)
        // console.log(listaDiasDoMes)
        meses.push({
          mes: i,
          dias: listaDiasDoMes
        })
      }
      this.meses = meses
    },

  },
  watch: {
    configuracoes(a, b) {
      // do something
    }
  },
  created () {
    this.premakeMeses();
    this.buscaHabitos();
  },
}
</script>
