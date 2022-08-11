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
          <button type="button" @click="toggleShowHoras(dia)">{{ dia.dataCompleta }}</button>
          <div v-if="dia.showHoras">
            <div v-for="hora in dia.horas" :key="hora.id">
              {{ hora.hora }}
              <button class="btn-sm" type="button" @click="toggleModalCriarAtividade(hora)">+</button>
              <button class="btn-sm" type="button" v-for="atividade in hora.atividades" :key="atividade.id"
                @click="toggleModalEditarAtividade(atividade)" >
                {{ atividade.descricao }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <Loader :busy="busy"></Loader>

    <ModalCriarAtividade
      v-model:exibirModal="exibirModalCriarAtividade"
      :hora="horaModalNovaAtividade"
      @reloadListaDias="buscaDias()">
    </ModalCriarAtividade>
    
    <ModalEditarAtividade
      v-model:exibirModal="exibirModalEditarAtividade"
      :atividade="atividadeModalEditarAtividade"
      @reloadListaDias="buscaDias()"><!-- @update:atividade="buscaDias()" -->
    </ModalEditarAtividade>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
import ModalCriarAtividade from '@/views/ModalCriarAtividade.vue';
import ModalEditarAtividade from '@/views/ModalEditarAtividade.vue';
import Request from '@/core/request.js';
import config from '@/core/config.js'
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
    toggleShowHoras(dia) {
      dia.showHoras = !dia.showHoras
    },
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
      let requestData = {
        'url': config.serverUrl + '/dias', //config.serverUrl + `/api/${this.localNote.notebook.id}/notes`;
      };

      Request.fetch(requestData)
      .then(([response, data]) => {
        this.dias = data
        this.busy = false;
      })
      .catch((error) => {
        console.error(error);
        this.busy = false;
        alert(error);
        // notify.notify(error, "error");
      });
    },

    criarDia() {
      this.busy = true;
      let body = {
        'dataCompleta': this.dataCompleta
      };
      let requestData = {
        'url': config.serverUrl + '/dias', //config.serverUrl + `/api/${this.localNote.notebook.id}/notes`;
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'post',
        'data' : body
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.busy = false;
        this.buscaDias();
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        alert(error);
        // notify.notify(error, "error");
      });
    },
    // excluirConta(idConta){
    //   this.busy = true;
    //   let url = config.serverUrl + '/contas/' + idConta;
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
