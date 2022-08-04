<style>
</style>

<template>
  <div v-if="exibirModal">
    <div class="modalBackground">
      <div class="modal">
        <div>Editar Atividade</div>
        <input type="text" v-model="atividadeLocal.descricao">
        <button class="btn form-input" @click="fecharModal()">Fechar</button>
        <button class="btn form-input" @click="editarAtividade()">Salvar</button>
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
      atividadeLocal: [],
      busy: false,
      editadoComSucesso: false
    }
  },
  props: {
    exibirModal: Boolean,
    atividade: Object
  },
  methods: {
    fecharModal() {
      // this.exibirModalLocal = false;
      // this.$emit('update:exibirModal', this.exibirModalLocal)
      this.$emit('update:exibirModal', this.exibirModalLocal)//$event.target.value)
      this.$emit('update:atividade', this.atividadeLocal)//$event.target.value)
      // if(this.editadoComSucesso == true) {
        // EventBus.$emit('LISTACONTAS_INDEX', {});
      // }
    },
    editarAtividade() {
      this.busy = true;
      let url = 'http://localhost:8000/atividades/' + this.atividade.id;
      let body = {
        'descricao': this.atividadeLocal.descricao,
        // 'hora': this.hora.id
      };
      let data = {
        method: 'PUT',
        body: JSON.stringify(body)
      };
      fetch(url,data).then(async response => {
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
    atividade(newProp, oldProp) {
      this.atividadeLocal = deepCopy.deepCopy(newProp);
    }
  }
}
</script>

