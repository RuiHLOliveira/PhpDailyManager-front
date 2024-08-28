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

      <!-- filters -->
      <div class="cardBox">
        <div class="titleBox">
          <!-- left side -->
          <div class="pageTitleProjetos">
            <div class="">Filtros</div>
            <!-- <button class="btn mx-5 btn-sm" type="button" @click="toggleModalCriarProjeto()">Criar Projeto +</button> -->
          </div>
          <!-- right side -->
          <div>
            <!-- <button class="btn btn-sm" type="button" @click="openBackupProjetosModal()">Backup Projetos</button> -->
          </div>
        </div>
        <div class="bodyBox">
          <div>
            Filtro Situacao
          </div>
          <div class="marginVerticalSpacer">
            <button type="button" class="btn btn-sm btnPrioridade situacaoPendente"
              :class="{selected : filtroSituacao == 1}"
              @click="toggleFiltroSituacao(1)">
              0-Pendente
            </button>
            <button type="button" class="btn btn-sm btnPrioridade situacaoAguardandoResposta"
              :class="{selected : filtroSituacao == 2}"
              @click="toggleFiltroSituacao(2)">
              1-Aguardando Resposta
            </button>
            <button type="button" class="btn btn-sm btnPrioridade situacaoPausado"
              :class="{selected : filtroSituacao == 3}"
              @click="toggleFiltroSituacao(3)">
              2-Pausado Indefinidamente
            </button>
            <button type="button" class="btn btn-sm btnPrioridade situacaoConcluido"
              :class="{selected : filtroSituacao == 4}"
              @click="toggleFiltroSituacao(4)">
              3-Concluído
            </button>
          </div>
          <div>
            Filtro Prioridade
          </div>
          <div class="marginVerticalSpacer">
            <button type="button" class="btn btn-sm btnPrioridade prioridadeUrgente"
              :class="{selected : filtroPrioridade == 1}"
              @click="toggleFiltroPrioridade(1)">
              1-Urgente
            </button>
            <button type="button" class="btn btn-sm btnPrioridade prioridadeAlta"
              :class="{selected : filtroPrioridade == 2}"
              @click="toggleFiltroPrioridade(2)">
              2-Alta
            </button>
            <button type="button" class="btn btn-sm btnPrioridade prioridadeMedia"
              :class="{selected : filtroPrioridade == 3}"
              @click="toggleFiltroPrioridade(3)">
              3-Media
            </button>
            <button type="button" class="btn btn-sm btnPrioridade prioridadeBaixa"
              :class="{selected : filtroPrioridade == 4}"
              @click="toggleFiltroPrioridade(4)">
              4-Baixa
            </button>
            <button type="button" class="btn btn-sm btnPrioridade prioridadeBaixissima"
              :class="{selected : filtroPrioridade == 5}"
              @click="toggleFiltroPrioridade(5)">
              5-Baixissima
            </button>
          </div>
          <div>
            <button class="btn my-5 btn-sm" type="button" @click="buscaProjetos()">Filtrar</button>
          </div>
        </div>
      </div>

      <div class="cardBox">
        <!-- TITLE -->
        <div class="titleBox">
          <!-- left side -->
          <div class="pageTitleProjetos">
            <div class="title">Projetos</div>
            <button class="btn mx-5 btn-sm" type="button" @click="toggleModalCriarProjeto()">Criar Projeto +</button>
          </div>
          <!-- right side -->
          <div>
            <button class="btn btn-sm" type="button" @click="openBackupProjetosModal()">Backup Projetos</button>
          </div>
        </div>
        <!-- BODY -->
        <div class="bodyBox">
          
          <InlineLoader
            :textoAguarde="true"
            :busy="busyProjetosLoad || busyProjetosDelete"
            :center="true">
          </InlineLoader>

          <div v-if="projetos != [] && !busyProjetosLoad && !busyProjetosDelete">
            <div v-for="projeto in projetos" :key="projeto.id">
              <div class="cardBox">
                
                <InlineLoader
                  :textoAguarde="true"
                  :busy="busyProjetosUpdate"
                  :center="true">
                </InlineLoader>

                <!-- TITLE -->
                <div v-if="!busyProjetosUpdate" class="titleBox">

                  <!-- common -->
                  <div class="titleBoxLeft" v-if="!projeto.editMode">
                    <div>
                      <span>
                        {{ projeto.nome }}
                      </span>
                    </div>
                    <div>
                      <button type="button" class="btn btn-sm btnPrioridade"
                        :class="{
                          situacaoPendente : projeto.situacao == 1,
                          situacaoAguardandoResposta : projeto.situacao == 2,
                          situacaoPausado : projeto.situacao == 3,
                          situacaoConcluido : projeto.situacao == 4,
                        }">
                        {{ projeto.situacao }}-{{ projeto.situacaoDescritivo }}
                      </button>
                      <button type="button" class="btn btn-sm btnPrioridade"
                        :class="{
                          prioridadeUrgente : projeto.prioridade == 1,
                          prioridadeAlta : projeto.prioridade == 2,
                          prioridadeMedia : projeto.prioridade == 3,
                          prioridadeBaixa : projeto.prioridade == 4,
                          prioridadeBaixissima : projeto.prioridade == 5,
                        }">
                        {{ projeto.prioridade }}-{{ projeto.prioridadeDescritivo }}
                      </button>
                    </div>
                  </div>

                  <!-- edicao -->
                  <div class="titleBoxLeft titleBoxLeft-editBox" v-if="projeto.editMode">
                    <div class="marginVerticalSpacer titleEditInput">
                      <input name="atividade" type="text" v-model="projeto.nomeEditar">
                    </div>
                    <div class="marginVerticalSpacer">
                      <button type="button" class="btn btn-sm btnPrioridade situacaoPendente"
                        :class="{selected : projeto.situacaoEditar == 1}"
                        @click="toggleEditarSituacao(projeto, 1)">
                        0-Pendente
                      </button>
                      <button type="button" class="btn btn-sm btnPrioridade situacaoAguardandoResposta"
                        :class="{selected : projeto.situacaoEditar == 2}"
                        @click="toggleEditarSituacao(projeto, 2)">
                        1-Aguardando Resposta
                      </button>
                      <button type="button" class="btn btn-sm btnPrioridade situacaoPausado"
                        :class="{selected : projeto.situacaoEditar == 3}"
                        @click="toggleEditarSituacao(projeto, 3)">
                        2-Pausado Indefinidamente
                      </button>
                      <button type="button" class="btn btn-sm btnPrioridade situacaoConcluido"
                        :class="{selected : projeto.situacaoEditar == 4}"
                        @click="toggleEditarSituacao(projeto, 4)">
                        3-Concluído
                      </button>
                    </div>

                    <div class="marginVerticalSpacer">
                      <button type="button" class="btn btn-sm btnPrioridade prioridadeUrgente"
                        :class="{selected : projeto.prioridadeEditar == 1}"
                        @click="toggleEditarPrioridade(projeto, 1)">
                        1-Urgente
                      </button>
                      <button type="button" class="btn btn-sm btnPrioridade prioridadeAlta"
                        :class="{selected : projeto.prioridadeEditar == 2}"
                        @click="toggleEditarPrioridade(projeto, 2)">
                        2-Alta
                      </button>
                      <button type="button" class="btn btn-sm btnPrioridade prioridadeMedia"
                        :class="{selected : projeto.prioridadeEditar == 3}"
                        @click="toggleEditarPrioridade(projeto, 3)">
                        3-Media
                      </button>
                      <button type="button" class="btn btn-sm btnPrioridade prioridadeBaixa"
                        :class="{selected : projeto.prioridadeEditar == 4}"
                        @click="toggleEditarPrioridade(projeto, 4)">
                        4-Baixa
                      </button>
                      <button type="button" class="btn btn-sm btnPrioridade prioridadeBaixissima"
                        :class="{selected : projeto.prioridadeEditar == 5}"
                        @click="toggleEditarPrioridade(projeto, 5)">
                        5-Baixissima
                      </button>
                    </div>
                  </div>

                  <!-- buttons -->
                  <div class="titleBoxRight">
                    <button v-if="!projeto.editMode" class="btn btn-sm" type="button" @click="toggleEdicaoProjeto(projeto)">Editar</button>
                    <button v-if="projeto.editMode" class="btn mx-5 my-5 btn-sm" type="button" @click="cancelarEdicaoProjeto(projeto)">Cancelar</button>
                    <button v-if="projeto.editMode" class="btn mx-5 my-5 btn-sm" type="button" @click="salvarEdicaoProjeto(projeto)">Salvar</button>
                    <button v-if="projeto.editMode" class="btn mx-5 my-5 btn-sm btn-red" type="button" @click="excluirProjeto(projeto)">Excluir</button>
                  </div>
                </div>

                <!-- BODY -->
                <div class="bodyBox">
                  <div class="bodyBoxDiv">
                    <span style="font-size: 1rem; color: #444444">Anotações: </span>
                    <div v-if="!projeto.editMode" class="whitespace-pre">
                      {{ projeto.anotacoes }}
                    </div>
                    <div v-if="projeto.editMode">
                      <!-- <input name="atividade" type="text" v-model="projeto.anotacoesEditar"> -->
                      <textarea class="textarea textareaHeight150" name="anotacoes" placeholder="anotacoes" v-model="projeto.anotacoesEditar"></textarea>
                    </div>
                  </div>
                  
                  <div class="bodyBoxDiv">
                    <button v-if="!carregarPreviamenteAsTarefas" class="btn btn-sm" type="button" @click="toggleShowTarefas(projeto)">Ver tarefas</button>
                    <button class="btn btn-sm" type="button" @click="toggleModalCriarTarefa(projeto)">Criar Tarefa +</button>
                  </div>
                  
                  <!-- TAREFAS -->
                  <div v-if="projeto.showTarefas">
                    <div v-for="tarefa in projeto.tarefas" :key="tarefa.id">
                      <div class="linhaTarefa linhaTarefa-round">
                        <div>
                          {{ tarefa.situacao == 0 ? '🆕' : tarefa.situacao == 1 ? '✅' : '❌' }}
                          {{ tarefa.hora != null ? `[${tarefa.hora}]` : '[]' }}
                          {{ tarefa.descricao }}
                        </div>
                        <div>
                          <button class="btn btn-sm btn_tarefa_concluida" type="button" 
                            @click="toggleModalEditarTarefa(tarefa,projeto)" >
                            Editar
                          </button>
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
      
      <BackupProjetos v-model:exibirModalBackupProjetos="exibirModalBackupProjetos" />

    </div>

    <Notifier ref="notifier"></Notifier>

    <ModalCriarProjeto
      v-model:exibirModal="exibirModalCriarProjeto"
      @reloadListaProjetosHabitTracker="buscaProjetos()">
    </ModalCriarProjeto>

    <ModalCriarTarefa
      v-model:exibirModal="exibirModalCriarTarefa"
      :projeto="projetoModalNovaTarefa"
      @reloadListaProjetosHabitTracker="buscaProjetos()">
    </ModalCriarTarefa>
    
    <ModalEditarTarefa
      v-model:exibirModal="exibirModalEditarTarefa"
      :tarefa="tarefaModalEditarTarefa"
      :projeto="projetoModalEditarTarefa"
      @reloadListaProjetosHabitTracker="buscaProjetos()">
    </ModalEditarTarefa>
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
import ModalCriarProjeto from '@/views/projetos/ModalCriarProjeto.vue';
import ModalCriarTarefa from '@/views/projetos/ModalCriarTarefa.vue';
import ModalEditarTarefa from '@/views/projetos/ModalEditarTarefa.vue';
import BackupProjetos from "@/views/projetos/BackupProjetos.vue";

export default {
  name: 'HabitTracker',
  components: {
    Loader,
    InlineLoader,
    ModalCriarProjeto,
    ModalCriarTarefa,
    ModalEditarTarefa,
    BackupProjetos,
    Notifier,
  },
  inject: ['configuracoes'],
  data: () => {
    return {
      busyProjetosLoad: false,
      busyProjetosDelete: false,
      busyProjetosUpdate: false,
      busyTarefasLoad: false,
      dataPrazo: '',
      projetos: [],
      exibirModalCriarProjeto: false,
      exibirModalCriarTarefa: false,
      exibirModalEditarTarefa: false,
      projetoModalNovaTarefa: [],
      tarefaModalEditarTarefa: [],
      projetoModalEditarTarefa: [],
      exibirModalBackupProjetos: false,
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
    toggleShowTarefas(projeto) {
      projeto.showTarefas = !projeto.showTarefas
      if(projeto.tarefas == null) this.loadTarefas(projeto)
    },

    toggleModalCriarProjeto () {
      this.exibirModalCriarProjeto = true;
    },

    toggleModalCriarTarefa (projeto) {
      this.projetoModalNovaTarefa = projeto
      this.exibirModalCriarTarefa = true;
    },

    toggleModalEditarTarefa (tarefa, projeto) {
      this.tarefaModalEditarTarefa = tarefa
      this.exibirModalEditarTarefa = true;
      this.projetoModalEditarTarefa = projeto
    },
    toggleFiltroSituacao(novaSituacao){
      this.filtroSituacao = novaSituacao;
    },
    toggleFiltroPrioridade(novaPrioridade){
      this.filtroPrioridade = novaPrioridade;
    },


    /**
     * EDIT FORMS
     */
    toggleEdicaoProjeto(projeto) {
      if(projeto.editMode == undefined) projeto.editMode = false;
      if(projeto.nomeEditar == undefined) projeto.nomeEditar = projeto.nome;
      if(projeto.anotacoesEditar == undefined) projeto.anotacoesEditar = projeto.anotacoes;
      projeto.prioridadeEditar = projeto.prioridade;
      projeto.situacaoEditar = projeto.situacao;
      projeto.editMode = !projeto.editMode
    },
    cancelarEdicaoProjeto(projeto) {
      this.toggleEdicaoProjeto(projeto)
      projeto.nomeEditar = projeto.nome;
      projeto.anotacoesEditar = projeto.anotacoes;
    },
    salvarEdicaoProjeto(projeto) {
      console.log(projeto.nomeEditar)
      console.log(projeto.anotacoesEditar)
      projeto.nome = projeto.nomeEditar
      projeto.anotacoes = projeto.anotacoesEditar
      projeto.prioridade = projeto.prioridadeEditar
      projeto.situacao = projeto.situacaoEditar
      console.log(projeto);
      this.updateProjeto(projeto);
    },
    toggleEditarSituacao(projeto, novaSituacao){
      projeto.situacaoEditar = novaSituacao;
    },
    toggleEditarPrioridade(projeto, novaPrioridade){
      projeto.prioridadeEditar = novaPrioridade;
    },



    excluirProjeto(projeto) {
      // ask for confirmation
      if(!confirm("Deseja apagar o projeto?")){
        return;
      }
      console.log(projeto.id);
      this.busyProjetosDelete = true;
      let requestData = {
        'url': `${config.serverUrl}/projetos/${projeto.id}`,
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'DELETE',
      };
      return Request.fetch(requestData).then(([response, data]) => {
        this.busyProjetosDelete = false;
        this.$refs.notifier.notify('Projeto excluído!')
        this.toggleEdicaoProjeto(projeto)
        this.buscaProjetos();
      }).catch((error) => {
        console.error(error);
        this.busyProjetosDelete = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
      });
    },

    /**
     * FUNCOES FETCH API
     */
    buscaProjetos () {
      this.busyProjetosLoad = true;
      let params = {};
      params['loadTarefas'] = this.carregarPreviamenteAsTarefas;
      if(this.filtroPrioridade != null){
        params['prioridade'] = this.filtroPrioridade;
      }
      if(this.filtroSituacao != null){
        params['situacao'] = this.filtroSituacao;
      }
      params['orderBy'] = 'dataPrazo,desc';
      params = QueryStringConverter.toQueryString(params, true);
      let requestData = {
        'url': `${config.serverUrl}/projetos${params}`,
      };
      Request.fetch(requestData)
      .then(([response, data]) => {
        console.log({data});
        this.projetos = data
        if(this.carregarPreviamenteAsTarefas) {
          for (let i = 0; i < this.projetos.length; i++) {
            this.toggleShowTarefas(this.projetos[i])
          }
        }
        this.busyProjetosLoad = false;
      })
      .catch((error) => {
        this.busyProjetosLoad = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
        console.error(error);
      });
    },

    updateProjeto(projeto) {
      console.log(projeto.id);
      this.busyProjetosUpdate = true;
      let body = {
        'dataPrazo': projeto.dataPrazo,
        'nome': projeto.nome,
        'anotacoes': projeto.anotacoes,
        'prioridade': projeto.prioridade,
        'situacao': projeto.situacao,
      };

      let requestData = {
        'url': `${config.serverUrl}/projetos/${projeto.id}`,
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'PUT',
        'data' : body
      };
      return Request.fetch(requestData).then(([response, data]) => {
        this.busyProjetosUpdate = false;
        // this.resetFields(true)
        this.$refs.notifier.notify('Projeto salvo!')
        this.toggleEdicaoProjeto(projeto)
        this.buscaProjetos();
      }).catch((error) => {
        console.error(error);
        this.busyProjetosUpdate = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
      });
    },

    loadTarefas(projeto){
      this.busyTarefasLoad = true;
      const params = {'orderBy': 'hora,asc', 'projeto': projeto.id};
      let requestData = {
        'url': `${config.serverUrl}/tarefas${QueryStringConverter.toQueryString(params, true)}`,
      };
      Request.fetch(requestData)
      .then(([response, data]) => {
        // console.log('tarefas', {data}, 'into', projeto.id, projeto.nome);
        projeto.tarefas = data
        this.busyTarefasLoad = false;
      })
      .catch((error) => {
        this.busyTarefasLoad = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
        console.error(error);
      });
    },

    /**
     * FUNÇÕES BAKCUP
     */
    openBackupProjetosModal() {
      this.exibirModalBackupProjetos = true;
    },

  },
  watch: {
    configuracoes(a, b) {
      // do something
    }
  },
  created () {
    this.buscaProjetos();
  },
}
</script>
