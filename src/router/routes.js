/* eslint-disable prettier/prettier */
import { defineAsyncComponent } from "vue";
/**
 *
 * keepAlive 需要被缓存的组件
 * requiresAuth
 */
const Login = () => import(/* webpackChunkName: "Login" */ "@/views/login/index");

const routes = [
  { path: "/", redirect: "/chatstudio" },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "登录",
      icon: "Eleme",
    },
  },
];

export default routes;
