<style>
</style>

<template>
  <div>
    <div class="container">

      <h1>Backup</h1>
      
      <section>
        <button @click="exportData()">Export Data</button>
        <button @click="openImportDataModal()">Import Data</button>
      </section>
    </div>

    <ImportData v-model:exibirModalImport="exibirModalImport" />

    <Notifier ref="notifier"></Notifier>
    <Loader :busy="busy"></Loader>

  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
import Notifier from '@/components/Notifier.vue';
import Request from '@/core/request.js';
import config from '@/core/config.js'
import ImportData from "@/views/ImportData.vue";

export default {
  name: 'Backup',
  components: {
    Loader,
    Notifier,
    ImportData,
  },
  data: () => {
    return {
      busy: false,
      exibirModalImport: false,
    }
  },
  methods: {
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
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        let date = new Date();
        date = date.toISOString().substr(0, 19);
        date = date.replaceAll( ':','.');
        link.download = date + '.phpdailymanager.export.json'
        link.click()
        URL.revokeObjectURL(link.href)
        this.busy = false;
      }).catch((error) => {
        this.busy = false;
        console.error(error);
        this.$refs.notifier.notify('Ocorreu um erro: ' + error, true) //this.notify(error);
      });
    },
  },
  watch: {
  },
  created () {
  },
}
</script>
