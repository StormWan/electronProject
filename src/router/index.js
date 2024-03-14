import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import { ACCESS_TOKEN } from "@/store/constants";
import { setPageTitle } from "@/utils/common";
import NProgress from "@/utils/progress";
import { scrollBehavior } from "./utils";
import storage from "@/utils/localforage/index";
import { isElectron } from "@/electron/utils/index";

const routes = [];
const files = require.context("./modules/", false, /\.js$/);
files.keys().forEach((key) => {
  routes.push(...files(key).default);
});
console.log(routes);

let isF = false;
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior,
});

router.beforeEach((to, from, next) => {
  if (from.path === to.path) return;
  !isElectron && setPageTitle(to.meta.title);
  const token = storage.get(ACCESS_TOKEN);
  if (token) {
    // start progress bar
    !isElectron && NProgress.start();
    if (isF) {
      next();
    } else {
      isF = true;
      next({ ...to, replace: true });
    }
  } else {
    if (to.path !== "/login") {
      next({ path: "/login" });
    } else {
      next();
    }
  }
});

router.afterEach((to, from, next) => {
  NProgress.done();
});

/** setup vue router. - [安装vue路由] */
export async function setupRouter(app) {
  app.use(router);
  await router.isReady();
}

export default router;
