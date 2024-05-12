export default [
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
  {
    path: "/register",
    name: "register",
    component: () => import(/* webpackChunkName: "Register" */ "@/views/register/index"),
    meta: {
      title: "注册",
      icon: "Eleme",
    },
  },
  {
    path: "/resetPassword",
    name: "resetPassword",
    component: () => import(/* webpackChunkName: "ResetPassword" */ "@/views/resetPassword/index"),
    meta: {
      title: "重置密码",
      icon: "Eleme",
    },
  },
  // {
  //   path: "/desktop",
  //   name: "desktop",
  //   component: () => import(/* webpackChunkName: "Desktop" */ "@/views/desktop/index"),
  //   meta: {
  //     title: "",
  //     locale: "",
  //     icon: "",
  //   },
  // },
];
