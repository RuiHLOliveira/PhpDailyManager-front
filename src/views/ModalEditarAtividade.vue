<style>
</style>

<template>
  <div v-if="exibirModal">
    <div class="modalBackground">
      <div class="modal">
        <h1>Editar Atividade</h1>
        <label for="atividade">Atividade:</label>
        <input name="atividade" type="text" placeholder="atividade" v-model="atividadeLocal.descricao">
        <button @click="fecharModal()">Fechar</button>
        <button @click="editarAtividade()">Salvar</button>
      </div>
    </div>
    <Loader :busy="busy"></Loader>
  </div>
</template>

<script>
import deepCopy from '@/core/deepcopy.js';
import Loader from '@/components/Loader.vue';
import Request from '@/core/request.js'
import config from '@/core/config.js'

export default {
  components: {
    Loader
  },
  data: function () {
    return {
      atividadeLocal: [],
      busy: false,
      needReload: false
    }
  },
  emits: ['reloadListaDias','update:exibirModal'],
  props: {
    exibirModal: Boolean,
    atividade: Object
  },
  methods: {
    fecharModal() {
      this.$emit('update:exibirModal', this.exibirModalLocal)
      // this.$emit('update:atividade', this.atividadeLocal)
      if(this.needReload == true) {
        console.log('reload');
        this.$emit('reloadListaDias', [])
      }
    },
    editarAtividade() {
      this.busy = true;
      let body = {
        'descricao': this.atividadeLocal.descricao,
      };
      let requestData = {
        'url': config.serverUrl + '/atividades/' + this.atividade.id, //config.serverUrl + `/api/${this.localNote.notebook.id}/notes`;
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'PUT',
        'data' : body
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.busy = false;
        this.needReload = true;
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
    atividade(newProp, oldProp) {
      this.atividadeLocal = deepCopy.deepCopy(newProp);
    }
  }
}
</script>

