<style scoped>
.modalAdditionalTag {
    font-size: 0.8rem;
    background-color: rgb(109, 109, 109);
    color: white;
    border-radius: 5px;
}
.modalInboxItem {
  border-radius: 5px;
  background-color: #bbbbbb77;
}
a.link{
  color: #116dc8;
}
a.link:visited {
  color: #116dc8;
}
</style>

<template>
  <div v-if="exibirModal">
    <div class="modalBackground">
      <div class="modal">

        <section>
          <h1>InboxItem - Dados</h1>

          <div class="modalInboxItem p-10">
            <div class="mt-5">
              <span>{{ inboxItemLocal.nome }}</span>
            </div>
            
            <div class="mt-5">
              <span v-html="inboxItemLocal.linkTag"></span>
            </div>
            
            <div class="mt-5 mb-5">
              <span class=" m-5 p-5 modalAdditionalTag">{{ inboxItemLocal.origemDescritivo }}</span>
              <span class=" m-5 p-5 modalAdditionalTag">{{  getCategoriaDescricao(inboxItemLocal.categoria) }}</span>
            </div>
          </div>

          <div>
            <h1>Edição</h1>

            <label for="nome">nome:</label>
            <input :disabled="busy" name="nome" type="text" placeholder="nome" v-model="inboxItemLocal.nome">

            <label for="link">link:</label>
            <input :disabled="busy" name="link" type="text" placeholder="link" v-model="inboxItemLocal.link">

            <label for="categoria">categoria:</label>
            
            <select v-model="inboxItemLocal.categoria" name="categoria" id="situacao">
              <option v-for="listaCategoria in listaCategorias" :key="listaCategoria.id" :value="listaCategoria.id">{{ listaCategoria.categoria }}</option>
            </select>

            <!-- <input disabled="true" name="categoria" type="text" placeholder="categoria" v-model="inboxItemLocal.categoria"> -->

            <label for="acao">acao:</label>
            <input :disabled="busy" name="acao" type="text" placeholder="acao" v-model="inboxItemLocal.acao">
          </div>
        </section>
          
        <section class="flex-justify-space-between">
          <div>
            <button :disabled="busy" class="btn btn-wider btn-red" @click="fecharModal()">Fechar</button>
            <button :disabled="busy" class="btn btn-wider" @click="editarInboxItem()">Salvar</button>
          </div>
        </section>
        
        <InlineLoader :busy="busy"></InlineLoader>

      </div>
    </div>
    <Notifier ref="notifier"></Notifier>
  </div>
</template>

<script>
import DateTime from '@/core/DateTime.js'
import deepCopy from '@/core/deepcopy.js';
import InlineLoader from '@/components/InlineLoader.vue';
import Notifier from '@/components/Notifier.vue';
import Request from '@/core/request.js'
import config from '@/core/config.js'

export default {
  components: {
    InlineLoader,
    Notifier
  },
  data: function () {
    return {
      inboxItemLocal: [],
      busy: false,
      needReload: false,
      configuracoes: [],
      listaCategorias: [],
      listaOrigens: [],
    }
  },
  emits: ['reloadListaInboxItem','update:exibirModal'],
  props: {
    exibirModal: Boolean,
    inboxItem: Object,
  },
  methods: {
    /** 
     * FUNCOES HELPER IMPORTADAS
    */
    formatDevDate(dateObject){return DateTime.formatDevDate(dateObject);},
    formatBrDate(dateObject){return DateTime.formatBrDate(dateObject);},
    getWeekDay(dateObject){return DateTime.getWeekDay(dateObject);},
    
    /**
     * CONTROLES DE TELA
     */
    resetFields(needReload = false){
      this.needReload = needReload;
    },

    fecharModal() {
      this.$emit('update:exibirModal', this.exibirModalLocal)
      console.log('this.needReload',this.needReload);
      if(this.needReload == true) {
        console.log('reload');
        this.$emit('reloadListaInboxItem', []);
        this.resetFields();
      }
    },

    getCategoriaDescricao(categoria) {
      let desc = '';
      this.listaCategorias.forEach(cat => {
        if(cat.id == categoria) desc = cat.categoria
      })
      return desc;
    },

    getOrigemDescricao(origem) {
      let desc = '';
      this.listaOrigens.forEach(or => {
        if(or.id == origem) desc = or.origem
      })
      return desc;
    },
    /**
     * APIS FETCH
     */
    editarInboxItem() {
      this.busy = true;
      let body = {
        'nome': this.inboxItemLocal.nome,
        'link': this.inboxItemLocal.link,
        'categoria': this.inboxItemLocal.categoria,
        'acao': this.inboxItemLocal.acao,
      };
      let requestData = {
        'url': config.serverUrl + '/inboxItems/' + this.inboxItem.id,
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'PUT',
        'data' : body
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.$refs.notifier.notify('InboxItem editada!')
        this.busy = false;
        this.resetFields(true);
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
      });
    },

    loadListaCategorias(){
      this.listaCategorias = [
        { id: 0, categoria: '-'},
        { id: 1, categoria: 'Desenvolvimento Pessoal'},
        { id: 2, categoria: 'Exercício'},
        { id: 3, categoria: 'Finanças'},
        { id: 4, categoria: 'Receitas'},
        { id: 5, categoria: 'Mkt Instagram'},
      ];
    },
    
    loadListaOrigens(){
      this.listaOrigens = [
        { id: 0, origem: '-'},
        { id: 1, origem: 'Youtube'},
        { id: 2, origem: 'Instagram'},
      ];
    },

  },
  watch: {
    exibirModal(newProp, oldProp) {
      // this.exibirModalLocal = newProp;
    },
    inboxItem(newProp, oldProp) {
      this.inboxItemLocal = deepCopy.deepCopy(newProp);
    }
  },
  created () {
    this.loadListaCategorias();
    this.loadListaOrigens();
    // this.buscaConfiguracoes();
  },
}
</script>

