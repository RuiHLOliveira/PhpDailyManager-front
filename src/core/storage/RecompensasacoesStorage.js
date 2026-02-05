import Request from '@/core/request.js'
import config from '@/core/config.js'
import QueryStringConverter from '@/core/QueryStringConverter.js';
import { reactive } from 'vue';

export const RecompensasacoesStorage = reactive({
    
    recompensasacoes: [],
    forceNextReload: [],

    debugReloadParams(name, idRecompensa){
        console.log(`[${name}] recompensasacoes`,this.recompensasacoes)
        if(this.recompensasacoes[idRecompensa]){
            console.log(`[recompensaacao] recompensasacoes idRecompensa`,this.recompensasacoes[idRecompensa])
        }
        console.log(`[recompensaacao] forceNextReload`, this.forceNextReload)
        if(this.forceNextReload[idRecompensa]){
            console.log(`[recompensaacao] forceNextReload idRecompensa`, this.forceNextReload[idRecompensa])
        }
    },

    // funcionalidades de storage
    index(idRecompensa){
        return new Promise((resolve, reject) => {
            const name = 'recompensasacoes';
            this.debugReloadParams(name, idRecompensa);
            if(this.recompensasacoes[idRecompensa] != undefined && this.recompensasacoes[idRecompensa].length > 0 && !this.forceNextReload[idRecompensa]) {
                console.log(`[${name}] loadFromCache`)
                resolve([null,this.recompensasacoes[idRecompensa]]);
            } else {
                console.log(`[${name}] loadFromApi`)
                this.loadFromApi(idRecompensa, resolve, reject);
            }
        });
    },

    criar(quantidade, tipoatividade, idRecompensa) {
        return new Promise((resolve, reject) => {
            this.apiCriar(quantidade, tipoatividade, idRecompensa)
            .then(([response,data]) => {
                this.forceNextReload[idRecompensa] = true;
                resolve([response,data]);
            }).catch((error) => {
                reject(error)
            });
        });
    },
    
    editar(idRecompensaacao, quantidade, tipoatividade, idRecompensa) {
        return new Promise((resolve, reject) => {
            this.apiEditar(idRecompensaacao, quantidade, tipoatividade, idRecompensa)
            .then(([response,data]) => {
                this.forceNextReload[idRecompensa] = true;
                resolve([response,data]);
            }).catch((error) => {
                reject(error)
            });
        });
    },

    loadFromApi(idRecompensa, resolve, reject) {
        this.apiLoad(idRecompensa).then(([response,data]) => {
            this.recompensasacoes[idRecompensa] = data
            this.forceNextReload[idRecompensa] = false;
            resolve([response,data]);
        }).catch((error) => {
            reject(error)
        });
    },

    // funcionalidades de api
    apiLoad(idRecompensa) {
        let params = {
            // 'relations': '',
            // 'orderBy': 'createdat,asc',
            'recompensa': idRecompensa
        };
        params = QueryStringConverter.toQueryString(params, true);
        let requestData = {
            'url': `${config.serverUrl}/recompensasacoes${params}`,
        };
        return Request.fetch(requestData)
    },

    apiCriar(quantidade, tipoatividade, idRecompensa) {
        const url = `${config.serverUrl}/recompensasacoes`
        const headers = new Headers({'Content-Type': 'application/json'})
        const body = {
            'recompensa': idRecompensa,
            'quantidade': quantidade,
            'tipoatividade': tipoatividade
        };
        let requestData = {
            'url': url,
            'headers': headers,
            'method' : 'POST',
            'data' : body
        };
        return Request.fetch(requestData);
    },

    apiEditar(idRecompensaacao, quantidade, tipoatividade, idRecompensa) {
        const url = `${config.serverUrl}/recompensasacoes/${idRecompensaacao}`
        const headers = new Headers({'Content-Type': 'application/json'})
        const body = {
            'quantidade': quantidade,
            'tipoatividade': tipoatividade
        };
        let requestData = {
            'url': url,
            'headers': headers,
            'method' : 'PUT',
            'data' : body
        };
        return Request.fetch(requestData);
    },

});
