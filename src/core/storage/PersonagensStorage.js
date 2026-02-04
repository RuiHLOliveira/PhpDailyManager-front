import Request from '@/core/request.js'
import config from '@/core/config.js'
import QueryStringConverter from '@/core/QueryStringConverter.js';
import { reactive } from 'vue';

export const PersonagensStorage = reactive({
    
    personagens: [],
    forceNextReload: false,

    // funcionalidades de storage
    index(){
        return new Promise((resolve, reject) => {
            console.log('this.forceNextReload',this.forceNextReload)
            if(this.personagens.length > 0 && !this.forceNextReload) {
                resolve([null,this.personagens]);
            } else {
                console.log('loadFromApi')
                this.loadFromApi(resolve, reject);
            }
        });
    },

    loadFromApi(resolve, reject) {
        this.apiLoad().then(([response,data]) => {
            this.personagens = data
            this.forceNextReload = false;
            resolve([response,data]);
        }).catch((error) => {
            reject(error)
        });
    },

    // funcionalidades de api
    apiLoad() {
        let params = {
            // 'relations': 'habitoRealizados',
            // 'orderBy': 'hora,asc'
        };
        params = QueryStringConverter.toQueryString(params, true);
        let requestData = {
            'url': `${config.serverUrl}/personagens${params}`,
        };
        return Request.fetch(requestData)
    },

});
