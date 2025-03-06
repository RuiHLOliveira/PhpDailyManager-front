<style>

.projetoNaTarefa {
    font-size: 0.8rem;
    border: 1px solid var(--gray-button-border);
    background-color: var(--gray-button-color);
    border-radius: 5px;
}

.prioridade {
  color: rgb(19, 19, 19);
  padding: 2px 10px;
  border-radius: 5px;
  font-size: 0.8rem;
}

.p1, button.p1 {
  background-color: rgb(146, 0, 0);
  color: rgb(255, 255, 255);
}
.p2, button.p2{
  background-color: red;
  color: rgb(255, 255, 255);
}
.p3, button.p3{
  background-color: orange;
  color: rgb(19, 19, 19);
}
.p4, button.p4{
  background-color: yellow;
  color: rgb(19, 19, 19);
}
.p5, button.p5{
  background-color: green;
  color: rgb(255, 255, 255);
}

</style>

<template>
  <div>
    <div class="container divBgWhite">
      
      <section class="divBgOffWhite borderGray my-10 p-10 pb-15" style="min-height: 11vh">
        <div class="flex">
          <h1 class="titulo">Tarefas</h1>
          <div class="mt-5">
            <button type="button" class="ml-10 btn btn-sm btn-clear"
              @click="toggleShowMotivoTodasTarefas()">Motivos
            </button>
            <button type="button" class="ml-10 btn btn-sm btn-clear"
              @click="toggleModalCriarTarefa()">Criar Tarefa
            </button>
            <button type="button" class="ml-10 btn btn-sm btn-clear"
              @click="ordenarPorData()">
                {{ deveOrdenarPorData ? 'Restaurar ordem' : 'Ordenar por data' }}
            </button>
            <button v-if="deveOrdenarPorData" type="button" class="ml-10 btn btn-sm btn-clear"
              @click="inverterOrdem()">
                Inverter Ordem
            </button>
          </div>
        </div>
        <div class="flex mt-10" style="align-items: center;">
          <!-- PRIORIDADE -->
          <span class="mr-5">Filtros:</span>
          <select class="smallSelect mr-5" v-model="selectedPrioridade" name="prioridade" id="prioridade" @change="filtraListaTarefas()">
            <option value="0">Todos</option>
            <option value="1">Prioridade 1</option>
            <option value="2">Prioridade 2</option>
            <option value="3">Prioridade 3</option>
            <option value="4">Prioridade 4</option>
            <option value="5">Prioridade 5</option>
          </select>
          <select class="smallSelect mr-5" v-model="selectedSituacao" name="situacao" id="situacao" @change="filtraListaTarefas()">
            <option value="0">Todos</option>
            <option value="1">Pendente</option>
            <option value="2">Completa</option>
            <option value="3">Falha</option>
          </select>
          <input type="date" class="normalSizeInput mx-5" v-model="filtroDataInicio">
          <span class="mr-5">até</span>
          <input type="date" class="normalSizeInput ml-5" v-model="filtroDataFim">
          <button type="button" class="ml-10 btn btn-sm btn-clear"
            @click="filtraListaTarefas()">Filtrar
          </button>
          <button type="button" class="ml-10 btn btn-sm btn-clear"
            @click="limparFiltroDatas()">Limpar datas
          </button>
        </div>
      </section>


      <!-- LISTA TAREFAS -->
      <div class="pt-10 px-10" style="max-height: 82vh; overflow-y: scroll; border-top: 2px solid #a0a0a0;">
        <!-- LOADER -->
        <InlineLoader
          :textoAguarde="true"
          :busy="busyTarefasLoad || busyTarefasDelete"
          :center="true">
        </InlineLoader>

        <div v-if="tarefas != [] && !busyTarefasLoad && !busyTarefasDelete">
          <div v-for="tarefa in tarefas" :key="tarefa.id">

            <div v-if="tarefa.filtroNaoExibe == false" class="divBgOffWhite borderGray mb-10 py-10 px-10" >

              <!-- LINHA SUPERIOR -->
              <div :class="{'flex justify-spacebetween' : !isSmallScreen, 'flex-column' : isSmallScreen}">

                <div>
                  <!-- LINHA 1 -->
                  <div class="flex-wrap">
                    <div class="ycenter mt-5">
                      <span class="mr-10 check-pendente" v-if="tarefa.situacao == 0"><i class="fi fi-sr-square"></i></span>
                      <span class="mr-10 check-concluido" v-if="tarefa.situacao == 1"><i class="fi fi-sr-checkbox"></i></span>
                      <span class="mr-10 check-falhado" v-if="tarefa.situacao == 2"><i class="fi fi-sr-square-x"></i></span>
                    </div>
                    <div class="ycenter mt-5">
                      <span class="mr-10 star-meudia" v-if="tarefa.meuDia !== null && tarefa.meuDiaHoje"><i class="fi fi-sr-parking"></i></span>
                      <span class="mr-10 star-meudia" v-if="tarefa.meuDia !== null && !tarefa.meuDiaHoje"><i class="fi fi-rr-parking"></i></span>
                    </div>
                    <div class="ycenter mt-5 mr-10" v-if="tarefa.prioridade != null">
                      <span :class="{
                        'prioridade p1' : tarefa.prioridade == 1,
                        'prioridade p2' : tarefa.prioridade == 2,
                        'prioridade p3' : tarefa.prioridade == 3,
                        'prioridade p4' : tarefa.prioridade == 4,
                        'prioridade p5' : tarefa.prioridade == 5
                      }">{{ tarefa.prioridade != null ? 'Prioridade '+ tarefa.prioridade : '-' }}</span>
                    </div>
                    <div class="ycenter mt-5 mr-10">
                      <span class="projetoNaTarefa p-5">{{ tarefa.projeto.nome }}</span>
                    </div>
                  </div>
                  <!-- LINHA 2 -->

                  <div class="mb-5 mr-10 p-5">
                    <div>
                      {{ tarefa.datahoraFormatted != null ? `[${tarefa.datahoraWeekday}, ${tarefa.datahoraFormatted}]` : '' }}
                      {{ ' - ' }}
                      {{ tarefa.descricao }}
                    </div>
                  </div>
                  <div>
                    <span class="ml-5 mr-5 p-5 italicDarkGray" v-if="showMotivo[tarefa.id]" >
                      "{{ tarefa.motivo ?? 'sem motivo cadastrado' }}"
                    </span>
                  </div>
                </div>

                <!-- BUTTONS -->
                <div class="pt-10" style="min-width: 220px;" :class="{'borderTopGray' : isSmallScreen, 'textAlignRight': !isSmallScreen}">
                  <button v-if="!tarefa.editMode" class="btn btn_tarefa_concluida mr-10" type="button" 
                    :disabled="tarefa.busyTarefasUpdate"
                    @click="togglePrioridadesTarefa(tarefa)">
                      <i class="fi fi-sr-priority-importance"></i>
                  </button>
                  <button v-if="!tarefa.editMode" class="btn btn_tarefa_concluida mr-10" type="button" 
                    :disabled="tarefa.busyTarefasUpdate"
                    @click="toggleMeuDiaTarefa(tarefa)">
                      <i class="fi fi-sr-brightness"></i>
                  </button>
                  <button v-if="!tarefa.editMode" class="btn btn_tarefa_concluida" type="button" 
                    :disabled="tarefa.busyTarefasUpdate"
                    @click="toggleModalEditarTarefa(tarefa)">
                      <i class="fi fi-rr-edit"></i>
                  </button>

                  <div class="mt-15" v-if="tarefa.showMenuPrioridades" :class="{'textAlignRight': !isSmallScreen}">
                    <button v-if="tarefa.showMenuPrioridades" class="btn p1 mr-10" type="button"
                      :disabled="tarefa.busyTarefasUpdate"
                      @click="updatePrioridade(tarefa, 1)">P1
                    </button>
                    <button v-if="tarefa.showMenuPrioridades" class="btn p2 mr-10" type="button"
                      :disabled="tarefa.busyTarefasUpdate"
                      @click="updatePrioridade(tarefa, 2)">P2
                    </button>
                    <button v-if="tarefa.showMenuPrioridades" class="btn p3 mr-10" type="button"
                      :disabled="tarefa.busyTarefasUpdate"
                      @click="updatePrioridade(tarefa, 3)">P3
                    </button>
                    <button v-if="tarefa.showMenuPrioridades" class="btn p4 mr-10" type="button"
                      :disabled="tarefa.busyTarefasUpdate"
                      @click="updatePrioridade(tarefa, 4)">P4
                    </button>
                    <button v-if="tarefa.showMenuPrioridades" class="btn p5" type="button"
                      :disabled="tarefa.busyTarefasUpdate"
                      @click="updatePrioridade(tarefa, 5)">P5
                    </button>
                  </div>
                </div>
                
              </div>
              
              <div> <!-- LINHA INFERIOR -->
                <InlineLoader
                  :textoAguarde="true"
                  :busy="tarefa.busyTarefasUpdate"
                  :center="true">
                </InlineLoader>
              </div>
            </div>

          </div>
        </div>
      </div>

      
    <ModalCriarTarefa
      v-model:exibirModal="exibirModalCriarTarefa"
      :projeto="null"
      @reloadListaProjetosHabitTracker="loadTarefas()">
    </ModalCriarTarefa>
    
    <ModalEditarTarefa
      v-model:exibirModal="exibirModalEditarTarefa"
      :tarefa="tarefaModalEditarTarefa"
      :projeto="projetoModalEditarTarefa"
      @updateTaskEvent="guardarTarefaAtualizada">
    </ModalEditarTarefa>

    <Notifier ref="notifier"></Notifier>

    </div>
  </div>
</template>

<script>
import DateTime from '@/core/DateTime.js'
import Request from '@/core/request.js';
import config from '@/core/config.js'
import QueryStringConverter from '@/core/QueryStringConverter.js'
import InlineLoader from '@/components/InlineLoader.vue';
import Notifier from '@/components/Notifier.vue';
import ModalCriarTarefa from '@/views/projetos/ModalCriarTarefa.vue';
import ModalEditarTarefa from '@/views/projetos/ModalEditarTarefa.vue';

export default {
  name: 'HabitTracker',
  components: {
    InlineLoader,
    ModalCriarTarefa,
    ModalEditarTarefa,
    Notifier,
  },
  inject: ['configuracoes'],
  data: () => {
    return {
      deveOrdenarPorData: false,
      ordemCrescente: false,
      busyTarefasLoad: false,
      busyTarefasDelete: false,
      busyTarefasUpdate: false,
      busyTarefasLoad: false,
      dataPrazo: '',
      tarefas: [],
      tarefasBackup: [],
      exibirModalCriarTarefa: false,
      exibirModalEditarTarefa: false,
      tarefaModalEditarTarefa: [],
      projetoModalEditarTarefa: [],
      carregarPreviamenteAsTarefas: true,
      filtroPrioridade: null,
      filtroSituacao: null,
      nextProgramedListingAmount: 0,
      showMotivo: [],
      windowWidth: 0,
      windowHeight: 0,
      selectedPrioridade: 0,
      selectedSituacao: 1,
      filtroDataInicio: null,
      filtroDataFim: null,
    }
  },
  computed: {
    isSmallScreen() {
      console.log(this.windowWidth);
      console.log(this.windowWidth < 800);
      return this.windowWidth < 800
    },
  },
  methods: {
    
    getDimensions() {
      this.windowWidth = document.documentElement.clientWidth;
      this.windowHeight = document.documentElement.clientHeight;
    },

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
    isSameYMD(date1, date2){return DateTime.isSameYMD(date1, date2);},

    /**
     * FUNCOES TOGGLE
     */
    // toggleModalCriarProjeto () {
    //   this.exibirModalCriarProjeto = true;
    // },
    toggleModalCriarTarefa () {
      this.exibirModalCriarTarefa = true;
    },
    toggleModalEditarTarefa (tarefa) {
      console.log('entrou');
      this.tarefaModalEditarTarefa = tarefa
      this.exibirModalEditarTarefa = true;
      this.projetoModalEditarTarefa = tarefa.projeto
    },

    limparFiltroDatas(){
      this.filtroDataInicio = null;
      this.filtroDataFim = null;
    },

    definicaoFiltroDataPadrao(){
      const oneDayTimestamp = 24 * 60 * 60 * 1000
      let hoje = new Date()
      let domingo = new Date(hoje.getTime() - (hoje.getDay() * oneDayTimestamp)); //returns to sunday
      let sabado = new Date(hoje.getTime() + ( (hoje.getDay() - 2) * oneDayTimestamp));
      domingo = this.formatDevDate(domingo);
      sabado = this.formatDevDate(sabado);
      this.filtroDataInicio = domingo;
      this.filtroDataFim = sabado;
    },

    filtraListaTarefas() {

      let listaTarefas = this.tarefas;

      let prioridadeFiltro = this.selectedPrioridade != 0 ? this.selectedPrioridade : null;
      let situacaoFiltro = this.selectedSituacao != 0 ? this.selectedSituacao : null;
      situacaoFiltro = situacaoFiltro - 1;

      for (let i = 0; i < listaTarefas.length; i++) {
        listaTarefas[i].filtroNaoExibe = false;
      }

      if(situacaoFiltro != null){
        for (let i = 0; i < listaTarefas.length; i++) {
          if(listaTarefas[i].situacao != situacaoFiltro){
            listaTarefas[i].filtroNaoExibe = true
          }
        }
      }
      
      if(prioridadeFiltro != null && prioridadeFiltro != 0){
        for (let i = 0; i < listaTarefas.length; i++) {
          if(listaTarefas[i].prioridade !== prioridadeFiltro){
            listaTarefas[i].filtroNaoExibe = true
          }
        }
      }

      if(this.filtroDataInicio != null && this.filtroDataInicio != ''
        && this.filtroDataFim != null && this.filtroDataFim != ''
      ){
        for (let i = 0; i < listaTarefas.length; i++) {
          if(listaTarefas[i].datahora < this.filtroDataInicio+' 00:00:00'){
            listaTarefas[i].filtroNaoExibe = true
          }
          if(listaTarefas[i].datahora > this.filtroDataFim+' 23:59:59'){
            listaTarefas[i].filtroNaoExibe = true
          }
          if(listaTarefas[i].datahora == null){
            listaTarefas[i].filtroNaoExibe = true
          }
        }
      }
      
      // ************************ atribuição final
      this.tarefas = listaTarefas
    },

    togglePrioridadesTarefa(tarefa)
    {
      tarefa.showMenuPrioridades = !tarefa.showMenuPrioridades
    },

    updatePrioridade(tarefa, prioridade)
    {
      tarefa.busyTarefasUpdate = true;
      let body = {
        'descricao': tarefa.descricao,
        'motivo': tarefa.motivo,
        'prioridade': prioridade,
        'datahora': tarefa.datahora,
      };
      let requestData = {
        'url': config.serverUrl + '/tarefas/' + tarefa.id + '/prioridade',
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'PUT',
        'data' : body
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.$refs.notifier.notify('Prioridade editada!')
        tarefa.busyTarefasUpdate = false;
        tarefa.prioridade = prioridade
      }).catch((error) => {
        console.error(error);
        tarefa.busyTarefasUpdate = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
      });
    },

    toggleMeuDiaTarefa(tarefa){
      tarefa.busyTarefasUpdate = true;
      let finalUrl = '';
      if(!tarefa.meuDia){
        finalUrl = '/meu-dia'
      } else {
        finalUrl = '/remover-meu-dia'
      }
      let requestData = {
        'url': config.serverUrl + '/tarefas/' + tarefa.id + finalUrl,
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'POST',
      };
      Request.fetch(requestData).then(([response, data]) => {
        if(!tarefa.meuDia){
          this.$refs.notifier.notify('Tarefa adicionada ao Meu Dia');
        } else {
          this.$refs.notifier.notify('Tarefa removida do Meu Dia');
        }
        tarefa.meuDia = data.meuDia
        tarefa.meuDiaObj = data.meuDiaObj
        tarefa.busyTarefasUpdate = false;
        this.guardarTarefaAtualizada(tarefa)
      }).catch((error) => {
        console.error(error);
        tarefa.busyTarefasUpdate = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
      });
    },
    
    toggleShowMotivoTodasTarefas () {
      for (let i = 0; i < this.tarefas.length; i++) {
        this.showMotivo[this.tarefas[i].id] = !this.showMotivo[this.tarefas[i].id];
      }
    },

    guardarTarefaAtualizada(tarefaAtualizada)
    {
      console.log(tarefaAtualizada)
      let tarefas = this.tarefas
      for (let i = 0; i < tarefas.length; i++) {
        if(tarefas[i].id == tarefaAtualizada.id){
          console.log('encontrei! substitui!');
          tarefas[i] = tarefaAtualizada
          break;
        }
      }
      tarefas = this.tarefasFillDefaults(tarefas)
      tarefas = this.organizaTarefasMeuDia(tarefas)
      this.tarefas = tarefas;
    },

    /**
     * EDIT FORMS
     */
    toggleEdicaoTarefa(tarefa) {
      if(tarefa.editMode == undefined) tarefa.editMode = false;
      if(tarefa.descricaoEditar == undefined) tarefa.descricaoEditar = tarefa.descricao;
      tarefa.editMode = !tarefa.editMode
    },
    cancelarEdicaoTarefa(tarefa) {
      this.toggleEdicaoTarefa(tarefa)
      tarefa.descricaoEditar = tarefa.descricao;
    },
    salvarEdicaoTarefa(tarefa) {
      console.log(tarefa.descricaoEditar)
      tarefa.descricao = tarefa.descricaoEditar
      console.log(tarefa);
      this.updateTarefa(tarefa);
    },

    updateTarefa(tarefa) {
      console.log(tarefa.id);
      tarefa.busyTarefasUpdate = true;
      let body = {
        'descricao': tarefa.descricao,
        'datahora': tarefa.datahora,
      };
      let requestData = {
        'url': `${config.serverUrl}/tarefas/${tarefa.id}`,
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'PUT',
        'data' : body
      };
      return Request.fetch(requestData).then(([response, data]) => {
        tarefa.busyTarefasUpdate = false;
        this.$refs.notifier.notify('Tarefa salva!')
        this.toggleEdicaoTarefa(tarefa)
        this.loadTarefas();
      }).catch((error) => {
        console.error(error);
        tarefa.busyTarefasUpdate = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
      });
    },

    loadTarefas(){
      this.busyTarefasLoad = true;
      const params = {'orderBy': 'projeto,asc', 'properties' : 'projeto'};
      let requestData = {
        'url': `${config.serverUrl}/tarefas${QueryStringConverter.toQueryString(params, true)}`,
      };
      Request.fetch(requestData)
      .then(([response, data]) => {
        this.fillShowMotivo(data)
        data = this.tarefasFillDefaults(data)
        data = this.organizaTarefasMeuDia(data)
        console.log(data)
        this.tarefas = data
        this.filtraListaTarefas();
        this.busyTarefasLoad = false;
      })
      .catch((error) => {
        this.busyTarefasLoad = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
        console.error(error);
      });
    },
    
    fillShowMotivo(tarefas)
    {
      for (let i = 0; i < tarefas.length; i++) {
        this.showMotivo[tarefas[i].id] = false;
      }
    },

    inverterOrdem(){
      this.ordemCrescente = !this.ordemCrescente;
      this.tarefas = this.organizaTarefasMeuDia(this.tarefas, this.deveOrdenarPorData);
    },

    ordenarPorData(){
      this.deveOrdenarPorData = !this.deveOrdenarPorData;
      if(this.deveOrdenarPorData){
        //guarda
        this.tarefasOrganizadas = this.tarefas;
      } else {
        //restaura
        this.tarefas = this.tarefasOrganizadas;
      }
      this.tarefas = this.organizaTarefasMeuDia(this.tarefas, this.deveOrdenarPorData);
    },

    organizaTarefasMeuDia (tarefas, ordenarPorData = false) {

      let tarefasMeuDiaHoje = [];
      let tarefasMeuDiaAnteriores = [];
      let tarefasComuns = [];
      let novoArrayTarefas = [];
      let tarefasMeuDiaHojeConcluidas = [];
      let tarefasMeuDiaAnterioresConcluidas = [];
      let tarefasComunsConcluidas = [];

      for (let i = 0; i < tarefas.length; i++) {
        const element = tarefas[i];
        if(element.meuDia === null || element.meuDia === false) {
          if(element.situacao == 1) {
            tarefasComunsConcluidas.push(element);
            continue;
          } else {
            tarefasComuns.push(element);
            continue;
          }
        }
        let dateMeuDia = this.newDatetimeTz(element.meuDia);
        let dateHoje = new Date();
        let tarefaDeHoje = this.isSameYMD(dateMeuDia, dateHoje);
        if(tarefaDeHoje){
          element.meuDiaHoje = true;
          if(element.situacao == 1){
            tarefasMeuDiaHojeConcluidas.push(element);
          } else {
            tarefasMeuDiaHoje.push(element);
          }
          continue;
        }
        if(element.situacao == 1){
          tarefasMeuDiaAnterioresConcluidas.push(element);
        } else {
          tarefasMeuDiaAnteriores.push(element);
        }
        continue;
      }

      novoArrayTarefas.push(...tarefasMeuDiaHoje);
      novoArrayTarefas.push(...tarefasMeuDiaHojeConcluidas);
      novoArrayTarefas.push(...tarefasMeuDiaAnteriores);
      novoArrayTarefas.push(...tarefasMeuDiaAnterioresConcluidas);
      novoArrayTarefas.push(...tarefasComuns);
      novoArrayTarefas.push(...tarefasComunsConcluidas);

      if(ordenarPorData) {
        let arrayTarefasSemData = [];
        let arrayTarefasComData = [];
        for (let i = 0; i < novoArrayTarefas.length; i++) {
          if(novoArrayTarefas[i].datahora != null && novoArrayTarefas[i].datahora != ''){
            arrayTarefasComData.push(novoArrayTarefas[i]);
          } else {
            arrayTarefasSemData.push(novoArrayTarefas[i]);
          }
        }
        if(this.ordemCrescente) {
          arrayTarefasComData.sort(function(tarefa1,tarefa2){
            return new Date(tarefa1.datahora) - new Date(tarefa2.datahora);
          });
        } else {
          arrayTarefasComData.sort(function(tarefa1,tarefa2){
            return new Date(tarefa2.datahora) - new Date(tarefa1.datahora);
          });
        }
        arrayTarefasComData.push(...arrayTarefasSemData);
        return arrayTarefasComData;
      }

      return novoArrayTarefas;
    },

    tarefasFillDefaults(tarefas)
    {
      for (let i = 0; i < tarefas.length; i++) {
        tarefas[i].meuDiaHoje = false;
        tarefas[i].editMode = false;
        tarefas[i].busyTarefasUpdate = false;
        tarefas[i].showMenuPrioridades = false
        tarefas[i].filtroNaoExibe = false
      }
      return tarefas;
    },

  },
  watch: {
    configuracoes(a, b) {
      // do something
    }
  },
  mounted() {
    window.addEventListener('resize', this.getDimensions);
    this.getDimensions()
  },
  unmounted() {
    window.removeEventListener('resize', this.getDimensions);
  },
  created () {
    this.loadTarefas();
    this.definicaoFiltroDataPadrao();
  },
}
</script>
