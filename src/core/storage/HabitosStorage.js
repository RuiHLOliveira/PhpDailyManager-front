import Request from '@/core/request.js'
import config from '@/core/config.js'
import QueryStringConverter from '@/core/QueryStringConverter.js';
import { reactive } from 'vue';

export const HabitosStorage = reactive({
    
    habitos: [],
    forceNextReload: false,

    // funcionalidades de storage
    index(){
        return new Promise((resolve, reject) => {
            console.log('this.forceNextReload',this.forceNextReload)
            if(this.habitos.length > 0 && !this.forceNextReload) {
                resolve([null,this.habitos]);
            } else {
                console.log('loadFromApi')
                this.loadFromApi(resolve, reject);
            }
        });
    },

    concluir(habito, textoObservacao) {
        return new Promise((resolve, reject) => {
            this.apiConcluir(habito, textoObservacao)
            .then(([response,data]) => {
                this.forceNextReload = true;
                // nao faz pois é melhor fazer por reload
                // this.substituir(habito); // substituir o habito antigo pelo novo
                resolve([response,data]);
            }).catch((error) => {
                reject(error)
            });
        });
    },

    substituir(habito) {
        if(this.habitos == null || this.habitos.length == 0) return;
        const index = this.habitos.findIndex(e => e.id === habito.id);
        this.habitos[index] = habito;
    },

    loadFromApi(resolve, reject) {
        this.apiLoad().then(([response,data]) => {
            this.habitos = data
            this.forceNextReload = false;
            resolve([response,data]);
        }).catch((error) => {
            reject(error)
        });
    },

    // funcionalidades de api
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

    apiConcluir(habito, textoObservacao) {
        const url = `${config.serverUrl}/habitos/${habito.id}/concluir`
        const headers = new Headers({'Content-Type': 'application/json'})
        const body = {'textoObservacao': textoObservacao}
        let requestData = {
            'url': url,
            'headers': headers,
            'method' : 'POST',
            'data' : body
        };
        return Request.fetch(requestData);
    }

});
