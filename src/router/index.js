import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

import Login from '../views/Auth/Login.vue'
import Register from '../views/Auth/Register.vue'
import Inbox from '../views/inbox/Inbox.vue'
import Projetos from '../views/projetos/Projetos.vue'
import ProjetosList from '../views/projetos/ProjetosList.vue'
import Tarefas from '../views/tarefas/Tarefas.vue'
import Habitos from '../views/habitos/Habitos.vue'
import Invitations from '../views/Invitations.vue'
import Configuracoes from '../views/Configuracoes.vue'
import Backup from '../views/Backup.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // },
    {
      path: '/inbox',
      name: 'Inbox',
      component: Inbox,
      props: true
    },
    {
      path: '/projetos',
      name: 'Projetos',
      component: Projetos,
      props: true
    },
    {
      path: '/projetosList',
      name: 'ProjetosList',
      component: ProjetosList,
      props: true
    },
    {
      path: '/tarefas',
      name: 'Tarefas',
      component: Tarefas,
      props: true
    },
    {
      path: '/habitTracker',
      name: 'HabitTracker',
      component: Habitos,
      props: true
    },
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/invitations',
      name: 'Invitations',
      component: Invitations
    },
    {
      path: '/configuracoes',
      name: 'Configuracoes',
      component: Configuracoes
    },
    {
      path: '/backup',
      name: 'backup',
      component: Backup
    },
    // {
    //   path: '/listaContas',
    //   name: 'listaContas',
    //   component: ListaContas
    // },
    // {
    //   path: '/listaMovimentos/:idConta',
    //   name: 'listaMovimentos',
    //   component: ListaMovimentos,
    //   props: true
    // }
  ]
})

export default router
