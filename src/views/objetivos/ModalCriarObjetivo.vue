<style>
</style>

<template>
<Teleport to="body">
  <div v-if="exibirModal">
    <div class="modalBackground">
      <div class="modal">
        <h1>Criar novo Objetivo</h1>

        <label for="nome">nome:</label>
        <input name="nome" type="text" placeholder="nome"
          :disabled="busy" v-model="nome">
        
        <label for="nome">horizonte:</label>
        <select class="mb-10 fullSelect" name="horizonte" id="horizonte"
          :disabled="busy" v-model="horizonte">
          <option value="2">Horizonte 2: Trimestral</option>
          <option value="3">Horizonte 3: Anual</option>
          <option value="4">Horizonte 4: 5 Anos</option>
          <option value="5">Horizonte 5: Vida</option>
        </select>

        <label for="nome">areaEscolhida:</label>
        <select class="mb-10 fullSelect" name="areaEscolhida" id="areaEscolhida"
          :disabled="busy" v-model="areaEscolhida">
          <option v-for="area in areas" :value="area.id">{{ area.nome }}</option>
        </select>

        <label for="anotacoes">Anotações:</label>
        <br>
        <textarea class="textarea textareaHeight150" rows="4" cols="80" name="anotacoes" placeholder="anotacoes"
          :disabled="busy" v-model="anotacoes"></textarea>
        <br>
        <br>


        <div v-for="pergunta in perguntas">
          {{pergunta.id}} - {{ pergunta.pergunta }}
          <input name="nome" type="text" placeholder="nome"
          v-model="respostas[pergunta.id].resposta" :disabled="busy">
        </div>

        <!-- 'id' => $this->getId(),
        'nome' => $this->getNome(),
        'anotacoes' => $this->getAnotacoes(),
        'repostas' => $this->getRespostas(),
        'horizonte' => $this->getHorizonte(),
        'fotos' => $this->getFotos(),
        'situacao' => $this->getSituacao(),
        'objetivopai' => $this->getObjetivopai(),
        'createdAt' => $this->getCreatedAt(),
        'updatedAt' => $this->getUpdatedAt(),
        'deletedAt' => $this->getDeletedAt(), -->

        <button @click="fecharModal()">Fechar</button>
        <button @click="criarObjetivo()">Criar Objetivo</button>
      </div>
    </div>
    <Loader :busy="busy"></Loader>
    <Notifier ref="notifier"></Notifier>
  </div>
</Teleport>
</template>

<script>
import deepCopy from '@/core/deepcopy.js';
import Loader from '@/components/Loader.vue';
import Request from '@/core/request.js';
import config from '@/core/config.js'
import Notifier from '@/components/Notifier.vue';
import { PerguntasStorage } from '@/core/storage/PerguntasStorage.js'
import { ObjetivosStorage } from '@/core/storage/ObjetivosStorage.js'
import { AreasStorage } from '@/core/storage/AreasStorage.js'

export default {
  components: {
    Loader,
    Notifier
  },
  data: function () {
    return {
      nome: '',
      anotacoes: '',
      horizonte: '',
      areaEscolhida: '',
      busy: false,
      needReload: false,
      // showNotify: false,
      // notifyMessage: '',
      perguntas: [],
      respostas: [],
      areas: [],
    }
  },
  emits: ['reloadListaObjetivos'],
  props: {
    exibirModal: Boolean,
  },
  methods: {
    resetFields(needReload = false){
        this.needReload = needReload;
        this.busy = false;
        this.perguntas.forEach(pergunta => {
          this.respostas[pergunta.id] = {'resposta': ''};
        });
        this.nome = '';
        this.horizonte = '';
        this.areaEscolhida = '';
        this.anotacoes = '';
    },

    fecharModal() {
      this.$emit('update:exibirModal', false)
      if(this.needReload == true) {
        console.log('reload');
        this.$emit('reloadListaObjetivos', [])
      }
      this.resetFields();
    },

    criarObjetivo() {
      this.busy = true;
      let body = {
        'nome': this.nome,
        'anotacoes': this.anotacoes,
        'horizonte': this.horizonte,
        'area': this.areaEscolhida,
        'respostas': JSON.stringify(this.respostas),
        // 'fotos': JSON.stringify(fotos),
      };
      let requestData = {
        'url': config.serverUrl + '/objetivos',
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'POST',
        'data' : body
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.busy = false;
        this.resetFields(true)
        this.$refs.notifier.notify('Objetivo criado!')
        ObjetivosStorage.forceNextReload = true;
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
      });
    },

    loadPerguntas () {
      this.busy = true;
      PerguntasStorage.index()
      .then(([response, data]) => {
        console.log(response);
        console.log(data);
        data.forEach(pergunta => {
          this.respostas[pergunta.id] = {'resposta': ''};
        });
        this.perguntas = data;
        this.busy = false;
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
      });
    },

    loadAreas () {
      AreasStorage.index()
      .then(([response, data]) => {
        console.log(response);
        console.log(data);
        this.areas = data;
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
      });
    }
  },
  watch: {
    exibirModal(newProp, oldProp) {
      // this.exibirModalLocal = newProp;
      this.loadAreas();
      this.loadPerguntas();
    },
  }
}
</script>

