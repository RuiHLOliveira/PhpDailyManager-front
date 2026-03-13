import Request from '@/core/request.js'
import config from '@/core/config.js'
import QueryStringConverter from '@/core/QueryStringConverter.js';
import { reactive } from 'vue';

export const TarefasStorage = reactive({
    
    tarefas: [],
    forceNextReload: false,

    // funcionalidades de storage
    index(){
        return new Promise((resolve, reject) => {
            console.log('this.forceNextReload',this.forceNextReload)
            if(this.tarefas.length > 0 && !this.forceNextReload) {
                resolve([null,this.tarefas]);
            } else {
                console.log('loadFromApi')
                this.loadFromApi(resolve, reject);
            }
        });
    },

    // concluir(tarefa, textoObservacao) {
    //     return new Promise((resolve, reject) => {
    //         this.apiConcluir(tarefa, textoObservacao)
    //         .then(([response,data]) => {
    //             this.forceNextReload = true;
    //             // nao faz pois é melhor fazer por reload
    //             // this.substituir(tarefa); // substituir o tarefa antigo pelo novo
    //             resolve([response,data]);
    //         }).catch((error) => {
    //             reject(error)
    //         });
    //     });
    // },

    // criar(tarefa) {
    //     return new Promise((resolve, reject) => {
    //         this.apiCriar(tarefa)
    //         .then(([response,data]) => {
    //             this.forceNextReload = true;
    //             resolve([response,data]);
    //         }).catch((error) => {
    //             reject(error)
    //         });
    //     });
    // },
    
    registraAvaliacao(tarefa) {
        return new Promise((resolve, reject) => {
            this.apiRegistraAvaliacao(tarefa)
            .then(([response,data]) => {
                this.forceNextReload = true;
                resolve([response,data]);
            }).catch((error) => {
                reject(error)
            });
        });
    },

    // substituir(tarefa) {
    //     if(this.tarefas == null || this.tarefas.length == 0) return;
    //     const index = this.tarefas.findIndex(e => e.id === tarefa.id);
    //     this.tarefas[index] = tarefa;
    // },

    loadFromApi(resolve, reject) {
        this.apiLoad().then(([response,data]) => {
            this.tarefas = data
            this.forceNextReload = false;
            resolve([response,data]);
        }).catch((error) => {
            reject(error)
        });
    },

    // funcionalidades de api
    apiLoad() {
        let params = {'orderBy': 'projeto,asc', 'properties' : 'projeto'};
        params = QueryStringConverter.toQueryString(params, true);
        let requestData = {
            'url': `${config.serverUrl}/tarefas${params}`,
        };
        return Request.fetch(requestData)
    },

    // apiConcluir(tarefa, textoObservacao) {
    //     const url = `${config.serverUrl}/tarefas/${tarefa.id}/concluir`
    //     const headers = new Headers({'Content-Type': 'application/json'})
    //     const body = {'textoObservacao': textoObservacao}
    //     let requestData = {
    //         'url': url,
    //         'headers': headers,
    //         'method' : 'POST',
    //         'data' : body
    //     };
    //     return Request.fetch(requestData);
    // },

    // apiEditar(tarefa) {
    //     const url = `${config.serverUrl}/tarefas/${tarefa.id}`
    //     const headers = new Headers({'Content-Type': 'application/json'})
    //     const body = {
    //         'descricao': tarefa.descricao,
    //         'motivo': tarefa.motivo,
    //         'hora': tarefa.hora,
    //     };
    //     let requestData = {
    //         'url': url,
    //         'headers': headers,
    //         'method' : 'PUT',
    //         'data' : body
    //     };
    //     return Request.fetch(requestData);
    // },

    apiRegistraAvaliacao(tarefa) {
        const url = `${config.serverUrl}/tarefas/${tarefa.id}/registra-avaliacao`
        const headers = new Headers({'Content-Type': 'application/json'})
        const body = {
            'avaliacaoJson': tarefa.avaliacaoJson,
        };
        let requestData = {
            'url': url,
            'headers': headers,
            'method' : 'POST',
            'data' : body
        };
        return Request.fetch(requestData);
    },

    // apiCriar(tarefa) {
    //     const url = `${config.serverUrl}/tarefas`
    //     const headers = new Headers({'Content-Type': 'application/json'})
    //     const body = {
    //         'descricao': tarefa.descricao,
    //         'motivo': tarefa.motivo,
    //         'hora': tarefa.hora,
    //     };
    //     let requestData = {
    //         'url': url,
    //         'headers': headers,
    //         'method' : 'POST',
    //         'data' : body
    //     };
    //     return Request.fetch(requestData);
    // }

});
