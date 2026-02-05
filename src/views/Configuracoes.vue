<style>
.criarRecompensa{
  margin: 0 auto;
  max-width: 500px;
  margin-bottom: 20px;
  border-radius: 5px;
  padding: 20px;
  border: 2px solid  var(--darkGray);
}
.recompensa{
  margin: 0 auto;
  max-width: 500px;
  padding: 20px;
  background-color: var(--darkGray);
  border-radius: 5px;
  margin-bottom: 20px;
}
</style>

<template>
  <div>
    <div class="container">

      <h1>Configuracoes</h1>

      <section class="flex-lateral-button">
        <button class="btn btn-sm" type="button" @click="criarConfiguracaoPadrao()">Criar configuração padrão</button>
      </section>

      <section class="mt-20">
        <button class="btn" @click="toggleDarkMode()">
          toggleDarkMode
        </button>
        <br>
        {{ darkmode ? 'ligado' : 'desligado'}} - 
        {{ darkmode }}
      </section>

      <section v-if="configuracoes['exibir_dia_semana_habit_tracker']">
        <label for="conf"> {{ configuracoes['exibir_dia_semana_habit_tracker'].chave }} {{ configuracoes['exibir_dia_semana_habit_tracker'].valor }}</label>
        <input type="text" v-model="configuracoes['exibir_dia_semana_habit_tracker'].valor">
        <button type="button" @click="atualizarConfiguracao(configuracoes['exibir_dia_semana_habit_tracker'])">Salvar</button>
      </section>
    </div>

    <hr>

    <div v-if="!busy">

      <div class="criarRecompensa">
        <div>Criar Recompensa</div>
        <div>
          <input type="text" v-model="nomeNovaRecompensa" id="" :disabled="busy">
          <button type="button" class="btn btn-sm" @click="criarNovaRecompensa()" :disabled="busy">Criar</button>
        </div>
      </div>
      
      <div v-for="recompensa in recompensas">
        <div class="recompensa">
          {{ recompensa.nome }}
          <button type="button" class="btn btn-sm" @click="toggleCriarAcao(recompensa)">Criar +</button>
          <div class="flex-column" style="gap: 10px;" v-if="recompensa.criarNovaAcao">
            <hr>
            Criar recompensa ação quantidade, tipoatividade, idRecompensa<br>
            Ao completar:
            <input type="text" v-model="tipoatividadeNovaAcao" id="" :disabled="busy">
            Premia com:
            <input type="text" v-model="quantidadeNovaAcao" id="" :disabled="busy">
            <div>
              <button type="button" class="btn btn-sm" @click="criarNovaRecompensaacao(recompensa)" :disabled="busy">Criar</button>
            </div>
          </div>
          <div class="mt-10">
            <div v-for="acao in recompensa.recompensaacoes">
              Concluir {{ acao.tipoatividade }} => recebe {{ recompensa.nome }} x{{ acao.quantidade }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <Notifier ref="notifier"></Notifier>
    <Loader :busy="busy"></Loader>

  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
import Notifier from '@/components/Notifier.vue';
import Request from '@/core/request.js';
import config from '@/core/config.js'
import QueryStringConverter from '@/core/QueryStringConverter.js'
import {RecompensasStorage} from '@/core/storage/RecompensasStorage.js'
import {RecompensasacoesStorage} from '@/core/storage/RecompensasacoesStorage.js'

export default {
  name: 'HabitTracker',
  components: {
    Loader,
    Notifier
  },
  data: () => {
    return {
      busy: false,
      dataCompleta: '',
      configuracoes: [],
      exibirCriarConfiguracao: false,
      formChave: '',
      formValor: '',
      darkmode: false,
      recompensas: [],
      recompensasacoes: [],
      nomeNovaRecompensa: '',
      tipoatividadeNovaAcao: '',
      quantidadeNovaAcao: 0,
    }
  },
  methods: {

    toggleCriarAcao(recompensa){
      recompensa.criarNovaAcao = !recompensa.criarNovaAcao;
    },

    criarNovaRecompensa()
    {
      if(this.nomeNovaRecompensa == '') return;
      this.busy = true;
      RecompensasStorage.criar(this.nomeNovaRecompensa)
      .then((data) => {
        this.$refs.notifier.notify('Recompensa criada!')
        this.busy = false;
        this.nomeNovaRecompensa = '';
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
      });
    },

    criarNovaRecompensaacao(recompensa){
      if(this.tipoatividadeNovaAcao == ''
        || this.quantidadeNovaAcao == 0
      ) return;
      this.busy = true;
      RecompensasacoesStorage.criar(this.quantidadeNovaAcao, this.tipoatividadeNovaAcao, recompensa.id)
      .then((data) => {
        this.$refs.notifier.notify('Recompensa acao criada!')
        this.busy = false;
        this.tipoatividadeNovaAcao = '';
        this.quantidadeNovaAcao = 0;
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
      });
    },

    buscaRecompensasEAcoes () {
      this.busy = true;
      RecompensasStorage.index().then((data) => {
        this.recompensas = data[1]
        this.recompensas.forEach((recompensa) => {recompensa.criarNovaAcao = false});
        console.log('[recompensas] ', this.recompensas)
        this.busy = false;
      })
      .catch((error) => {
        this.busy = false;
        console.error(error);
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
      });
    },


    toggleCriarConfiguracao(){
      this.exibirCriarConfiguracao = !this.exibirCriarConfiguracao
    },
    resetFields(){
        this.formChave = '';
        this.formValor = '';
    },
    loadDarkmode(){
      this.darkmode = window.localStorage.getItem('darkmode') ?? false;
    },
    toggleDarkMode(){
      let darkmode = window.localStorage.getItem('darkmode');
      darkmode = darkmode == 'false' ? false : true;
      window.localStorage.setItem('darkmode', !darkmode)
      this.loadDarkmode()
    },
    criarConfiguracaoPadrao(){
      this.busy = true;
      let requestData = {
        'url': config.serverUrl + '/configuracoes/criarPadrao',
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'POST',
        'data' : {}
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.busy = false;
        this.$refs.notifier.notify('Configuracao padrão criada!')
        this.buscaConfiguracoes();
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
      });
    },
    atualizarConfiguracao(configuracao) {
      this.busy = true;
      let body = {
        'chave': configuracao.chave,
        'valor': configuracao.valor,
      };
      let requestData = {
        'url': config.serverUrl + '/configuracoes/' + configuracao.id,
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'PUT',
        'data' : body
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.busy = false;
        this.$refs.notifier.notify('Configuracao salva!')
        this.buscaConfiguracoes();
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
      });
    },
    buscaConfiguracoes () {
      this.busy = true;
      let requestData = {
        'url': config.serverUrl + '/configuracoes'
      };
      Request.fetch(requestData)
      .then(([response, data]) => {
        let configuracoes = this.organizaESeparaConfiguracoes(data)
        this.configuracoes = configuracoes;
        this.busy = false;
      })
      .catch((error) => {
        this.busy = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
        console.error(error);
      });
    },
    organizaESeparaConfiguracoes(lista){
      let novaLista = [];
      for (let i = 0; i < lista.length; i++){
        let conf = lista[i];
        //verificar se a conf existe na lista permitida
        //colocar em lista separada por nome
        novaLista[conf.chave] = conf;
      }
      return novaLista
    },
  },
  watch: {
  },
  created () {
    this.buscaConfiguracoes();
    this.loadDarkmode();
    this.buscaRecompensasEAcoes();
  },
}
</script>
