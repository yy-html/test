import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import baseConfigRoutes from './baseConfig'
import layoutRoutes from './layout'
const viewRoutes = [
  ...baseConfigRoutes,
  ...layoutRoutes
]

const pageRoutes = [
]

const router = new Router({
  routes: [
    ...viewRoutes, 
    ...pageRoutes,
    {
      path: '/error'
    },
    {
      path: '/dms/*',
      redirect: '/error'
    }
  ]
})

export default router
