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
        <label for="email">Email:</label>
        <input name="email" type="email" placeholder="email" v-model="email">

        <label for="password">Senha:</label>
        <input name="password" type="password" placeholder="senha" v-model="password">

        <button @click="login()">Criar conta</button>
      </section>
    </div>

    <Loader :busy="busy"></Loader>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
import config from '@/core/config.js'

export default {
  name: 'ListaDias',
  components: {
    Loader,
  },
  data: () => {
    return {
      busy: false,
      email: '',
      password: '',
    }
  },
  methods: {
    login () {
      this.busy = true;
      let url = config.serverUrl + '/auth/register';
      let body = {
        'email': this.email,
        'password': this.password
      };
      let data = {
        method: 'POST',
        body: JSON.stringify(body)
      };
      fetch(url,data)
      .then(async response => {
        data = await response.json();
        console.log('[LOG]',response);
        console.log('[LOG]',data);
        this.dias = data
        this.busy = false;
        // notify.notify('carregado!', "success");
      }).catch(error => {
        console.log('[LOG]',error);
        this.busy = false;
      });
    },
  },
  watch: {
  },
  created () {
  },
  destroyed() {
  }
}
</script>
