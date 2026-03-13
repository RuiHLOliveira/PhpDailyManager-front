import Request from '@/core/request.js'
import config from '@/core/config.js'
import { reactive } from 'vue';

export const HabitosRealizadosStorage = reactive({

    registraAvaliacao(habitoRealizado) {
        return new Promise((resolve, reject) => {
            this.apiRegistraAvaliacao(habitoRealizado)
            .then(([response,data]) => {
                resolve([response,data]);
            }).catch((error) => {
                reject(error)
            });
        });
    },

    apiRegistraAvaliacao(habitoRealizado) {
        const url = `${config.serverUrl}/habitos-realizados/${habitoRealizado.id}/registra-avaliacao`
        const headers = new Headers({'Content-Type': 'application/json'})
        const body = {
            'avaliacaoJson': habitoRealizado.avaliacaoJson,
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
