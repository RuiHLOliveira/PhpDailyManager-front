import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App);
app.use(router).mount('#app');

app.config.globalProperties.$global = {
    configuracoes: []
}
app.config.unwrapInjectedRef = true