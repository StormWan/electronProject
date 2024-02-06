import asyncRoute from "./asyncRoute";

const routes = [
  { path: "/", redirect: "/chatstudio" },
  {
    path: "/login",
    name: "login",
    component: () => import(/* webpackChunkName: "Login" */ "@/views/login/index"),
    meta: {
      title: "登录",
      icon: "Eleme",
    },
  },
  // ...asyncRoute,
];

export default routes;
