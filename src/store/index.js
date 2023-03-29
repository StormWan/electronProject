import { createStore } from "vuex";
import { useI18n } from "vue-i18n";
import saveToLocalStorage from "./plugins/localStorage"; // 自定义插件
import { changeAppearance } from "@/utils/common";
import mutations from "./mutations";
import actions from "./actions";
import state from "./state";

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
  state,
  mutations,
  actions,
  getters: {},
  // 自定义属性
  plugins,
});

// 刷新页面保存当前主题色
changeAppearance(store.state.settings.appearance);

console.log(store, "store实例");
export default store;
