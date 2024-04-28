<style>
</style>

<template>
  <div v-if="exibirModal">
    <div class="modalBackground">
      <div class="modal">

        <section>
          <h1>Editar Tarefa</h1>
          <h3>
            {{ projeto.nome }}
          <span>Tarefa {{ tarefa.situacaoDescritivo }}</span>
          </h3>

          <label for="tarefa">Tarefa:</label>
          <input name="tarefa" type="text" placeholder="tarefa" v-model="tarefaLocal.descricao">
          
          <label for="hora">Hora:</label>
          <input name="hora" type="time" placeholder="hora" v-model="tarefaLocal.hora">

        </section>
          
        <section class="flex-justify-space-between">
          <div>
            <button class="btn-wider btn-red" @click="fecharModal()">Fechar</button>
            <button class="btn-wider" @click="editarTarefa()">Salvar</button>
          </div>
          <div v-if="tarefaLocal.situacao == 0">
            <button class="btn-wider btn-red" @click="falheiTarefa()">Falhar</button>
            <button class="btn-wider" @click="concluirTarefa()">Concluir</button>
          </div>
        </section>

      </div>
    </div>
    <Loader :busy="busy"></Loader>
    <Notifier ref="notifier"></Notifier>
  </div>
</template>

<script>
import DateTime from '@/core/DateTime.js'
import deepCopy from '@/core/deepcopy.js';
import Loader from '@/components/Loader.vue';
import Notifier from '@/components/Notifier.vue';
import Request from '@/core/request.js'
import config from '@/core/config.js'

export default {
  components: {
    Loader,
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
  emits: ['reloadListaProjetosHabitTracker','update:exibirModal'],
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

    concluirTarefa() {
      this.busy = true;
      let requestData = {
        'url': config.serverUrl + '/tarefas/' + this.tarefa.id + '/concluir',
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'POST',
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.$refs.notifier.notify('Tarefa alterada para "concluída!""')
        this.busy = false;
        this.resetFields(true);
        this.tarefaLocal.situacao = 1
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

