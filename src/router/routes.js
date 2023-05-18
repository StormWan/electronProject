/* eslint-disable prettier/prettier */
import { defineAsyncComponent } from 'vue';
/**
 *
 * keepAlive 需要被缓存的组件
 * requiresAuth
 */
const Login = () => import(/* webpackChunkName: "Login" */ "@/views/login/index");
const Home = () => import(/* webpackChunkName: "Home" */ "@/views/home/index");
const Welcome = () => import(/* webpackChunkName: "Welcome" */ "@/views/welcome/index");
const ChatStudio = () => import(/* webpackChunkName: "ChatStudio" */ "@/views/ChatStudio/index");
const Menu = () => import(/* webpackChunkName: "Menu" */ "@/views/system/menu/index");
const User = () => import(/* webpackChunkName: "User" */ "@/views/system/user/index");
const Role = () => import(/* webpackChunkName: "Role" */ "@/views/system/role/index");
const Personal = () => import(/* webpackChunkName: "Role" */ "@/views/Personal/index");
const About = () => import(/* webpackChunkName: "Role" */ "@/views/about/index");

// const Welcome = defineAsyncComponent(() => import('@/views/welcome/index.vue'));
const routes = [
  { path: "/", redirect: "/home" },
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

const routescopy = [
  {
    path: "/home",
    name: "home",
    component: Home,
    meta: {
      title: "Home",
      icon: "Eleme",
    },
    redirect: "/home/welcome",
    children: [
      // 首页
      {
        path: "welcome",
        name: "welcome",
        component: Welcome,
        meta: {
          title: "首页",
          icon: "Eleme",
        },
      },
      // 聊天工作室
      {
        path: "ChatStudio",
        name: "ChatStudio",
        component: ChatStudio,
        meta: {
          keep: true,
          title: "聊天工作室",
          icon: "ForkSpoon",
        },
      },
      // 个人中心
      // {
      //   path: "/personal",
      //   name: "personal",
      //   component: Personal,
      //   meta: {
      //     title: "个人中心",
      //     icon: "User",
      //   },
      // },
      // 系统管理
      {
        path: "system",
        name: "system",
        redirect: "/system/menu",
        meta: {
          title: "系统管理",
          icon: "Setting",
        },
        children: [
          {
            path: "/system/menu",
            name: "menu",
            component: Menu,
            meta: {
              title: "菜单列表",
              icon: "More",
            },
          },
          // {
          //   path: "/system/role",
          //   name: "role",
          //   component: Role,
          //   meta: {
          //     title: "角色权限",
          //     icon: "User",
          //   },
          // },
          // {
          //   path: "/system/user",
          //   name: "user",
          //   component: User,
          //   meta: {
          //     title: "用户权限",
          //     icon: "CopyDocument",
          //   },
          // },
        ],
      },
      // 关于
      // {
      //   path: "/about",
      //   name: "about",
      //   component: About,
      //   meta: {
      //     title: "关于",
      //     icon: "Warning",
      //   },
      // },
    ],
  },
  // { path: "/", redirect: "/home" },
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
