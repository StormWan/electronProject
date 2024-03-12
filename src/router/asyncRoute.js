export default [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "Layout" */ "@/layout/index.vue"),
    meta: {
      title: "home",
      icon: "Eleme",
    },
    children: [
      {
        path: "/welcome",
        name: "welcome",
        component: () => import(/* webpackChunkName: "Welcome" */ "@/views/welcome/index"),
        meta: {
          title: "首页",
          locale: "welcome",
          icon: "Eleme",
        },
      },
      {
        path: "/chatStudio",
        name: "chatStudio",
        component: () => import(/* webpackChunkName: "ChatStudio" */ "@/views/chatStudio/index"),
        meta: {
          title: "聊天工作室",
          locale: "chatStudio",
          icon: "ForkSpoon",
          keep: true,
        },
      },
      {
        path: "/personal",
        name: "personal",
        component: () => import(/* webpackChunkName: "Personal" */ "@/views/personal/index"),
        meta: {
          title: "个人中心",
          locale: "personal",
          icon: "User",
        },
      },
      {
        path: "/about",
        name: "about",
        component: () => import(/* webpackChunkName: "About" */ "@/views/about/index"),
        meta: {
          title: "关于",
          locale: "about",
          icon: "Warning",
        },
      },
      {
        path: "/system",
        name: "system",
        meta: {
          title: "系统管理",
          locale: "system",
          icon: "Setting",
        },
        children: [
          {
            path: "/system/menu",
            name: "menu",
            component: () => import(/* webpackChunkName: "Menu" */ "@/views/system/menu/index"),
            meta: {
              title: "菜单",
              locale: "menu",
              icon: "More",
            },
          },
          {
            path: "/system/role",
            name: "role",
            component: () => import(/* webpackChunkName: "Role" */ "@/views/system/role/index"),
            meta: {
              title: "角色",
              locale: "role",
              icon: "CopyDocument",
            },
          },
          {
            path: "/system/user",
            name: "user",
            component: () => import(/* webpackChunkName: "user" */ "@/views/system/user/index"),
            meta: {
              title: "用户",
              locale: "user",
              icon: "User",
            },
          },
        ],
      },
      // {
      //   path: "/assembly",
      //   name: "assembly",
      //   meta: {
      //     title: '组件',
      //     locale: "assembly",
      //     icon: "Menu",
      //   },
      //   children: [
      //     {
      //       path: "/assembly/jigsaw",
      //       name: "jigsaw",
      //       component: () =>
      //         import(/* webpackChunkName: "Jigsaw" */ "@/views/assembly/Jigsaw/index"),
      //       meta: {
      //         title: '拼图游戏',
      //         locale: "jigsaw",
      //         icon: "DishDot",
      //       },
      //     },
      //   ],
      // },
    ],
  },
  {
    path: "/desktop",
    name: "desktop",
    component: () => import(/* webpackChunkName: "Desktop" */ "@/views/desktop/index"),
    meta: {
      title: "",
      locale: "",
      icon: "",
    },
  },
];
