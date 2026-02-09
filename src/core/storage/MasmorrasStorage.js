import Request from '@/core/request.js'
import config from '@/core/config.js'
import QueryStringConverter from '@/core/QueryStringConverter.js';
import { reactive } from 'vue';

export const MasmorrasStorage = reactive({
    
    masmorras: [],
    forceNextReload: [],

    // funcionalidades de storage
    index(){
        return new Promise((resolve, reject) => {

            const name = 'masmorras';

            if(this.masmorras != undefined && this.masmorras.length > 0 && !this.forceNextReload) {
                console.log(`[${name}] loadFromCache`)
                resolve([null,this.masmorras]);
            } else {
                console.log(`[${name}] loadFromApi`)
                this.loadFromApi(resolve, reject);
            }
        });
    },

    loadFromApi(resolve, reject) {
        this.apiLoad().then(([response,data]) => {
            this.masmorras = data
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
            'url': `${config.serverUrl}/masmorras${params}`,
        };
        return Request.fetch(requestData)
    },
});
