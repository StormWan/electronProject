import router from "@/router";
import { convertToTree, optimizeTree } from "@/utils/ToTree";

const actions = {
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
};

export default actions;
