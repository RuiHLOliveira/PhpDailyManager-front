
import Request from '@/core/request.js'
import config from '@/core/config.js'

export default {
  criarCategoria(novaCategoria) {
    let body = {
      'categoria': novaCategoria,
    };
    let requestData = {
      'url': config.serverUrl + '/categoriaItems',
      'headers': new Headers({ 'Content-Type': 'application/json' }),
      'method': 'POST',
      'data': body
    };
    return Request.fetch(requestData);
  },
  loadListaCategorias() {
    let requestData = {
      'url': config.serverUrl + '/categoriaItems',
      'headers': new Headers({ 'Content-Type': 'application/json' }),
      'method': 'GET',
    };
    return Request.fetch(requestData);
  },
}
