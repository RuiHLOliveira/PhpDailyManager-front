import Request from '@/core/request.js'
import config from '@/core/config.js'
import QueryStringConverter from '@/core/QueryStringConverter.js';
import { reactive } from 'vue';

export const HabitosStorage = reactive({
    
    habitos: [],

    index(){
        return new Promise((resolve, reject) => {
            
            console.log(this.habitos, this.habitos.length);

            if(this.habitos.length > 0) {
                console.log('[HABITOS usando state]');
                resolve([null,this.habitos]);
            } else {
                console.log('[HABITOS buscando...]');
                this.apiLoad().then(([response,data]) => {
                    console.log('[HABITOS recuperados]',response,data);
                    this.habitos = data
                    resolve([response,data]);
                }).catch((error) => {
                    console.error('[HABITOS erro]',error);
                    reject(error)
                });
            }
        });
    },

    apiLoad() {
        let params = {
            'relations': 'habitoRealizados',
            'orderBy': 'hora,asc'
        };
        params = QueryStringConverter.toQueryString(params, true);
        let requestData = {
            'url': `${config.serverUrl}/habitos${params}`,
        };
        return Request.fetch(requestData)
    },

});
