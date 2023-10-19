import { createStore } from "vuex";
import saveToLocalStorage from "./plugins/localStorage"; // 自定义插件
import { changeAppearance } from "@/utils/common";
import router from "@/router";
import storage from "storejs";
import emitter from "@/utils/mitt-bus";
import { convertToTree, optimizeTree } from "@/utils/ToTree";
import { USER_DATA, SET_UP } from "@/store/mutation-types";

// 默认设置
const defaultSettings = {
  lang: "zh-CN", // 默认语言
  sidebar: true, // 侧边栏隐藏
  appearance: "light", // 主题颜色
  isCollapse: true, // 侧边栏是否折叠
  setswitch: false, // 设置按钮开关
};

// 默认用户信息
const defaultData = {
  verifyCode: "",
  user: null,
  token: null,
  elTag: [], // Tag 标签
  routeTable: null, // 路由表  Route Table
};

// 获取本地存储中的设置和用户信息，如果没有则使用默认值
const settings = storage.get(SET_UP) || defaultSettings;
const data = storage.get(USER_DATA) || defaultData;

const modules = {};
const plugins = [saveToLocalStorage];
// 使用Webpack的require.context方法
// 自动导入指定目录下的所有以index.ts或index.js结尾的文件
// true表示会搜索子目录
// iu表示不区分大小写，支持Unicode字符
const requireModules = require.context("./modules/", true, /index\.(ts|js)$/iu);

/**
 * @description: 自动导入模块文件中的所有vuex模块
 * @param {*}
 * @return {*}
 */
requireModules.keys().forEach((filePath) => {
  const modular = requireModules(filePath);
  // 从文件路径中提取模块名称，如'./modules/user/index.ts' => 'user'
  const name = filePath.replace(/\.\/|\/index.(js|ts)/g, "");
  modules[name] = {
    // namespaced: true,
    ...modular.default,
  };
});

console.log(modules, "modules");

const store = createStore({
  modules,
  state: {
    data,
    settings,
  },
  mutations: {
    // 更新用户设置
    UPDATE_USER_SETUP(state, { key, value }) {
      state.settings[key] = value;
    },
    // 更新用户信息
    UPDATE_USER_INFO(state, { key, value }) {
      state.data[key] = value;
    },
    // 保存登录信息 keep
    ACCOUNT_INFORMATION(state, data) {
      storage.set("ACCOUNT", data?.keep ? data : null);
    },
    updataScroll(state, value) {
      emitter.emit("updataScroll", value);
    },
  },
  actions: {
    // 初始化路由表 将扁平化数据结构 转化为 符合 ElementUI 菜单组件的格式
    updateRoute({ commit }, route) {
      const root = route.find((t) => (t.path = "/root"));
      optimizeTree(route);
      convertToTree(root, route);
      root.children.forEach((item) => {
        router.addRoute(item);
      });
      commit("UPDATE_USER_INFO", { key: "routeTable", value: root.children });
    },
    // 页面刷新重新加载路由
    reloadRoute({ state }, route) {
      try {
        const routing = state.data.routeTable;
        if (!routing) return;
        optimizeTree(routing);
        routing.forEach((item) => {
          router.addRoute(item);
        });
      } catch (error) {
        console.error(error);
      }
    },
    // 设置验证码
    SET_VERIFYCODE({ state }, verifyCode) {
      state.data.verifyCode = verifyCode;
    },
    // 清除 eltag 标签
    CLEAR_EL_TAG({ state }) {
      state.data.elTag = [];
    },
  },
  getters: {},
  // 自定义属性
  plugins,
});

// 刷新页面保存当前主题色
changeAppearance(store.state.settings.appearance);

console.log(store, "store实例");
export default store;
