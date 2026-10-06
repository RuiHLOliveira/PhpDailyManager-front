import Request from '@/core/request.js'
import config from '@/core/config.js'
import QueryStringConverter from '@/core/QueryStringConverter.js';
import { reactive } from 'vue';

export const ArvoresStorage = reactive({
    
    arvores: [],
    forceNextReload: [],

    // funcionalidades de storage
    index(){
        return new Promise((resolve, reject) => {

            const name = 'arvores';

            if(this.arvores != undefined && this.arvores.length > 0 && !this.forceNextReload) {
                console.log(`[${name}] loadFromCache`)
                resolve([null,this.arvores]);
            } else {
                console.log(`[${name}] loadFromApi`)
                this.loadFromApi(resolve, reject);
            }
        });
    },

    loadFromApi(resolve, reject) {
        this.apiLoad().then(([response,data]) => {
            this.arvores = data
            this.forceNextReload = false;
            resolve([response,data]);
        }).catch((error) => {
            reject(error)
        });
    },

    // funcionalidades de api
    apiLoad() {
        let params = {
            // 'relations': '',
            // 'orderBy': 'createdat,asc',
        };
        params = QueryStringConverter.toQueryString(params, true);
        let requestData = {
            'url': `${config.serverUrl}/arvores${params}`,
        };
        return Request.fetch(requestData)
    },
});
