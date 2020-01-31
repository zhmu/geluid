import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Artist from '../views/Artist.vue'
import Album from '../views/Album.vue'
import Track from '../views/Track.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  { path: '/artist/:id', component: Artist },
  { path: '/album/:id', component: Album },
  { path: '/track/:id', component: Track }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
