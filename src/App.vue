<template>
  <div id="app">
    <div v-if="appLoaded">
      <nav class="shadow-1" v-if="loggedIn">
        <!-- <router-link v-if="!loggedIn" class="btn mx-5 my-5" to="/">Login</router-link> -->
        <!-- <router-link v-if="!loggedIn" class="btn mx-5 my-5" to="/register">Register</router-link> -->
        <router-link v-if="loggedIn" class="btn mx-5 my-5" to="/projetos">Projetos</router-link>
        <router-link v-if="loggedIn" class="btn mx-5 my-5" to="/tarefas">Tarefas</router-link>
        <router-link v-if="loggedIn" class="btn mx-5 my-5" to="/habitTracker">Habit Tracker</router-link>
        <router-link v-if="loggedIn" class="btn mx-5 my-5" to="/backup">Backup</router-link>
        <router-link v-if="loggedIn" class="btn mx-5 my-5" to="/invitations">Convites</router-link>
        <router-link v-if="loggedIn" class="btn mx-5 my-5" to="/configuracoes">Configurações</router-link>
        <button class="btn mx-5 my-5" v-if="loggedIn" @click="logout()">Logout</button>
      </nav>

      <router-view
        @redirectAfterLogin="redirectAfterLogin()"
      />
    </div>
    <Loader :busy="busy"></Loader>
    <Notifier ref="notifier"></Notifier>
  </div>
</template>

<style>
@import url('@/assets/main.css');
</style>

<script>
import AuthManager from '@/core/AuthManager.js';
import Request from '@/core/request.js';
import config from '@/core/config.js'
import Loader from '@/components/Loader.vue';
import Notifier from '@/components/Notifier.vue';
import { computed } from 'vue'

export default {
  name: "App",
  components: {
    Loader,
    Notifier,
  },
  provide() {
    return {
      configuracoes: computed(() => this.configuracoes)
    }
  },
  data: function () {
    return {
      busy: false,
      loggedIn: AuthManager.isLoggedIn(),
      configuracoesArray: [],
      configuracoes: {},
      appLoaded: false
    }
  },
  methods: {
    updateLoggedIn(){
      this.loggedIn = AuthManager.isLoggedIn();
    },
    
    redirectAfterLogin(){
      this.updateLoggedIn()
      this.$router.push({ path: '/habitTracker' })
    },

    logout() {
      AuthManager.logout();
      this.$refs.notifier.notify('Sessão encerrada.')
      this.updateLoggedIn()
      console.log('redirecting');
      this.$router.push({ path: '/' })
    },

    async buscaConfiguracoes () {
      console.log('[LOG] Carregando configuracoes');
      let requestData = {
        'url': config.serverUrl + '/configuracoes'
      };
      await Request.fetch(requestData)
      .then(( [response, data]) => {
        let configuracoes = this.organizaESeparaConfiguracoes(data)
        this.configuracoes = configuracoes;
        console.log('[LOG] Configuracoes carregadas', this.configuracoes);
      })
      .catch((error) => {
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

    async loadConfiguracoesSeLogado(){
      if(this.loggedIn){
        await this.buscaConfiguracoes();
      }
    },

    async loadApp(){
      this.busy = true
      this.appLoaded = true
      this.busy = false
    }

  },
  watch: {
    loggedIn (a, b){
      this.loadConfiguracoesSeLogado();
    }
  },
  beforeCreate(){
  },
  async created () {
    this.loadApp();
  },
};
</script>
