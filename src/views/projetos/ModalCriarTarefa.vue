<style>
</style>

<template>
  <div v-if="exibirModal">
    <div class="modalBackground">
      <div class="modal">
        <h1>Nova Tarefa</h1>
        <h3>
          {{ projeto.nome }}
          , às x:x horas
        </h3>

        <label for="tarefa">Tarefa:</label>
        <input name="tarefa" :disabled="busy" type="text" placeholder="tarefa" v-model="tarefa.descricao">
        
        <label for="hora">Hora:</label>
        <input name="hora" :disabled="busy" type="time" placeholder="hora" v-model="hora">

        <button :disabled="busy" class="btn btn-wider btn-red" @click="fecharModal()">Fechar</button>
        <button :disabled="busy" class="btn btn-wider" @click="criarTarefa()">Salvar</button>
        
        <InlineLoader :busy="busy"></InlineLoader>
      </div>
    </div>
    <Notifier ref="notifier"></Notifier>
  </div>
</template>

<script>
import DateTime from '@/core/DateTime.js'
import InlineLoader from '@/components/InlineLoader.vue';
import Notifier from '@/components/Notifier.vue';
import Request from '@/core/request.js';
import config from '@/core/config.js'

export default {
  components: {
    InlineLoader,
    Notifier
  },
  data: function () {
    return {
      tarefa: {},
      busy: false,
      needReload: false,
      hora: '',
      configuracoes: [],
      exibeProjetoSemana: false
    }
  },
  emits: ['reloadListaProjetosHabitTracker'],
  props: {
    exibirModal: Boolean,
    projeto: Object,
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
      this.tarefa = {};
    },
    
    fecharModal() {
      this.$emit('update:exibirModal', this.exibirModalLocal)
      if(this.needReload == true) {
        console.log('reload');
        this.$emit('reloadListaProjetosHabitTracker', [])
        this.resetFields();
      }
    },

    /**
     * APIS FETCH
     */
    criarTarefa() {
      this.busy = true;
      let body = {
        'descricao': this.tarefa.descricao,
        'projeto': this.projeto.id,
        'hora': this.hora
      };

      let requestData = {
        'url': config.serverUrl + '/tarefas', //config.serverUrl + `/api/${this.localNote.notebook.id}/notes`;
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'POST',
        'data' : body
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.$refs.notifier.notify('Tarefa criada!') //this.notify('Tarefa criada!');
        this.busy = false;
        this.needReload = true;
        this.resetFields(true);
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true) //this.notify('Ocorreu um erro.' + error);
      });
    },
    
    /**
     * CONFIGURACOES
     */
    // buscaConfiguracoes () {
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
    hora(newProp, oldProp) {
      // this.horaLocal = deepCopy.deepCopy(newProp);
    }
  },
  created () {
    // this.buscaConfiguracoes();
  },
}
</script>

