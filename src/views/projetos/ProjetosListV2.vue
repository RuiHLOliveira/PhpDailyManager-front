<style scoped>
section {
  /* margin-bottom: 20px; */
}
section.header {
  h1 {
    margin-right: 10px;
  }
}

.projetofoto {
  border: 10px solid #ffddbb;
  border-radius: 20px;
  max-width: 400px;
  max-height: 400px;
}

section.projetoList {
  flex-basis: 100%; /**mobile */
  flex-grow: 0;
  flex-shrink: 0;
  max-height: 100%; /**mobile */
  max-height: 83svh; /**desktop */
  overflow-y: scroll;
  div.projeto {
    justify-content: space-between;
    background-color: rgb(228, 228, 228);
    /* border-radius: 5px; */
    button.situacaoFixedWidth {
      min-width: 100px;
      max-width: 100px;
    }
    button.prioridadeFixedWidth {
      min-width: 100px;
      max-width: 100px;
    }
    .col1 {
      /* border-right: 1px solid rgb(167, 167, 167); */
      width: 68%;
      display: inline-block;
    }
    .col2 {
      text-align: center;
      /* border-right: 1px solid rgb(167, 167, 167); */
      width: 10%;
      min-width: 100px;
      display: inline-block;
    }
    .col3 {
      text-align: center;
      /* border-right: 1px solid rgb(167, 167, 167); */
      width: 10%;
      min-width: 100px;
      display: inline-block;
    }
    .col4 {
      text-align: center;
      /* border-right: 1px solid rgb(167, 167, 167); */
      width: 4%;
      min-width: 4%;
      max-width: 4%;
      display: inline-block;
    }
  }
}
@media only screen and (min-width: 800px) {
  section.projetoList {
    flex-basis: 300px; /**desktop */
    max-height: 87svh; /**desktop */
    overflow-y: scroll;
    margin-right: 10px;
  }
}


section.projetoShow {
  border-radius: 5px;
  flex: 1;
  /* height: 90svh; */
  max-height: 100%; /**mobile */
  overflow-y: visible;
  .projetoShowLabel{
    /* font-style: italic; */
    /* text-decoration: underline; */
    font-size: 1.3rem;
    /* font-weight: bold; */
    color: #000000;
  }
}
@media only screen and (min-width: 800px) {
  section.projetoShow {
    flex:1;
    max-height: 87svh;
    overflow-y: scroll;
  }
}

.linhaBox {
  padding: 10px;
  border-radius: 5px;
  background-color: #d3d3d3;
  border: 1px solid #d3d3d3;
}
.linhaBox:hover {
  /* background-color: #cccccc; */
  border: 1px solid rgb(88, 88, 88);
}

</style>

<template>
  <div>
    <div class="container divBgWhite">

      <!-- HEADER -->
      <section class="divBgOffWhite borderGray my-5 py-5 px-10 header flex justify-spacebetween alignitens-center">
        <div class="flex alignitens-center">
          <h1>Projetos</h1>
          <div>
            <button class="btn mx-5 btn-sm" type="button" @click="toggleModalCriarProjeto()">Criar Projeto +</button>
          </div>
        </div>
        <div>
        </div>
      </section>

      <div>

          <!-- FILTER -->
          <div class="mt-10 p-5 divBgOffWhite borderGray flex-wrap" v-if="projetoExibir.id == null">
            <div class="mr-15">
              <input @keyup="filtraListaProjeto()" name="filtroNomeProjeto" placeholder="filtro nome do projeto" type="text" v-model="filtroNomeProjeto">
            </div>
            <!-- SITUACAO -->
            <select class="smallSelect mr-15" v-model="selectedSituacao" name="situacao" id="situacao" @click="filtraListaProjeto()">
              <option value="0">Todos</option>
              <option value="1">Pendente</option>
              <option value="2">Espera</option>
              <option value="3">Pausado</option>
              <option value="4">Concluído</option>
            </select>
            <!-- PRIORIDADE -->
            <select class="smallSelect mr-15" v-model="selectedPrioridade" name="prioridade" id="prioridade" @click="filtraListaProjeto()">
              <option value="0">Todos</option>
              <option value="1">Urgente</option>
              <option value="2">Alta</option>
              <option value="3">Media</option>
              <option value="4">Baixa</option>
              <option value="5">Baixissima</option>
            </select>
            <!-- BUTTON -->
            <div class="mr-15">
              <button class="btn my-5 btn-sm" type="button" @click="buscaProjetos()">Recarregar Lista</button>
            </div>
          </div>

        <!-- PROJETO LIST -->
        <section class="projetoList" v-if="projetoExibir.id == null">

          <!-- FOR EACH PROJETOS -->
          <div class="mt-10 pt-5" v-if="projetos != [] && !busyProjetosLoad && !busyProjetosDelete">

            <div v-for="projeto in projetos" :key="projeto.id">
              <!-- TITLE -->
              <div class="projeto divBgOffWhite borderGray my-10 ml-5 mr-15" :class="{ 'flex' : !isSmallScreen, 'flex-column' : isSmallScreen}">
                
                <!-- PROJETO NOME -->
                <span class="py-10 px-10">
                  {{ projeto.nome }}
                </span>

                <!-- TAGS -->
                <div class="py-5 px-10 flex alignitens-center">
                  <!-- fixado -->
                  <button type="button" disabled="true"
                    v-if="!projetoExibir.editMode && projeto.fixado"
                    class="btn btn-sm btn-clear mr-10 my-5 btn">
                    <i class="fi fi-ss-thumbtack"></i>
                  </button>
                  <!-- SITUACAO -->
                  <button type="button" class="mr-10 btn btn-sm btnPrioridade"
                    :class="{
                      situacaoFixedWidth : configs.situacaoFixedWidth == true,
                      situacaoPendente : projeto.situacao == 1,
                      situacaoAguardandoResposta : projeto.situacao == 2,
                      situacaoPausado : projeto.situacao == 3,
                      situacaoConcluido : projeto.situacao == 4,
                    }">
                    {{ projeto.situacao }}-{{ projeto.situacaoDescritivo }}
                  </button>

                  <!-- PRIORIDADE -->
                  <button type="button" class="mr-10 btn btn-sm btnPrioridade"
                    :class="{
                      prioridadeFixedWidth : configs.prioridadeFixedWidth == true,
                      prioridadeUrgente : projeto.prioridade == 1,
                      prioridadeAlta : projeto.prioridade == 2,
                      prioridadeMedia : projeto.prioridade == 3,
                      prioridadeBaixa : projeto.prioridade == 4,
                      prioridadeBaixissima : projeto.prioridade == 5,
                    }">
                    {{ projeto.prioridade }}-{{ projeto.prioridadeDescritivo }}
                  </button>
                  
                  <!-- COLUNA 3 -->
                  <button type="button" class="mr-10 btn btn-sm" @click="toggleShowProjeto(projeto)">
                    ...
                  </button>
                  <router-link class="mr-10 btn btn-sm" :to='getProjetoUrl(projeto)'>
                    <i style="line-height: 0; font-size: 1.2rem;" class="fi fi-rr-arrow-small-right"></i>
                  </router-link>
                </div>

              </div>

            </div>
          </div>
        </section>

        <div class="divBgBlur my-5 py-5" v-if="busyProjetosLoad">
          <InlineLoader
            :textoAguarde="true"
            :busy="busyProjetosLoad"
            :center="true">
          </InlineLoader>
        </div>

        <!-- PROJETO SHOW -->
        <section class="projetoShow divBgBlur my-10 p-10 mx-5" v-if="projetoExibir.id != null">
        <!-- <div v-if="projetoExibir != [] && !busyProjetosLoad && !busyProjetosDelete"> -->
        <div v-if="projetoExibir.id != null">

          <div class="mb-10 flex justify-spacebetween">
            <div>
              <button v-if="!projetoExibir.editMode" class="btn mr-10 my-5 btn" type="button" @click="hideProjeto(projetoExibir)">...</button>
              <router-link v-if="!projetoExibir.editMode" class="btn mr-10 my-5 btn" to='/projetosListV2'>Voltar</router-link>

              <button v-if="!projetoExibir.editMode" class="btn mx-10 my-5 btn" type="button" @click="toggleFixarProjeto(projetoExibir)">
                {{ projetoExibir.fixado ? 'Desafixar' : 'Fixar' }}
              </button>
              <button v-if="!projetoExibir.editMode" class="btn mx-10 my-5 btn" type="button" @click="toggleEdicaoProjeto(projetoExibir)">Editar</button>
              <button v-if="projetoExibir.editMode" class="btn mr-10 my-5 btn" type="button" @click="cancelarEdicaoProjeto(projetoExibir)">Cancelar</button>
            </div>
            <div>
              <button v-if="projetoExibir.editMode" class="btn mx-10 my-5 btn" type="button" @click="salvarEdicaoProjeto(projetoExibir)">Salvar</button>
              <button v-if="projetoExibir.editMode" class="btn mx-10 my-5 btn btn-red" type="button" @click="excluirProjeto(projetoExibir)">Excluir</button>
            </div>
          </div>

          <InlineLoader
            :textoAguarde="true"
            :busy="busyProjetosUpdate || busyProjetosDelete"
            :center="true">
          </InlineLoader>

          <div class="flex-column">
            <!-- COL 1 DADOS E TAREFAS -->
            <div class="mr-5">
              <div class="mb-15">
                <div class="mb-5">
                  <span class="projetoShowLabel">Título: </span>
                </div>
                <div v-if="!projetoExibir.editMode" class="linhaBox whitespace-pre">
                  {{ projetoExibir.nome }}
                </div>
                <div v-if="projetoExibir.editMode">
                  <input name="atividade" type="text" v-model="projetoExibir.nomeEditar">
                </div>
              </div>

              <div class="mb-15">
                <div v-if="!projetoExibir.editMode" class="">
                  <!-- FIXADO -->
                    <!-- SITUACAO -->
                    <button type="button" class="btn btn-sm btnPrioridade mr-5"
                      :class="{
                        situacaoFixedWidth : configs.situacaoFixedWidth == true,
                        situacaoPendente : projetoExibir.situacao == 1,
                        situacaoAguardandoResposta : projetoExibir.situacao == 2,
                        situacaoPausado : projetoExibir.situacao == 3,
                        situacaoConcluido : projetoExibir.situacao == 4,
                      }">
                      {{ projetoExibir.situacao }}-{{ projetoExibir.situacaoDescritivo }}
                    </button>
                    <!-- PRIORIDADE -->
                    <button type="button" class="btn btn-sm btnPrioridade mr-5"
                      :class="{
                        prioridadeFixedWidth : configs.prioridadeFixedWidth == true,
                        prioridadeUrgente : projetoExibir.prioridade == 1,
                        prioridadeAlta : projetoExibir.prioridade == 2,
                        prioridadeMedia : projetoExibir.prioridade == 3,
                        prioridadeBaixa : projetoExibir.prioridade == 4,
                        prioridadeBaixissima : projetoExibir.prioridade == 5,
                      }">
                      {{ projetoExibir.prioridade }}-{{ projetoExibir.prioridadeDescritivo }}
                    </button>
                  <button type="button" disabled="true"
                    v-if="!projetoExibir.editMode && projetoExibir.fixado"
                    class="btn btn-sm btn-clear mr-10 my-5 btn">
                    <i class="fi fi-ss-thumbtack"></i>
                  </button>
                </div>

                <div v-if="projetoExibir.editMode" :class="{ 'flex' : isSmallScreen, 'flex-column' : !isSmallScreen}">

                  <div class="marginVerticalSpacer" :class="{ 'flex' : !isSmallScreen, 'flex-column' : isSmallScreen}">
                    <button type="button" class="btn btn-my-5 btn-sm btnPrioridade mr-5 situacaoPendente"
                      :class="{selected : projetoExibir.situacaoEditar == 1}"
                      @click="toggleEditarSituacao(projetoExibir, 1)">
                      0-Pendente
                    </button>
                    <button type="button" class="btn btn-my-5 btn-sm btnPrioridade mr-5 situacaoAguardandoResposta"
                      :class="{selected : projetoExibir.situacaoEditar == 2}"
                      @click="toggleEditarSituacao(projetoExibir, 2)">
                      1-Espera
                    </button>
                    <button type="button" class="btn btn-my-5 btn-sm btnPrioridade mr-5 situacaoPausado"
                      :class="{selected : projetoExibir.situacaoEditar == 3}"
                      @click="toggleEditarSituacao(projetoExibir, 3)">
                      2-Suspenso
                    </button>
                    <button type="button" class="btn btn-my-5 btn-sm btnPrioridade mr-5 situacaoConcluido"
                      :class="{selected : projetoExibir.situacaoEditar == 4}"
                      @click="toggleEditarSituacao(projetoExibir, 4)">
                      3-Concluído
                    </button>
                  </div>
                  

                  <div class="marginVerticalSpacer" :class="{ 'flex' : !isSmallScreen, 'flex-column ml-10' : isSmallScreen}">
                    <button type="button" class="btn btn-my-5 btn-sm btnPrioridade mr-5 prioridadeUrgente"
                      :class="{selected : projetoExibir.prioridadeEditar == 1}"
                      @click="toggleEditarPrioridade(projetoExibir, 1)">
                      1-Urgente
                    </button>
                    <button type="button" class="btn btn-my-5 btn-sm btnPrioridade mr-5 prioridadeAlta"
                      :class="{selected : projetoExibir.prioridadeEditar == 2}"
                      @click="toggleEditarPrioridade(projetoExibir, 2)">
                      2-Alta
                    </button>
                    <button type="button" class="btn btn-my-5 btn-sm btnPrioridade mr-5 prioridadeMedia"
                      :class="{selected : projetoExibir.prioridadeEditar == 3}"
                      @click="toggleEditarPrioridade(projetoExibir, 3)">
                      3-Media
                    </button>
                    <button type="button" class="btn btn-my-5 btn-sm btnPrioridade mr-5 prioridadeBaixa"
                      :class="{selected : projetoExibir.prioridadeEditar == 4}"
                      @click="toggleEditarPrioridade(projetoExibir, 4)">
                      4-Baixa
                    </button>
                    <button type="button" class="btn btn-my-5 btn-sm btnPrioridade mr-5 prioridadeBaixissima"
                      :class="{selected : projetoExibir.prioridadeEditar == 5}"
                      @click="toggleEditarPrioridade(projetoExibir, 5)">
                      5-Baixissima
                    </button>
                  </div>

                </div>
              </div>

              <!-- PROJETOS FOTOS LINKS -->
              <div class="mb-15">
                <div class="mb-15 flex-wrap">
                  <span class="projetoShowLabel mr-15">Fotos Links: </span>

                  <button class="btn btn-sm mr-15" type="button" @click="toggleModalCriarProjetofoto(projetoExibir)">Criar Foto Link +</button>

                  <button class="btn btn-sm mr-5" type="button" @click="toggleCollapsarProjetosfotos()" v-if="projetoExibir.projetosfotos.length > 0">Mostrar Fotos</button>
                </div>

                <div v-if="projetoExibir.projetosfotos.length > 0 && !collapsarProjetosfotos">
                  <div class="flex-wrap">

                    <!-- CADA PROJETO FOTO -->
                    <div v-for="projetofoto in projetoExibir.projetosfotos" :key="projetofoto.id" >
                      <div class="flex-column borderGray ml-5 mr-5 p-5 mb-5">
                          <div class="mb-10">
                            {{ projetofoto.descricao }}
                            <button class="btn btn-sm btn_tarefa_concluida" type="button" 
                              @click="toggleModalEditarProjetofoto(projetofoto,projetoExibir)" >
                              Editar
                            </button> 
                          </div>
                          <div>
                            <img :src="projetofoto.link" class="projetofoto" />
                          </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>


              <!-- TAREFAS -->
              <div class="mb-15">
                <div class="mb-15 flex-wrap">
                  <span class="projetoShowLabel mr-15">Tarefas: </span>
                  <button class="btn btn-sm mr-15" type="button" @click="toggleModalCriarTarefa(projetoExibir)">Criar Tarefa +</button>
                  <button class="btn btn-sm mr-15" type="button" @click="toggleExibirTarefasConcluidas()" v-if="projetoExibir.tarefas.length > 0">Mostrar Pendentes</button>
                  <button class="btn btn-sm mr-5" type="button" @click="toggleCollapsarTarefas()" v-if="projetoExibir.tarefas.length > 0">Minimizar</button>
                  <button type="button" class="btn btn-sm btn-clear" v-if="projetoExibir.tarefas.length > 0 && collapsarTarefas">
                    ...
                  </button>
                </div>

                <div v-if="projetoExibir.tarefas.length > 0 && !collapsarTarefas">
                  <!-- CADA TAREFA -->
                  <div v-for="tarefa in projetoExibir.tarefas" :key="tarefa.id" >
                    <div class="flex-wrap justify-spacebetween borderGray p-5 mb-5" v-if="tarefa.situacao == 0 || (exibirTarefasConcluidas)">
                      <div class="flex-wrap">
                        <div>
                          <span class="verticalalign-center mr-10 check-pendente" v-if="tarefa.situacao == 0"><i class="fi fi-sr-square"></i></span>
                          <span class="verticalalign-center mr-10 check-concluido" v-if="tarefa.situacao == 1"><i class="fi fi-sr-checkbox"></i></span>
                          <span class="verticalalign-center mr-10 check-falhado" v-if="tarefa.situacao == 2"><i class="fi fi-sr-square-x"></i></span>
                        </div>
                        <div>
                          <span class="verticalalign-center mr-10 star-meudia" v-if="tarefa.meuDia !== null && tarefa.meuDiaHoje"><i class="fi fi-sr-parking"></i></span>
                        </div>
                        <div>
                          <span class="verticalalign-center mr-10 star-meudia" v-if="tarefa.meuDia !== null && !tarefa.meuDiaHoje"><i class="fi fi-rr-parking"></i></span>
                        </div>
                        <div>
                          {{ tarefa.hora != null ? `[${tarefa.hora}]` : '' }}
                        </div>
                        <div>
                          {{ tarefa.descricao }}
                        </div>
                      </div>
                      <div>
                        <button class="btn btn-sm btn_tarefa_concluida" type="button" 
                          @click="toggleModalEditarTarefa(tarefa,projetoExibir)" >
                          Editar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style="flex-grow: 2;">
              <!-- ANOTAÇÕES -->
              <div class="mb-15">
                <div class="mb-5">
                  <span class="projetoShowLabel">Anotações: </span>
                </div>
                <div v-if="!projetoExibir.editMode" class="whitespace-pre mb-5 linhaBox">
                  {{ projetoExibir.anotacoes }}
                </div>
                <div v-if="projetoExibir.editMode" class="mb-5">
                  <textarea
                    id="projetoExibirAnotacoesEditarTextarea"
                    class="textarea"
                    name="anotacoes"
                    placeholder="anotacoes"
                    v-model="projetoExibir.anotacoesEditar">
                  </textarea>
                </div>
              </div>
            </div>
          </div>


        </div>
        </section>

      </div>
  </div>

    <Notifier ref="notifier"></Notifier>

    <ModalCriarProjeto
      v-model:exibirModal="exibirModalCriarProjeto"
      @reloadListaProjetosHabitTracker="buscaProjetos()">
    </ModalCriarProjeto>

    <ModalCriarTarefa
      v-model:exibirModal="exibirModalCriarTarefa"
      :projeto="projetoModalNovaTarefa"
      @updateTaskEvent="guardarNovaTarefa">
    </ModalCriarTarefa>
    
    <ModalEditarTarefa
      v-model:exibirModal="exibirModalEditarTarefa"
      :tarefa="tarefaModalEditarTarefa"
      :projeto="projetoModalEditarTarefa"
      @updateTaskEvent="guardarTarefaAtualizada">
    </ModalEditarTarefa>

    <ModalCriarProjetofoto
      v-model:exibirModal="exibirModalCriarProjetofoto"
      :projeto="projetoModalNovoProjetofoto"
      @createdProjetofotoEvent="guardarNovoProjetofoto">
    </ModalCriarProjetofoto>

    <ModalEditarProjetofoto
      v-model:exibirModal="exibirModalEditarProjetofoto"
      :projetofoto="projetofotoModalEditarProjetofoto"
      :projeto="projetoModalEditarProjetofoto"
      @updatedProjetofotoEvent="guardarProjetofotoAtualizado">
    </ModalEditarProjetofoto>

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
import ModalCriarProjetofoto from '@/views/projetos/ModalCriarProjetofoto.vue';
import ModalEditarProjetofoto from '@/views/projetos/ModalEditarProjetofoto.vue';
import BackupProjetos from "@/views/projetos/BackupProjetos.vue";

export default {
  name: 'HabitTracker',
  components: {
    Loader,
    InlineLoader,
    ModalCriarProjeto,
    ModalCriarTarefa,
    ModalEditarTarefa,
    ModalCriarProjetofoto,
    ModalEditarProjetofoto,
    BackupProjetos,
    Notifier,
  },
  inject: ['configuracoes'],
  data: () => {
    return {
      configs: {
        situacaoFixedWidth: false,
        prioridadeFixedWidth: false
      },
      busyProjetosLoad: false,
      busyProjetosDelete: false,
      busyProjetosUpdate: false,
      busyTarefasLoad: false,
      dataPrazo: '',
      projetos: [],
      projetoBackup: [],
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
      filtroNomeProjeto: '',
      exibirTarefasConcluidas: false,
      collapsarTarefas: false,
      projetoExibir: [],
      selectedSituacao: 0,
      selectedPrioridade: 0,
      
      exibirModalCriarProjetofoto: false,
      projetoModalNovoProjetofoto: [],
      exibirModalEditarProjetofoto: false,
      projetoModalEditarProjetofoto: [],
      projetofotoModalEditarProjetofoto: [],
      collapsarProjetosfotos: true,
      
      windowWidth: 0,
      windowHeight: 0,
    }
  },
  computed: {
    isSmallScreen() {
      return this.windowWidth < 800
    },
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
    isSameYMD(date1, date2){return DateTime.isSameYMD(date1, date2);},

    getProjetoUrl(projeto) {
      let url = '/projetosListV2/projeto/'+projeto.id;
      return url;
    },

    showProjetoFromQueryIdProjeto() {
      if(this.$route.params.idProjeto != undefined && this.$route.params.idProjeto != null && this.$route.params.idProjeto != '') {
        const projeto = this.findProjeto(this.$route.params.idProjeto)
        this.toggleShowProjeto(projeto);
      } else {
        this.hideProjeto(this.projetoExibir)
      }
    },

    findProjeto(idProjeto){
      for (let i = 0; i < this.projetos.length; i++) {
        if(this.projetos[i].id == idProjeto){
          return this.projetos[i];
        }
      }
    },

    /**
     * FUNCOES TOGGLE
     */
    toggleShowProjeto(projeto) {
      this.hideProjeto(projeto)
      projeto.selected = true
      this.projetoExibir = projeto
    },
    hideProjeto(projeto) {
      this.projetoExibir.selected = false
      projeto.selected = false
      this.projetoExibir = []
    },

    guardarNovaTarefa(novaTarefa)
    {
      console.log("novaTarefa",novaTarefa);
      console.log("projetos",this.projetos);
      console.log("projetoBackup",this.projetoBackup);

      for (let i = 0; i < this.projetos.length; i++) {
        if(this.projetos[i].id == novaTarefa.projeto){
          this.projetos[i].tarefas.push(novaTarefa);
          break;
        }
      }
      // for (let i = 0; i < this.projetoBackup.length; i++) {
      //   if(this.projetoBackup[i].id == novaTarefa.projeto){
      //     this.projetoBackup[i].tarefas.push(novaTarefa);
      //     break;
      //   }
      // }
    },

    guardarNovoProjetofoto(novo)
    {
      console.log("novo projeto foto",novo);
      console.log("projetos",this.projetos);
      console.log("projetoBackup",this.projetoBackup);

      for (let i = 0; i < this.projetos.length; i++) {
        if(this.projetos[i].id == novo.projeto){
          this.projetos[i].projetosfotos.push(novo);
          break;
        }
      }
      // for (let i = 0; i < this.projetoBackup.length; i++) {
      //   if(this.projetoBackup[i].id == novaTarefa.projeto){
      //     this.projetoBackup[i].tarefas.push(novaTarefa);
      //     break;
      //   }
      // }
    },

    guardarTarefaAtualizada(tarefaAtualizada){
      for (let i = 0; i < this.projetos.length; i++) {
        if(this.projetos[i].id == tarefaAtualizada.projeto){
          for (let j = 0; j < this.projetos[i].tarefas.length; j++) {
            if(this.projetos[i].tarefas[j].id == tarefaAtualizada.id){
              this.projetos[i].tarefas[j] = tarefaAtualizada
              break;
            }
          }
        }
      }
      // for (let i = 0; i < this.projetoBackup.length; i++) {
      //   if(this.projetoBackup[i].id == tarefaAtualizada.projeto){
      //     for (let j = 0; j < this.projetoBackup[i].tarefas.length; j++) {
      //       if(this.projetoBackup[i].tarefas[j].id == tarefaAtualizada.id){
      //         this.projetoBackup[i].tarefas[j] = tarefaAtualizada
      //         break;
      //       }
      //     }
      //   }
      // }
    },

    guardarProjetofotoAtualizado(projetofotoAtualizado){
      for (let i = 0; i < this.projetos.length; i++) {
        if(this.projetos[i].id == projetofotoAtualizado.projeto){
          for (let j = 0; j < this.projetos[i].projetosfotos.length; j++) {
            if(this.projetos[i].projetosfotos[j].id == projetofotoAtualizado.id){
              if(projetofotoAtualizado.excluido == true){
                delete(this.projetos[i].projetosfotos[j]);
              } else {
                this.projetos[i].projetosfotos[j] = projetofotoAtualizado
              }
              break;
            }
          }
        }
      }
    },

    
    toggleCollapsarTarefas()
    {
      this.collapsarTarefas = !this.collapsarTarefas;
    },

    toggleCollapsarProjetosfotos()
    {
      this.collapsarProjetosfotos = !this.collapsarProjetosfotos;
    },
    
    toggleExibirTarefasConcluidas()
    {
      this.exibirTarefasConcluidas = !this.exibirTarefasConcluidas;
    },

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

    toggleModalCriarProjetofoto (projeto) {
      this.projetoModalNovoProjetofoto = projeto
      this.exibirModalCriarProjetofoto = true;
    },
    toggleModalEditarProjetofoto (projetofoto, projeto) {
      this.projetofotoModalEditarProjetofoto = projetofoto
      this.exibirModalEditarProjetofoto = true;
      this.projetoModalEditarProjetofoto = projeto
    },

    /**
     * EDIT FORMS
     */
    toggleEdicaoProjeto(projeto) {
      projeto.prioridadeEditar = projeto.prioridade;
      projeto.situacaoEditar = projeto.situacao;
      projeto.editMode = !projeto.editMode
      if(projeto.editMode == true){
        // configuração para autosize
        setTimeout(() => {
          let element = document.getElementById('projetoExibirAnotacoesEditarTextarea');
          if(element != null) {
            console.log('event added');
            element.addEventListener('input', function(e){
              this.style.height = this.scrollHeight + 3 + 'px';
            })
            element.style.height = element.scrollHeight + 3 + 'px';
          }
        }, 1);
      }
    },
    toggleFixarProjeto(projeto) {
      // ask for confirmation
      this.busyProjetosDelete = true;
      let requestData = {
        'url': `${config.serverUrl}/projetos/${projeto.id}/fixar-desafixar`,
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'POST',
      };
      return Request.fetch(requestData).then(([response, data]) => {
        this.busyProjetosDelete = false;
        if(projeto.fixado == false) {
          this.$refs.notifier.notify('Projeto fixado!')
        } else {
          this.$refs.notifier.notify('Projeto desafixado!')
        }
        projeto.fixado = !projeto.fixado
      }).catch((error) => {
        console.error(error);
        this.busyProjetosDelete = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
      });
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
    buscaProjetos (primeiraExecucao = false) {
      this.busyProjetosLoad = true;
      let params = {};
      params['loadTarefas'] = this.carregarPreviamenteAsTarefas;
      params['loadProjetosfotos'] = true;
      if(this.selectedPrioridade != null && this.selectedPrioridade > 0){
        params['prioridade'] = this.selectedPrioridade;
      }
      if(this.selectedSituacao != null && this.selectedSituacao > 0){
        params['situacao'] = this.selectedSituacao;
      }
      params['orderBy'] = 'nome,asc'
      params = QueryStringConverter.toQueryString(params, true);
      let requestData = {
        'url': `${config.serverUrl}/projetos${params}`,
      };
      Request.fetch(requestData)
      .then(([response, data]) => {
        console.log({data});
        data = this.projetosFillAdditionalProps(data)
        data = this.projetosTarefasFillAdditionalProps(data)
        data = this.projetosTarefasOrganizar(data)
        this.projetos = data
        this.projetoBackup = this.projetos
        this.busyProjetosLoad = false;
        if(primeiraExecucao) this.showProjetoFromQueryIdProjeto();
      })
      .catch((error) => {
        this.busyProjetosLoad = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
        console.error(error);
      });
    },
    
    projetosTarefasFillAdditionalProps(projetos){
      let dateHoje = new Date();
      for (let i = 0; i < projetos.length; i++) {
        for (let j = 0; j < projetos[i].tarefas.length; j++) {
          let dateMeuDia = this.newDatetimeTz(projetos[i].tarefas[j].meuDia);
          let tarefaDeHoje = this.isSameYMD(dateMeuDia, dateHoje);
          if(tarefaDeHoje){
            projetos[i].tarefas[j].meuDiaHoje = true;
          }
        }
      }
      return projetos;
    },

    projetosTarefasOrganizar(projetos){
      let dateHoje = new Date();
      for (let i = 0; i < projetos.length; i++) {
        let tarefasPendentes = [];
        let tarefasConcluidas = [];
        for (let j = 0; j < projetos[i].tarefas.length; j++) {
          if(projetos[i].tarefas[j].situacao == 1 || projetos[i].tarefas[j].situacao == 2){
            tarefasConcluidas.push(projetos[i].tarefas[j])
          } else {
            tarefasPendentes.push(projetos[i].tarefas[j])
          }
        }
        tarefasPendentes.push(...tarefasConcluidas);
        projetos[i].tarefas = tarefasPendentes
      }
      return projetos;
    },


    projetosFillAdditionalProps(projetos) {
      for (let i = 0; i < projetos.length; i++) {
        projetos[i].nomeEditar = projetos[i].nome;
        projetos[i].anotacoesEditar = projetos[i].anotacoes;
        projetos[i].prioridadeEditar = projetos[i].prioridade;
        projetos[i].situacaoEditar = projetos[i].situacao;
        projetos[i].editMode = false;
        projetos[i].selected = false;
      }
      return projetos;
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
        // this.buscaProjetos(); // nao atualiza a lista para não atrapalhar o fluxo
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
    
    loadProjetosfotos(projeto){
      this.busyProjetosfotosLoad = true;
      const params = {'projeto': projeto.id};
      let requestData = {
        'url': `${config.serverUrl}/projetosfotos${QueryStringConverter.toQueryString(params, true)}`,
      };
      Request.fetch(requestData)
      .then(([response, data]) => {
        projeto.projetosfotos = data
        this.busyProjetosfotosLoad = false;
      })
      .catch((error) => {
        this.busyProjetosfotosLoad = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
        console.error(error);
      });
    },

    filtraListaProjeto()
    {
      // guarda o backup se não existir
      if(this.projetoBackup.length == 0){
        this.projetoBackup = this.projetos;
      }
      // recupera o backup para listar de forma completa
      // this.projetos = this.projetoBackup;
      let listaProjetos = this.projetoBackup;

      let arrayfilter = [];
      let nomeProjetoFiltro = this.filtroNomeProjeto.toLowerCase();
      let situacaoFiltro = this.selectedSituacao != 0 ? this.selectedSituacao : null;
      let prioridadeFiltro = this.selectedPrioridade != 0 ? this.selectedPrioridade : null;
      
      // ************************ filtro por situação
      if(situacaoFiltro != null){
        arrayfilter = [];
        for (let i = 0; i < listaProjetos.length; i++) {
          if(listaProjetos[i].situacao == situacaoFiltro){
            arrayfilter.push(listaProjetos[i])
          }
        }
        listaProjetos = arrayfilter;
      }
      // ************************ filtro por prioridade
      if(prioridadeFiltro != null){
        arrayfilter = [];
        for (let i = 0; i < listaProjetos.length; i++) {
          if(listaProjetos[i].prioridade == prioridadeFiltro){
            arrayfilter.push(listaProjetos[i])
          }
        }
        listaProjetos = arrayfilter;
      }
      // ************************ filtro por texto
      if(nomeProjetoFiltro != null){
        arrayfilter = [];
        for (let i = 0; i < listaProjetos.length; i++) {
          if(listaProjetos[i].nome.toLowerCase().includes(nomeProjetoFiltro)){
            arrayfilter.push(listaProjetos[i])
          }
        }
        listaProjetos = arrayfilter;
      }
      // ************************ atribuição final
      this.projetos = arrayfilter
    },

    getDimensions() {
      this.windowWidth = document.documentElement.clientWidth;
      this.windowHeight = document.documentElement.clientHeight;
    },

  },
  watch: {
    configuracoes(a, b) {
      // do something
    },
    $route (to, from){
      this.showProjetoFromQueryIdProjeto();
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
    this.buscaProjetos(true);
  },
}
</script>
