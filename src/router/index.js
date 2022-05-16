import {
  createRouter,
  createWebHistory
} from "vue-router";
import storage from "storejs"
import NProgress from 'nprogress'
import routes from './routes'
import store from '@/store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// hack router push callback
const originalPush = createRouter.prototype.push
createRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}


// 登录验证白名单
const whiteList = [] // 'login','home'
const loginRoutePath = '/login'
const defaultRoutePath = '/home'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

let isF = false
router.beforeEach(async (to, from, next) => {
  // console.log(to, from)
  if (from.path === to.path) return
  const token = storage.get(ACCESS_TOKEN)

  if (token) {
    NProgress.start() // start progress bar
    // console.log(router.options)
    // console.log(store.state.data)
    if (isF) {
      next();
    } else {
      isF = true
      next({ ...to, replace: true });
    }
  } else {
    if (to.path !== loginRoutePath) {
      next({ path: loginRoutePath })
    } else {
      next()
    }
  }
})

// 后置守卫
router.afterEach(async (to, from, next) => {
  NProgress.done() // finish progress bar
})
// 应用场景，进入页面登录判断、管理员权限判断、浏览器判断

export default router;
