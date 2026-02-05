import Request from '@/core/request.js'
import config from '@/core/config.js'
import QueryStringConverter from '@/core/QueryStringConverter.js';
import { reactive } from 'vue';

export const RecompensasStorage = reactive({
    
    recompensas: [],
    forceNextReload: false,

    // funcionalidades de storage
    index(){
        return new Promise((resolve, reject) => {
            console.log('this.forceNextReload',this.forceNextReload)
            if(this.recompensas.length > 0 && !this.forceNextReload) {
                resolve([null,this.recompensas]);
            } else {
                console.log('loadFromApi')
                this.loadFromApi(resolve, reject);
            }
        });
    },

    loadFromApi(resolve, reject) {
        this.apiLoad().then(([response,data]) => {
            this.recompensas = data
            this.forceNextReload = false;
            resolve([response,data]);
        }).catch((error) => {
            reject(error)
        });
    },
    
    criar(nome) {
        return new Promise((resolve, reject) => {
            this.apiCriar(nome)
            .then(([response,data]) => {
                this.forceNextReload = true;
                resolve([response,data]);
            }).catch((error) => {
                reject(error)
            });
        });
    },

    // funcionalidades de api
    apiLoad() {
        let params = {
            'relations': ['recompensasacoes'],
            // 'orderBy': 'hora,asc'
        };
        params = QueryStringConverter.toQueryString(params, true);
        let requestData = {
            'url': `${config.serverUrl}/recompensas${params}`,
        };
        return Request.fetch(requestData)
    },

    apiCriar(nome) {
        const url = `${config.serverUrl}/recompensas`
        const headers = new Headers({'Content-Type': 'application/json'})
        const body = {
            'nome': nome,
        };
        let requestData = {
            'url': url,
            'headers': headers,
            'method' : 'POST',
            'data' : body
        };
        return Request.fetch(requestData);
    }

});
