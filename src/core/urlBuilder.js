import config from "./config";

export default {
    getProjetoUrl(projeto, fullpath = false) {
        let url = '/projetosListV2/projeto/' + projeto.id;
        if(fullpath) {
            url = config.frontSubfolderUrl + url;
        }
        return url;
    },
    getObjetivoUrl(objetivo, fullpath = false) {
        let url = '/objetivosList/objetivo/' + objetivo.id;
        if(fullpath) {
            url = config.frontSubfolderUrl + url;
        }
        return url;
    },
}
