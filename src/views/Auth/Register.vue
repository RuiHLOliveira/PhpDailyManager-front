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
        <h1>Register</h1>

        <label for="invitationToken">Palavra Passe:</label>
        <input name="invitationToken" type="text" placeholder="invitationToken" v-model="invitationToken">

        <label for="email">Email:</label>
        <input name="email" type="email" placeholder="email" v-model="email">

        <label for="password">Senha:</label>
        <input name="password" type="password" placeholder="senha" v-model="password">

        <label for="repeatPassword">Repita a senha:</label>
        <input name="repeatPassword" type="password" placeholder="repeatPassword" v-model="repeatPassword">

        <button @click="register()">Criar conta</button>
      </section>
    </div>

    <Loader :busy="busy"></Loader>
    <Notifier ref="notifier"></Notifier>
  </div>
</template>

<script>
import AuthManager from '@/core/AuthManager.js';
import config from '@/core/config.js'
import Request from '@/core/request.js'
import Loader from '@/components/Loader.vue';
import Notifier from '@/components/Notifier.vue';

export default {
  name: 'Register',
  components: {
    Loader,
    Notifier
  },
  data: () => {
    return {
      busy: false,
      email: '',
      password: '',
      invitationToken: '',
      repeatPassword: '',
    }
  },
  methods: {
    // notify(message, type = 'success'){
    //     this.showNotify = true;
    //     this.notifyMessage = message;
    // },
    register () {
      this.busy = true;
      let url = config.serverUrl + '/auth/register';
      let body = {
        'email': this.email,
        'password': this.password,
        'invitationToken': this.invitationToken,
        'repeatPassword': this.repeatPassword
      };
      let data = {
        method: 'POST',
        body: JSON.stringify(body),
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
        this.$refs.notifier.notify('Registrado! Faça o login.') //this.notify('Registrado! Faça o login.');
        this.busy = false;
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
  created () {
  },
  destroyed() {
  }
}
</script>
