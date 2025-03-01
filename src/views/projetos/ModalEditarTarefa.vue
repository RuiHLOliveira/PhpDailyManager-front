<style>
</style>

<template>
<Teleport to="body">
  <div v-if="exibirModal">
    <div class="modalBackground">
      <div class="modal">

        <section>
          <h1 class="textCenter mb-10">Editar Tarefa</h1>

          <div class="flex-wrap my-10 inputlikeDiv">
            <div class="verticalalign-center mr-10">
              Projeto:
            </div>
            <div>
              <h3>{{ projeto.nome }}</h3>
            </div>
          </div>

          <div class="flex-wrap mb-10 inputlikeDiv">
            <div class="verticalalign-center mr-10">
              Tarefa:
            </div>
            <div>
              <h3>{{ tarefa.descricao }}</h3>
            </div>
          </div>

          <div class="flex-wrap mb-10 inputlikeDiv">
            <div class="verticalalign-center mr-10">
              Motivo:
            </div>
            <div>
              <h3>{{ tarefa.motivo }}</h3>
            </div>
          </div>

          <div class="flex-column mt-10 inputlikeDiv">
            <div class="verticalalign-center mr-10">
              Situação: {{ tarefa.situacaoDescritivo }}
            </div>
            <div>
              Prioridade: 
              <span class="verticalalign-center mr-10 star-meudia" v-if="tarefa.meuDia !== null && tarefa.meuDiaHoje">
                <i class="fi fi-sr-parking"></i>
              </span>
              <span class="verticalalign-center mr-10 star-meudia" v-if="tarefa.meuDia !== null && !tarefa.meuDiaHoje">
                <i class="fi fi-rr-parking"></i>
              </span>
            </div>
            <div>
              Finalizada: 
              <span class="verticalalign-center mr-10 check-pendente" v-if="tarefa.situacao == 0"><i class="fi fi-sr-square"></i></span>
              <span class="verticalalign-center mr-10 check-concluido" v-if="tarefa.situacao == 1"><i class="fi fi-sr-checkbox"></i></span>
              <span class="verticalalign-center mr-10 check-falhado" v-if="tarefa.situacao == 2"><i class="fi fi-sr-square-x"></i></span>
            </div>
          </div>
          
          <label for="tarefa">Tarefa:</label>
          <input :disabled="busy" name="tarefa" type="text" placeholder="tarefa" v-model="tarefaLocal.descricao">
          
          <label for="motivo">Motivo:</label>
          <input :disabled="busy" name="motivo" type="text" placeholder="motivo" v-model="tarefaLocal.motivo">

          <label for="hora">Hora:</label>
          <input :disabled="busy" name="hora" type="time" placeholder="hora" v-model="tarefaLocal.hora">
        </section>

        <div class="mt-15" v-if="tarefaLocal.situacao == 0">
          <h2 class="mb-5">Prioridade</h2>
          <div v-if="!tarefa.meuDia">
            <button :disabled="busy" class="btn btn-clear iconBig" @click="adicionarAoMeuDiaTarefa()">
              <i class="fi fi-sr-parking"></i> Definir como Prioridade
            </button>
          </div>
          <div v-if="tarefa.meuDia">
            <button :disabled="busy" class="btn btn-clear iconBig mr-10" @click="removerMeuDiaTarefa()">
              <i class="fi fi-br-parking"></i> Retirar Prioridade
            </button>
            <button :disabled="true" class="btn btn-clear iconBig ml-10" @click="recolocarMeuDiaTarefa()">
              <i class="fi fi-br-parking"></i> Reaplicar Prioridade - pend
            </button>
          </div>
        </div>

        <br><br>

        <section class="flex-justify-space-between">
          <div>
            <button :disabled="busy" class="btn btn-clear iconBig mr-10" @click="fecharModal()">
              <i class="fi fi-br-left" ></i> Fechar
            </button>
            <button :disabled="busy" class="btn btn-clear iconBig ml-10" @click="editarTarefa()">
              <i class="fi fi-br-disk"></i> Salvar
            </button>
          </div>
          <div v-if="tarefaLocal.situacao == 0">
            <button :disabled="busy" class="btn btn-clear iconBig" @click="concluirTarefa()">
              <i class="fi fi-br-checkbox"></i> Concluir
            </button>
          </div>
        </section>

        <InlineLoader :busy="busy"></InlineLoader>

      </div>
    </div>
    <Notifier ref="notifier"></Notifier>
  </div>
</Teleport>
</template>

<script>
import DateTime from '@/core/DateTime.js'
import deepCopy from '@/core/deepcopy.js';
import InlineLoader from '@/components/InlineLoader.vue';
import Notifier from '@/components/Notifier.vue';
import Request from '@/core/request.js'
import config from '@/core/config.js'

export default {
  components: {
    InlineLoader,
    Notifier
  },
  data: function () {
    return {
      tarefaLocal: [],
      busy: false,
      needReload: false,
      configuracoes: [],
      exibeProjetoSemana: false
    }
  },
  emits: ['reloadListaProjetosHabitTracker','update:exibirModal','updateTaskEvent'],
  props: {
    exibirModal: Boolean,
    tarefa: Object,
    projeto: Object
  },
  methods: {
    /** 
     * FUNCOES HELPER IMPORTADAS
    */
    formatDevDate(dateObject){return DateTime.formatDevDate(dateObject);},
    formatBrDate(dateObject){return DateTime.formatBrDate(dateObject);},
    getWeekDay(dateObject){return DateTime.getWeekDay(dateObject);},
    
    /**
     * CONTROLES DE TELA
     */
    resetFields(needReload = false){
      this.needReload = needReload;
    },

    fecharModal() {
      this.$emit('update:exibirModal', this.exibirModalLocal)
      console.log('this.needReload',this.needReload);
      if(this.needReload == true) {
        console.log('reload');
        this.$emit('reloadListaProjetosHabitTracker', []);
        this.$emit('updateTaskEvent', this.tarefaLocal)
        this.resetFields();
      }
    },

    /**
     * APIS FETCH
     */
    editarTarefa() {
      this.busy = true;
      let body = {
        'descricao': this.tarefaLocal.descricao,
        'motivo': this.tarefaLocal.motivo,
        'hora': this.tarefaLocal.hora,
      };
      let requestData = {
        'url': config.serverUrl + '/tarefas/' + this.tarefa.id,
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'PUT',
        'data' : body
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.$refs.notifier.notify('Tarefa editada!')
        this.busy = false;
        this.resetFields(true);
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
      });
    },

    adicionarAoMeuDiaTarefa() {
      this.busy = true;
      let requestData = {
        'url': config.serverUrl + '/tarefas/' + this.tarefa.id + '/meu-dia',
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'POST',
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.$refs.notifier.notify('Tarefa adicionada ao Meu Dia')
        this.busy = false;
        this.resetFields(true);
        this.tarefaLocal.meuDia = data.meuDia
        this.tarefaLocal.meuDiaObj = data.meuDiaObj
        this.tarefa.meuDia = data.meuDia
        this.tarefa.meuDiaObj = data.meuDiaObj
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
      });
    },
    removerMeuDiaTarefa() {
      this.busy = true;
      let requestData = {
        'url': config.serverUrl + '/tarefas/' + this.tarefa.id + '/remover-meu-dia',
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'POST',
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.$refs.notifier.notify('Tarefa adicionada ao Meu Dia')
        this.busy = false;
        this.resetFields(true);
        this.tarefaLocal.meuDia = data.meuDia
        this.tarefaLocal.meuDiaObj = data.meuDiaObj
        this.tarefa.meuDia = data.meuDia
        this.tarefa.meuDiaObj = data.meuDiaObj
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
      });
    },

    concluirTarefa() {
      this.busy = true;
      let requestData = {
        'url': config.serverUrl + '/tarefas/' + this.tarefa.id + '/concluir',
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'POST',
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.$refs.notifier.notify('Tarefa alterada para "concluída!"')
        this.busy = false;
        this.resetFields(true);
        this.tarefaLocal.situacao = 1
        this.tarefa.situacao = 1
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
      });
    },

    falheiTarefa(){
      this.busy = true;
      let requestData = {
        'url': config.serverUrl + '/tarefas/' + this.tarefa.id + '/falhar',
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'POST',
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.$refs.notifier.notify('Tarefa alterada para "falhou"')
        this.busy = false;
        this.resetFields(true);
        this.tarefaLocal.situacao = 2
        this.tarefa.situacao = 2
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
      });
    },
    
    /**
     * CONFIGURACOES
     */
    //  buscaConfiguracoes () {
    //   this.busy = true;
    //   let requestData = {
    //     'url': config.serverUrl + '/configuracoes'
    //   };
    //   Request.fetch(requestData)
    //   .then(([response, data]) => {
    //     let configuracoes = this.organizaESeparaConfiguracoes(data)
    //     this.configuracoes = configuracoes;
    //     this.busy = false;
    //   })
    //   .catch((error) => {
    //     this.busy = false;
    //     this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
    //     console.error(error);
    //   });
    // },
    // organizaESeparaConfiguracoes(lista){
    //   let novaLista = [];
    //   for (let i = 0; i < lista.length; i++){
    //     let conf = lista[i];
    //     //verificar se a conf existe na lista permitida
    //     //colocar em lista separada por nome
    //     novaLista[conf.chave] = conf;
    //   }
    //   this.exibeProjetoSemana = novaLista['exibir_projeto_semana_habit_tracker'].valor == '1' ? true : false
    //   return novaLista
    // },

  },
  watch: {
    exibirModal(newProp, oldProp) {
      // this.exibirModalLocal = newProp;
    },
    tarefa(newProp, oldProp) {
      this.tarefaLocal = deepCopy.deepCopy(newProp);
    }
  },
  created () {
    // this.buscaConfiguracoes();
  },
}
</script>

