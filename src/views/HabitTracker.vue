<style>
</style>

<template>
  <div>
    <div class="container">

      <h1>Habit Tracker</h1>

      <section class="flex-lateral-button">
        <button class="btn btn-sm" type="button" @click="toggleModalCriarDia()">Criar dia +</button>
      </section>

      <section v-if="dias != []">
        <div v-for="dia in dias" :key="dia.id">
          <button class='diaBox' type="button" @click="toggleShowAtividades(dia)">
            <span v-if="exibeDiaSemana">{{ getWeekDay(dia.dataCompletaObject) }}, </span>
            {{ formatBrDate(dia.dataCompletaObject) }}
          </button>
          <div v-if="dia.showAtividades">
            <button class="btn" type="button" @click="toggleModalCriarAtividade(dia)">+</button>
            <button class="btn" :class="{ btn_atividade_concluida: atividade.situacao == 1, btn_atividade_falhou: atividade.situacao == 2}" type="button" v-for="atividade in dia.atividades" :key="atividade.id"
              @click="toggleModalEditarAtividade(atividade,dia)" >
              [{{ atividade.hora }}] {{ atividade.descricao }}
            </button>
          </div>

        </div>
      </section>
    </div>

    <Notifier ref="notifier"></Notifier>
    <Loader :busy="busy"></Loader>

    <ModalCriarDia
      v-model:exibirModal="exibirModalCriarDia"
      @reloadListaDiasHabitTracker="buscaDias()">
    </ModalCriarDia>

    <ModalCriarAtividade
      v-model:exibirModal="exibirModalCriarAtividade"
      :dia="diaModalNovaAtividade"
      @reloadListaDiasHabitTracker="buscaDias()">
    </ModalCriarAtividade>
    
    <ModalEditarAtividade
      v-model:exibirModal="exibirModalEditarAtividade"
      :atividade="atividadeModalEditarAtividade"
      :dia="diaModalEditarAtividade"
      @reloadListaDiasHabitTracker="buscaDias()">
    </ModalEditarAtividade>
  </div>
</template>

<script>
import DateTime from '@/core/DateTime.js'
import Request from '@/core/request.js';
import config from '@/core/config.js'
import QueryStringConverter from '@/core/QueryStringConverter.js'
import Loader from '@/components/Loader.vue';
import Notifier from '@/components/Notifier.vue';
import ModalCriarDia from '@/views/ModalCriarDia.vue';
import ModalCriarAtividade from '@/views/ModalCriarAtividade.vue';
import ModalEditarAtividade from '@/views/ModalEditarAtividade.vue';

export default {
  name: 'HabitTracker',
  components: {
    Loader,
    ModalCriarDia,
    ModalCriarAtividade,
    ModalEditarAtividade,
    Notifier
  },
  inject: ['configuracoes'],
  data: () => {
    return {
      busy: false,
      dataCompleta: '',
      dias: [],
      exibirModalCriarDia: false,
      exibirModalCriarAtividade: false,
      exibirModalEditarAtividade: false,
      diaModalNovaAtividade: [],
      atividadeModalEditarAtividade: [],
      diaModalEditarAtividade: [],
      exibeDiaSemana: false
    }
  },
  methods: {
    
    /** 
     * FUNCOES HELPER IMPORTADAS
    */
    formatDevDate(dateObject){return DateTime.formatDevDate(dateObject);},
    formatBrDate(dateObject){return DateTime.formatBrDate(dateObject);},
    getWeekDay(dateObject){return DateTime.getWeekDay(dateObject);},

    /**
     * FUNCOES TOGGLE
     */
    toggleShowAtividades(dia) {
      dia.showAtividades = !dia.showAtividades
      if(dia.atividades == null) this.loadAtividades(dia)
    },

    toggleModalCriarDia () {
      this.exibirModalCriarDia = true;
    },

    toggleModalCriarAtividade (dia) {
      this.diaModalNovaAtividade = dia
      this.exibirModalCriarAtividade = true;
    },

    toggleModalEditarAtividade (atividade, dia) {
      this.atividadeModalEditarAtividade = atividade
      this.exibirModalEditarAtividade = true;
      this.diaModalEditarAtividade = dia
    },

    /**
     * FUNCOES FETCH API
     */
    buscaDias () {
      this.busy = true;
      const params = {'orderBy': 'dataCompleta,desc'};
      let requestData = {
        'url': config.serverUrl + '/dias'+QueryStringConverter.toQueryString(params, true),
      };
      Request.fetch(requestData)
      .then(([response, data]) => {
        console.log({data});
        for (let i = 0; i < data.length; i++) {
          data[i].dataCompletaObject = new Date(data[i].dataCompleta)
        }
        this.dias = data
        this.busy = false;
      })
      .catch((error) => {
        this.busy = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
        console.error(error);
      });
    },

    loadAtividades(dia){
      this.busy = true;
      const params = {'orderBy': 'hora,asc', 'dia': dia.id};
      let requestData = {
        'url': config.serverUrl + '/atividades'+QueryStringConverter.toQueryString(params, true),
      };
      Request.fetch(requestData)
      .then(([response, data]) => {
        console.log({data});
        dia.atividades = data
        this.busy = false;
      })
      .catch((error) => {
        this.busy = false;
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true)
        console.error(error);
      });

    },
      
    setExibeDiaSemana(){
      console.log('CONFIG INJECT', this.configuracoes);
      if(this.configuracoes == []){
        console.log('CONFIG vazia');
        this.exibeDiaSemana = false
      } else if(!this.configuracoes.hasOwnProperty('exibir_dia_semana_habit_tracker')) {
        console.log('CONFIG sem a chave');
        this.exibeDiaSemana = false;
      } else if (this.configuracoes.exibir_dia_semana_habit_tracker.valor == '1'){
        console.log('CONFIG true');
        this.exibeDiaSemana = true
      } else {
        console.log('CONFIG false');
        this.exibeDiaSemana = false
      }
    },
  },
  watch: {
    configuracoes(a, b) {
      this.setExibeDiaSemana()
    }
  },
  created () {
    this.setExibeDiaSemana()
    this.buscaDias();
  },
}
</script>
