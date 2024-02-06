import { $t } from "@/plugins/i18n";
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
          title: $t("route.welcome"),
          locale: "welcome",
          icon: "Eleme",
        },
      },
      {
        path: "/chatStudio",
        name: "chatStudio",
        component: () => import(/* webpackChunkName: "ChatStudio" */ "@/views/chatStudio/index"),
        meta: {
          title: $t("route.chatStudio"),
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
          title: $t("route.personal"),
          locale: "personal",
          icon: "User",
        },
      },
      {
        path: "/about",
        name: "about",
        component: () => import(/* webpackChunkName: "About" */ "@/views/about/index"),
        meta: {
          title: $t("route.about"),
          locale: "about",
          icon: "Warning",
        },
      },
      {
        path: "/system",
        name: "system",
        meta: {
          title: $t("route.system"),
          locale: "system",
          icon: "Setting",
        },
        children: [
          {
            path: "/system/menu",
            name: "menu",
            component: () => import(/* webpackChunkName: "Menu" */ "@/views/system/menu/index"),
            meta: {
              title: $t("route.menu"),
              locale: "menu",
              icon: "More",
            },
          },
          {
            path: "/system/role",
            name: "role",
            component: () => import(/* webpackChunkName: "Role" */ "@/views/system/role/index"),
            meta: {
              title: $t("route.role"),
              locale: "role",
              icon: "CopyDocument",
            },
          },
          {
            path: "/system/user",
            name: "user",
            component: () => import(/* webpackChunkName: "user" */ "@/views/system/user/index"),
            meta: {
              title: $t("route.user"),
              locale: "user",
              icon: "User",
            },
          },
        ],
      },
      {
        path: "/assembly",
        name: "assembly",
        meta: {
          title: $t("route.assembly"),
          locale: "assembly",
          icon: "Menu",
        },
        children: [
          {
            path: "/assembly/jigsaw",
            name: "jigsaw",
            component: () =>
              import(/* webpackChunkName: "Jigsaw" */ "@/views/assembly/Jigsaw/index"),
            meta: {
              title: $t("route.jigsaw"),
              locale: "jigsaw",
              icon: "DishDot",
            },
          },
        ],
      },
    ],
  },
];
