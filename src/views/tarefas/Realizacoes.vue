<style>

</style>

<template>
  <div>
    <div class="container div_bg_white">
      
      <section class="div_bg_offwhite div_border_gray my-10 p-10">
        <div class="flex">
          <h1 class="titulo">Realizações</h1>
        </div>
      </section>


      <!-- LISTA TAREFAS -->
      <div class="pt-10 px-10">
        <!-- LOADER -->
        <InlineLoader
          :textoAguarde="true"
          :busy="busy"
          :center="true">
        </InlineLoader>

        <div v-if="tarefas != [] && !busy">
          <div v-for="tarefa in tarefas" :key="tarefa.id">

            <div class="div_bg_offwhite div_border_gray mb-10 py-10 px-10" >

              <!-- LINHA SUPERIOR -->
              <div :class="{'flex justify-spacebetween' : !isSmallScreen, 'flex-column' : isSmallScreen}">

                <div>
                  <!-- LINHA 2 -->
                  <div class="my-5 mr-10 mt-10 p-5">
                    <div>
                      {{ tarefa.dataAtualizacao }} =>
                      {{ tarefa.descricao }}
                    </div>
                  </div>
                  <!-- LINHA 1 -->
                  <div class="flex-wrap">
                    <div class="ycenter mt-5">
                      <span class="mr-10 check-pendente" v-if="tarefa.situacao == 0"><i class="fi fi-sr-square"></i></span>
                      <span class="mr-10 check-concluido" v-if="tarefa.situacao == 1"><i class="fi fi-sr-checkbox"></i></span>
                      <span class="mr-10 check-falhado" v-if="tarefa.situacao == 2"><i class="fi fi-sr-square-x"></i></span>
                    </div>
                    <div class="ycenter mt-5">
                      <span class="mr-10 iconBig" v-if="tarefa.meuDia !== null && tarefa.meuDiaHoje"><i class="fi fi-sr-parking"></i></span>
                      <span class="mr-10 iconBig" v-if="tarefa.meuDia !== null && !tarefa.meuDiaHoje"><i class="fi fi-rr-parking"></i></span>
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
                  <!-- <div>
                    <button type="button" class="btn btn-sm btn-clear"
                      @click="toggleShowMotivoTarefa(tarefa)">Motivo
                    </button>
                    <span class="ml-5 mr-5 p-5 italicDarkGray" v-if="showMotivo[tarefa.id]" >
                      "{{ tarefa.motivo ?? 'sem motivo cadastrado' }}"
                    </span>
                  </div> -->
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DateTime from '@/core/DateTime.js'
import Request from '@/core/request.js';
import config from '@/core/config.js'
import QueryStringConverter from '@/core/QueryStringConverter.js'
import InlineLoader from '@/components/InlineLoader.vue';

export default {
  name: 'HabitTracker',
  components: {
    InlineLoader,
  },
  inject: ['configuracoes'],
  data: () => {
    return {
      busy: false,
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
      selectedSituacao: 1
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
    filtraListaTarefas()
    {
      // guarda o backup se não existir
      if(this.tarefasBackup.length == 0){
        this.tarefasBackup = this.tarefas;
      }
      // recupera o backup para listar de forma completa
      let listaTarefas = this.tarefasBackup;

      let arrayfilter = [];

      let situacaoFiltro = 2;

      // ************************ filtro por situação
      if(situacaoFiltro != null){
        arrayfilter = [];
        for (let i = 0; i < listaTarefas.length; i++) {
          if(listaTarefas[i].situacao == situacaoFiltro-1){
            arrayfilter.push(listaTarefas[i])
          }

        }
        listaTarefas = arrayfilter;
      }
      // ************************ atribuição final
      this.tarefas = listaTarefas
    },

    toggleShowMotivoTodasTarefas () {
      for (let i = 0; i < this.tarefas.length; i++) {
        this.showMotivo[this.tarefas[i].id] = !this.showMotivo[this.tarefas[i].id];
      }
    },

    toggleShowMotivoTarefa (tarefa) {
      this.showMotivo[tarefa.id] = !this.showMotivo[tarefa.id];
    },

    /**
     * EDIT FORMS
     */
    loadTarefas(){
      this.busyTarefasLoad = true;
      const params = {'orderBy': 'updated_at, desc', 'properties' : 'projeto'};
      let requestData = {
        'url': `${config.serverUrl}/tarefas${QueryStringConverter.toQueryString(params, true)}`,
      };
      Request.fetch(requestData)
      .then(([response, data]) => {
        this.fillShowMotivo(data)
        data = this.tarefasFillDefaults(data)
        data = this.tarefasFillDataAtualizacao(data);
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

    tarefasFillDefaults(tarefas)
    {
      for (let i = 0; i < tarefas.length; i++) {
        tarefas[i].meuDiaHoje = false;
        tarefas[i].editMode = false;
        tarefas[i].busyTarefasUpdate = false;
        tarefas[i].showMenuPrioridades = false
      }
      return tarefas;
    },

    tarefasFillDataAtualizacao(tarefas)
    {
      for (let i = 0; i < tarefas.length; i++) {
        if(tarefas[i].updatedAt == null) {
          tarefas[i].dataAtualizacao = '';
          continue;
        }
        console.log(tarefas[i].updatedAt);
        const dateObj = this.newDatetimeTz(tarefas[i].updatedAt.date);
        const dataAtualizacao = this.formatBrDate(dateObj);
        const weekDay = this.getWeekDay(dateObj);
        console.log(weekDay, dataAtualizacao);
        tarefas[i].dataAtualizacao = weekDay+', '+dataAtualizacao;
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
  },
}
</script>
