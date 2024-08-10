<style>

h1.titulo {

}
.tarefa {
  /* border-bottom: 2px solid rgb(194, 194, 194); */
  border-radius: 5px;
  background-color: #ffffff77;
}
.projetoNaTarefa {
    font-size: 0.8rem;
    background-color: rgb(109, 109, 109);
    color: white;
    border-radius: 5px;
}

</style>

<template>
  <div>
    <div class="container">
      
      <section class="divBgBlur my-10 p-10">
        <h1 class="titulo">Tarefas</h1>
      </section>

      <!-- LOADER -->
      <InlineLoader
        :textoAguarde="true"
        :busy="busyTarefasLoad || busyTarefasDelete"
        :center="true">
      </InlineLoader>

      <!-- LISTA TAREFAS -->
      <div v-if="tarefas != [] && !busyTarefasLoad && !busyTarefasDelete">
        <div v-for="tarefa in tarefas" :key="tarefa.id">

          <div class="tarefa mb-10 py-10 px-10" >

            <div class="flex justify-spacebetween"> <!-- LINHA SUPERIOR -->

              <div> <!-- TEXTO -->
                <div>
                  <span class="mr-10">{{ tarefa.situacao == 0 ? '🆕' : tarefa.situacao == 1 ? '✅' : '❌' }}</span>
                  <span class="mr-10">
                      {{ tarefa.descricao }}
                  </span>
                  <span class="projetoNaTarefa p-5 mr-10">{{ tarefa.projeto.nome }}</span>
                </div>
                <div v-if="tarefa.editMode" class="m-10">
                    <input :disabled="tarefa.busyTarefasUpdate" name="descricao" type="text" v-model="tarefa.descricaoEditar">
                </div>
              </div>
              <div> <!-- BUTTONS -->
                <button v-if="!tarefa.editMode" class="btn btn-sm btn_tarefa_concluida" type="button" 
                  @click="toggleEdicaoTarefa(tarefa)">
                  Editar
                </button>
                <button v-if="tarefa.editMode" class="btn mx-5 my-5 btn-sm" type="button"
                    :disabled="tarefa.busyTarefasUpdate"
                    @click="cancelarEdicaoTarefa(tarefa)">
                    Cancelar
                </button>
                <button v-if="tarefa.editMode" class="btn mx-5 my-5 btn-sm" type="button"
                    :disabled="tarefa.busyTarefasUpdate"
                    @click="salvarEdicaoTarefa(tarefa)">
                    Salvar
                </button>
                <!-- <button v-if="projeto.editMode" class="btn mx-5 my-5 btn-sm btn-red" type="button"
                    @click="excluirProjeto(projeto)">
                    Excluir
                </button> -->
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

    <Notifier ref="notifier"></Notifier>

    </div>
  </div>
</template>

<script>
import DateTime from '@/core/DateTime.js'
import Request from '@/core/request.js';
import config from '@/core/config.js'
import QueryStringConverter from '@/core/QueryStringConverter.js'
// import Loader from '@/components/Loader.vue';
import InlineLoader from '@/components/InlineLoader.vue';
import Notifier from '@/components/Notifier.vue';
// import ModalCriarProjeto from '@/views/projetos/ModalCriarProjeto.vue';
// import ModalCriarTarefa from '@/views/projetos/ModalCriarTarefa.vue';
// import ModalEditarTarefa from '@/views/projetos/ModalEditarTarefa.vue';
// import BackupProjetos from "@/views/projetos/BackupProjetos.vue";

export default {
  name: 'HabitTracker',
  components: {
    // Loader,
    InlineLoader,
    // ModalCriarProjeto,
    // ModalCriarTarefa,
    // ModalEditarTarefa,
    // BackupProjetos,
    Notifier,
  },
  inject: ['configuracoes'],
  data: () => {
    return {
      busyTarefasLoad: false,
      busyTarefasDelete: false,
      busyTarefasUpdate: false,
      busyTarefasLoad: false,
      dataPrazo: '',
      tarefas: [],
      // exibirModalCriarProjeto: false,
      exibirModalCriarTarefa: false,
      exibirModalEditarTarefa: false,
      // projetoModalNovaTarefa: [],
      tarefaModalEditarTarefa: [],
      // projetoModalEditarTarefa: [],
      // exibirModalBackupProjetos: false,
      carregarPreviamenteAsTarefas: true,
      filtroPrioridade: null,
      filtroSituacao: null,
      nextProgramedListingAmount: 0,
    }
  },
  methods: {
    
    /** 
     * FUNCOES HELPER IMPORTADAS
    */
    formatDevDate(dateObject){return DateTime.formatDevDate(dateObject);},
    formatBrDate(dateObject){return DateTime.formatBrDate(dateObject);},
    getWeekDay(dateObject){return DateTime.getWeekDay(dateObject);},

    /**
     * FUNCOES TOGGLE
     */
    // toggleModalCriarProjeto () {
    //   this.exibirModalCriarProjeto = true;
    // },
    // toggleModalCriarTarefa (projeto) {
    //   this.projetoModalNovaTarefa = projeto
    //   this.exibirModalCriarTarefa = true;
    // },
    // toggleModalEditarTarefa (tarefa, projeto) {
    //   this.tarefaModalEditarTarefa = tarefa
    //   this.exibirModalEditarTarefa = true;
    //   this.projetoModalEditarTarefa = projeto
    // },
    // toggleFiltroSituacao(novaSituacao){
    //   this.filtroSituacao = novaSituacao;
    // },
    // toggleFiltroPrioridade(novaPrioridade){
    //   this.filtroPrioridade = novaPrioridade;
    // },


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
    // toggleEditarSituacao(projeto, novaSituacao){
    //   projeto.situacaoEditar = novaSituacao;
    // },
    // toggleEditarPrioridade(projeto, novaPrioridade){
    //   projeto.prioridadeEditar = novaPrioridade;
    // },



    // excluirProjeto(projeto) {
    //   // ask for confirmation
    //   if(!confirm("Deseja apagar o projeto?")){
    //     return;
    //   }
    //   console.log(projeto.id);
    //   this.busyProjetosDelete = true;
    //   let requestData = {
    //     'url': `${config.serverUrl}/projetos/${projeto.id}`,
    //     'headers': new Headers({'Content-Type': 'application/json'}),
    //     'method' : 'DELETE',
    //   };
    //   return Request.fetch(requestData).then(([response, data]) => {
    //     this.busyProjetosDelete = false;
    //     this.$refs.notifier.notify('Projeto excluído!')
    //     this.toggleEdicaoProjeto(projeto)
    //     this.buscaProjetos();
    //   }).catch((error) => {
    //     console.error(error);
    //     this.busyProjetosDelete = false;
    //     this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
    //   });
    // },

    /**
     * FUNCOES FETCH API
     */
    // buscaProjetos () {
    //   this.busyProjetosLoad = true;
    //   let params = {};
    //   params['loadTarefas'] = this.carregarPreviamenteAsTarefas;
    //   if(this.filtroPrioridade != null){
    //     params['prioridade'] = this.filtroPrioridade;
    //   }
    //   if(this.filtroSituacao != null){
    //     params['situacao'] = this.filtroSituacao;
    //   }
    //   params['orderBy'] = 'dataPrazo,desc';
    //   params = QueryStringConverter.toQueryString(params, true);
    //   let requestData = {
    //     'url': `${config.serverUrl}/projetos${params}`,
    //   };
    //   Request.fetch(requestData)
    //   .then(([response, data]) => {
    //     console.log({data});
    //     this.projetos = data
    //     if(this.carregarPreviamenteAsTarefas) {
    //       for (let i = 0; i < this.projetos.length; i++) {
    //         this.toggleShowTarefas(this.projetos[i])
    //       }
    //     }
    //     this.busyProjetosLoad = false;
    //   })
    //   .catch((error) => {
    //     this.busyProjetosLoad = false;
    //     this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
    //     console.error(error);
    //   });
    // },

    updateTarefa(tarefa) {
      console.log(tarefa.id);
      tarefa.busyTarefasUpdate = true;
      let body = {
        'descricao': tarefa.descricao,
        'hora': tarefa.hora,
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
      const params = {'orderBy': 'descricao,asc', 'properties' : 'projeto'};
      let requestData = {
        'url': `${config.serverUrl}/tarefas${QueryStringConverter.toQueryString(params, true)}`,
      };
      Request.fetch(requestData)
      .then(([response, data]) => {
        data = this.tarefasFillDefaults(data)
        console.log(data)
        this.tarefas = data
        this.busyTarefasLoad = false;
      })
      .catch((error) => {
        this.busyTarefasLoad = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
        console.error(error);
      });
    },

    tarefasFillDefaults(tarefas)
    {
      for (let i = 0; i < tarefas.length; i++) {
        tarefas[i].editMode = false;
        tarefas[i].busyTarefasUpdate = false;
      }
      return tarefas;
    },

  },
  watch: {
    configuracoes(a, b) {
      // do something
    }
  },
  created () {
    this.loadTarefas();
  },
}
</script>
