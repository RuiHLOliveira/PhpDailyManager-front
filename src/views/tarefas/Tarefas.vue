<style scoped>

.col-completa {
  width: 30px;
}
.col-prioridade {
  width: 40px;
}
.col-projeto {
  width: 200px;
}
.col-texto {
  width: 600px;
}
.col-acoes {
  width: 60px;
}

.menu-propriedades-container {
  position: relative;
  top: -16px;
}
.menu-prioridades{
  position: absolute;
  background-color: var(--bg-color);
  display: flex;
  flex-direction: row;
}

.tarefasScroll {
  overflow-x: scroll;
  max-width: 95vw;
}

@media only screen and (min-width: 800px) {
  .tarefasScroll {
    overflow-x: scroll;
    max-width: calc(95vw - 200px);
  }
}

.tarefasScroll > div {
  width: 860px;
}

/* MODERN FILTER STYLES */
.boxFiltros {
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 5px;
}

.columnPrioridade {
  width: 150px;
}

.columnStatus {
  width: 150px;
}

.columnPeriodo {
  width: 335px;
}

.columnOrdenacao {
  width: 200px;
}

.columnProjeto {

}

.filter-label {
  margin-top: 0px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--font-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  height: 25px;
  vertical-align: bottom;
  display: inline-block;
}

.fieldData {
  color: var(--font-color);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  width: 150px;
}

.filter-select,
.filter-input {
  color: var(--font-color);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.filter-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23B0B0B0' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 28px;
}

.filter-select:hover,
.filter-input:hover {
  background-color: var(--bg-color);
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  background-color: var(--bg-color);
}

.filter-select:active {
  outline: none;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
}

.filter-select option {
  color: var(--font-color);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  padding: 8px;
}

.filter-select option:checked {
  background-color: var(--bg-color);
}

.sort-btn-active {
  color: var(--font-color);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  font-weight: 500;
}

.filter-btn-secondary {
  color: var(--font-color);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-align: center;
}

.filter-btn-secondary:hover {
  background-color: var(--bg-color-variant);
}

.full-width {
  width: 100%;
}


@media only screen and (max-width: 799px) {
  /* .columnPrioridade,
  .columnStatus,
  .columnPeriodo,
  .columnOrdenacao,
  .columnProjeto {
    flex: 1 1 100%;
    width: 100%;
  } */
  
  .filter-date-range {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-date-range input {
    width: 100%;
  }
}

</style>

<template>
  <div class="containerLarge ">
    
    <div class="div_border_bottom_gray ">
      <section class="mb-10 p-10 pb-15">
        <!-- HEADER COM TÍTULO E AÇÕES RÁPIDAS -->
        <div class="flex-wrap justify-spacebetween alignitems-center">
          <div class="flex alignitems-center gap-5">
            <h1 class="titulo">Tarefas</h1>
            <button type="button" class="btn btn-sm btn-clear"
              @click="toggleShowMotivoTodasTarefas()">
              <i class="fi fi-rr-note"></i> Motivos
            </button>
            <button type="button" class="btn btn-sm btn-clear"
              @click="toggleModalCriarTarefa()">
              <i class="fi fi-rr-plus"></i> Criar
            </button>
          </div>
        </div>

        <div class="boxFiltros flex-column px-10 py-5">

            <!-- Filtros da linha 1 -->
            <div class="flex-wrap">

              <div class="flex-column columnPrioridade mr-5 mt-10">
                <label class="filter-label">
                  <i class="fi fi-rr-priority-importance"></i> Prioridade
                </label>
                <select class="filter-select" v-model="selectedPrioridade" name="prioridade" id="prioridade" @change="filtraListaTarefas()">
                  <option value="0">Todos</option>
                  <option value="1">🔴 Prioridade 1</option>
                  <option value="2">🟠 Prioridade 2</option>
                  <option value="3">🟡 Prioridade 3</option>
                  <option value="4">🟢 Prioridade 4</option>
                  <option value="5">🔵 Prioridade 5</option>
                </select>
              </div>

              <div class="flex-column columnStatus mr-5 mt-10">
                <label class="filter-label">
                  <i class="fi fi-rr-list-check"></i> Status
                </label>
                <select class="filter-select" v-model="selectedSituacao" name="situacao" id="situacao" @change="filtraListaTarefas()">
                  <option value="0">Todos</option>
                  <option value="1">⏳ Pendente</option>
                  <option value="2">✓ Completa</option>
                  <option value="3">✗ Falha</option>
                </select>
              </div>
              
              <div class="flex-column columnPeriodo mr-5 mt-10">
                <label class="filter-label">
                  <i class="fi fi-rr-calendar"></i> Período
                  <button type="button" class="btn btn-sm btn-clear"
                    style="font-size: 0.7rem;"
                    @click="limparFiltroDatas(); filtraListaTarefas()">
                    <i class="fi fi-rr-broom"></i> Limpar Datas
                  </button>
                </label>

                <div class="flex-wrap alignitems-center">
                  <input type="date" class="fieldData" v-model="filtroDataInicio" @change="filtraListaTarefas()">
                  <div class="mx-5">até</div>
                  <input type="date" class="fieldData" v-model="filtroDataFim" @change="filtraListaTarefas()">
                </div>
              </div>
              
              <div class="flex-column columnOrdenacao mt-10">
                <label class="filter-label">
                  <i class="fi fi-rr-arrow-sort"></i> Ordenação
                </label>
                <div>
                  <button v-if="!ordenacaoAtiva || ordenacaoAtiva === 'data'" type="button" class="btn btn-clear btn-sm mr-5"
                    :style="{ width: ordenacaoAtiva === 'data' ? '100px' : 'calc(50% - 5px)'}"
                    @click="ordenarPorData()"
                    :class="{ 'sort-btn-active': ordenacaoAtiva === 'data' }">
                    <i :class="ordenacaoAtiva === 'data' ? 'fi fi-sr-calendar-check' : 'fi fi-rr-calendar'"></i>
                    Por Data
                  </button>
                  <button v-if="ordenacaoAtiva === 'data'" type="button" class="btn btn-sm btn-clear sort-btn"
                    style="width:35px"
                    @click="inverterOrdem()">
                    {{ ordemCrescente ? '↓' : '↑' }}
                  </button>
                  <button v-if="!ordenacaoAtiva || ordenacaoAtiva === 'prioridade'" type="button" class="btn btn-clear btn-sm"
                    :style="{ width: ordenacaoAtiva === 'prioridade' ? '100px' : 'calc(50% - 5px)'}"
                    @click="ordenarPorPrioridade()"
                    :class="{ 'sort-btn-active': ordenacaoAtiva === 'prioridade' }">
                    <i :class="ordenacaoAtiva === 'prioridade' ? 'fi fi-sr-priority-importance' : 'fi fi-rr-priority-importance'"></i>
                    Por Prioridade
                  </button>
                  <button v-if="ordenacaoAtiva === 'prioridade'" type="button" class="btn btn-sm btn-clear sort-btn"
                    style="width:35px"
                    @click="inverterOrdem()">
                    {{ ordemCrescente ? '↓' : '↑' }}
                  </button>
                </div>
              </div>
            </div>

            
            <!-- Filtro da linha 2, ocupando toda a largura -->
            <div class="flex-column mt-10">
              <div class="columnProjeto">
                <label class="filter-label">
                  <i class="fi fi-rr-folder"></i> Projeto
                </label>
                <select class="fullSelect" v-model="selectedProjeto"
                  name="projeto" id="projeto" @change="filtraListaTarefas()">
                  <option value="0">Todos</option>
                  <option v-for="projeto in listaProjetos" :key="projeto.id" :value="projeto.id">
                    {{ projeto.nome }}
                  </option>
                </select>
              </div>
            </div>

        </div>
      </section>
    </div>


    <!-- LISTA TAREFAS -->
    <div class="pt-10 px-10">
      <!-- LOADER -->
      <InlineLoader
        :textoAguarde="true"
        :busy="busyTarefasLoad || busyTarefasDelete"
        :center="true">
      </InlineLoader>

      <div v-if="tarefas != [] && !busyTarefasLoad && !busyTarefasDelete"  class="tarefasScroll">
        <div v-for="tarefa in tarefas" :key="tarefa.id">
          <div class="flex">
          <div v-if="tarefa.filtroNaoExibe == false" class="tarefa shadow-1">

            <!-- <div class="flex-column"> -->
            <div class="flex">

              <div class="" :class="{'flex alignitens-center' : !isSmallScreen, 'flex-column' : isSmallScreen}">

                <!-- LINHA 1 -->
                <div class="col-completa flex-wrap">
                  <div class="">
                    <span class="mr-10 check-pendente" v-if="tarefa.situacao == 0"><i class="fi fi-sr-square"></i></span>
                    <span class="mr-10 check-concluido" v-if="tarefa.situacao == 1"><i class="fi fi-rr-checkbox"></i></span>
                    <span class="mr-10 check-falhado" v-if="tarefa.situacao == 2"><i class="fi fi-sr-square-x"></i></span>
                  </div>
                  <div class="">
                    <span class="mr-10 iconBig" v-if="tarefa.meuDia !== null && tarefa.meuDiaHoje"><i class="fi fi-sr-parking"></i></span>
                    <span class="mr-10 iconBig" v-if="tarefa.meuDia !== null && !tarefa.meuDiaHoje"><i class="fi fi-rr-parking"></i></span>
                  </div>
                </div>

                <div class="col-prioridade">
                  <div class="pb-5">
                    <span :class="{
                      'prioridade semPrioridade' : tarefa.prioridade == null,
                      'prioridade p1' : tarefa.prioridade == 1,
                      'prioridade p2' : tarefa.prioridade == 2,
                      'prioridade p3' : tarefa.prioridade == 3,
                      'prioridade p4' : tarefa.prioridade == 4,
                      'prioridade p5' : tarefa.prioridade == 5
                    }">{{ tarefa.prioridade != null ? 'P'+ tarefa.prioridade : 'ND' }}</span>
                  </div>
                </div>

                <div class="col-acoes flex justify-start alignitems-center ml-5" style="gap: 5px;">
                  <button v-if="!tarefa.editMode" class="btn btn-sm btn-clear btn_tarefa_concluida" type="button" 
                    :disabled="tarefa.busyTarefasUpdate"
                    @click="toggleModalEditarTarefa(tarefa)">
                      <i class="fi fi-rr-edit"></i>
                  </button>

                  <button v-if="!tarefa.editMode" class="my-10 btn btn-sm btn-clear btn_tarefa_concluida" type="button" 
                    :disabled="tarefa.busyTarefasUpdate"
                    @click="togglePrioridadesTarefa(tarefa)">
                      <i class="fi fi-sr-priority-importance"></i>
                  </button>

                  <div class="menu-propriedades-container">
                    <div class="menu-prioridades div_border_gray px-5 py-5" v-if="tarefa.showMenuPrioridades">
                      <button v-if="tarefa.showMenuPrioridades" class="btn btn-sm p1 mr-10" type="button"
                        :disabled="tarefa.busyTarefasUpdate"
                        @click="updatePrioridade(tarefa, 1)">P1
                      </button>
                      <button v-if="tarefa.showMenuPrioridades" class="btn btn-sm p2 mr-10" type="button"
                        :disabled="tarefa.busyTarefasUpdate"
                        @click="updatePrioridade(tarefa, 2)">P2
                      </button>
                      <button v-if="tarefa.showMenuPrioridades" class="btn btn-sm p3 mr-10" type="button"
                        :disabled="tarefa.busyTarefasUpdate"
                        @click="updatePrioridade(tarefa, 3)">P3
                      </button>
                      <button v-if="tarefa.showMenuPrioridades" class="btn btn-sm p4 mr-10" type="button"
                        :disabled="tarefa.busyTarefasUpdate"
                        @click="updatePrioridade(tarefa, 4)">P4
                      </button>
                      <button v-if="tarefa.showMenuPrioridades" class="btn btn-sm p5 mr-10" type="button"
                        :disabled="tarefa.busyTarefasUpdate"
                        @click="updatePrioridade(tarefa, 5)">P5
                      </button>
                      <button v-if="tarefa.showMenuPrioridades" class="btn btn-sm semPrioridade" type="button"
                        :disabled="tarefa.busyTarefasUpdate"
                        @click="updatePrioridade(tarefa, null)">ND
                      </button>
                    </div>
                  </div>
                </div>
                
                <div class="col-projeto mx-10">
                  <router-link class="mr-10 btn btn-sm btn-clear projetoNaTarefa p-5"
                    style="width: 100%;"
                    :to='getProjetoUrl(tarefa.projeto)'>
                    {{ tarefa.projeto.nome }}
                  </router-link>
                </div>

                <div class="flex-column col-texto ml-10 ">
                  <span class="data_com_tarefa">
                    {{ tarefa.datahoraFormatted != null ? `${tarefa.datahoraWeekday}, ${tarefa.datahoraFormatted}` : '___ __/__/__ __:__' }}
                  </span>
                  <span class="">
                    {{ tarefa.descricao }}
                  </span>
                  <div class="mt-5 mb-5" v-if="showMotivo[tarefa.id]">
                    <span class="mr-5 p-5 pl-10 italicoSutil motivo_tarefa" >
                      "{{ tarefa.motivo ?? 'sem motivo cadastrado' }}"
                    </span>
                  </div>
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
    </div>

    
  <ModalCriarTarefa
    v-model:exibirModal="exibirModalCriarTarefa"
    :projeto="null">
  </ModalCriarTarefa>
  
  <ModalEditarTarefa
    v-model:exibirModal="exibirModalEditarTarefa"
    :tarefa="tarefaModalEditarTarefa"
    :projeto="projetoModalEditarTarefa"
    @updateTaskEvent="guardarTarefaAtualizada"
    @deletedTaskEvent="removeTarefaExcluida">
  </ModalEditarTarefa>

  <Notifier ref="notifier"></Notifier>

  </div>
</template>

<script>
import DateTime from '@/core/DateTime.js'
import Request from '@/core/request.js';
import config from '@/core/config.js'
import UrlBuilder from '../../core/urlBuilder';
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
  },  emits: ['redirectAfterLogin'],  inject: ['configuracoes'],
  data: () => {
    return {
      ordenacaoAtiva: null,
      ordemCrescente: false,
      tarefasOrganizadas: [],
      busyTarefasLoad: false,
      busyTarefasDelete: false,
      busyTarefasUpdate: false,
      busyTarefasLoad: false,
      dataPrazo: '',
      tarefas: [],
      listaProjetos: [],
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
      selectedProjeto: 0,
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

    getProjetoUrl(projeto, fullpath = false) {
      let response = UrlBuilder.getProjetoUrl(projeto, fullpath);
      return response;
    },

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

    definicaoFiltroDataPadrao(usarDiaAtual = true)
    {
      const currentDate = new Date();
      const currentDay = currentDate.getDay();
      const daysToSunday = currentDay === 0 ? 0 : currentDay;
      const daysToSaturday = currentDay === 6 ? 0 : 6 - currentDay;

      let domingo = new Date(currentDate);
      domingo.setDate(currentDate.getDate() - daysToSunday);
      let sabado = new Date(currentDate);
      sabado.setDate(currentDate.getDate() + daysToSaturday);

      domingo = this.formatDevDate(domingo);
      sabado = this.formatDevDate(sabado);
      let hoje = this.formatDevDate(currentDate);

      if(usarDiaAtual) {
        this.filtroDataInicio = hoje;
        this.filtroDataFim = hoje;
      } else {
        this.filtroDataInicio = domingo;
        this.filtroDataFim = sabado;
      }

    },

    filtraListaTarefas() {

      let listaTarefas = this.tarefas;

      let prioridadeFiltro = this.selectedPrioridade != 0 ? this.selectedPrioridade : null;
      let situacaoFiltro = this.selectedSituacao != 0 ? this.selectedSituacao : null;
      let projetoFiltro = this.selectedProjeto != 0 ? this.selectedProjeto : null;
      
      for (let i = 0; i < listaTarefas.length; i++) {
        listaTarefas[i].filtroNaoExibe = false;
      }

      if(situacaoFiltro != null){
        situacaoFiltro = situacaoFiltro - 1;
        for (let i = 0; i < listaTarefas.length; i++) {
          if(listaTarefas[i].situacao != situacaoFiltro){
            listaTarefas[i].filtroNaoExibe = true
          }
        }
      }
      
      if(prioridadeFiltro != null && prioridadeFiltro != 0){
        for (let i = 0; i < listaTarefas.length; i++) {
          if(listaTarefas[i].prioridade != prioridadeFiltro){
            listaTarefas[i].filtroNaoExibe = true
          }
        }
      }

      if(projetoFiltro != null){
        for (let i = 0; i < listaTarefas.length; i++) {
          if(listaTarefas[i].projeto == null || listaTarefas[i].projeto.id != projetoFiltro){
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
        this.tarefas = this.aplicarOrdenacaoAtual(this.tarefas)
        if(this.ordenacaoAtiva === 'prioridade'){
          const indiceBase = this.tarefasOrganizadas.findIndex(item => item.id === tarefa.id);
          if(indiceBase !== -1) this.tarefasOrganizadas[indiceBase].prioridade = prioridade;
        }
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
      console.info("LOG guardando tarefa atualizada", tarefaAtualizada);
      let tarefas = this.tarefas
      for (let i = 0; i < tarefas.length; i++) {
        if(tarefas[i].id == tarefaAtualizada.id){
          console.info("LOG tarefa encontrada, guardando.");
          tarefas[i] = tarefaAtualizada
          break;
        }
      }
      if(this.ordenacaoAtiva){
        const indiceBase = this.tarefasOrganizadas.findIndex(tarefa => tarefa.id === tarefaAtualizada.id);
        if(indiceBase !== -1) this.tarefasOrganizadas[indiceBase] = tarefaAtualizada;
      }
      tarefas = this.aplicarOrdenacaoAtual(tarefas)
      this.tarefas = tarefas;
      // this.filtraListaTarefas(); // usuário irá filtrar manualmente
    },

    removeTarefaExcluida(tarefaExcluida)
    {
      let tarefas = this.tarefas

      const indice = tarefas.findIndex(tarefa => tarefa.id === tarefaExcluida.id);
      console.log('id para remover encontrado: ', indice);
      // Se o elemento foi encontrado (índice não é -1)
      if (indice !== -1) {
        console.log('removido');
        tarefas.splice(indice, 1);
      }
      if(this.ordenacaoAtiva){
        const indiceBase = this.tarefasOrganizadas.findIndex(tarefa => tarefa.id === tarefaExcluida.id);
        if(indiceBase !== -1) this.tarefasOrganizadas.splice(indiceBase, 1);
      }
      tarefas = this.aplicarOrdenacaoAtual(tarefas)
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
        data = this.ordenarTarefasPorData(data)
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

    listarProjetos(){
      const params = {
        'loadTarefas': false,
        'orderBy': 'nome,asc'
      };
      const requestData = {
        'url': `${config.serverUrl}/projetos${QueryStringConverter.toQueryString(params, true)}`,
      };
      Request.fetch(requestData)
      .then(([response, data]) => {
        this.listaProjetos = data;
      })
      .catch((error) => {
        this.$refs.notifier.notify(`Ocorreu um erro ao carregar os projetos: ${error}`, true)
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
      this.tarefas = this.aplicarOrdenacaoAtual(this.tarefas);
    },

    ordenarPorData(){
      this.alternarOrdenacao('data');
    },

    ordenarPorPrioridade(){
      this.alternarOrdenacao('prioridade');
    },

    alternarOrdenacao(tipo){
      if(this.ordenacaoAtiva === tipo){
        this.ordenacaoAtiva = null;
        this.tarefas = [...this.tarefasOrganizadas];
        return;
      }

      this.tarefasOrganizadas = [...this.tarefas];
      this.ordenacaoAtiva = tipo;
      this.ordemCrescente = tipo === 'prioridade';
      this.tarefas = this.aplicarOrdenacaoAtual(this.tarefas);
    },

    aplicarOrdenacaoAtual(tarefas){
      if(this.ordenacaoAtiva === 'data'){
        return this.ordenarTarefasPorData(tarefas, true);
      }
      if(this.ordenacaoAtiva === 'prioridade'){
        return this.ordenarTarefasPorPrioridade(tarefas);
      }
      return tarefas;
    },

    ordenarTarefasPorData (tarefas, ordenarPorData = false)
    {
      let novoArrayTarefas = tarefas;

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

    ordenarTarefasPorPrioridade(tarefas){
      return [...tarefas].sort((tarefa1, tarefa2) => {
        const semPrioridade1 = tarefa1.prioridade == null;
        const semPrioridade2 = tarefa2.prioridade == null;
        if(semPrioridade1 !== semPrioridade2) return semPrioridade1 ? 1 : -1;
        if(semPrioridade1) return 0;

        const prioridade1 = Number(tarefa1.prioridade);
        const prioridade2 = Number(tarefa2.prioridade);
        const diferenca = prioridade1 - prioridade2;
        return this.ordemCrescente ? diferenca : -diferenca;
      });
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
    this.listarProjetos();
    this.definicaoFiltroDataPadrao();
  },
}
</script>
