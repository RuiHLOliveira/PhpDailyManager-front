<style>
section {
  max-width: 700px;
  margin: 0 auto;
}
</style>

<template>
  <div>
    <div class="container">

      <section>
        <h1>Login</h1>
        <label for="email">Email:</label>
        <input name="email" type="email" placeholder="email" v-model="email">

        <label for="password">Senha:</label>
        <input name="password" type="password" placeholder="senha" v-model="password">

        <button @click="login()">Entrar</button>
      </section>
    </div>
    
    <Loader :busy="busy"></Loader>
    <Notifier ref="notifier"></Notifier>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
import AuthManager from '@/core/AuthManager.js';
import config from '@/core/config.js'
import Request from '@/core/Request.js'
import Notifier from '@/components/Notifier.vue'

export default {
  name: 'Login',
  components: {
    Loader,
    Notifier
  },
  data: () => {
    return {
      busy: false,
      email: '',
      password: '',
    }
  },
  emits: ['redirectAfterLogin'],
  methods: {
    // notify(message, type = 'success'){
    //     this.showNotify = true;
    //     this.notifyMessage = message;
    // },
    login () {
      this.busy = true;
      let url = config.serverUrl + '/auth/login';
      let body = {
        'email': this.email,
        'password': this.password
      };
      let requestData = {
        'url': url,
        method: 'POST',
        data: body,
        notAuthenticated: true
      };
      Request.fetch(requestData)
      .then(([response, data]) => {
        console.log('data',data);
        this.$refs.notifier.notify('Logado! Redirecionando...')
        AuthManager.storeToken(data.token);
        AuthManager.storeRefreshToken(data.refreshToken);
        this.busy = false;
        this.$emit('redirectAfterLogin', [])
      })
      .catch((error) => {
        console.error(error);
        this.busy = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true) // this.notify('Ocorreu um erro: ' + error);
      });
    },
  },
  watch: {
  },
  mounted () {
    if(AuthManager.isLoggedIn()) {
      this.$emit('redirectAfterLogin', [])
    }
  },
  destroyed() {
  }
}
</script>
