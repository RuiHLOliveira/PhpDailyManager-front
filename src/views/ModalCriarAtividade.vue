<style>
</style>

<template>
  <div v-if="exibirModal">
    <div class="modalBackground">
      <div class="modal">
        <div>Nova Atividade</div>
        <input type="text" v-model="atividade.descricao">
        <button class="btn form-input" @click="fecharModal()">Fechar</button>
        <button class="btn form-input" @click="criarAtividade()">Salvar</button>
      </div>
    </div>
    <Loader :busy="busy"></Loader>
  </div>
</template>

<script>
// import EventBus from '@/core/EventBus.js';
import deepCopy from '@/core/deepcopy.js';
import Loader from '@/components/Loader.vue';

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
      editadoComSucesso: false
    }
  },
  props: {
    exibirModal: Boolean,
    hora: Object
  },
  methods: {
    fecharModal() {
      // this.exibirModalLocal = false;
      this.$emit('update:exibirModal', this.exibirModalLocal)
      if(this.editadoComSucesso == true) {
        // EventBus.$emit('LISTACONTAS_INDEX', {});
      }
    },
    criarAtividade() {
      this.busy = true;
      let url = 'http://localhost:8000/atividades';
      let body = {
        'descricao': this.atividade.descricao,
        'hora': this.hora.id
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
        if(!response.ok){
          this.busy = false;
          // notify.notify(data.message, "error");
          return;
        }
        this.busy = false;
        // notify.notify('Editado!', "success");
        this.editadoComSucesso = true;
      })
      .catch(error => {
        console.log('[LOG]',error);
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

