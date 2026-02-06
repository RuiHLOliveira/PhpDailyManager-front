
<style>
.modalRecompensaContainer {
  /* position: absolute; */
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #0000008f;
  display: flex;
  justify-content: center;
  align-items: top;
  z-index: 99;
}

.modalRecompensa {
  border: 2px solid #00000070;
  border-radius: 3px;

  background-color: #333333;

  width: 300px;
  height: 300px;

  margin-top: 40px;
  padding: 20px 20px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: top;

  z-index: 99;
}

@media only screen and (min-width: 800px) {
  .modalRecompensa {
    margin-top: 15vh;
  }
}

.boxMoedaRecompensa {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
}
.boxMoedaRecompensa img.moedaRecompensa{
  max-width: 48px;
}

</style>

<template>
  <div>
    <div v-if="display || debugShow" class="fix" :class="{ modalRecompensaContainer : modalMode == true }">
      <div class="shadow-3 modalRecompensa">
        
        <div class="flex justify-center">Recompensa!</div>
        <div class="flex justify-center" v-if="subiuNivelTexto != null">{{ subiuNivelTexto }}</div>

        <div class="flex justify-spacearound">
          <div v-for="recompensa in recompensas">
            <span class="boxMoedaRecompensa">
              {{recompensa.quantidade}}
              <img class="moedaRecompensa" v-if="recompensa.moeda == 'ouro'" src="/fc131.png" alt="">
              <img class="moedaRecompensa" v-if="recompensa.moeda == 'experiencia'" src="/fc865.png" alt="">
            </span>
          </div>
        </div>
        
        <div class="flex justify-end">
          <button type="button" class="btn btn-sm" @click="close()">close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      debugShow: false,
      modalMode: true,
      debugMessage: 'Mensagem de debugging',
      listaMensagens: [],
      subiuNivelTexto: null,
      display: false,
    }
  },
  // emits: ['update:display'],
  props: {
    // display: Boolean,
    // message: String
  },
  methods:{
    show(requestData){
      let dados = JSON.parse(requestData.historico.dadosjson);
      let recompensas = dados.recompensas
      this.subiuNivelTexto = requestData.historicoSubiuNivel?.texto ?? null;
      let msgs = [];
      this.recompensas = recompensas;
      recompensas.forEach(recompensa => {
        let icone = '';
        if(recompensa.moeda == 'ouro') icone = 'fc131.png'
        if(recompensa.moeda == 'experiencia') icone = 'fc865.png'
        let msg = `<span class="boxMoedaRecompensa">
          ${recompensa.quantidade}
          <img class="moedaRecompensa" src="/${icone}" alt="">
        </span>`;
        msgs.push(msg);
      });
      this.listaMensagens = msgs
      this.display = true
    },
    close(){
      this.display = false
      this.listaMensagens = []
      this.subiuNivelTexto = null
    },
  },
  expose: ['show'],
  watch: {
  },
}
</script>

