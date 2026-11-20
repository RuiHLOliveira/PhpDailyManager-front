import Request from '@/core/request.js'
import config from '@/core/config.js'
import QueryStringConverter from '@/core/QueryStringConverter.js';
import { reactive } from 'vue';

export const PerguntasStorage = reactive({
    
    perguntas: [],
    forceNextReload: false,

    // funcionalidades de storage
    index(){
        return new Promise((resolve, reject) => {
            console.log('[Perguntas Storage] this.forceNextReload',this.forceNextReload)
            if(this.perguntas.length > 0 && !this.forceNextReload) {
                resolve([null,this.perguntas]);
            } else {
                console.log('loadFromApi')
                this.loadFromApi(resolve, reject);
            }
        });
    },

    loadFromApi(resolve, reject) {
        this.apiLoad().then(([response,data]) => {
            this.perguntas = data
            this.forceNextReload = false;
            resolve([response,data]);
        }).catch((error) => {
            reject(error)
        });
    },

    // funcionalidades de api
    apiLoad() {
        let params = {'orderBy': 'horizonte,asc', 'properties' : 'projeto'};
        params = QueryStringConverter.toQueryString(params, true);
        let requestData = {
            'url': `${config.serverUrl}/perguntas${params}`,
        };
        return Request.fetch(requestData)
    },

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

    // apiCriar(pergunta) {
    //     const url = `${config.serverUrl}/perguntas`
    //     const headers = new Headers({'Content-Type': 'application/json'})
    //     const body = {
    //         'nome': pergunta.nome,
    //         'anotacoes': tarefa.anotacoes,
    //         'respostas': tarefa.respostas,
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
