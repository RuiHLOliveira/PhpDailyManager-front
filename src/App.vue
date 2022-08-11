<template>
  <div id="app">

    <nav class="shadow-1">
      <router-link class="btn" to="/">Login</router-link>
      <router-link class="btn" to="/register">Register</router-link>
      <router-link class="btn" to="/listaDias">Lista Dias</router-link>
      <button @click="exportData()">Export Data</button>
      <button @click="openImportDataModal()">Import Data</button>
    </nav>

    <router-view
      @redirectAfterLogin="redirectAfterLogin()"
    />

    <ImportData v-model:exibirModalImport="exibirModalImport" />
    <Loader :busy="busy"></Loader>
    <!-- <NoticeBox></NoticeBox> -->
  </div>
</template>

<style>
@import url('@/assets/main.css');
</style>

<script>
// import NoticeBox from '@/components/NoticeBox.vue';
import Loader from '@/components/Loader.vue';
import ImportData from "@/views/ImportData.vue";
import Request from '@/core/request.js';
import config from '@/core/config.js'

export default {
  name: "App",
  components: {
    ImportData,
    // NoticeBox,
    Loader
  },
  data: function () {
    return {
      busy: false,
      exibirModalImport: false,
    }
  },
  methods: {
    redirectAfterLogin(){
      this.$router.push({ path: '/listaDias' })
    },
    openImportDataModal() {
      this.exibirModalImport = true;
    },
    exportData() {
      this.busy = true;

      let requestData = {
        'url': config.serverUrl + "/backup/export",
        'headers': new Headers({'Content-Type': 'application/json'}),
      };

      Request.fetch(requestData).then(([response, data]) => {
        console.log('[LOG]',response);
        console.log('[LOG]',data);
        
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        let date = new Date();
        date = date.toISOString().substr(0, 19);
        date = date.replaceAll( ':','.');
        console.log('date',date);
        link.download = date + '.phpdailymanager.export.json'
        link.click()
        URL.revokeObjectURL(link.href)

        this.busy = false;
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        alert(error);
        // notify.notify(error, "error");
      });

    },
  }
};
</script>
