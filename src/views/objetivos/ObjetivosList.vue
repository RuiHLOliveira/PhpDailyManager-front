<style scoped>
.areaDeObjetivo{
  border-bottom: 1px solid var(--border-color);
}

.areasContainerBloco{
  max-width: 900px;
  margin: 0 auto;
}
.objetivoBox {
  border-radius: 5px;
  max-width: 300px;
  align-self: stretch;
}
.objetivoLine {
  border-radius: 5px;
  width: 100%;
}
.objetivo-completado {
  border: 1px solid green;
}

.objetivoExibirSubbloco {
  padding: 10px;
  border-radius: 5px;
  background-color: var(--bg-color-variant);
}
.imgObjetivo {
  max-width: 400px;
  max-height: 400px;
}
.imgObjetivoSmall{
  max-width: 200px;
  max-height: 200px;
}

.objetivoShow{
  max-width: 1100px;
  margin: 0 auto;
}

/* OLD ONES */
.btnSituacao{
  padding: 5px 10px;
  border-radius: 50px;
}
.btnBgOnly{
  color: var(--font-color);
  background-color: var(--bg-color);
  padding: 5px 10px;
  border-radius: 50px;
}
.btnBgOnly:hover{
  background-color: var(--bg-color-variant);
}

.horizonte2{
  color: black;
  background-color: rgb(165, 219, 154)
}
.horizonte3{
  color: black;
  background-color: rgb(133, 177, 124);
}
.horizonte4 {
  color: white;
  background-color: rgb(107, 143, 100);
}
.horizonte5 {
  color: white;
  background-color: rgb(75, 100, 70);
}

</style>

<template>
    <div class="" :class="{
      'maxViewportWidth': isSmallScreen,
      'containerFullWidth': exibeBloco,
      'container': !exibeBloco
    }">

      <div class="position_sticky py-10 div_border_bottom_gray bg-color-force">
        <!-- HEADER -->
        <section class="my-5 py-5 px-10 flex justify-spacebetween alignitens-center">
          <div class="flex alignitens-center">
            <h1>Objetivos</h1> <span class="ml-10">Inspiracionais</span>

            <div class="">
              <button class="btn btn-sm mx-15" type="button"
                v-if="objetivoExibir.id == null"
                @click="toggleModalCriarObjetivo()">
                Criar Objetivo +
              </button>

              <button class="btn btn-sm mx-15" type="button"
                v-if="objetivoExibir.id == null"
                @click="toggleCriarArea()">
                Criar Área
              </button>

              <router-link to='/objetivosList' v-if="objetivoExibir.id != null && !objetivoExibir.editMode" 
                class="btn ml-15 mr-10 my-5 flex-center-combo" style="display: inline-flex;">
                <i class="fi fi-rr-arrow-small-left"></i> Voltar
              </router-link>

              <button v-if="objetivoExibir.id != null && !objetivoExibir.editMode" class="btn mx-10 my-5" type="button" 
                @click="toggleEdicaoObjetivo(objetivoExibir)">
                Editar
              </button>

            </div>
          </div>
          <div v-if="objetivoExibir.id != null">
            <div class="flex-wrap flex-center-combo justify-spacebetween">
              <button v-if="objetivoExibir.editMode"
                class="btn mx-10 mr-10 my-5" type="button" 
                @click="cancelarEdicaoObjetivo(objetivoExibir)">
                Cancelar
              </button>
              <button v-if="objetivoExibir.editMode"
                class="btn mx-10 my-5 btn" type="button" 
                @click="salvarEdicaoObjetivo(objetivoExibir)">
                Salvar
              </button>
              <button v-if="objetivoExibir.editMode"
                class="btn mx-10 my-5 btn btn-red" type="button" 
                @click="excluirObjetivo(objetivoExibir)">
                Excluir
              </button>
            </div>

          </div>
        </section>

        <!-- FILTER -->
        <div class="mt-10 p-5 flex-column" v-if="objetivoExibir.id == null">

          <div class="" :class="{
            'flex-wrap flex-center-combo' : !isSmallScreen,
            'flex-column' : isSmallScreen
          }">

            <div class="mr-5">
              <input @keyup="filtraListaObjetivo()" name="filtroNomeObjetivo" placeholder="filtro nome do objetivo" type="text" v-model="filtroNomeObjetivo">
            </div>

            <div class="flex flex-center-combo">
              <!-- SITUACAO -->
              <select class="smallSelect mr-5" v-model="selectedSituacao" name="situacao" id="situacao" @click="filtraListaObjetivo()">
                <option value="0">Todos</option>
                <option value="1">Pendente</option>
                <option value="2">Concluído</option>
              </select>
            </div>

            <div class="flex flex-center-combo">
              <button
                class="btn mx-10 my-5 btn-sm" type="button" 
                @click="toggleExibeBloco()">
                Bloco/lista
              </button>
            </div>

          </div>

        </div>


        <div v-if="exibirCriarAreaForm">
          <div>Nova Área da Vida</div>
          <input :disabled="busyCreateAreas" name="nomeNovaArea"
            placeholder="nome da área da vida" type="text" v-model="nomeNovaArea">
          <button class="btn mx-10 my-5 btn" type="button" 
            @click="criarAreaDaVida()" :disabled="busyCreateAreas">
            Criar
          </button>
          <InlineLoader
            :textoAguarde="true"
            :busy="busyCreateAreas"
            :center="true">
          </InlineLoader>
        </div>

      </div>

      <div class="flex-column">

        <div class="my-5 py-5" v-if="busyObjetivosLoad || busyLoadAreas">
          <InlineLoader
            :textoAguarde="true"
            :busy="busyObjetivosLoad || busyLoadAreas"
            :center="true">
          </InlineLoader>
        </div>

        <!-- OBJETIVO LIST -->
        <section class="objetivoList" v-if="objetivoExibir.id == null">

          <!-- FOR EACH OBJETIVO -->
          <div v-for="area in areas" class="areaDeObjetivo py-20 mb-20"
          :class="{
            '' : !isSmallScreen && exibeBloco,
            'areasContainerBloco' : isSmallScreen || !exibeBloco
          }">
            <div>
              {{ area.nome }}
              <button class="btn mx-10 my-5 btn-sm" type="button" @click="editarArea(area)">
                Editar
              </button>
            </div>
            <div v-if="area.editMode">
              <input :disabled="busyEditAreas" name="nomearea" type="text" v-model="area.nomeEditar">
              <button class="btn mx-10 my-5 btn-sm" type="button"
                :disabled="busyEditAreas" @click="salvarEdicaoArea(area)">
                Salvar
              </button>
              <InlineLoader
                :textoAguarde="true"
                :busy="busyEditAreas"
                :center="true">
              </InlineLoader>
            </div>

            <div class="gap-10 pt-5" v-if="objetivos != [] && !busyObjetivosLoad && !busyObjetivosDelete"
            :class="{
                'flex-wrap flex-center-combo' : !isSmallScreen && exibeBloco,
                'flex-column' : isSmallScreen || !exibeBloco
              }">
              <template v-for="objetivo in objetivos" :key="objetivo.id" >
                <!-- TITLE -->
                <div v-if="objetivo.area.id == area.id" class="p-10 flex flex-center-combo justify-spacebetween"
                  :class="{
                    'objetivoBox': !isSmallScreen && exibeBloco,
                    'objetivoLine': isSmallScreen || !exibeBloco,
                    // 'objetivoSelected' : objetivo.id == objetivoExibir.id,
                    'horizonte2': objetivo.horizonte == 2,
                    'horizonte3': objetivo.horizonte == 3,
                    'horizonte4': objetivo.horizonte == 4,
                    'horizonte5': objetivo.horizonte == 5,
                  }">
                  
                  <div class="objetivoNome flex flex-center-combo">
                    <div class="btnSituacao" style="padding-left: 0px;">
                      <!-- <i v-if="objetivo.situacao == 1" class="fi fi-rr-square"></i> -->
                      <i v-if="objetivo.situacao == 2" class="fi fi-rr-checkbox"></i>
                    </div>
                    <div>
                      [H{{ objetivo.horizonte }}
                      {{ objetivo.horizonte == 2 ? '3m]' : '' }}
                      {{ objetivo.horizonte == 3 ? '1a]' : '' }}
                      {{ objetivo.horizonte == 4 ? '5a]' : '' }}
                      {{ objetivo.horizonte == 5 ? 'vida]' : '' }}
                      {{ objetivo.nome }}
                    </div>
                  </div>
                  
                  <div class="">
                    <div class="flex flex-center-combo" :class="{'flex-reverse' : isSmallScreen}">
                      <div class="flex flex-center-combo">
                        <router-link :to='getObjetivoUrl(objetivo)'
                          class="mx-10 btn btnBgOnly" style="line-height: 0;">
                          <i class="fi fi-rr-folder-open"></i>
                        </router-link>
                      </div>
                    </div>
                  </div>

                </div>
              </template>
            </div>
          </div>
        </section>

        <!-- OBJETIVO SHOW -->
        <section class="objetivoShow p-10 mx-5" v-if="objetivoExibir.id != null">
        <div v-if="objetivoExibir.id != null">

          <InlineLoader
            :textoAguarde="true"
            :busy="busyObjetivosUpdate || busyObjetivosDelete"
            :center="true">
          </InlineLoader>

          <div class="">
            <!-- COL 1 DADOS -->
            <div class="flex-column">
              <div class="objetivoExibirSubbloco">
                  
                <div v-if="!objetivoExibir.editMode" class="mb-10 objetivoShowLabel whitespace-pre">
                  {{ objetivoExibir.nome }}
                </div>

                <div v-if="!objetivoExibir.editMode" class="mb-10">
                  <label for="nome">{{ objetivoExibir.horizonteDescritivo }}</label>
                </div>

                <!-- SITUACAO -->
                <div v-if="!objetivoExibir.editMode" class="">
                  <button type="button" class="btn btn-sm btnPrioridade mr-5"
                    :class="{
                      situacaoFixedWidth : configs.situacaoFixedWidth == true,
                      situacaoPendente : objetivoExibir.situacao == 1,
                      situacaoConcluido : objetivoExibir.situacao == 2,
                    }">
                    {{ objetivoExibir.situacao }}-{{ objetivoExibir.situacaoDescritivo }}
                  </button>
                </div>

                <div v-if="objetivoExibir.editMode" :class="{ 'flex-column' : isSmallScreen, 'flex-column' : !isSmallScreen}">

                  <input name="atividade" type="text" v-model="objetivoExibir.nomeEditar">

                  <label for="horizonte">horizonte:</label>
                  <select class="mb-10 fullSelect" name="horizonte" id="horizonte"
                    :disabled="busy" v-model="objetivoExibir.horizonte">
                    <option value="2">Horizonte 2: Trimestral</option>
                    <option value="3">Horizonte 3: Anual</option>
                    <option value="4">Horizonte 4: 5 Anos</option>
                    <option value="5">Horizonte 5: Vida</option>
                  </select>

                  
                  <label for="area">Area:</label>
                  <select class="mb-10 fullSelect" name="area" id="area"
                    :disabled="busy" v-model="objetivoExibir.areaEditar.id">
                    <option v-for="area in areas" :value="area.id">{{ area.nome }}</option>
                  </select>

                  
                  <div class="marginVerticalSpacer" :class="{ 'flex' : isSmallScreen, 'flex' : !isSmallScreen}">
                    <button type="button" class="btn my-5 btn-sm btnPrioridade mr-5 situacaoPendente"
                      :class="{selected : objetivoExibir.situacaoEditar == 1}"
                      @click="toggleEditarSituacao(objetivoExibir, 1)">
                      1-Pendente
                    </button>
                    <button type="button" class="btn my-5 btn-sm btnPrioridade mr-5 situacaoConcluido"
                      :class="{selected : objetivoExibir.situacaoEditar == 2}"
                      @click="toggleEditarSituacao(objetivoExibir, 2)">
                      2-Concluído
                    </button>
                  </div>
                  
                </div>
              </div>

              <!-- OBJETIVO FOTOS LINKS -->
              <div class="mt-20 objetivoExibirSubbloco">
                <div class="mb-15 flex-column">

                  <div class="flex-wrap mb-20">
                    <span class="objetivoShowLabel mr-15">FOTOS: </span>
                    <button class="btn btn-sm mr-5" type="button" @click="toggleCollapsarObjetivosfotos()"
                      v-if="objetivoExibir.fotos?.length > 0">Mostrar Fotos ({{ objetivoExibir.fotosEditar.length }})</button>
                    <button v-if="objetivoExibir.editMode" class="btn btn-sm mr-15" type="button"
                      @click="addLineFoto(objetivoExibir)">Criar Foto Link +</button>
                  </div>

                  <div v-if="!collapsarObjetivosfotos" :class="{'flex-column': objetivoExibir.editMode, 'flex-wrap': !objetivoExibir.editMode}">
                    <div v-for="foto in objetivoExibir.fotosEditar" class="flex">
                      <img class="mr-10" :class="{'imgObjetivo': !objetivoExibir.editMode, 'imgObjetivoSmall': objetivoExibir.editMode}" :src="foto.link" :alt="'Origem: ' + foto.link" srcset="">
                      <input class="" name="nome" type="text" placeholder="link da sua imagem"
                        v-if="objetivoExibir.editMode" v-model="foto.link" :disabled="busy">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-20 objetivoExibirSubbloco">
              <div v-for="pergunta in perguntas" class="mb-20">
                <div class="font-weight-bold mb-5">
                  {{pergunta.id}} - {{ pergunta.pergunta }}
                </div>
                <div v-if="!objetivoExibir.editMode">
                  {{ objetivoExibir.respostasParsed[pergunta.id].resposta ?? '-'}}
                </div>
                <div v-if="objetivoExibir.editMode">
                  <input name="nome" type="text" placeholder="nome"
                  v-model="objetivoExibir.respostasEditar[pergunta.id].resposta" :disabled="busy">
                </div>
              </div>
            </div>

            <div class="mt-20 objetivoExibirSubbloco" style="flex-grow: 2;">
              <!-- ANOTAÇÕES -->
              <div class="mb-15">
                <div class="mb-10">
                  <span class="objetivoShowLabel">Anotações: </span>
                </div>
                <div v-if="!objetivoExibir.editMode" class="whitespace-pre mb-5 linhaBox">
                  {{ objetivoExibir.anotacoes }}
                </div>
                <div v-if="objetivoExibir.editMode" class="mb-30 pb-30">
                  <textarea
                    id="objetivoExibirAnotacoesEditarTextarea"
                    class="textarea"
                    name="anotacoes"
                    placeholder="anotacoes"
                    v-model="objetivoExibir.anotacoesEditar">
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

    <ModalCriarObjetivo
      v-model:exibirModal="exibirModalCriarObjetivo"
      @reloadListaObjetivos="loadObjetivos()">
    </ModalCriarObjetivo>

    <!-- <ModalCriarTarefa
      v-model:exibirModal="exibirModalCriarTarefa"
      :objetivo="objetivoModalNovaTarefa"
      @updateTaskEvent="guardarNovaTarefa">
    </ModalCriarTarefa> -->
    
    <!-- <ModalEditarTarefa
      v-model:exibirModal="exibirModalEditarTarefa"
      :tarefa="tarefaModalEditarTarefa"
      :objetivo="objetivoModalEditarTarefa"
      :objetivos="objetivos"
      @updateTaskEvent="guardarTarefaAtualizada"
      @deletedTaskEvent="removeTarefaExcluida">
    </ModalEditarTarefa> -->

    <!-- <ModalCriarObjetivofoto
      v-model:exibirModal="exibirModalCriarObjetivofoto"
      :objetivo="objetivoModalNovoObjetivofoto"
      @createdObjetivofotoEvent="guardarNovoObjetivofoto">
    </ModalCriarObjetivofoto> -->

    <!-- <ModalEditarObjetivofoto
      v-model:exibirModal="exibirModalEditarObjetivofoto"
      :objetivofoto="objetivofotoModalEditarObjetivofoto"
      :objetivo="objetivoModalEditarObjetivofoto"
      @updatedObjetivofotoEvent="guardarObjetivofotoAtualizado">
    </ModalEditarObjetivofoto> -->

</template>

<script>
import DateTime from '@/core/DateTime.js'
import Request from '@/core/request.js';
import config from '@/core/config.js'
import UrlBuilder from '../../core/urlBuilder';
import QueryStringConverter from '@/core/QueryStringConverter.js'
import Loader from '@/components/Loader.vue';
import InlineLoader from '@/components/InlineLoader.vue';
import Notifier from '@/components/Notifier.vue';

import { ObjetivosStorage } from '@/core/storage/ObjetivosStorage.js'
import { AreasStorage } from '@/core/storage/AreasStorage.js'
import { PerguntasStorage } from '@/core/storage/PerguntasStorage.js'

import ModalCriarObjetivo from '@/views/objetivos/ModalCriarObjetivo.vue';
// import ModalCriarTarefa from '@/views/objetivos/ModalCriarTarefa.vue';
// import ModalEditarTarefa from '@/views/objetivos/ModalEditarTarefa.vue';
// import ModalCriarObjetivofoto from '@/views/objetivos/ModalCriarObjetivofoto.vue';
// import ModalEditarObjetivofoto from '@/views/objetivos/ModalEditarObjetivofoto.vue';

export default {
  name: 'HabitTracker',
  components: {
    Loader,
    InlineLoader,
    ModalCriarObjetivo,
    // ModalCriarTarefa,
    // ModalEditarTarefa,
    // ModalCriarObjetivofoto,
    // ModalEditarObjetivofoto,
    Notifier,
  },
  emits: ['redirectAfterLogin'],
  inject: ['configuracoes'],
  data: () => {
    return {
      configs: {
        situacaoFixedWidth: false,
        prioridadeFixedWidth: false
      },
      busyObjetivosLoad: false,
      busyObjetivosDelete: false,
      busyObjetivosUpdate: false,
      busyTarefasLoad: false,

      busyLoadAreas: false,
      busyCreateAreas: false,
      busyEditAreas: false,

      dataPrazo: '',
      objetivos: [],
      objetivoBackup: [],
      exibirModalCriarObjetivo: false,
      filtroSituacao: null,
      nextProgramedListingAmount: 0,
      filtroNomeObjetivo: '',
      objetivoExibir: [],
      selectedSituacao: 0,
      
      exibeBloco: true,

      perguntas: [],

      objetivosPorHorizonte: [],
      objetivosHorizonte2: [],
      objetivosHorizonte3: [],
      objetivosHorizonte4: [],
      objetivosHorizonte5: [],
      areas: [],

      exibirCriarAreaForm: false,
      nomeNovaArea: '',
      
      exibirModalCriarObjetivofoto: false,
      objetivoModalNovoObjetivofoto: [],
      exibirModalEditarObjetivofoto: false,
      objetivoModalEditarObjetivofoto: [],
      objetivofotoModalEditarObjetivofoto: [],
      collapsarObjetivosfotos: true,
      
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

    getObjetivoUrl(objetivo){ return UrlBuilder.getObjetivoUrl(objetivo); },

    showObjetivoFromQueryIdObjetivo() {
      if(this.$route.params.idObjetivo != undefined && this.$route.params.idObjetivo != null && this.$route.params.idObjetivo != '') {
        const objetivo = this.findObjetivo(this.$route.params.idObjetivo)
        this.toggleShowObjetivo(objetivo);
      } else {
        this.hideObjetivo(this.objetivoExibir)
      }
    },

    loadBlocoLista(){
      this.exibeBloco = window.localStorage.getItem('objetivos.exibeBloco') === 'true';
    },

    toggleExibeBloco(){
      this.exibeBloco = !this.exibeBloco;
      window.localStorage.setItem('objetivos.exibeBloco', String(this.exibeBloco));
    },

    findObjetivo(idObjetivo){
      for (let i = 0; i < this.objetivos.length; i++) {
        if(this.objetivos[i].id == idObjetivo){
          return this.objetivos[i];
        }
      }
    },

    /**
     * FUNCOES TOGGLE
     */
    toggleShowObjetivo(objetivo) {
      this.hideObjetivo(objetivo)
      objetivo.selected = true
      this.objetivoExibir = objetivo
    },
    hideObjetivo(objetivo) {
      this.objetivoExibir.selected = false
      objetivo.selected = false
      this.objetivoExibir = []
    },

    editarArea(area){
      area.editMode = !area.editMode;
    },

    toggleCollapsarObjetivosfotos()
    {
      this.collapsarObjetivosfotos = !this.collapsarObjetivosfotos;
    },
    
    toggleCriarArea() {
      this.exibirCriarAreaForm = !this.exibirCriarAreaForm;
    },

    toggleModalCriarObjetivo () {
      this.exibirModalCriarObjetivo = true;
    },

    toggleModalCriarObjetivofoto (objetivo) {
      this.objetivoModalNovoObjetivofoto = objetivo
      this.exibirModalCriarObjetivofoto = true;
    },
    toggleModalEditarObjetivofoto (objetivofoto, objetivo) {
      this.objetivofotoModalEditarObjetivofoto = objetivofoto
      this.exibirModalEditarObjetivofoto = true;
      this.objetivoModalEditarObjetivofoto = objetivo
    },

    addLineFoto(objetivoExibir) {
      objetivoExibir.fotosEditar.push({"link": ''});
    },

    /**
     * EDIT FORMS
     */
    toggleEdicaoObjetivo(objetivo) {
      objetivo.situacaoEditar = objetivo.situacao;
      objetivo.editMode = !objetivo.editMode
      if(objetivo.editMode == true){
        // configuração para autosize
        setTimeout(() => {
          let element = document.getElementById('objetivoExibirAnotacoesEditarTextarea');
          if(element != null) {
            console.log('event added');
            element.addEventListener('input', function(e){
              this.style.height = this.scrollHeight + 1 + 'px';
            })
            element.style.height = element.scrollHeight + 3 + 'px';
          }
        }, 1);
      }
    },

    cancelarEdicaoObjetivo(objetivo) {
      this.toggleEdicaoObjetivo(objetivo)
      objetivo.nomeEditar = objetivo.nome;
      objetivo.anotacoesEditar = objetivo.anotacoes;
    },

    toggleEditarSituacao(objetivo, novaSituacao){
      objetivo.situacaoEditar = novaSituacao;
    },

    excluirObjetivo(objetivo) {
      // ask for confirmation
      if(!confirm("Deseja apagar o objetivo?")){
        return;
      }
      console.log(objetivo.id);
      this.busyObjetivosDelete = true;
      let requestData = {
        'url': `${config.serverUrl}/objetivos/${objetivo.id}`,
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'DELETE',
      };
      return Request.fetch(requestData).then(([response, data]) => {
        this.busyObjetivosDelete = false;
        this.$refs.notifier.notify('Objetivo excluído!')
        this.toggleEdicaoObjetivo(objetivo)
        this.loadObjetivos();
      }).catch((error) => {
        console.error(error);
        this.busyObjetivosDelete = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
      });
    },

    /**
     * FUNCOES FETCH API
     */
    loadObjetivos (primeiraExecucao = false) {
      this.busyObjetivosLoad = true;
      let params = {};
      if(this.selectedSituacao != null && this.selectedSituacao > 0){
        params['situacao'] = this.selectedSituacao;
      }
      params['orderBy'] = 'nome,asc'
      params = QueryStringConverter.toQueryString(params, true);
      let requestData = {
        'url': `${config.serverUrl}/objetivos${params}`,
      };
      // todo usar ObjetivosStorage
      Request.fetch(requestData)
      .then(([response, data]) => {
        console.log({data});
        data = this.objetivosFillAdditionalProps(data)
        this.separarObjetivosPorHorizonte(data)
        console.log(data);
        this.objetivos = data
        this.objetivoBackup = this.objetivos
        this.busyObjetivosLoad = false;
        if(primeiraExecucao) this.showObjetivoFromQueryIdObjetivo();
      })
      .catch((error) => {
        this.busyObjetivosLoad = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
        console.error(error);
      });
    },
    
    objetivosFillAdditionalProps(objetivos) {
      for (let i = 0; i < objetivos.length; i++) {

        objetivos[i].respostasParsed = JSON.parse(objetivos[i].respostas ?? null);
        objetivos[i].fotosParsed = JSON.parse(objetivos[i].fotos == null ? [] : objetivos[i].fotos);

        if(objetivos[i].respostasParsed.length == 0 || objetivos[i].respostasParsed == null ) {
          this.perguntas.forEach(pergunta => {
            objetivos[i].respostasParsed[pergunta.id] = {'resposta': ''};
          });
          objetivos[i].respostas = objetivos[i].respostasParsed;
        }

        console.log('[respostas parsed]', objetivos[i].respostasParsed);
        objetivos[i].nomeEditar = objetivos[i].nome;
        objetivos[i].horizonteEditar = objetivos[i].horizonte;
        objetivos[i].respostasEditar = objetivos[i].respostasParsed;
        objetivos[i].fotosEditar = objetivos[i].fotosParsed;
        objetivos[i].areaEditar = objetivos[i].area;
        objetivos[i].anotacoesEditar = objetivos[i].anotacoes;
        objetivos[i].situacaoEditar = objetivos[i].situacao;
        objetivos[i].editMode = false;
        objetivos[i].selected = false;
      }
      return objetivos;
    },

    separarObjetivosPorHorizonte(objetivos) {
      // objetivosHorizonte2
      // objetivos.forEach(objetivo => {
      //   if(objetivo.horizonte == 2) this.objetivosHorizonte2.push(objetivo);
      //   if(objetivo.horizonte == 3) this.objetivosHorizonte3.push(objetivo);
      //   if(objetivo.horizonte == 4) this.objetivosHorizonte4.push(objetivo);
      //   if(objetivo.horizonte == 5) this.objetivosHorizonte5.push(objetivo);
      // });
      // this.objetivosPorHorizonte[0] = this.objetivosHorizonte2;
      // this.objetivosPorHorizonte[1] = this.objetivosHorizonte3;
      // this.objetivosPorHorizonte[2] = this.objetivosHorizonte4;
      // this.objetivosPorHorizonte[3] = this.objetivosHorizonte5;
      
      objetivos.sort(function(objetivo1,objetivo2){
        return objetivo1.horizonte < objetivo2.horizonte;
      });
      
    },

    salvarEdicaoObjetivo(objetivo, sairDaEdicao = true) {
      console.log(objetivo.nomeEditar)
      console.log(objetivo.anotacoesEditar)
      objetivo.nome = objetivo.nomeEditar
      objetivo.anotacoes = objetivo.anotacoesEditar
      objetivo.situacao = objetivo.situacaoEditar
      objetivo.respostas = objetivo.respostasEditar
      objetivo.fotos = objetivo.fotosEditar
      objetivo.area = objetivo.areaEditar
      console.log(objetivo);
      this.updateObjetivo(objetivo, sairDaEdicao);
    },

    updateObjetivo(objetivo, sairDaEdicao = true) {
      console.log(objetivo.id);
      this.busyObjetivosUpdate = true;
      let body = {
        'dataPrazo': objetivo.dataPrazo,
        'nome': objetivo.nome,
        'anotacoes': objetivo.anotacoes,
        'situacao': objetivo.situacao,
        'horizonte': objetivo.horizonte,
        'respostas': JSON.stringify(objetivo.respostas),
        'fotos': JSON.stringify(objetivo.fotos),
        'area': objetivo.area.id,
      };

      let requestData = {
        'url': `${config.serverUrl}/objetivos/${objetivo.id}`,
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'PUT',
        'data' : body
      };
      return Request.fetch(requestData).then(([response, data]) => {
        this.busyObjetivosUpdate = false;
        this.$refs.notifier.notify('Objetivo salvo!')
        if(sairDaEdicao) this.toggleEdicaoObjetivo(objetivo)
      }).catch((error) => {
        console.error(error);
        this.busyObjetivosUpdate = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true)
      });
    },

    filtraListaObjetivo()
    {
      // guarda o backup se não existir
      if(this.objetivoBackup.length == 0){
        this.objetivoBackup = this.objetivos;
      }
      // recupera o backup para listar de forma completa
      // this.objetivos = this.objetivoBackup;
      let listaObjetivos = this.objetivoBackup;

      let arrayfilter = [];
      let nomeObjetivoFiltro = this.filtroNomeObjetivo.toLowerCase();
      let situacaoFiltro = this.selectedSituacao != 0 ? this.selectedSituacao : null;
      
      // ************************ filtro por situação
      if(situacaoFiltro != null){
        arrayfilter = [];
        for (let i = 0; i < listaObjetivos.length; i++) {
          if(listaObjetivos[i].situacao == situacaoFiltro){
            arrayfilter.push(listaObjetivos[i])
          }
        }
        listaObjetivos = arrayfilter;
      }
      
      // ************************ filtro por texto
      if(nomeObjetivoFiltro != null){
        arrayfilter = [];
        for (let i = 0; i < listaObjetivos.length; i++) {
          if(listaObjetivos[i].nome.toLowerCase().includes(nomeObjetivoFiltro)){
            arrayfilter.push(listaObjetivos[i])
          }
        }
        listaObjetivos = arrayfilter;
      }
      // ************************ atribuição final
      this.objetivos = arrayfilter
    },


    loadAreas(){
      this.busyLoadAreas = true;
      return AreasStorage.index()
      .then(([response, data]) => {
        console.log(response);
        console.log(data);
        data.forEach(area => {
          area.editMode = false;
          area.nomeEditar = area.nome;
        });
        this.areas = data;
        this.busyLoadAreas = false;
      }).catch((error) => {
        console.error(error);
        this.busyLoadAreas = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
      });
    },

    criarAreaDaVida() {
      this.busyCreateAreas = true;
      let body = {'nome' : this.nomeNovaArea};
      return AreasStorage.apiCriar(body)
      .then(([response, data]) => {
        console.log(response);
        console.log(data);
        AreasStorage.forceNextReload = true;
        this.loadAreas()
        this.busyCreateAreas = false;
        this.nomeNovaArea = '';
        this.exibirCriarAreaForm = false;
      }).catch((error) => {
        console.error(error);
        this.busyCreateAreas = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
      });
    },
    

    salvarEdicaoArea(area) {
      this.busyEditAreas = true;
      AreasStorage.apiEditar({'id': area.id, 'nome': area.nomeEditar})
      .then(([response, data]) => {
        area.editMode = false;
        console.log(response);
        console.log(data);
        AreasStorage.forceNextReload = true;
        this.loadAreas()
        this.busyEditAreas = false;
      }).catch((error) => {
        console.error(error);
        this.busyEditAreas = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
      });
    },
    
    async loadPerguntas () {
      return PerguntasStorage.index()
      .then(([response, data]) => {
        console.log(response);
        console.log(data);
        this.perguntas = data;
        // data.forEach(pergunta => {
        //   this.respostas[pergunta.id] = {'resposta': ''};
        // });
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
      });
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
    'objetivoExibir.anotacoesEditar'(a, b) {
      //this.registrarDebounceUpdateObjetivo();
    },
    $route (to, from){
      this.showObjetivoFromQueryIdObjetivo();
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
    this.loadBlocoLista();
    this.loadAreas();
    this.loadPerguntas().then(r => {
      this.loadObjetivos(true);
    });
  },
}
</script>
