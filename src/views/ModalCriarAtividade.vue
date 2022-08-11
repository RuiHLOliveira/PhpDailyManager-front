<style>
</style>

<template>
  <div v-if="exibirModal">
    <div class="modalBackground">
      <div class="modal">
        <h1>Nova Atividade</h1>
        <label for="atividade">Atividade:</label>
        <input name="atividade" type="text" placeholder="atividade" v-model="atividade.descricao">
        <button @click="fecharModal()">Fechar</button>
        <button @click="criarAtividade()">Salvar</button>
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
      // exibirModalLocal: false,
      // horaLocal: {},
      atividade: {},
      busy: false,
      needReload: false
    }
  },
  emits: ['reloadListaDias'],
  props: {
    exibirModal: Boolean,
    hora: Object
  },
  methods: {
    fecharModal() {
      this.$emit('update:exibirModal', this.exibirModalLocal)
      if(this.needReload == true) {
        console.log('reload');
        this.$emit('reloadListaDias', [])
      }
    },
    criarAtividade() {
      this.busy = true;
      let body = {
        'descricao': this.atividade.descricao,
        'hora': this.hora.id
      };

      let requestData = {
        'url': config.serverUrl + '/atividades', //config.serverUrl + `/api/${this.localNote.notebook.id}/notes`;
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'POST',
        'data' : body
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.busy = false;
        this.needReload = true;
        alert('Atividade criada!');
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
    hora(newProp, oldProp) {
      // this.horaLocal = deepCopy.deepCopy(newProp);
    }
  }
}
</script>

