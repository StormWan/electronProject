/**
 *
 * keepAlive 需要被缓存的组件
 *
 */

const routes = [
  { path: "/", redirect: "/home" },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "Login" */ "@/views/login/index.vue"),
    meta: {
      title: "登录",
      icon: "Eleme",
    },
  },
];

export default routes;
