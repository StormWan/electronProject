import { ACCESS_TOKEN } from "@/constants/index";
import { isElectron } from "@/electron/utils/index";
import { setPageTitle } from "@/utils/common";
import storage from "@/utils/localforage/index";
import NProgress from "@/utils/progress";
import { createRouter, createWebHashHistory } from "vue-router";
import { generateRoutes, scrollBehavior } from "./utils";

let isF = false;
const router = createRouter({
  history: createWebHashHistory(),
  routes: generateRoutes(),
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
    if (to.path !== "/login" && to.path !== "/register" && to.path !== "/resetPassword") {
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
