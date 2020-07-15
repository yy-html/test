import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { getToken } from '@/utils/token'
import { relogin } from '@/utils/ccsAuth'

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (store.getters.roles.length === 0) {
      store.dispatch('user/getInfo').then(res => {
        const { roles } = res
        if (roles.length) {
          store.dispatch('authRoutes/generateRoutes', { roles }).then(() => {
            router.addRoutes(store.getters.addRouters)
            next({ ...to, replace: true })
          })
        } else {
          next()
        }
      }).catch((err) => {
        store.dispatch('user/resetToken').then(() => {
          Message.error(err || 'Verification failed, please login again')
          next({ path: '/' })
        })
      })
    } else {
      next()
    }
  } else {
    relogin()
    NProgress.done()
  }
})

router.afterEach(() => {
  NProgress.done()
})
