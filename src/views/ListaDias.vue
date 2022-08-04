<style>
</style>

<template>
  <div>
    <div class="container">

      <h1>Dias</h1>

      <section>
        <h2>Criar Dia</h2>
        <label for="dataCompleta">Data:</label>
        <input name="dataCompleta" type="date" placeholder="nome" v-model="dataCompleta">
        <button @click="criarDia()">Criar dia</button>
      </section>
    
      <section>
        <h2>Lista de Dias</h2>

        <div v-for="dia in dias" :key="dia.id">
          <span>{{ dia.dataCompleta }}</span>
          <div v-for="hora in dia.horas" :key="hora.id">
            {{ hora.hora }}
            <button type="button" @click="toggleModalCriarAtividade(hora)">+</button>
            <button type="button" v-for="atividade in hora.atividades" :key="atividade.id"
              @click="toggleModalEditarAtividade(atividade)" >
              {{ atividade.descricao }}
            </button>
          </div>
          <!-- <span class="mv5">
            <router-link v-bind:to="'/listaMovimentos/'+dia.id" class="btn btn-sm"><i class="fas fa-arrow-right"></i> Acessar</router-link>
            <button @click="ativarModalEdicao(dia.id)" class="btn btn-sm ml5"><i class="fas fa-edit"></i> Editar</button>
            <button @click="ativarModalExcluirDia(dia.id)" class="btn btn-sm ml5"><i class="fas fa-trash"></i> Excluir</button>
          </span> -->
        </div>
      </section>
    </div>

    <Loader :busy="busy"></Loader>

    <ModalCriarAtividade
      v-model:exibirModal="exibirModalCriarAtividade"
      :hora="horaModalNovaAtividade">
    </ModalCriarAtividade>
    
    <ModalEditarAtividade
      v-model:exibirModal="exibirModalEditarAtividade"
      :atividade="atividadeModalEditarAtividade"
      @update:atividade="buscaDias()">
    </ModalEditarAtividade>
    <!-- <ModalEditarConta :exibirModalEdicao.sync="exibirModalEdicao" :conta="contaEditar"></ModalEditarConta> -->
    <!-- <ModalExcluirConta :exibirModalExcluirConta.sync="exibirModalExcluirConta" :conta="contaExcluir"></ModalExcluirConta> -->
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
import ModalCriarAtividade from '@/views/ModalCriarAtividade.vue';
import ModalEditarAtividade from '@/views/ModalEditarAtividade.vue';
// import ModalEditarConta from '@/views/ModalEditarConta.vue';
// import ModalExcluirConta from '@/views/ModalExcluirConta.vue';

export default {
  name: 'ListaDias',
  components: {
    Loader,
    ModalCriarAtividade,
    ModalEditarAtividade,
    // ModalEditarConta,
    // ModalExcluirConta
  },
  data: () => {
    return {
      busy: false,
      dataCompleta: '',
      dias: [],
      exibirModalCriarAtividade: false,
      exibirModalEditarAtividade: false,
      horaModalNovaAtividade: [],
      atividadeModalEditarAtividade: [],
      // noticeboxQueue: [],
      // exibirModalEdicao: false,
      // exibirModalExcluirConta: false,
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
    toggleModalCriarAtividade (hora) {
      this.horaModalNovaAtividade = hora
      this.exibirModalCriarAtividade = true;
    },
    toggleModalEditarAtividade (atividade) {
      this.atividadeModalEditarAtividade = atividade
      this.exibirModalEditarAtividade = true;
    },
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
        this.dias = data
        this.busy = false;
        // notify.notify('carregado!', "success");
      })
    },
    criarDia() {
      this.busy = true;
      let url = 'http://localhost:8000/dias';
      let body = {
        'dataCompleta': this.dataCompleta
      };
      let data = {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
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
        // notify.notify('criado!', "success");
        this.buscaDias();
      })
      .catch(error => {
        console.log('[LOG]',error);
        this.busy = false;
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
