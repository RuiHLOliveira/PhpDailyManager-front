<style>
</style>

<template>
  <div>
    <div class="page">

      <div class="box">
        <div class="pageTitle">Dias</div>
      </div>

      <div class="whitebox mt5">
        <div class="pageSubtitle">Criar Dia</div>
        <input name="nome" class="form-input"
          type="text" placeholder="nome" 
          v-model="novaNotaNome">
        <button class="btn" @click="criarDia()">Criar dia</button>
      </div>
    
      <div class="box mt10">
        <div class="pageSubtitle">Lista de Dias</div>
      </div>

      <div v-for="dia in dias" :key="dia.id" class="whitebox mt10 flex-column justify-spacebetween"><!-- flex justify-spacebetween alignitens-center">-->
        <span class="mv5">
          {{ dia.dataCompleta }}
        </span>
        <span class="mv5">
          <router-link v-bind:to="'/listaMovimentos/'+dia.id" class="btn btn-sm"><i class="fas fa-arrow-right"></i> Acessar</router-link>
        <!-- </span>
        <span class="mv5"> -->
          <button @click="ativarModalEdicao(dia.id)" class="btn btn-sm ml5"><i class="fas fa-edit"></i> Editar</button>
        <!-- </span>
        <span class="mv5"> -->
          <button @click="ativarModalExcluirDia(dia.id)" class="btn btn-sm ml5"><i class="fas fa-trash"></i> Excluir</button>
        </span>
      </div>
    </div>

    <Loader :busy="busy"></Loader>

    <!-- <ModalEditarConta :exibirModalEdicao.sync="exibirModalEdicao" :conta="contaEditar"></ModalEditarConta>
    <ModalExcluirConta :exibirModalExcluirConta.sync="exibirModalExcluirConta" :conta="contaExcluir"></ModalExcluirConta> -->
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
// import ModalEditarConta from '@/views/ModalEditarConta.vue';
// import ModalExcluirConta from '@/views/ModalExcluirConta.vue';

export default {
  name: 'ListaDias',
  components: {
    Loader,
    // ModalEditarConta,
    // ModalExcluirConta
  },
  data: () => {
    return {
      busy: false,
      novaNotaNome: '',
      dias: [],
      // noticeboxQueue: [],
      exibirModalEdicao: false,
      exibirModalExcluirConta: false,
      // contaEditar: {},
      // contaExcluir: {}
    }
  },
  methods: {
    // ativarModalExcluirConta (contaId) {
    //   let contaEncontrada = this.contas.filter((conta) => {
    //     return conta.id == contaId;
    //   });
    //   contaEncontrada = contaEncontrada[0]
    //   this.contaExcluir = contaEncontrada
    //   this.exibirModalExcluirConta = true;
    // },
    // ativarModalEdicao (contaId) {
    //   let contaEncontrada = this.contas.filter((conta) => {
    //     return conta.id == contaId;
    //   });
    //   contaEncontrada = contaEncontrada[0]
    //   this.contaEditar = contaEncontrada
    //   this.exibirModalEdicao = true;
    // },
    buscaDias () {
      this.busy = true;
      let url = 'http://localhost:8000/dias';
      let data = {
        method: 'get'
      };
      fetch(url,data)
      .then(async response => {
        data = await response.json();
        console.log('[LOG]',response);
        console.log('[LOG]',data);
        this.dias = data.dias
        this.busy = false;
        // notify.notify('carregado!', "success");
      })
    },
    criarDia() {
      this.busy = true;
      let url = 'http://localhost:8000/dias';
      let body = {
        'nome': this.novaNotaNome
      };
      let data = {
        method: 'post',
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
        // notify.notify('criado!', "success");
        this.buscaDias();
      })
      .catch(error => {
        console.log('[LOG]',error);
      });
    },
    // excluirConta(idConta){
    //   this.busy = true;
    //   let url = 'http://localhost:8000/contas/' + idConta;
    //   let data = {
    //     method: 'delete',
    //   };
    //   fetch(url,data)
    //   .then(async response => {
    //     data = await response.json();
    //     console.log('[LOG]',response);
    //     console.log('[LOG]',data);
    //     if(!response.ok){
    //       this.busy = false;
    //       notify.notify(data.message, "error");
    //       return;
    //     }
    //     this.busy = false;
    //     notify.notify('deletado!', "success");
    //     this.buscaContas();
    //   })
    //   .catch(error => {
    //     console.log('[LOG]',error);
    //   });
    // },
  },
  watch: {
  },
  created () {
    this.buscaDias();
    // EventBus.$on('LISTACONTAS_INDEX', (data) => {
    //   this.buscaContas();
    // });
  },
  destroyed() {
    // EventBus.$off('LISTACONTAS_INDEX');
  }
}
</script>
