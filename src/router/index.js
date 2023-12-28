import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import { ACCESS_TOKEN } from "@/store/constants";
import { setPageTitle } from "@/utils/common";
import NProgress from "@/utils/progress";
import storage from "storejs";
import routes from "./routes";

// hack router push callback
const originalPush = createRouter.prototype.push;
createRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

// 登录验证白名单
let isF = false;
const whiteList = ["login", "home"];
const loginRoutePath = "/login";
const defaultRoutePath = "/home";
console.log("[routes]", routes);

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (from.path === to.path) return;
  !process.env.IS_ELECTRON && setPageTitle(to.meta.title);
  const token = storage.get(ACCESS_TOKEN);
  if (token) {
    // start progress bar
    !process.env.IS_ELECTRON && NProgress.start();
    if (isF) {
      next();
    } else {
      isF = true;
      next({ ...to, replace: true });
    }
  } else {
    if (to.path !== loginRoutePath) {
      next({ path: loginRoutePath });
    } else {
      next();
    }
  }
});

router.afterEach(async (to, from, next) => {
  NProgress.done();
});

export default router;
