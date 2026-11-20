import Request from '@/core/request.js'
import config from '@/core/config.js'
import QueryStringConverter from '@/core/QueryStringConverter.js';
import { reactive } from 'vue';

export const AreasStorage = reactive({
    
    areas: [],
    forceNextReload: false,

    // funcionalidades de storage
    index(){
        return new Promise((resolve, reject) => {
            console.log('[areas Storage] this.forceNextReload',this.forceNextReload)
            if(this.areas.length > 0 && !this.forceNextReload) {
                resolve([null,this.areas]);
            } else {
                console.log('loadFromApi')
                this.loadFromApi(resolve, reject);
            }
        });
    },

    loadFromApi(resolve, reject) {
        this.apiLoad().then(([response,data]) => {
            this.areas = data
            this.forceNextReload = false;
            resolve([response,data]);
        }).catch((error) => {
            reject(error)
        });
    },

    // funcionalidades de api
    apiLoad() {
        let params = {'orderBy': 'nome,asc', 'properties' : ''};
        params = QueryStringConverter.toQueryString(params, true);
        let requestData = {
            'url': `${config.serverUrl}/areas${params}`,
        };
        return Request.fetch(requestData)
    },

    apiEditar(area) {
        const url = `${config.serverUrl}/areas/${area.id}`
        const headers = new Headers({'Content-Type': 'application/json'})
        const body = {
            'nome': area.nome,
        };
        let requestData = {
            'url': url,
            'headers': headers,
            'method' : 'PUT',
            'data' : body
        };
        return Request.fetch(requestData);
    },

    apiCriar(area) {
        const url = `${config.serverUrl}/areas`
        const headers = new Headers({'Content-Type': 'application/json'})
        const body = {
            'nome': area.nome,
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
