<style>
</style>

<template>
  <div v-if="exibirModal">
    <div class="modalBackground">
      <div class="modal">
        <h1>Criar novo dia</h1>
        <label for="dataCompleta">Data:</label>
        <input name="dataCompleta" type="date" placeholder="nome" v-model="dataCompleta">
        <button @click="fecharModal()">Fechar</button>
        <button @click="criarDia()">Criar dia</button>
      </div>
    </div>
    <Loader :busy="busy"></Loader>
  </div>
</template>

<script>
import deepCopy from '@/core/deepcopy.js';
import Loader from '@/components/Loader.vue';
import Request from '@/core/request.js';
import config from '@/core/config.js'

export default {
  components: {
    Loader
  },
  data: function () {
    return {
      dataCompleta: {},
      busy: false,
      needReload: false
    }
  },
  emits: ['reloadListaDias'],
  props: {
    exibirModal: Boolean,
  },
  methods: {
    resetFields(needReload = false){
        this.needReload = needReload;
        this.busy = false;
        this.dataCompleta = {};
    },
    fecharModal() {
      this.$emit('update:exibirModal', false)
      if(this.needReload == true) {
        console.log('reload');
        this.$emit('reloadListaDias', [])
      }
      this.resetFields();
    },
    criarDia() {
      this.busy = true;
      let body = {
        'dataCompleta': this.dataCompleta,
      };

      let requestData = {
        'url': config.serverUrl + '/dias',
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'POST',
        'data' : body
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.busy = false;
        this.resetFields(true)
        alert('Dia criado!');
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        alert(error);
        // notify.notify(error, "error");
      });
    },
  },
  watch: {
    exibirModal(newProp, oldProp) {
      // this.exibirModalLocal = newProp;
    },
  }
}
</script>

