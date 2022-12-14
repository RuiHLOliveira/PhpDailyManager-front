import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Auth/Login.vue'
import Register from '../views/Auth/Register.vue'
import ListaDias from '../views/ListaDias.vue'
import Invitations from '../views/Invitations.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      path: '/listaDias',
      name: 'ListaDias',
      component: ListaDias
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
