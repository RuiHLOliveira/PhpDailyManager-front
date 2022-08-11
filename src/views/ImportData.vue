<style>
</style>

<template>
  <div v-if="exibirModalImport">
    <div class="modalBackground">
      <div class="modal">
        <div class="flex-column alignitens-start pv5 ph10">
          <div>
            <div class="pageTitle">Import Backup</div>
          </div>
          <div>
              Import File
              <input type="file" name="importfile" id="importfile" ref="importfile">
          </div>
          <!-- <div>
              <input class="form-input" type="text" v-model="contaLocal.nome">
          </div> -->
          <div class="flex">
            <button class="btn form-input" @click="fecharModal()">Fechar</button>
            <button class="btn form-input" @click="importFile()">Salvar</button>
          </div>
        </div>
      </div>
    </div>
    <Loader :busy="busy"></Loader>
  </div>
</template>

<script>
import deepCopy from '@/core/deepcopy.js';
import Loader from '@/components/Loader.vue';
import Request from '@/core/request.js';
import AuthManager from '@/core/AuthManager.js';
import config from '@/core/config.js'

export default {
  name: "ImportData",
  components: {
    Loader
  },
  data () {
    return {
      // exibirModal: false,
      busy: false,
      fileToImport: null,
      editadoComSucesso: false,
    };
  },
  props: {
    exibirModalImport: Boolean,
  },
  methods: {
    fecharModal() {
      this.exibirModal = false;
      this.$emit('update:exibirModalImport', this.exibirModal)
      if(this.editadoComSucesso == true) {
        // EventBus.$emit('LISTACONTAS_INDEX', {});
      }
    },
    async importFile() {
      this.busy = true;
      
      let file = this.$refs.importfile.files[0];
      let fileJson = await file.text();

      console.log('[fileJson]', fileJson);

      let headers = new Headers();
      headers.append("Authorization", AuthManager.getToken());
      headers.append('Accept','application/json');

      let requestData = {
        'url': config.serverUrl + "/backup/import",
        'headers': headers,
        'method' : 'POST',
        'data' : fileJson,
      };

      Request.fetch(requestData).then(([response,data]) => {
        console.log('[response]',response);
        console.log('[data]',data);
        this.busy = false;
        this.editadoComSucesso = true;
        this.fecharModal();
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        alert(error);
      });

      // fetch(config.serverUrl + "/backup/import", {
      //   headers: headers,
      //   method: 'POST',
      //   body: dataForm,
      // }).then(async (response) => {
      //   console.log('response',response);
      //   let responseText = await response.text();
      //   console.log('responseText',responseText);
      //   let responseData = JSON.parse(responseText);
      //   console.log('responseData',responseData);
      //   this.busy = false;
      //   this.editadoComSucesso = true;
      // }).catch(error => {
      //   console.error(error);
      //   this.busy = false;
      //   alert(error);
      // })

    },
  },
  watch: {
    // exibirModalImport(newProp, oldProp) {
    //   this.exibirModal = newProp;
    // },
  }
}
</script>
