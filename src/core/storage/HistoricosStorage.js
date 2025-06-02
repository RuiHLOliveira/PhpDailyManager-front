import Request from '@/core/request.js'
import config from '@/core/config.js'
import QueryStringConverter from '@/core/QueryStringConverter.js';
import { reactive } from 'vue';

export const HistoricosStorage = reactive({
    
    historicos: [],

    index(){
        return new Promise((resolve, reject) => {
            
            console.log(this.historicos, this.historicos.length);

            if(this.historicos.length > 0) {
                console.log('[HISTORICOS usando state]');
                resolve([null,this.historicos]);
            } else {
                console.log('[HISTORICOS buscando...]');
                this.apiLoad().then(([response,data]) => {
                    console.log('[HISTORICOS recuperados]',response,data);
                    this.historicos = data
                    resolve([response,data]);
                }).catch((error) => {
                    console.error('[HISTORICOS erro]',error);
                    reject(error)
                });
            }
        });
    },

    apiLoad() {
        let params = {
            // 'relations': 'habitoRealizados',
            'orderBy': 'createdAt, desc'
        };
        params = QueryStringConverter.toQueryString(params, true);
        let requestData = {
            'url': `${config.serverUrl}/historicos${params}`,
        };
        return Request.fetch(requestData)
    },

});
